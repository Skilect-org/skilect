/**
 * Gemini Flash AI Client
 *
 * Exports a helper to get the Gemini 2.0 Flash model instance.
 * Always call `getGeminiFlashModel()` per request — the underlying
 * GoogleGenerativeAI instance is a singleton.
 *
 * Required env vars:
 *   GEMINI_API_KEY
 */

import { GoogleGenerativeAI } from "@google/generative-ai";

const geminiApiKey = process.env.GEMINI_API_KEY;

if (!geminiApiKey) {
  throw new Error("[Gemini] Missing GEMINI_API_KEY environment variable");
}

// Singleton instance — one per server process
const genAI = new GoogleGenerativeAI(geminiApiKey);

// ── Model helper ─────────────────────────────────────────────────────────────
// Returns the Gemini 2.0 Flash model ready for generateContent() calls.
export function getGeminiFlashModel() {
  return genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
}

export { geminiApiKey };
