import { Router, Request, Response } from "express";
import { moderateReport } from "../services/moderation";
import { db } from "../config/firebase";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  const { segmentId, type, text, tags } = req.body;

  if (!segmentId || !type || !text) {
    res.status(400).json({ error: "Missing required fields: segmentId, type, text" });
    return;
  }

  // Auth middleware not yet applied to this route – using placeholder UID
  const uid = "anonymous";

  try {
    // 1. Run Groq moderation
    const moderation = await moderateReport(text, tags || [], segmentId);

    // 2. Save report to Firestore
    const docRef = await db.collection("reports").add({
      segmentId,
      type,
      text,
      tags: tags || [],
      structuredTags: moderation.structuredTags,
      status: moderation.type === "valid" ? "pending" : moderation.type,
      severity: 0,
      confirmations: [],
      createdAt: new Date().toISOString(),
      uid,
      containsPersonalIdentifier: moderation.containsPersonalIdentifier || false,
      moderationExplanation: moderation.explanation || "",
    });
    // 3. If the report is valid, update the linked segment's severity and tags
    if (moderation.type === "valid" && segmentId) {
      try {
        const segmentRef = db.collection("segments").doc(segmentId);
        const segmentDoc = await segmentRef.get();
        if (segmentDoc.exists) {
          const segmentData = segmentDoc.data() || {};
          const currentSeverity = segmentData.aggregatedSeverity || 0;
          const currentTags: string[] = segmentData.conditionTags || [];

          // Merge new tags from moderation
          const newTags = Object.values(moderation.structuredTags || {})
            .filter((v) => v && v !== "unknown");
          const mergedTags = [...new Set([...currentTags, ...newTags])];

          await segmentRef.update({
            aggregatedSeverity: currentSeverity + 1,
            conditionTags: mergedTags,
            lastReportAt: new Date().toISOString(),
          });
        }
      } catch (segErr) {
        console.error("Failed to update segment severity:", segErr);
        // Don't fail the whole request — the report is already saved
      }
    }
    res.status(201).json({
      reportId: docRef.id,
      status: moderation.type === "valid" ? "pending" : moderation.type,
      moderation,
      message: "Report submitted and saved to Firestore",
    });
  } catch (err) {
    console.error("Report submission failed:", err);
    res.status(500).json({ error: "Failed to save report" });
  }
});

export default router;
