import { Router } from "express";

const router = Router();

// TODO: Replace with real ranking algorithm + SafeStop query (Task 53/54)
router.post("/", (req, res) => {
  const { userLocation } = req.body;

  if (!userLocation) {
    res.status(400).json({ error: "Missing userLocation" });
    return;
  }

  res.json([
    {
      safeStopId: "stop-1",
      name: "Café Amara",
      category: "cafe",
      location: { lat: 12.9716, lng: 77.5946 },
      oneLiner: "Café Amara — 3 min, lit main road, 5 confirmations.",
      trustScore: 8.5,
      route: {
        type: "LineString",
        coordinates: [
          [77.5946, 12.9716],
          [77.5948, 12.9718],
        ],
      },
      walkTime: "3 min",
    },
    {
      safeStopId: "stop-2",
      name: "24/7 Pharmacy",
      category: "pharmacy",
      location: { lat: 12.9720, lng: 77.5950 },
      oneLiner: "24/7 Pharmacy — 5 min, side street, 7 confirmations.",
      trustScore: 9.2,
      route: {
        type: "LineString",
        coordinates: [
          [77.5946, 12.9716],
          [77.5950, 12.9720],
        ],
      },
      walkTime: "5 min",
    },
    {
      safeStopId: "stop-3",
      name: "Transit Stop — MG Road",
      category: "transit",
      location: { lat: 12.9730, lng: 77.5955 },
      oneLiner: "Transit Stop MG Road — 7 min, busy main road, 3 confirmations.",
      trustScore: 6.8,
      route: {
        type: "LineString",
        coordinates: [
          [77.5946, 12.9716],
          [77.5955, 12.9730],
        ],
      },
      walkTime: "7 min",
    },
  ]);
});

export default router;
