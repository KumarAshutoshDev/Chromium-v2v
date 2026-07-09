import { Router } from "express";

const router = Router();

// TODO: Replace with real A* engine (Task 47)
router.post("/", (req, res) => {
  const { origin, destination } = req.body;

  if (!origin || !destination) {
    res.status(400).json({ error: "Missing origin or destination" });
    return;
  }

  const recommended = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: [
            [77.5946, 12.9716],
            [77.5950, 12.9720],
            [77.5954, 12.9724],
          ],
        },
        properties: {
          name: "Recommended",
          walkTime: "8 min",
          hazardCount: 1,
          safeStopWaypoints: ["stop-1"],
        },
      },
    ],
  };

  const shortest = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: [
            [77.5946, 12.9716],
            [77.5954, 12.9724],
          ],
        },
        properties: {
          name: "Shortest",
          walkTime: "5 min",
          hazardCount: 2,
          hazardSegments: ["seg-2"],
        },
      },
    ],
  };

  res.json({ recommended, shortest });
});

export default router;
