/**
 * Sarvam AI Client
 *
 * Initializes and exports the Sarvam AI client for Indian language processing.
 * Uses environment variables for configuration.
 *
 * Required env vars:
 *   SARVAM_API_KEY
 *   SARVAM_API_URL (optional, defaults to production endpoint)
 */

const sarvamApiKey = process.env.SARVAM_API_KEY!;
const sarvamApiUrl =
  process.env.SARVAM_API_URL || "https://api.sarvam.ai";

// Helper to make authenticated requests to Sarvam AI
// export async function sarvamFetch(endpoint: string, options?: RequestInit) {
//   const url = `${sarvamApiUrl}${endpoint}`;
//   return fetch(url, {
//     ...options,
//     headers: {
//       "Content-Type": "application/json",
//       "API-Subscription-Key": sarvamApiKey,
//       ...options?.headers,
//     },
//   });
// }

export { sarvamApiKey, sarvamApiUrl };
