
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateCopySuggestion = async (baseName: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Gere uma copy curta e persuasiva para WhatsApp para o produto: "${baseName}". 
      Use obrigatoriamente a tag [NOME] onde o nome do cliente deve entrar. 
      A copy deve ser amigável e direta. Máximo 3 frases.`,
      config: {
        temperature: 0.7,
        topP: 0.9,
      }
    });

    return response.text?.trim() || "Olá [NOME], tudo bem? Notei seu interesse e gostaria de falar mais sobre nossa novidade!";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Olá [NOME], vi que você tem interesse em saber mais sobre o nosso projeto. Podemos conversar?";
  }
};
