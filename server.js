// server.js - مع Groq API ووكيل Firestore
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { dirname, extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

dotenv.config();

const appRoot = dirname(fileURLToPath(import.meta.url));
const getEnv = (key) => process.env[key] || "";

// ============================================================
// إعدادات Firebase
// ============================================================
const firebaseConfig = {
  apiKey: getEnv("FIREBASE_API_KEY"),
  authDomain: getEnv("FIREBASE_AUTH_DOMAIN"),
  projectId: getEnv("FIREBASE_PROJECT_ID"),
  storageBucket: getEnv("FIREBASE_STORAGE_BUCKET"),
  messagingSenderId: getEnv("FIREBASE_MESSAGING_SENDER_ID"),
  appId: getEnv("FIREBASE_APP_ID"),
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

// ============================================================
// Groq API
// ============================================================
const GROQ_API_KEY = getEnv("GROQ_API_KEY");
if (!GROQ_API_KEY) {
  console.warn("⚠️ GROQ_API_KEY غير موجود في ملف .env");
} else {
  console.log("✅ GROQ_API_KEY موجود");
}

// ============================================================
// دوال مساعدة
// ============================================================
const json = (response, status, body) =>
  response
    .writeHead(status, {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    })
    .end(JSON.stringify(body));

const readBody = async (request) => {
  let value = "";
  for await (const chunk of request) {
    value += chunk;
    if (value.length > 100000) throw new Error("Request too large.");
  }
  try {
    return JSON.parse(value || "{}");
  } catch {
    throw new Error("Invalid JSON");
  }
};

// ============================================================
// التحقق من توكن Firebase
// ============================================================
const verify = async (token) => {
  if (!token || !firebaseConfig.apiKey) return null;
  try {
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${encodeURIComponent(firebaseConfig.apiKey)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken: token }),
      }
    );
    const data = await response.json();
    return response.ok ? data.users?.[0] : null;
  } catch {
    return null;
  }
};

