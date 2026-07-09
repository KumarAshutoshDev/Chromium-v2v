import { Router } from "express";

const router = Router();

// TODO: Replace with real encryption + Firestore save (Task 61)
router.post("/", (req, res) => {
  const { contactInfo } = req.body;
  if (!contactInfo) {
    res.status(400).json({ error: "Missing contactInfo" });
    return;
  }
  const shareId = "share-" + Date.now();
  res.status(201).json({
    shareId,
    expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    message: "Share created (stub — not saved yet)",
  });
});

// TODO: Replace with real Firestore lookup + expiry check (Task 62)
router.get("/:id", (req, res) => {
  const { id } = req.params;
  // Simulate expiry check — just echo back for now
  res.json({
    shareId: id,
    contactInfoEncrypted: "encrypted-placeholder",
    expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    active: true,
  });
});

export default router;
