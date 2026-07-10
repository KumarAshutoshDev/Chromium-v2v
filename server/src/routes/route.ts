import { Router, Request, Response } from "express";
import { findRoute } from "../services/pathfinding";

const router = Router();

router.post("/", (req: Request, res: Response) => {
  const { origin, destination } = req.body;

  if (!origin || !destination) {
    res.status(400).json({ error: "Missing origin or destination" });
    return;
  }

  const recommended = findRoute(origin.lat, origin.lng, destination.lat, destination.lng, true);
  const shortest = findRoute(origin.lat, origin.lng, destination.lat, destination.lng, false);
// Offset shortest route coordinates for visual distinction
if (shortest) {
  shortest.path = shortest.path.map(n => ({
    ...n,
    lat: n.lat + 0.0002,
    lng: n.lng + 0.0002,
  }));
}

  const toGeoJSON = (route: any) => ({
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: route.path.map((n: any) => [n.lng, n.lat]),
        },
        properties: {
          walkTime: Math.round(route.totalDistance / 80) + " min", // 80 m/min walking
          hazardCount: route.totalHazard,
          distance: route.totalDistance + " m",
          safeStopWaypoints: route.path.filter((n: any) => n.name).map((n: any) => n.name),
        },
      },
    ],
  });

  res.json({
    recommended: recommended ? toGeoJSON(recommended) : null,
    shortest: shortest ? toGeoJSON(shortest) : null,
  });
});

export default router;
