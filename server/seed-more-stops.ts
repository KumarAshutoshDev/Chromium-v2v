import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import dotenv from "dotenv";
dotenv.config();

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT as string);
initializeApp({ credential: cert(serviceAccount) });

const db = getFirestore();

const newStops = [
  {
    zoneId: "zone-1",
    location: { lat: 12.9728, lng: 77.5948 },
    name: "St. Martha's Hospital",
    category: "hospital",
    trustScore: 8.8,
    openHoursCached: "Open 24 hours",
    openHoursLastRefreshed: new Date().toISOString(),
    osmVerified: true,
    confirmations: [],
  },
  {
    zoneId: "zone-1",
    location: { lat: 12.9712, lng: 77.5962 },
    name: "Cubbon Park Metro Station",
    category: "transit",
    trustScore: 7.5,
    openHoursCached: "5:30 AM - 11:30 PM",
    openHoursLastRefreshed: new Date().toISOString(),
    osmVerified: true,
    confirmations: [],
  },
  {
    zoneId: "zone-1",
    location: { lat: 12.9740, lng: 77.5935 },
    name: "Women's Hostel Block A",
    category: "residence",
    trustScore: 9.0,
    openHoursCached: "Open 24 hours",
    openHoursLastRefreshed: new Date().toISOString(),
    osmVerified: false,
    confirmations: [],
  },
  {
    zoneId: "zone-1",
    location: { lat: 12.9700, lng: 77.5948 },
    name: "Indian Coffee House",
    category: "cafe",
    trustScore: 7.8,
    openHoursCached: "8:00 AM - 10:00 PM",
    openHoursLastRefreshed: new Date().toISOString(),
    osmVerified: true,
    confirmations: [],
  },
  {
    zoneId: "zone-1",
    location: { lat: 12.9735, lng: 77.5968 },
    name: "MG Road Police Booth",
    category: "security",
    trustScore: 9.3,
    openHoursCached: "Open 24 hours",
    openHoursLastRefreshed: new Date().toISOString(),
    osmVerified: true,
    confirmations: [],
  },
];

async function seed() {
  for (const stop of newStops) {
    const docRef = await db.collection("safeStops").add(stop);
    console.log(`Seeded: ${stop.name} (${docRef.id})`);
  }
  console.log("✅ Added more SafeStops. Total now 11.");
}

seed().catch(console.error);
