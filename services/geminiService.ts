
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const solveWithAI = async (prompt: string): Promise<{ result: string; explanation: string }> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Solve this mathematical problem and provide a clear, concise result followed by a short explanation. Problem: ${prompt}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            result: { type: Type.STRING, description: "The final numerical result or answer." },
            explanation: { type: Type.STRING, description: "A brief step-by-step explanation." }
          },
          required: ["result", "explanation"]
        }
      }
    });

    const jsonStr = response.text.trim();
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("AI Solve Error:", error);
    return {
      result: "Erro",
      explanation: "Não foi possível processar sua solicitação com a IA no momento."
    };
  }
};
