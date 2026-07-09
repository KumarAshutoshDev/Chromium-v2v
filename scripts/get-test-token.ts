import dotenv from "dotenv";
dotenv.config();

import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT as string);
initializeApp({ credential: cert(serviceAccount) });

const uid = "test-user-" + Date.now();

async function main() {
  const customToken = await getAuth().createCustomToken(uid);
  const apiKey = "AIzaSyBG6IzlhZZqwoFdDa71Tl_ArLwqBiB3rH8";
  const res = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token: customToken, returnSecureToken: true }),
  });
  const data: any = await res.json();
  if (data.error) {
    console.error("Error exchanging custom token:", data.error.message);
    return;
  }
  console.log("ID Token (copy this whole line):");
  console.log(data.idToken);
  console.log("UID:", data.localId);
}

main();
