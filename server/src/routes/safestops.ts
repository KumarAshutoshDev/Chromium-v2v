import { Router } from "express";

const router = Router();

// TODO: Replace with real Firestore query once AI seeds data (Task 33)
router.get("/", (_req, res) => {
  res.json([
    {
      id: "stop-1",
      name: "Café Amara",
      category: "cafe",
      location: { lat: 12.9716, lng: 77.5946 },
      trustScore: 8.5,
    },
    {
      id: "stop-2",
      name: "24/7 Pharmacy",
      category: "pharmacy",
      location: { lat: 12.9720, lng: 77.5950 },
      trustScore: 9.2,
    },
  ]);
});

export default router;
