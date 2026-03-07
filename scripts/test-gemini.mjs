import { GoogleGenerativeAI } from "@google/generative-ai";

const key = ((process.env.GEMINI_API_KEY || process.argv[2] || "")).trim();
if (!key) {
  console.error("Missing GEMINI_API_KEY");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(key);
const models = [
  "gemini-2.5-flash",
  "gemini-2.0-flash",
  "gemini-2.0-flash-001",
  "gemini-1.5-flash-latest",
  "gemini-1.5-pro-latest",
  "gemini-1.0-pro",
];

async function run() {
  for (const name of models) {
    try {
      const model = genAI.getGenerativeModel({ model: name });
      const result = await model.generateContent("Hello");
      console.log("Success with", name, "=>", result.response.text());
      process.exit(0);
    } catch (e) {
      console.error("Failed with", name, e.status || "", e.message || String(e));
    }
  }
  console.error("All models failed");
  process.exit(2);
}

run();
