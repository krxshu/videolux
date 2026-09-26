import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { getJob, updateJob, toPublicJob } from "../services/jobStore.js";
import { enhanceVideo } from "../services/ffmpegService.js";
import { isAIAvailable, runAIEnhancement } from "../services/aiEnhancer.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROCESSED_DIR = path.join(__dirname, "..", process.env.PROCESSED_DIR || "temp/processed");

const router = express.Router();

const VALID_MODES = ["upscale", "sharpen", "denoise", "restore"];
const VALID_RESOLUTIONS = ["720p", "1080p", "1440p", "4k"];

router.post("/:jobId", async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const { mode = "restore", targetResolution = "1080p" } = req.body || {};

    const job = getJob(jobId);
    if (!job) {
      const err = new Error("Job not found");
      err.status = 404;
      err.publicMessage = "We couldn't find that video. Please upload it again.";
      throw err;
    }
    if (job.status === "processing" || job.status === "queued") {
      return res.status(409).json({ error: "This video is already being processed." });
    }
    if (!VALID_MODES.includes(mode) || !VALID_RESOLUTIONS.includes(targetResolution)) {
      const err = new Error("Invalid enhancement options");
      err.status = 400;
      err.publicMessage = "Invalid enhancement mode or target resolution.";
      throw err;
    }

    const outputPath = path.join(PROCESSED_DIR, `${jobId}-enhanced.mp4`);

    updateJob(jobId, {
      status: "queued",
      progress: 0,
      mode,
      targetResolution,
      outputPath,
      error: null,
    });

    // Respond immediately — the client polls /api/status/:jobId for progress.
    res.status(202).json({ job: toPublicJob(getJob(jobId)) });

    // ---- Kick off processing asynchronously (fire-and-forget) -------------
    processJobAsync(jobId, { mode, targetResolution, outputPath }).catch((err) => {
      console.error(`[process] Job ${jobId} failed:`, err.message);
    });
  } catch (err) {
    next(err);
  }
});

async function processJobAsync(jobId, { mode, targetResolution, outputPath }) {
  const job = getJob(jobId);
  if (!job) return;

  updateJob(jobId, { status: "processing", progress: 1 });

  const onProgress = (percent) => updateJob(jobId, { progress: percent });

  // Prefer a connected AI provider if one is configured. Never fake it —
  // if AI is unavailable we run the real FFmpeg enhancement pipeline and
  // are explicit with the client about which engine actually ran.
  if (isAIAvailable()) {
    try {
      updateJob(jobId, { engine: "ai" });
      await runAIEnhancement(job.inputPath, outputPath, { mode, targetResolution }, onProgress);
      return finishJob(jobId, outputPath);
    } catch (err) {
      console.warn(
        `[process] AI enhancement failed for job ${jobId} (${err.message}). Falling back to FFmpeg.`
      );
      // Fall through to classical processing below, but the status update
      // will make clear to the user which engine actually produced the result.
    }
  }

  try {
    updateJob(jobId, { engine: "ffmpeg" });
    await enhanceVideo({
      inputPath: job.inputPath,
      outputPath,
      mode,
      targetResolution,
      onProgress,
    });
    finishJob(jobId, outputPath);
  } catch (err) {
    updateJob(jobId, {
      status: "failed",
      error: "Video processing failed. Please try a different file.",
    });
  }
}

function finishJob(jobId, outputPath) {
  if (!fs.existsSync(outputPath)) {
    updateJob(jobId, { status: "failed", error: "Processing did not produce an output file." });
    return;
  }
  updateJob(jobId, { status: "completed", progress: 100 });
}

export default router;
