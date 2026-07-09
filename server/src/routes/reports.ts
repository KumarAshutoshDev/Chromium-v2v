import { Router } from "express";

const router = Router();

// TODO: Replace with Firestore save + real ID (Task 37)
router.post("/", (req, res) => {
  const { segmentId, type, text, tags } = req.body;

  if (!segmentId || !type || !text) {
    res.status(400).json({ error: "Missing required fields: segmentId, type, text" });
    return;
  }

  // Mock response — real implementation will save to Firestore and return the actual document ID
  const mockReportId = "report-" + Date.now();
  res.status(201).json({
    reportId: mockReportId,
    status: "pending",
    message: "Report submitted (stub — not saved to DB yet)",
  });
});

export default router;
