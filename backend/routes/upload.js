import express from "express";
import { nanoid } from "nanoid";
import { upload } from "../middleware/upload.js";
import { createJob, toPublicJob } from "../services/jobStore.js";
import { probeVideo } from "../services/ffmpegService.js";

const router = express.Router();

router.post("/", upload.single("video"), async (req, res, next) => {
  try {
    if (!req.file) {
      const err = new Error("No file uploaded");
      err.status = 400;
      err.publicMessage = "Please select a video file to upload.";
      throw err;
    }

    const jobId = nanoid(12);

    let meta = {};
    try {
      meta = await probeVideo(req.file.path);
    } catch {
      // Non-fatal — metadata is a nice-to-have for the UI
      meta = {};
    }

    const job = createJob({
      id: jobId,
      status: "uploaded",
      originalName: req.file.originalname,
      inputPath: req.file.path, // server-only, never sent to client
      outputPath: null,
      sizeBytes: req.file.size,
      meta,
    });

    res.status(201).json({ job: toPublicJob(job), meta });
  } catch (err) {
    next(err);
  }
});

export default router;
