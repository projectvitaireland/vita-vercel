import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

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
      { inlineData: { mimeType: "image/jpeg", data: imageBase64 } },
      "Describe the food in this image. Identify ingredients, estimate nutrition, and suggest healthier alternatives if needed."
    ]);
    const response = await result.response;
    const text = response.text?.() ?? "";
    res.status(200).json({ result: text.trim() });
  } catch (error) {
    console.error("Gemini error:", error);
    res.status(500).json({ error: "Gemini call failed" });
  }
}