import { Router, Request, Response } from "express";
import { db } from "../config/firebase";
import { findRoute } from "../services/pathfinding";
import { FieldPath } from "firebase-admin/firestore";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  const { userLocation } = req.body;
  if (!userLocation || userLocation.lat == null || userLocation.lng == null) {
    res.status(400).json({ error: "Missing valid userLocation { lat, lng }" });
    return;
  }

  try {
    // 1. Fetch all safe stops from Firestore
    const snapshot = await db.collection("safeStops").get();
    const stops = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // 2. For each stop, compute the safe route and gather segment lighting info
    const rankedPromises = stops.map(async (stop: any) => {
      const route = findRoute(
        userLocation.lat,
        userLocation.lng,
        stop.location.lat,
        stop.location.lng,
        true // avoid hazards
      );
      if (!route) return null;

      // Collect segment IDs along the route
      const segmentIds = route.edges
        .map((e) => e.segmentId)
        .filter((id): id is string => !!id);

      // Fetch those segments from Firestore to get conditionTags
      let lightingCondition = "unknown";
      if (segmentIds.length > 0) {
        try {
          const segSnapshot = await db
            .collection("segments")
            .where(FieldPath.documentId(), "in", segmentIds)
            .get();
          const tags: string[] = [];
          segSnapshot.forEach((doc) => {
            const data = doc.data();
            if (data.conditionTags && Array.isArray(data.conditionTags)) {
              tags.push(...data.conditionTags);
            }
          });
          // Determine the overall lighting condition
          if (tags.some((t) => t.toLowerCase().includes("dark") || t.toLowerCase().includes("dim"))) {
            lightingCondition = "poorly lit";
          } else if (tags.some((t) => t.toLowerCase().includes("lighting") || t.toLowerCase().includes("well_lit"))) {
            lightingCondition = "well lit";
          } else {
            lightingCondition = "lighting unknown";
          }
        } catch (e) {
          console.error("Failed to fetch segment lighting:", e);
        }
      } else {
        lightingCondition = "no segment data";
      }

      // Composite score: lower is better
      const distanceScore = route.totalDistance;
      const hazardScore = route.totalHazard * 50;
      const trustBonus = (10 - (stop.trustScore || 5)) * 10;
      const score = distanceScore + hazardScore + trustBonus;

      const oneLiner = `${stop.name} — ${Math.round(route.totalDistance / 80)} min, ${lightingCondition}, ${route.totalHazard} hazards, ${stop.confirmations?.length || 0} confirmations.`;

      return {
        safeStopId: stop.id,
        name: stop.name,
        category: stop.category,
        location: stop.location,
        trustScore: stop.trustScore,
        oneLiner,
        route: {
          type: "LineString",
          coordinates: route.path.map((n: any) => [n.lng, n.lat]),
        },
        walkTime: Math.round(route.totalDistance / 80) + " min",
        distance: route.totalDistance + " m",
        hazardCount: route.totalHazard,
        lighting: lightingCondition,
      };
    });

    // Wait for all stop computations to finish
    const ranked = (await Promise.all(rankedPromises))
      .filter(Boolean)
      .sort((a: any, b: any) => a.score - b.score)
      .slice(0, 3);

    res.json(ranked);
  } catch (err) {
    console.error("Panic reroute failed:", err);
    res.status(500).json({ error: "Panic reroute failed" });
  }
});

export default router;