// ============================================================
// Rate Limiting
// ============================================================
const assistantHits = new Map();
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 15;
const isRateLimited = (key) => {
  const now = Date.now();
  const hits = (assistantHits.get(key) || []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  hits.push(now);
  assistantHits.set(key, hits);
  return hits.length > RATE_LIMIT_MAX;
};

// ============================================================
// الخادم
// ============================================================
const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url, `http://${request.headers.host}`);

    // ---- API: /api/config ----
    if (request.method === "GET" && url.pathname === "/api/config") {
      return json(response, 200, { firebase: firebaseConfig });
    }

    // ---- API: /api/firestore (الوكيل) ----
    if (request.method === "POST" && url.pathname === "/api/firestore") {
      const user = await verify(request.headers.authorization?.replace(/^Bearer\s+/i, ""));
      if (!user) return json(response, 401, { error: "يجب تسجيل الدخول" });

      const { action, collection: colName, data, docId } = await readBody(request);
      const uid = user.localId;
      let result;

      try {
        switch (action) {
          case "add": {
            const ref = collection(db, colName);
            const docRef = await addDoc(ref, { ...data, uid, createdAt: serverTimestamp() });
            result = { id: docRef.id };
            break;
          }
          case "set": {
            if (!docId) throw new Error("docId مطلوب");
            const ref = doc(db, colName, docId);
            await setDoc(ref, { ...data, uid, updatedAt: serverTimestamp() }, { merge: true });
            result = { success: true };
            break;
          }
          case "update": {
            if (!docId) throw new Error("docId مطلوب");
            const ref = doc(db, colName, docId);
            await updateDoc(ref, { ...data, updatedAt: serverTimestamp() });
            result = { success: true };
            break;
          }
          case "delete": {
            if (!docId) throw new Error("docId مطلوب");
            const ref = doc(db, colName, docId);
            await deleteDoc(ref);
            result = { success: true };
            break;
          }
          case "get": {
            const ref = collection(db, colName);
            const q = query(ref, where("uid", "==", uid));
            const snapshot = await getDocs(q);
            result = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
            break;
          }
          default:
            throw new Error("action غير معروف");
        }
        return json(response, 200, result);
      } catch (error) {
        console.error("[Proxy] خطأ:", error);
        return json(response, 500, { error: error.message });
      }
    }

    // ---- API: /api/assistant (Groq) ----
    if (request.method === "POST" && url.pathname === "/api/assistant") {
      console.log("🟢 [Assistant] تم استلام طلب جديد");
      
      const user = await verify(request.headers.authorization?.replace(/^Bearer\s+/i, ""));
      if (!user) {
        console.log("🔴 [Assistant] فشل التحقق من المستخدم");
        return json(response, 401, { error: "يجب تسجيل الدخول" });
      }
      
      if (isRateLimited(user.localId)) {
        console.log("🔴 [Assistant] تجاوز حد الطلبات");
        return json(response, 429, { error: "طلبات كثيرة، انتظر دقيقة." });
      }
      
      const { prompt, transactions, goals, bills, budget } = await readBody(request);
      console.log("🟢 [Assistant] السؤال:", prompt);
      
      if (!prompt) {
        console.log("🔴 [Assistant] السؤال فارغ");
        return json(response, 400, { error: "اكتب سؤالاً." });
      }
      
      if (!GROQ_API_KEY) {
        console.log("🔴 [Assistant] GROQ_API_KEY غير موجود");
        return json(response, 500, { error: "GROQ_API_KEY غير موجود" });
      }

      const financialContext = {
        transactions: (transactions || []).slice(0, 500).map(({ type, date, category, description, amount }) => ({
          type,
          date,
          category,
          description,
          amount: Number(amount),
        })),
        goals: (goals || []).slice(0, 20),
        bills: (bills || []).slice(0, 50),
        budget: Number(budget) || 0,
      };

      const systemMessage =
        "You are PocketWise, a professional personal-finance assistant. Use only the supplied user data. Be concise, practical, non-judgmental, and state uncertainty. Do not give legal, tax, investment, or debt advice as certainty.";
      const userMessage = `User question: ${prompt}\nFinancial data: ${JSON.stringify(financialContext)}`;

      try {
        console.log("🟢 [Assistant] إرسال طلب إلى Groq...");
        const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${GROQ_API_KEY}`,
          },
          body: JSON.stringify({
            model: "llama-3.1-8b-instant",
            messages: [
              { role: "system", content: systemMessage },
              { role: "user", content: userMessage },
            ],
            temperature: 0.35,
            max_tokens: 700,
          }),
        });
        
        const result = await groqRes.json();
        console.log("🟢 [Assistant] استجابة Groq:", groqRes.status);
        
        if (!groqRes.ok) {
          console.error("[Groq] فشل:", groqRes.status, JSON.stringify(result));
          return json(response, 502, { 
            error: `فشل Groq: ${result.error?.message || "خطأ غير معروف"}` 
          });
        }
        
        const text = result.choices?.[0]?.message?.content || "لم أتمكن من توليد إجابة.";
        console.log("🟢 [Assistant] تم توليد الإجابة بنجاح");
        return json(response, 200, { text });
      } catch (error) {
        console.error("[Groq] خطأ:", error);
        return json(response, 500, { error: `فشل الاتصال بـ Groq: ${error.message}` });
      }
    }

    // ---- الملفات الثابتة ----
    if (request.method !== "GET" && request.method !== "HEAD") {
      return json(response, 405, { error: "Method not allowed." });
    }
    let requested = url.pathname === "/" ? "index.html" : url.pathname.replace(/^\/+/, "");
    if (!requested || requested.split(/[\\/]/).some((p) => p.startsWith("."))) {
      return json(response, 404, { error: "Not found." });
    }
    const path = normalize(join(appRoot, requested));
    if (!path.startsWith(appRoot)) return json(response, 403, { error: "Forbidden" });
    const content = await readFile(path);
    const ext = extname(path);
    const contentType = {
      ".html": "text/html; charset=utf-8",
      ".js": "text/javascript; charset=utf-8",
      ".css": "text/css; charset=utf-8",
      ".webmanifest": "application/manifest+json",
    }[ext] || "application/octet-stream";
    response.writeHead(200, {
      "Content-Type": contentType,
      "Cache-Control": ext === ".html" ? "no-cache" : "public, max-age=3600",
      "Content-Security-Policy":
        "default-src 'self'; script-src 'self' https://cdn.jsdelivr.net https://www.gstatic.com https://apis.google.com; connect-src 'self' https://*.googleapis.com https://*.firebaseio.com https://firestore.googleapis.com https://api.groq.com; style-src 'self' 'unsafe-inline'; img-src 'self' data:; frame-src https://*.firebaseapp.com https://accounts.google.com; base-uri 'self'; form-action 'self'; object-src 'none'",
    });
    response.end(request.method === "HEAD" ? undefined : content);
  } catch (error) {
    console.error("[Server] خطأ فادح:", error);
    const status = error.status || (error.code === "ENOENT" ? 404 : 500);
    json(response, status, { error: "فشل الطلب." });
  }
});

// ============================================================
// تشغيل الخادم
// ============================================================
const startPort = Number(process.env.PORT) || 3004;
let currentPort = startPort;
const maxAttempts = 20;

function startServer(port) {
  server.listen(port, () => {
    console.log(`🚀 PocketWise يعمل على http://localhost:${port}`);
  });
}

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    currentPort++;
    if (currentPort - startPort < maxAttempts) {
      console.log(`⚠️ المنفذ ${currentPort - 1} مشغول، جرب ${currentPort}...`);
      startServer(currentPort);
    } else {
      console.error("❌ لا يوجد منفذ شاغر.");
      process.exit(1);
    }
  } else {
    console.error("❌ خطأ في الخادم:", err);
    process.exit(1);
  }
});

startServer(currentPort);