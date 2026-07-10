import { Router, Request, Response } from "express";
import { db } from "../config/firebase";
import { FieldValue } from "firebase-admin/firestore";

const router = Router();

router.post("/:id/confirm", async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const uid = "anonymous"; // Replace with req.uid when auth middleware is applied

  try {
    const docRef = db.collection("reports").doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      res.status(404).json({ error: "Report not found" });
      return;
    }

    const data = doc.data();
    const confirmations: string[] = data?.confirmations || [];

    if (confirmations.includes(uid)) {
      res.json({ message: "Already confirmed", confirmations: confirmations.length });
      return;
    }

    await docRef.update({
     confirmations: FieldValue.arrayUnion(uid),
    });

    res.json({
      reportId: id,
      confirmedBy: uid,
      confirmations: confirmations.length + 1,
      message: "Confirmation recorded",
    });
  } catch (err) {
    console.error("Confirmation failed:", err);
    res.status(500).json({ error: "Failed to confirm report" });
  }
});

export default router;
