import express from "express";
import fs from "fs";
import { getJob, toPublicJob, deleteJob } from "../services/jobStore.js";
import { purgeJobFiles } from "../services/cleanup.js";

const router = express.Router();

// GET /api/status/:jobId — poll job progress
router.get("/:jobId", (req, res) => {
  const job = getJob(req.params.jobId);
  if (!job) return res.status(404).json({ error: "Job not found." });
  res.json({ job: toPublicJob(job) });
});

// GET /api/status/:jobId/download — stream the finished file, then clean up
router.get("/:jobId/download", (req, res) => {
  const job = getJob(req.params.jobId);
  if (!job) return res.status(404).json({ error: "Job not found." });
  if (job.status !== "completed" || !job.outputPath || !fs.existsSync(job.outputPath)) {
    return res.status(409).json({ error: "This video isn't ready for download yet." });
  }

  const downloadName = `videolux-ai-enhanced-${job.originalName || "video.mp4"}`;

  res.download(job.outputPath, downloadName, (err) => {
    if (err) {
      console.error("[download] Error streaming file:", err.message);
      return;
    }
    // Once the file has been delivered, remove server-side copies immediately
    // rather than waiting for the periodic cleanup sweep.
    purgeJobFiles(job);
    deleteJob(job.id);
  });
});

export default router;
