
import { GoogleGenAI, Type } from "@google/genai";
import { GeminiResponsePart } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function analyzeCardsInImage(base64Image: string): Promise<GeminiResponsePart[]> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        {
          parts: [
            {
              text: `You are an expert at identifying student Plickers-style cards. 
              Each card has a square shape with a unique integer ID and a small triangle marker (▲) on one of the four sides.
              The triangle marker determines the answer based on its orientation:
              - Pointing Up: Answer A
              - Pointing Right: Answer B
              - Pointing Down: Answer C
              - Pointing Left: Answer D

              Analyze this image of students holding cards. For every card detected, return the ID and the direction of the triangle marker.
              Return ONLY a valid JSON array of objects.`
            },
            {
              inlineData: {
                mimeType: 'image/jpeg',
                data: base64Image
              }
            }
          ]
        }
      ],
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.INTEGER, description: "The student ID found on the card" },
              direction: { 
                type: Type.STRING, 
                enum: ['Up', 'Right', 'Down', 'Left'],
                description: "Orientation of the triangle marker" 
              }
            },
            required: ['id', 'direction']
          }
        }
      }
    });

    const results = JSON.parse(response.text || "[]");
    return results;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
}
