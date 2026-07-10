import { Router, Request, Response } from "express";
import { db } from "../config/firebase";

const router = Router();

router.get("/", async (_req: Request, res: Response) => {
  try {
    const snapshot = await db.collection("safeStops").get();
    const stops = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.json(stops);
  } catch (err) {
    console.error("Failed to fetch SafeStops:", err);
    res.status(500).json({ error: "Failed to fetch SafeStops" });
  }
});

export default router;
