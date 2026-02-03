
import { GoogleGenAI, Type } from "@google/genai";
import { AIAnalysisResult } from "../types";

export const analyzeURL = async (text: string): Promise<AIAnalysisResult> => {
  const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || '' });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-exp',
      contents: `Analyser denne teksten/URL-en og foreslå QR-kodestyling: "${text}". 
      Gi svaret på norsk.
      Gi en kort etikett (f.eks. "Offisiell Nettside", "Sosiale Medier", "Kontaktinfo"), 
      en hex-primærfarge som passer til merkevaren eller innholdet, 
      en sekundærfarge/bakgrunnsfarge som kontrasterer godt (vanligvis #FFFFFF eller #F8FAFC),
      og en kort beskrivelse av hva brukeren vil finne.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            label: { type: Type.STRING, description: 'Kort fengende etikett for QR-koden' },
            primaryColor: { type: Type.STRING, description: 'Hex-fargekode for merkevaren' },
            secondaryColor: { type: Type.STRING, description: 'Hex-fargekode for bakgrunnen' },
            description: { type: Type.STRING, description: 'Kort oppsummering av innholdet' },
          },
          required: ["label", "primaryColor", "secondaryColor", "description"]
        }
      }
    });

    const jsonStr = response.text ? response.text.trim() : "";
    if (!jsonStr) throw new Error("Tom respons fra AI");

    return JSON.parse(jsonStr) as AIAnalysisResult;
  } catch (error) {
    console.error("Kunne ikke tolke AI-svar:", error);
    return {
      label: "Egendefinert kobling",
      primaryColor: "#1C2C5B",
      secondaryColor: "#FFFFFF",
      description: "Rask tilgang til den oppgitte informasjonen."
    };
  }
};
