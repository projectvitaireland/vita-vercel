import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const { entry } = req.body;
  if (!entry || typeof entry !== "string") {
    return res.status(400).json({ error: "Missing or invalid entry" });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(`Summarize this health journal entry:\n\n${entry}`);
    const response = await result.response;
    const text = response.text?.() ?? "";
    res.status(200).json({ result: text.trim() });
  } catch (error) {
    console.error("Gemini error:", error);
    res.status(500).json({ error: "Gemini call failed" });
  }
}