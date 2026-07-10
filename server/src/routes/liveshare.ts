import { Router, Request, Response } from "express";
import { db } from "../config/firebase";
import crypto from "crypto";

const router = Router();

// Simple placeholder encryption (base64)
function encrypt(text: string): string {
  return Buffer.from(text).toString("base64");
}
function decrypt(encoded: string): string {
  return Buffer.from(encoded, "base64").toString("utf-8");
}

// POST /api/live-share
router.post("/", async (req: Request, res: Response) => {
  const { contactInfo } = req.body;
  if (!contactInfo) {
    res.status(400).json({ error: "Missing contactInfo" });
    return;
  }

  try {
    const encrypted = encrypt(contactInfo);
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000).toISOString(); // 30 min from now
    const docRef = await db.collection("liveShares").add({
      uid: "anonymous", // replace with req.uid when auth middleware is applied
      contactInfoEncrypted: encrypted,
      expiresAt,
      active: true,
    });

    res.status(201).json({
      shareId: docRef.id,
      expiresAt,
      message: "Live share created. Link will expire in 30 minutes.",
    });
  } catch (err) {
    console.error("Live share creation failed:", err);
    res.status(500).json({ error: "Failed to create live share" });
  }
});

// GET /api/live-share/:id
router.get("/:id", async (req: Request, res: Response) => {
const id = req.params.id as string;
  try {
    const docRef = db.collection("liveShares").doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      res.status(404).json({ error: "Share not found" });
      return;
    }

    const data = doc.data()!;
    const now = new Date();
    const expiresAt = new Date(data.expiresAt);

    if (now > expiresAt) {
      res.status(410).json({ error: "This share has expired and can no longer be viewed." });
      return;
    }

    const contactInfo = decrypt(data.contactInfoEncrypted);
    res.json({
      shareId: id,
      contactInfo, // decrypted original
      expiresAt: data.expiresAt,
      active: data.active,
    });
  } catch (err) {
    console.error("Live share retrieval failed:", err);
    res.status(500).json({ error: "Failed to retrieve live share" });
  }
});

export default router;
