
import { GoogleGenAI } from "@google/genai";
import { AI_PROMPTS } from "../constants";

export const generateLuxuryGreeting = async (name: string, theme: string): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a luxury Christmas greeting for ${name}. The theme is ${theme}.`,
      config: {
        systemInstruction: AI_PROMPTS.SYSTEM,
        temperature: 0.9,
      },
    });

    return response.text || "May your season be draped in the finest gold and deepest emerald hues. Merry Christmas from Arix.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "A season of timeless elegance and golden moments awaits you. Happy Holidays.";
  }
};
