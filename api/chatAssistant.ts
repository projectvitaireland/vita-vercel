import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const { moodEntry } = req.body;
  if (!moodEntry || typeof moodEntry !== "string") {
    return res.status(400).json({ error: "Missing or invalid moodEntry" });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(
      `User says: "${moodEntry}". Reflect back insights and offer a grounding exercise.`
    );
    const response = await result.response;
    const text = response.text?.() ?? "";
    res.status(200).json({ result: text.trim() });
  } catch (error) {
    console.error("Gemini error:", error);
    res.status(500).json({ error: "Gemini call failed" });
  }
}