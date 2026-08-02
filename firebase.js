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
import {
  getFirestore,
  collection as firestoreCollection,
  doc as firestoreDoc,
  addDoc as firestoreAddDoc,
  setDoc as firestoreSetDoc,
  updateDoc as firestoreUpdateDoc,
  deleteDoc as firestoreDeleteDoc,
  getDocs,
  query as firestoreQuery,
  where as firestoreWhere,
  onSnapshot as firestoreOnSnapshot,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCJRjZBtMHqJw2zdQXJ6D8FK95S02s4UbA",
  authDomain: "pocket-wise-9b0b1.firebaseapp.com",
  projectId: "pocket-wise-9b0b1",
  storageBucket: "pocket-wise-9b0b1.firebasestorage.app",
  messagingSenderId: "696020964709",
  appId: "1:696020964709:web:fee5ae7ad9b6cea71d7d8c",
  measurementId: "G-M4M5PQH5F4"
};

let app, auth, db, services = null;

export const startFirebase = async () => {
  console.log("🔵 [Firebase] initializing on the client...");
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);

  await setPersistence(auth, browserLocalPersistence);
  console.log("✅ [Firebase] ready to go");
  services = { auth, db };
  return services;
};

export const firebase = () => {
  if (!services) throw new Error("Firebase hasn't been initialized yet — call startFirebase() first.");
  return services;
};

export const collection = (db, name) => ({ path: { segments: [, name] } });
export const doc = (db, colName, id) => ({ path: { segments: [, colName, id] } });
export const query = (ref, ...conditions) => ref;
export const where = (field, operator, value) => ({ field, operator, value });

export const addDoc = async (collectionRef, data) => {
  const colName = collectionRef?.path?.segments?.[1] || "unknown";
  const colRef = firestoreCollection(db, colName);
  const docRef = await firestoreAddDoc(colRef, data);
  return { id: docRef.id };
};

export const setDoc = async (docRef, data, options) => {
  const path = docRef?.path?.segments || [];
  const colName = path[1] || "unknown";
  const docId = path[2] || null;
  if (!docId) throw new Error("Missing document id — can't write without one.");
  const ref = firestoreDoc(db, colName, docId);
  await firestoreSetDoc(ref, data, options || { merge: true });
  return { success: true };
};

export const updateDoc = async (docRef, data) => {
  const path = docRef?.path?.segments || [];
  const colName = path[1] || "unknown";
  const docId = path[2] || null;
  if (!docId) throw new Error("Missing document id — can't update without one.");
  const ref = firestoreDoc(db, colName, docId);
  await firestoreUpdateDoc(ref, data);
  return { success: true };
};

export const deleteDoc = async (docRef) => {
  const path = docRef?.path?.segments || [];
  const colName = path[1] || "unknown";
  const docId = path[2] || null;
  if (!docId) throw new Error("Missing document id — can't delete without one.");
  const ref = firestoreDoc(db, colName, docId);
  await firestoreDeleteDoc(ref);
  return { success: true };
};

export const onSnapshot = (queryRef, callback, errorCallback) => {
  const colName = queryRef?.path?.segments?.[1] || "unknown";
  const user = auth?.currentUser;

  if (!user) {
    console.warn("⚠️ onSnapshot called with no user, returning no-op");
    return () => {};
  }

  const q = firestoreQuery(firestoreCollection(db, colName), firestoreWhere("uid", "==", user.uid));
  return firestoreOnSnapshot(q, (snapshot) => {
    const docs = snapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        data: () => data,
        ...data,
      };
    });
    callback({ docs });
  }, errorCallback);
};

export {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  signOut,
  updateProfile,
  getDocs,
  serverTimestamp,
};
