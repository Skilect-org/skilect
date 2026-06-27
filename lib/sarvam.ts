/**
 * Sarvam AI Client
 *
 * Provides `sarvamFetch()` — a thin authenticated wrapper around the
 * Sarvam AI REST API for STT (Speech-to-Text) and TTS (Text-to-Speech).
 *
 * Usage:
 *   const res = await sarvamFetch("/speech-to-text", {
 *     method: "POST",
 *     body: formData,
 *   });
 *
 * Required env vars:
 *   SARVAM_API_KEY
 *   SARVAM_API_URL  (optional — defaults to https://api.sarvam.ai)
 */

const sarvamApiKey = process.env.SARVAM_API_KEY;
const sarvamApiUrl = process.env.SARVAM_API_URL || "https://api.sarvam.ai";

if (!sarvamApiKey) {
  console.warn("⚠️ [Sarvam] Missing SARVAM_API_KEY environment variable. API calls will fail.");
}

// ── Authenticated fetch helper ────────────────────────────────────────────────
export async function sarvamFetch(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  if (!sarvamApiKey) {
    throw new Error("[Sarvam] Missing SARVAM_API_KEY environment variable");
  }
  const url = `${sarvamApiUrl}${endpoint}`;

  // Merge auth headers — preserve any Content-Type the caller sets
  // (multipart/form-data for audio uploads must NOT have Content-Type set
  //  manually, so we only inject it when the caller doesn't include it)
  const headers = new Headers(options.headers);
  headers.set("API-Subscription-Key", sarvamApiKey!);

  // Only default Content-Type for non-FormData requests
  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  return fetch(url, { ...options, headers });
}

export { sarvamApiKey, sarvamApiUrl };
