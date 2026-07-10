import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import dotenv from "dotenv";
dotenv.config();

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT as string);
initializeApp({ credential: cert(serviceAccount) });

const db = getFirestore();

async function seed() {
  const segments = [
    {
      zoneId: "zone-1",
      coordinates: [
        { lat: 12.9716, lng: 77.5946 },
        { lat: 12.9720, lng: 77.5950 },
      ],
      aggregatedSeverity: 2,
      lastReportAt: new Date().toISOString(),
      conditionTags: ["lighting"],
    },
    {
      zoneId: "zone-1",
      coordinates: [
        { lat: 12.9720, lng: 77.5950 },
        { lat: 12.9724, lng: 77.5954 },
      ],
      aggregatedSeverity: 5,
      lastReportAt: new Date().toISOString(),
      conditionTags: ["harassment_risk", "crowd_density"],
    },
    {
      zoneId: "zone-1",
      coordinates: [
        { lat: 12.9716, lng: 77.5946 },
        { lat: 12.9710, lng: 77.5940 },
      ],
      aggregatedSeverity: 1,
      lastReportAt: new Date().toISOString(),
      conditionTags: ["well_lit"],
    },
    {
      zoneId: "zone-1",
      coordinates: [
        { lat: 12.9720, lng: 77.5950 },
        { lat: 12.9725, lng: 77.5960 },
      ],
      aggregatedSeverity: 3,
      lastReportAt: new Date().toISOString(),
      conditionTags: ["crowd_density"],
    },
    {
      zoneId: "zone-1",
      coordinates: [
        { lat: 12.9724, lng: 77.5954 },
        { lat: 12.9705, lng: 77.5955 },
      ],
      aggregatedSeverity: 4,
      lastReportAt: new Date().toISOString(),
      conditionTags: ["harassment_risk", "dim"],
    },
  ];

  for (const seg of segments) {
    const docRef = await db.collection("segments").add(seg);
    console.log(`Seeded segment: ${docRef.id}`);
  }

  console.log("✅ Segments seeded.");
}

seed().catch(console.error);
