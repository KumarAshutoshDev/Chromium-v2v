// src/lib/firebase.ts
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, signInAnonymously, onAuthStateChanged, type User } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "PASTE_FROM_BE",
  authDomain: "PASTE_FROM_BE",
  projectId: "PASTE_FROM_BE",
  storageBucket: "PASTE_FROM_BE",
  messagingSenderId: "PASTE_FROM_BE",
  appId: "PASTE_FROM_BE",
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