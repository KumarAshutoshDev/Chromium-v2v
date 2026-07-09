import { Router } from "express";

const router = Router();

// TODO: Replace with Firestore array-union update (Task 40)
router.post("/:id/confirm", (req, res) => {
  const { id } = req.params;
  // In real implementation, req.uid would come from authMiddleware
  const uid = (req as any).uid || "anonymous";

  res.json({
    reportId: id,
    confirmedBy: uid,
    confirmations: 3,
    message: "Confirmation recorded (stub)",
  });
});

export default router;
