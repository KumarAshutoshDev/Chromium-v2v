import { Router, Request, Response } from "express";
import { db } from "../config/firebase";
import { groq, MODEL } from "../config/groq";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  const { name, category, location, text } = req.body;

  if (!name || !category || !location || !text) {
    res.status(400).json({ error: "Missing required fields: name, category, location, text" });
    return;
  }

  try {
    // 1. Groq OSM cross-check
    const prompt = `
You are an assistant that verifies whether a suggested safe stop category matches its name and typical OSM categories.
Suggested stop:
Name: "${name}"
Category: "${category}"
Location: (${location.lat}, ${location.lng})
User description: "${text}"

Return a JSON object:
{
  "categoryMatch": true or false,
  "suggestedCategory": "the most appropriate OSM category if mismatch",
  "explanation": "brief reason"
}
`;
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: MODEL,
      temperature: 0.1,
      response_format: { type: "json_object" },
    });

    const moderation = JSON.parse(chatCompletion.choices[0]?.message?.content || "{}");

    // 2. Save nomination to Firestore
    const status = moderation.categoryMatch ? "pending" : "review";
    const trustScore = moderation.categoryMatch ? 5.0 : 2.0; // initial trust score

    const docRef = await db.collection("safeStops").add({
      zoneId: "zone-1", // hardcoded for MVP
      location,
      name,
      category: moderation.suggestedCategory || category,
      trustScore,
      openHoursCached: "Unknown",
      openHoursLastRefreshed: new Date().toISOString(),
      osmVerified: moderation.categoryMatch,
      confirmations: [],
      nominated: true,
      nominationText: text,
      nominationStatus: status,
    });

    res.status(201).json({
      nominationId: docRef.id,
      status,
      categoryMatch: moderation.categoryMatch,
      suggestedCategory: moderation.suggestedCategory,
      explanation: moderation.explanation,
      message: `Nomination ${status === "pending" ? "submitted" : "sent for manual review"}`,
    });
  } catch (err) {
    console.error("Nomination failed:", err);
    res.status(500).json({ error: "Nomination failed" });
  }
});

export default router;
