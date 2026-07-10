// src/lib/firebase.ts
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, signInAnonymously, onAuthStateChanged, type User } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBG6IzlhZZqwoFdDa71Tl_ArLwqBiB3rH8",
  authDomain: "herpath-448f0.firebaseapp.com",
  projectId: "herpath-448f0",
  storageBucket: "herpath-448f0.firebasestorage.app",
  messagingSenderId: "1025551402546",
  appId: "1:1025551402546:web:2824382a6e98d770941e2b",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// Signs the user in anonymously and calls back with their UID once ready
export function initAnonymousAuth(onReady: (user: User | null) => void) {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      onReady(user);
    } else {
      signInAnonymously(auth).catch((err) => {
        console.error('Anonymous sign-in failed:', err);
        onReady(null);
      });
    }
  });
}