import { Router } from "express";

const router = Router();

// TODO: Replace with real Firestore query (Task 42)
router.get("/", (_req, res) => {
  res.json([
    {
      id: "seg-1",
      zoneId: "zone-1",
      geometry: {
        type: "LineString",
        coordinates: [
          [77.5946, 12.9716],
          [77.5950, 12.9720],
        ],
      },
      aggregatedSeverity: 2,
      conditionTags: ["lighting"],
      lastReportAt: new Date().toISOString(),
    },
    {
      id: "seg-2",
      zoneId: "zone-1",
      geometry: {
        type: "LineString",
        coordinates: [
          [77.5950, 12.9720],
          [77.5954, 12.9724],
        ],
      },
      aggregatedSeverity: 5,
      conditionTags: ["harassment_risk", "crowd_density"],
      lastReportAt: new Date().toISOString(),
    },
  ]);
});

export default router;
