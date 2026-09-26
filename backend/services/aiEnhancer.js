/**
 * AI ENHANCEMENT ADAPTER
 * ---------------------------------------------------------------------------
 * This file is the single integration point for a real AI video-enhancement
 * model/API (e.g. a super-resolution model, a hosted upscaling API, a GPU
 * inference microservice, etc.).
 *
 * VIDEOLUX AI never fakes an AI result. Until a real provider is wired up
 * here, `isAIAvailable()` returns false and the app is transparent with
 * users that their video was processed with classical FFmpeg filters
 * (real, functioning enhancement — just not a neural model) rather than
 * pretending an AI model ran.
 *
 * TO CONNECT A REAL PROVIDER:
 *   1. Set AI_PROVIDER_ENABLED=true and the relevant credentials in .env
 *   2. Implement the request/response handling in runAIEnhancement() below
 *   3. Return { outputPath } (or stream/write to outputPath) on success
 *   4. Throw an Error on failure — the caller will surface a clear error
 *      state to the user rather than silently falling back and pretending.
 * ---------------------------------------------------------------------------
 */

export function isAIAvailable() {
  return (
    process.env.AI_PROVIDER_ENABLED === "true" &&
    Boolean(process.env.AI_PROVIDER_API_URL) &&
    Boolean(process.env.AI_PROVIDER_API_KEY)
  );
}

/**
 * @param {string} inputPath - absolute path to the uploaded source video
 * @param {string} outputPath - absolute path the enhanced video must be written to
 * @param {object} options - { mode: 'upscale'|'sharpen'|'denoise'|'restore', targetResolution }
 * @param {(percent: number) => void} onProgress
 */
export async function runAIEnhancement(inputPath, outputPath, options, onProgress) {
  if (!isAIAvailable()) {
    const err = new Error("AI provider not configured");
    err.code = "AI_UNAVAILABLE";
    throw err;
  }

  // -------------------------------------------------------------------------
  // Example shape for a hosted inference API. Replace with the real provider's
  // request/response contract. This is intentionally left unimplemented so
  // the app never claims to run an AI model that isn't actually connected.
  // -------------------------------------------------------------------------
  //
  // const form = new FormData();
  // form.append("video", fs.createReadStream(inputPath));
  // form.append("mode", options.mode);
  // form.append("target_resolution", options.targetResolution || "1080p");
  //
  // const response = await fetch(process.env.AI_PROVIDER_API_URL, {
  //   method: "POST",
  //   headers: { Authorization: `Bearer ${process.env.AI_PROVIDER_API_KEY}` },
  //   body: form,
  // });
  //
  // if (!response.ok) throw new Error("AI provider request failed");
  // const buffer = Buffer.from(await response.arrayBuffer());
  // fs.writeFileSync(outputPath, buffer);
  // onProgress(100);
  // return { outputPath };

  throw new Error(
    "runAIEnhancement() is not implemented yet. Wire up your AI provider in services/aiEnhancer.js."
  );
}
