import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

import uploadRoutes from "./routes/upload.js";
import processRoutes from "./routes/process.js";
import statusRoutes from "./routes/status.js";
import { startCleanupJob } from "./services/cleanup.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// ---------------------------------------------------------------------------
// Ensure temp storage directories exist
// ---------------------------------------------------------------------------
const UPLOAD_DIR = path.join(__dirname, process.env.UPLOAD_DIR || "temp/uploads");
const PROCESSED_DIR = path.join(__dirname, process.env.PROCESSED_DIR || "temp/processed");
[UPLOAD_DIR, PROCESSED_DIR].forEach((dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// ---------------------------------------------------------------------------
// Frontend static files path (built frontend output)
// ---------------------------------------------------------------------------
const FRONTEND_BUILD_DIR = path.join(__dirname, "../frontend/dist");

// ---------------------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------------------
app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN || "http://localhost:5173",
  })
);
app.use(morgan("dev"));
app.use(express.json());

// Serve static frontend files
if (fs.existsSync(FRONTEND_BUILD_DIR)) {
  app.use(express.static(FRONTEND_BUILD_DIR));
}

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------
app.use("/api/upload", uploadRoutes);
app.use("/api/process", processRoutes);
app.use("/api/status", statusRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "VIDEOLUX AI backend", time: new Date().toISOString() });
});

// 404 handler for API
app.use("/api", (req, res) => {
  res.status(404).json({ error: "Not found" });
});

// SPA fallback: serve index.html for all non-API routes (React Router)
app.get("*", (req, res) => {
  const indexPath = path.join(FRONTEND_BUILD_DIR, "index.html");
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).json({ error: "Frontend not built. Run: cd frontend && npm run build" });
  }
});

// Central error handler — never leak server file paths to the client
app.use((err, req, res, next) => {
  console.error("[VIDEOLUX AI] Error:", err.message);
  const safeMessage =
    err.publicMessage || "Something went wrong while processing your request.";
  res.status(err.status || 500).json({ error: safeMessage });
});

app.listen(PORT, () => {
  console.log(`\n  VIDEOLUX AI backend running → http://localhost:${PORT}`);
  console.log(`  AI provider enabled: ${process.env.AI_PROVIDER_ENABLED === "true"}\n`);
  // Background job: remove stale temp files so nothing lingers on disk
  startCleanupJob();
});
