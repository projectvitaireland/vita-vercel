import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const { imageBase64 } = req.body;
  if (!imageBase64 || typeof imageBase64 !== "string") {
    return res.status(400).json({ error: "Missing or invalid imageBase64" });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
    const result = await model.generateContent([
      { text: "Describe the food in this image and estimate calories for a typical portion." },
      { inlineData: { mimeType: "image/jpeg", data: imageBase64 } }
    ]);
    const response = await result.response;
    const text = response.text?.() ?? "";
    res.status(200).json({ result: text.trim() });
  } catch (error) {
    console.error("Gemini vision error:", error);
    res.status(500).json({ error: "Gemini vision call failed" });
  }
}