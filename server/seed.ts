import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import dotenv from "dotenv";
dotenv.config();

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT as string);
initializeApp({ credential: cert(serviceAccount) });

const db = getFirestore();

async function seed() {
  const safeStops = [
    {
      zoneId: "zone-1",
      location: { lat: 12.9716, lng: 77.5946 },
      name: "Café Amara",
      category: "cafe",
      trustScore: 8.5,
      openHoursCached: "6:00 AM - 11:00 PM",
      openHoursLastRefreshed: new Date().toISOString(),
      osmVerified: true,
      confirmations: [],
    },
    {
      zoneId: "zone-1",
      location: { lat: 12.9720, lng: 77.5950 },
      name: "24/7 Pharmacy",
      category: "pharmacy",
      trustScore: 9.2,
      openHoursCached: "Open 24 hours",
      openHoursLastRefreshed: new Date().toISOString(),
      osmVerified: true,
      confirmations: [],
    },
    {
      zoneId: "zone-1",
      location: { lat: 12.9730, lng: 77.5955 },
      name: "Transit Stop — MG Road",
      category: "transit",
      trustScore: 6.8,
      openHoursCached: "5:00 AM - 12:00 AM",
      openHoursLastRefreshed: new Date().toISOString(),
      osmVerified: false,
      confirmations: [],
    },
    {
      zoneId: "zone-1",
      location: { lat: 12.9710, lng: 77.5940 },
      name: "University Library",
      category: "public_building",
      trustScore: 9.5,
      openHoursCached: "8:00 AM - 12:00 AM",
      openHoursLastRefreshed: new Date().toISOString(),
      osmVerified: true,
      confirmations: [],
    },
    {
      zoneId: "zone-1",
      location: { lat: 12.9725, lng: 77.5960 },
      name: "Campus Security Office",
      category: "security",
      trustScore: 9.8,
      openHoursCached: "Open 24 hours",
      openHoursLastRefreshed: new Date().toISOString(),
      osmVerified: true,
      confirmations: [],
    },
    {
      zoneId: "zone-1",
      location: { lat: 12.9705, lng: 77.5955 },
      name: "Green Park Convenience Store",
      category: "shop",
      trustScore: 7.0,
      openHoursCached: "6:00 AM - 2:00 AM",
      openHoursLastRefreshed: new Date().toISOString(),
      osmVerified: false,
      confirmations: [],
    },
  ];

  for (const stop of safeStops) {
    const docRef = await db.collection("safeStops").add(stop);
    console.log(`Seeded SafeStop: ${stop.name} (${docRef.id})`);
  }

  console.log("✅ All SafeStops seeded.");
}

seed().catch(console.error);
