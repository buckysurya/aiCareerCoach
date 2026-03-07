"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI((process.env.GEMINI_API_KEY || "").trim());
const primaryModel = "gemini-2.5-flash";
const fallbackModels = [
  "gemini-2.0-flash",
  "gemini-2.0-flash-001",
  "gemini-1.5-flash-latest",
  "gemini-1.5-pro-latest",
  "gemini-1.0-pro",
];
async function generateWithFallback(prompt) {
  const names = [primaryModel, ...fallbackModels];
  for (const name of names) {
    try {
      const m = genAI.getGenerativeModel({ model: name });
      return await m.generateContent(prompt);
    } catch (e) {
      const msg = String(e && e.message ? e.message : "");
      const code = e && e.status ? e.status : 0;
      if (!(code === 404 || msg.includes("not found") || msg.includes("not supported"))) {
        throw e;
      }
    }
  }
  throw new Error("No compatible Gemini model available");
}

export const generateAIInsights = async (industry) => {
  const prompt = `
          Analyze the current state of the ${industry} industry and provide insights in ONLY the following JSON format without any additional notes or explanations:
          {
            "salaryRanges": [
              { "role": "string", "min": number, "max": number, "median": number, "location": "string" }
            ],
            "growthRate": number,
            "demandLevel": "High" | "Medium" | "Low",
            "topSkills": ["skill1", "skill2"],
            "marketOutlook": "Positive" | "Neutral" | "Negative",
            "keyTrends": ["trend1", "trend2"],
            "recommendedSkills": ["skill1", "skill2"]
          }
          
          IMPORTANT: Return ONLY the JSON. No additional text, notes, or markdown formatting.
          Include at least 5 common roles for salary ranges.
          Growth rate should be a percentage.
          Include at least 5 skills and trends.
        `;

  const result = await generateWithFallback(prompt);
  const response = result.response;
  const text = response.text();
  const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();

  return JSON.parse(cleanedText);
};

export async function getIndustryInsights() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    include: {
      industryInsight: true,
    },
  });

  if (!user) throw new Error("User not found");

  const now = new Date();
  const needsRefresh =
    !user.industryInsight || (user.industryInsight.nextUpdate && user.industryInsight.nextUpdate <= now);

  if (needsRefresh) {
    const insights = await generateAIInsights(user.industry);

    const industryInsight = await db.industryInsight.upsert({
      where: { industry: user.industry },
      update: {
        ...insights,
        lastUpdated: now,
        nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
      create: {
        industry: user.industry,
        ...insights,
        lastUpdated: now,
        nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return industryInsight;
  }

  return user.industryInsight;
}
