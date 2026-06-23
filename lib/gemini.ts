import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Existing model
export const getGeminiFlashModel = () => 
  genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// Add this new export
export const getGemini15Model = () => 
  genAI.getGenerativeModel({ model: "gemini-1.5-flash" });