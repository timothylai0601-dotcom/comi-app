/* ============================================================
   MASCOT GENERATION — AI PROMPT DESIGN (future real generation)
   ------------------------------------------------------------
   This file is NOT executable AI code. It documents the intended
   prompt/config shape for when a real image-generation API is
   wired up server-side (see mascotGenerator.js for the call seam).
   Keep this in sync with product decisions about mascot style.
   ============================================================ */

/* Base "identity + style" prompt used to generate the neutral/base mascot.
   `sourcePhoto` and `styleReferenceImages` are expected to be image
   references (uploaded file / URL), passed to a real multimodal
   image-generation model — never inlined as text. */
export const BASE_MASCOT_PROMPT = {
  identityReference: "sourcePhoto",        // the user's uploaded pet photo
  styleReference: "codyMascotAssets",      // Cody/Comi mascot art as the style anchor
  instructions: [
    "Use the uploaded pet photo only as an identity reference (breed, fur colour, markings, ear shape, general proportions, distinguishing features).",
    "Use the existing Cody/Comi mascot artwork as the style reference.",
    "Generate a flat, cute, vector-style mascot illustration — not a photorealistic image.",
    "Match the existing Comi mascot family: soft rounded shapes, consistent line weight, simplified but recognizable eyes/proportions.",
    "Transparent or clean, plain background — no scene, no props, no random background elements.",
    "Preserve the pet's breed silhouette, fur colour, ear shape, and any distinctive markings from the source photo.",
    "Do not invent random accessories, clothing, or props unless present and central to the pet's look in the source photo.",
  ],
};

/* Mood-variant prompt — layered on top of the approved base mascot. */
export const MOOD_VARIANT_PROMPT = {
  instructions: [
    "Use the same generated pet identity/character established in the base mascot — do not redesign the character.",
    "Apply the mood pose/expression from the matching Cody mood-mascot reference (fun / sad / sleepy / thinking / worry) to this pet's identity.",
    "Keep proportions, line quality, and style fully consistent with the base mascot and the rest of the Cody mood set.",
    "Only the pose/expression changes between mood variants — breed, colour, and markings must stay identical across all variants.",
  ],
};

/* One prompt-note per mood slot — mirrors the existing MOOD_TO_SLOT
   buckets already used across the app (fun/sad/sleepy/thinking/worry). */
export function moodPromptFor(slot) {
  const notes = {
    fun:      "Playful, joyful pose — open mouth, bright eyes, tail/ears up, echoes Cody's 'fun' reference pose.",
    sad:      "Downcast, gentle sad expression — lowered ears/head, echoes Cody's 'sad' reference pose.",
    sleepy:   "Drowsy, relaxed pose — half-closed eyes, echoes Cody's 'sleepy' reference pose.",
    thinking: "Curious/thoughtful pose — tilted head, one raised brow/ear, echoes Cody's 'thinking' reference pose.",
    worry:    "Concerned, alert pose — wide eyes, flattened ears, echoes Cody's 'worry' reference pose.",
  };
  return notes[slot] || null;
}

/* ------------------------------------------------------------
   Real-generation call shape (for future reference — see the
   `realGenerateMascotPack` stub in mascotGenerator.js):

   POST /api/mascot/generate
   {
     petName, breed,
     sourcePhotoUrl,          // uploaded photo, stored server-side/cloud, never sent to the client bundle as a secret
     styleReferenceUrls: [...codyAssetUrls],
     basePrompt: BASE_MASCOT_PROMPT,
     moodPrompt: MOOD_VARIANT_PROMPT,
   }
   -> { base, fun, sad, sleepy, thinking, worry } (asset URLs)

   API keys for the real image-generation provider must live ONLY in
   server-side environment config — never in this frontend bundle.
   ------------------------------------------------------------ */
