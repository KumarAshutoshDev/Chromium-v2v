import { groq, MODEL } from "../config/groq";

export interface ModerationResult {
  type: "valid" | "duplicate" | "spam";
  structuredTags: {
    lighting?: string;
    crowd?: string;
    harassment_risk?: string;
  };
  categoryMatch?: boolean;
  duplicateOfSegmentId?: string | null;
  containsPersonalIdentifier: boolean;
  explanation: string;
}

export async function moderateReport(
  text: string,
  tags: string[],
  segmentId?: string
): Promise<ModerationResult> {
   const prompt = `
You are a strict content moderation system for a women's safety app. Analyze this street condition report.

Report text: "${text}"
User-selected tags: ${JSON.stringify(tags)}
Submitted for segment: ${segmentId || "unknown"}

Return a JSON object with this exact structure. Do NOT use "unknown" unless absolutely nothing can be inferred.
{
  "type": "valid" | "duplicate" | "spam",
  "structuredTags": {
    "lighting": "well_lit" | "dim" | "dark" | "unknown",
    "crowd": "sparse" | "moderate" | "crowded" | "unknown",
    "harassment_risk": "none" | "low" | "reported" | "unknown"
  },
  "duplicateOfSegmentId": null,
  "containsPersonalIdentifier": false,
  "explanation": "brief explanation"
}

Rules:
1. "valid" = a real street condition relevant to safety.
2. "duplicate" = matches an already-reported issue (set duplicateOfSegmentId to the matching segment ID if known, otherwise null).
3. "spam" = irrelevant, gibberish, or clearly not a real report.
4. For lighting: if the text mentions "dark", "no streetlights", "unlit", "dim", "flickering", set the appropriate lighting value. If it mentions "well lit", "bright", "good lighting", use "well_lit".
5. For crowd: if the text mentions "crowded", "many people", "busy", use "crowded". If it mentions "alone", "no one around", "quiet", "empty", "deserted", use "sparse". If it mentions "some people", "few students", use "moderate".
6. For harassment_risk: if the text mentions "catcalled", "followed", "harassment", "felt unsafe", "threatened", use "reported".
7. containsPersonalIdentifier = true only if a real person's name, phone number, or email appears.
8. Prefer specific values over "unknown" — use the context clues in the text.
`;
try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: MODEL,
      temperature: 0.1,
      response_format: { type: "json_object" },
    });

    const jsonText = chatCompletion.choices[0]?.message?.content || "{}";
    const parsed = JSON.parse(jsonText) as ModerationResult;
    return parsed;
} catch (err: any) {
    // If rate limited or any other error, return a fallback so the app still works
    if (err?.status === 429) {
      console.warn("Gemini rate limited – using fallback moderation result.");
    } else {
      console.error("Gemini error:", err);
    }

    return {
      type: "valid",
      structuredTags: {
        lighting: "unknown",
        crowd: "unknown",
        harassment_risk: "unknown",
      },
      containsPersonalIdentifier: false,
      explanation: "Moderation temporarily unavailable – report accepted as valid.",
    };
  }
}
