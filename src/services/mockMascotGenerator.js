/* ============================================================
   MOCK MASCOT GENERATOR — prototype/demo mode
   ------------------------------------------------------------
   No real AI image generation runs here. This produces a real,
   pet-specific mascot pack (derived from the uploaded photo) using
   plain <canvas> compositing, so the demo has 6 genuinely distinct
   images per pet instead of static placeholders — while being
   honest that it is NOT true generative-AI restyling.
   See mascotGenerator.js for where a real AI provider would plug in.
   ============================================================ */

/* Matches Comi's mood-color families (warm yellow/fun, muted blue-grey/sad,
   muted blue/sleepy, soft teal/thinking, warm amber/worry) so the generated
   ring reads as part of the same app, even though the art itself is a mock. */
const MOOD_RING_COLORS = {
  base:     "#5A8EC8",
  fun:      "#FFCE54",
  sad:      "#9FB1BF",
  sleepy:   "#8FB3DE",
  thinking: "#5FBFB0",
  worry:    "#F0A94E",
};

const OUTPUT_SIZE = 320;

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Could not load image"));
    img.src = src;
  });
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function rand(min, max) {
  return min + Math.random() * (max - min);
}

function drawFramedPortrait(sourceImg, ringColor) {
  const size = OUTPUT_SIZE;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#EAF4FB";
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
  ctx.fill();

  const side = Math.min(sourceImg.width, sourceImg.height);
  const sx = (sourceImg.width - side) / 2;
  const sy = (sourceImg.height - side) / 2;
  const inset = 10;

  ctx.save();
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2 - inset, 0, Math.PI * 2);
  ctx.clip();
  ctx.filter = "saturate(1.15) contrast(1.05) brightness(1.03)";
  ctx.drawImage(sourceImg, sx, sy, side, side, inset, inset, size - inset * 2, size - inset * 2);
  ctx.restore();

  ctx.lineWidth = 10;
  ctx.strokeStyle = ringColor;
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2 - 5, 0, Math.PI * 2);
  ctx.stroke();

  return canvas;
}

/**
 * Simulates generating a Comi-style mascot pack from an uploaded photo.
 * Resolves { base, fun, sad, sleepy, thinking, worry } as transparent-background PNG data URLs.
 * `onProgress(label)` is called with friendly loading copy as steps complete.
 */
export async function mockGenerateMascotPack({ sourcePhoto, onProgress }) {
  if (!sourcePhoto) throw new Error("mockGenerateMascotPack: sourcePhoto is required");

  onProgress?.("Creating your Comi mascot...");
  await delay(rand(650, 950));

  const sourceImg = await loadImage(sourcePhoto);

  onProgress?.("Matching your pet's look to Comi's style...");
  await delay(rand(650, 950));
  const baseCanvas = drawFramedPortrait(sourceImg, MOOD_RING_COLORS.base);
  const base = baseCanvas.toDataURL("image/png");

  onProgress?.("Building mood expressions...");
  const slots = ["fun", "sad", "sleepy", "thinking", "worry"];
  await delay(rand(650, 950));

  const pack = { base };
  slots.forEach((slot) => {
    const canvas = drawFramedPortrait(sourceImg, MOOD_RING_COLORS[slot]);
    pack[slot] = canvas.toDataURL("image/png");
  });

  return pack;
}
