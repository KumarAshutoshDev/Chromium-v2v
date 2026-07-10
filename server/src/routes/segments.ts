import { Router, Request, Response } from "express";
import { db } from "../config/firebase";

const router = Router();

router.get("/", async (_req: Request, res: Response) => {
  try {
    const snapshot = await db.collection("segments").get();
    const segments = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.json(segments);
  } catch (err) {
    console.error("Failed to fetch segments:", err);
    res.status(500).json({ error: "Failed to fetch segments" });
  }
});

export default router;
