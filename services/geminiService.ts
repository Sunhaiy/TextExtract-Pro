import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY || '';

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: API_KEY });

/**
 * Converts a File object to a Base64 string.
 */
export const fileToGenerativePart = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64Data = base64String.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Performs OCR on an image using Gemini 2.5 Flash.
 */
export const performOCR = async (file: File): Promise<string> => {
  try {
    const base64Data = await fileToGenerativePart(file);

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: file.type,
            },
          },
          {
            text: "Please extract all visible text from this image. Preserve the original formatting where possible. If there is no text, return 'No text detected'. Do not provide markdown code blocks or explanation, just the raw text.",
          },
        ],
      },
    });

    return response.text || "No text extracted.";
  } catch (error) {
    console.error("OCR Error:", error);
    throw new Error("Failed to process image. Please try again.");
  }
};