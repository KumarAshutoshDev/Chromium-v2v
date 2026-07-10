import { moderateReport } from "./src/services/moderation";
import dotenv from "dotenv";
dotenv.config();

// Expected structured tags for our 7 seeded reports
const testCases = [
  {
    id: "seed-1",
    text: "Two streetlights out near the pharmacy. Very dark after 7 PM.",
    tags: ["lighting"],
    expectedType: "valid",
    expectedTags: { lighting: "dark", crowd: "unknown", harassment_risk: "unknown" },
  },
  {
    id: "seed-2",
    text: "Group of men loitering near the transit stop. I crossed the street.",
    tags: ["harassment_risk", "crowd_density"],
    expectedType: "valid",
    expectedTags: { lighting: "unknown", crowd: "crowded", harassment_risk: "reported" },
  },
  {
    id: "seed-3",
    text: "Suspicious person following me near the bus stop. Ran to the pharmacy.",
    tags: ["harassment_risk"],
    expectedType: "valid",
    expectedTags: { lighting: "unknown", crowd: "sparse", harassment_risk: "reported" },
  },
  {
    id: "seed-4",
    text: "Walk here often – well lit and usually other students around. Feels safe.",
    tags: ["lighting"],
    expectedType: "valid",
    expectedTags: { lighting: "well_lit", crowd: "moderate", harassment_risk: "none" },
  },
  {
    id: "seed-5",
    text: "Sidewalk too narrow for the crowd, had to walk on the road.",
    tags: ["crowd_density"],
    expectedType: "valid",
    expectedTags: { lighting: "unknown", crowd: "crowded", harassment_risk: "unknown" },
  },
  {
    id: "seed-6",
    text: "Very dim light, couldn't see the path clearly. Tripped on uneven pavement.",
    tags: ["lighting"],
    expectedType: "valid",
    expectedTags: { lighting: "dim", crowd: "unknown", harassment_risk: "unknown" },
  },
  {
    id: "seed-7",
    text: "Catcalled from a parked car. No one around to help. Ran to the convenience store.",
    tags: ["harassment_risk", "crowd_density"],
    expectedType: "valid",
    expectedTags: { lighting: "unknown", crowd: "sparse", harassment_risk: "reported" },
  },
];

async function runValidation() {
  let passed = 0;
  let total = 0;

  for (const testCase of testCases) {
    total++;
    const result = await moderateReport(testCase.text, testCase.tags);
    const typeMatch = result.type === testCase.expectedType;
    const tagsMatch =
      (result.structuredTags.lighting || "unknown") === (testCase.expectedTags.lighting || "unknown") &&
      (result.structuredTags.crowd || "unknown") === (testCase.expectedTags.crowd || "unknown") &&
      (result.structuredTags.harassment_risk || "unknown") === (testCase.expectedTags.harassment_risk || "unknown");

    const passedCase = typeMatch && tagsMatch;
    if (passedCase) passed++;

    console.log(`Test ${testCase.id}: ${passedCase ? "PASS" : "FAIL"}`);
    console.log(`  Expected: ${JSON.stringify(testCase.expectedTags)}`);
    console.log(`  Got:      ${JSON.stringify(result.structuredTags)}`);
    console.log(`  Type:     ${result.type} (expected ${testCase.expectedType})`);
    console.log();
  }

  const accuracy = ((passed / total) * 100).toFixed(1);
  console.log(`=================================`);
  console.log(`Accuracy: ${passed}/${total} (${accuracy}%)`);
}

runValidation().catch(console.error);
