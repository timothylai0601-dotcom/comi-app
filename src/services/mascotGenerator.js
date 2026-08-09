/* ============================================================
   MASCOT GENERATOR — API-ready service boundary
   ------------------------------------------------------------
   Frontend code should only ever call `generateMascotPack(...)`
   from this file. Today it delegates to the local mock generator
   (see mockMascotGenerator.js). When a real AI image-generation
   backend exists, flip USE_MOCK to false and implement
   `realGenerateMascotPack` below — that is the ONLY function that
   needs to change; every screen in the app calls this same
   `generateMascotPack` signature either way.
   ============================================================ */

import { mockGenerateMascotPack } from "./mockMascotGenerator";
import { BASE_MASCOT_PROMPT, MOOD_VARIANT_PROMPT } from "./mascotPrompts";

const USE_MOCK = true; // flip to false once a real backend/API is connected

/**
 * generateMascotPack({ petName, breed, sourcePhoto, styleReference, moodReferences, onProgress })
 * -> Promise<{ base, fun, sad, sleepy, thinking, worry }>
 *
 * sourcePhoto: data URL of the user's uploaded pet photo.
 * styleReference: identifier for the style anchor (defaults to Cody's mascot set).
 * moodReferences: optional list of mood slots to generate (defaults to all 5).
 * onProgress: optional (label: string) => void, called with friendly loading copy.
 */
export async function generateMascotPack({
  petName,
  breed,
  sourcePhoto,
  styleReference = "cody",
  moodReferences = ["fun", "sad", "sleepy", "thinking", "worry"],
  onProgress,
} = {}) {
  if (!sourcePhoto) {
    throw new Error("generateMascotPack: sourcePhoto is required");
  }

  if (USE_MOCK) {
    return mockGenerateMascotPack({ petName, breed, sourcePhoto, styleReference, moodReferences, onProgress });
  }

  return realGenerateMascotPack({ petName, breed, sourcePhoto, styleReference, moodReferences, onProgress });
}

/* ------------------------------------------------------------
   REAL AI GENERATION — not implemented in this prototype.
   ------------------------------------------------------------
   This is the ONLY place a real image-generation provider gets
   wired in. It must call a SERVER-SIDE endpoint (e.g. POST
   /api/mascot/generate) — never call an AI image API directly
   from the browser, and never put API keys in frontend code.

   Expected server contract:
     Request:  { petName, breed, sourcePhotoUrl, styleReferenceUrls,
                 basePrompt: BASE_MASCOT_PROMPT, moodPrompt: MOOD_VARIANT_PROMPT }
     Response: { base, fun, sad, sleepy, thinking, worry }  // asset URLs

   The server would be responsible for:
     1. Storing the uploaded photo in cloud storage, returning a URL.
     2. Calling the AI image-generation model with the identity photo
        + Cody style-reference assets + BASE_MASCOT_PROMPT.
     3. Generating each mood variant with MOOD_VARIANT_PROMPT layered
        on the approved base mascot.
     4. Storing generated assets in cloud storage and persisting rows
        in a `mascot_assets` table (see mascotPrompts.js / plan notes).
     5. Returning asset URLs (not raw image data) to the client.
   ------------------------------------------------------------ */
async function realGenerateMascotPack({ petName, breed, sourcePhoto, styleReference, moodReferences, onProgress }) {
  throw new Error(
    "realGenerateMascotPack is not implemented. Connect a server-side AI image-generation endpoint here, " +
    "then set USE_MOCK = false in mascotGenerator.js."
  );

  // Example of what this would look like once a backend exists:
  //
  // onProgress?.("Creating your Comi mascot...");
  // const res = await fetch("/api/mascot/generate", {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({
  //     petName, breed, sourcePhotoUrl: sourcePhoto, styleReferenceUrls: [styleReference],
  //     basePrompt: BASE_MASCOT_PROMPT, moodPrompt: MOOD_VARIANT_PROMPT, moodReferences,
  //   }),
  // });
  // if (!res.ok) throw new Error("Mascot generation failed");
  // return res.json(); // { base, fun, sad, sleepy, thinking, worry }
}
