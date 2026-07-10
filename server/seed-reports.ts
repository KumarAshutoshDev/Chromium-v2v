import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import dotenv from "dotenv";
dotenv.config();

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT as string);
initializeApp({ credential: cert(serviceAccount) });

const db = getFirestore();

const reports = [
  {
    segmentId: "BbRwatjOt72SC4xjrRBu", // lighting segment
    type: "condition",
    text: "Two streetlights out near the pharmacy. Very dark after 7 PM.",
    tags: ["lighting"],
    structuredTags: { lighting: "dark", crowd: "unknown", harassment_risk: "unknown" },
    status: "valid",
    severity: 1,
    confirmations: [],
    createdAt: new Date().toISOString(),
    uid: "seed-user-1",
    containsPersonalIdentifier: false,
    moderationExplanation: "Legitimate lighting report.",
  },
  {
    segmentId: "zxwKwhCOFSYwbLjkFweI", // harassment segment
    type: "condition",
    text: "Group of men loitering near the transit stop. I crossed the street.",
    tags: ["harassment_risk", "crowd_density"],
    structuredTags: { lighting: "unknown", crowd: "crowded", harassment_risk: "reported" },
    status: "valid",
    severity: 2,
    confirmations: [],
    createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    uid: "seed-user-2",
    containsPersonalIdentifier: false,
    moderationExplanation: "Harassment report with crowd tag.",
  },
  {
    segmentId: "zxwKwhCOFSYwbLjkFweI",
    type: "condition",
    text: "Suspicious person following me near the bus stop. Ran to the pharmacy.",
    tags: ["harassment_risk"],
    structuredTags: { lighting: "unknown", crowd: "sparse", harassment_risk: "reported" },
    status: "valid",
    severity: 3,
    confirmations: [],
    createdAt: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
    uid: "seed-user-3",
    containsPersonalIdentifier: false,
    moderationExplanation: "Valid harassment incident.",
  },
  {
    segmentId: "FCds36nnSR3y5HkroK1M", // new well-lit segment
    type: "condition",
    text: "Walk here often – well lit and usually other students around. Feels safe.",
    tags: ["lighting"],
    structuredTags: { lighting: "well_lit", crowd: "moderate", harassment_risk: "none" },
    status: "valid",
    severity: 0,
    confirmations: [],
    createdAt: new Date().toISOString(),
    uid: "seed-user-4",
    containsPersonalIdentifier: false,
    moderationExplanation: "Positive safety report.",
  },
  {
    segmentId: "4HFvD41pobJQN5fOXHzr", // crowd_density segment
    type: "condition",
    text: "Sidewalk too narrow for the crowd, had to walk on the road.",
    tags: ["crowd_density"],
    structuredTags: { lighting: "unknown", crowd: "crowded", harassment_risk: "unknown" },
    status: "valid",
    severity: 1,
    confirmations: [],
    createdAt: new Date(Date.now() - 1800000).toISOString(),
    uid: "seed-user-5",
    containsPersonalIdentifier: false,
    moderationExplanation: "Infrastructure/crowd issue.",
  },
  {
    segmentId: "55Jw2xifRu2rskZ0ZQhs", // dim segment
    type: "condition",
    text: "Very dim light, couldn't see the path clearly. Tripped on uneven pavement.",
    tags: ["lighting"],
    structuredTags: { lighting: "dim", crowd: "sparse", harassment_risk: "unknown" },
    status: "valid",
    severity: 2,
    confirmations: [],
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    uid: "seed-user-6",
    containsPersonalIdentifier: false,
    moderationExplanation: "Dim lighting report.",
  },
  {
    segmentId: "lpdAFuPQJokgHBwJ4AEh", // harassment+dim segment
    type: "condition",
    text: "Catcalled from a parked car. No one around to help. Ran to the convenience store.",
    tags: ["harassment_risk", "crowd_density"],
    structuredTags: { lighting: "dim", crowd: "sparse", harassment_risk: "reported" },
    status: "valid",
    severity: 3,
    confirmations: [],
    createdAt: new Date().toISOString(),
    uid: "seed-user-7",
    containsPersonalIdentifier: false,
    moderationExplanation: "Harassment in dim area.",
  },
];

async function seed() {
  for (const report of reports) {
    const docRef = await db.collection("reports").add(report);
    console.log(`Seeded report: ${docRef.id}`);
  }
  console.log("✅ 7 condition reports seeded.");
}

seed().catch(console.error);
