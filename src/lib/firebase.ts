// src/lib/firebase.ts
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// TODO: replace with real config once BE shares it
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