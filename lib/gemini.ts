/**
 * Gemini Flash AI Client
 *
 * Initializes and exports the Google Gemini AI client.
 * Uses environment variables for configuration.
 *
 * Required env vars:
 *   GEMINI_API_KEY
 */

// TODO: Install @google/generative-ai and uncomment
// import { GoogleGenerativeAI } from "@google/generative-ai";

const geminiApiKey = process.env.GEMINI_API_KEY!;

// export const genAI = new GoogleGenerativeAI(geminiApiKey);

// Helper to get the Gemini Flash model
// export function getGeminiFlashModel() {
//   return genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
// }

export { geminiApiKey };
