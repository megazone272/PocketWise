import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth, setPersistence, browserLocalPersistence, onAuthStateChanged, createUserWithEmailAndPassword,
  signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, sendPasswordResetEmail, signOut, updateProfile,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  getFirestore, collection, doc, addDoc, setDoc, updateDoc, deleteDoc, query, where, onSnapshot, serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

let services;
export const startFirebase = async () => {
  const response = await fetch("/api/config", { credentials: "same-origin" });
  if (!response.ok) throw new Error("Firebase is not configured on this server.");
  const { firebase } = await response.json();
  if (!firebase?.apiKey || !firebase?.projectId) throw new Error("Firebase configuration is incomplete.");
  const app = initializeApp(firebase);
  const auth = getAuth(app);
  await setPersistence(auth, browserLocalPersistence);
  services = { auth, db: getFirestore(app) };
  return services;
};
export const firebase = () => {
  if (!services) throw new Error("Firebase is still initializing. Please try again in a moment.");
  return services;
};
export {
  collection, doc, addDoc, setDoc, updateDoc, deleteDoc, query, where, onSnapshot, serverTimestamp,
  onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider,
  signInWithPopup, sendPasswordResetEmail, signOut, updateProfile,
};
