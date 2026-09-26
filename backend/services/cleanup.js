import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { allJobs, deleteJob } from "./jobStore.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const UPLOAD_DIR = path.join(__dirname, "..", process.env.UPLOAD_DIR || "temp/uploads");
const PROCESSED_DIR = path.join(__dirname, "..", process.env.PROCESSED_DIR || "temp/processed");
const TTL_MS = (Number(process.env.FILE_TTL_MINUTES) || 60) * 60 * 1000;

function safeUnlink(filePath) {
  if (!filePath) return;
  fs.unlink(filePath, (err) => {
    if (err && err.code !== "ENOENT") {
      console.warn(`[cleanup] Could not remove ${path.basename(filePath)}: ${err.message}`);
    }
  });
}

/** Immediately removes both the source upload and the processed output for a job. */
export function purgeJobFiles(job) {
  if (!job) return;
  safeUnlink(job.inputPath);
  safeUnlink(job.outputPath);
}

/** Periodic sweep: deletes any job (and its files) older than the configured TTL. */
export function startCleanupJob() {
  const sweep = () => {
    const now = Date.now();
    for (const job of allJobs()) {
      if (now - job.createdAt > TTL_MS) {
        purgeJobFiles(job);
        deleteJob(job.id);
      }
    }
    // Belt-and-suspenders: also sweep orphaned files directly on disk in case
    // a job entry was lost (e.g. server restart) but a file was left behind.
    [UPLOAD_DIR, PROCESSED_DIR].forEach((dir) => {
      if (!fs.existsSync(dir)) return;
      for (const file of fs.readdirSync(dir)) {
        if (file === ".gitkeep") continue;
        const fullPath = path.join(dir, file);
        try {
          const stats = fs.statSync(fullPath);
          if (now - stats.mtimeMs > TTL_MS) safeUnlink(fullPath);
        } catch {
          /* ignore races */
        }
      }
    });
  };

  // Run every 10 minutes
  setInterval(sweep, 10 * 60 * 1000);
  console.log("[cleanup] Temporary file cleanup job started (runs every 10 min).");
}
