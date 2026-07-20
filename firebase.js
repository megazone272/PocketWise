// firebase.js – استيراد مباشر من CDN (بدون importmap)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  signOut,
  updateProfile,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

let services = null;

export const startFirebase = async () => {
  console.log("🔵 [Firebase] جاري تحميل الإعدادات...");
  const response = await fetch("/api/config", { credentials: "same-origin" });
  if (!response.ok) throw new Error("فشل تحميل إعدادات Firebase");
  const { firebase } = await response.json();
  console.log("✅ [Firebase] تم استلام الإعدادات");

  const app = initializeApp(firebase);
  const auth = getAuth(app);
  await setPersistence(auth, browserLocalPersistence);
  console.log("✅ [Firebase] تم تهيئة المصادقة");

  services = { auth };
  return services;
};

export const firebase = () => {
  if (!services) throw new Error("Firebase لم يتم تهيئته بعد");
  return services;
};

// ============================================================
// دوال Firestore عبر الوكيل (Proxy) – مع تصحيح
// ============================================================

async function proxyRequest(action, collection, data = null, docId = null) {
  console.log(`🔵 [proxyRequest] بدء ${action} على ${collection}`, { data, docId });

  const user = services?.auth?.currentUser;
  if (!user) {
    console.error("❌ [proxyRequest] لا يوجد مستخدم مسجل الدخول");
    throw new Error("يجب تسجيل الدخول");
  }

  const token = await user.getIdToken();
  console.log("🔵 [proxyRequest] التوكن:", token.substring(0, 20) + "...");

  const body = JSON.stringify({ action, collection, data, docId });
  console.log("🔵 [proxyRequest] إرسال الطلب إلى /api/firestore");

  try {
    const response = await fetch("/api/firestore", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body,
    });

    const result = await response.json();
    console.log(`🔵 [proxyRequest] استجابة ${response.status}:`, result);

    if (!response.ok) {
      console.error("❌ [proxyRequest] فشل الطلب:", result.error || "خطأ غير معروف");
      throw new Error(result.error || "فشل الطلب");
    }

    console.log("✅ [proxyRequest] نجاح");
    return result;
  } catch (error) {
    console.error("❌ [proxyRequest] استثناء:", error.message);
    throw error;
  }
}

export const addDoc = async (collectionRef, data) => {
  const colName = collectionRef?.path?.segments?.[1] || "unknown";
  console.log(`🔵 [addDoc] إضافة إلى ${colName}`, data);
  return await proxyRequest("add", colName, data);
};

export const setDoc = async (docRef, data) => {
  const path = docRef?.path?.segments || [];
  const colName = path[1] || "unknown";
  const docId = path[2] || null;
  if (!docId) throw new Error("معرف المستند غير موجود");
  return await proxyRequest("set", colName, data, docId);
};

export const updateDoc = async (docRef, data) => {
  const path = docRef?.path?.segments || [];
  const colName = path[1] || "unknown";
  const docId = path[2] || null;
  if (!docId) throw new Error("معرف المستند غير موجود");
  return await proxyRequest("update", colName, data, docId);
};

export const deleteDoc = async (docRef) => {
  const path = docRef?.path?.segments || [];
  const colName = path[1] || "unknown";
  const docId = path[2] || null;
  if (!docId) throw new Error("معرف المستند غير موجود");
  return await proxyRequest("delete", colName, null, docId);
};

export const onSnapshot = (queryRef, callback) => {
  const colName = queryRef?.path?.segments?.[1] || "unknown";
  const fetchData = async () => {
    try {
      const result = await proxyRequest("get", colName);
      callback({
        docs: result.map((item) => ({
          id: item.id,
          data: () => item,
          ...item,
        })),
      });
    } catch (error) {
      console.error("[Polling] خطأ:", error);
    }
  };
  fetchData();
  const interval = setInterval(fetchData, 3000);
  return () => clearInterval(interval);
};

export const collection = (db, name) => ({ path: { segments: [, name] } });
export const doc = (db, colName, id) => ({ path: { segments: [, colName, id] } });
export const query = (ref, ...conditions) => ref;
export const where = (field, operator, value) => ({ field, operator, value });
export const serverTimestamp = () => new Date().toISOString();

export {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  signOut,
  updateProfile,
};