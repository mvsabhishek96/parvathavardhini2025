// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBNxvQA-82MgxXAzkLRabadKt9I61FMRe8",
  authDomain: "parvathavardhini2025.firebaseapp.com",
  projectId: "parvathavardhini2025",
  storageBucket: "parvathavardhini2025.firebasestorage.app",
  messagingSenderId: "902451328910",
  appId: "1:902451328910:web:b7afd9a70cdace298396df",
  measurementId: "G-QWCEJSLQF5",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;

// Re-export style (compatibility with `import * as fb from "./firebase";`)
export const firebase = { auth, db, app };
