import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UploadCloud,
  FileVideo,
  Sparkles,
  Wand2,
  ScanLine,
  Layers,
  Zap,
  Loader2,
  CheckCircle2,
  XCircle,
  Download,
  RotateCcw,
  Info,
} from "lucide-react";
import Button from "../components/Button";
import GlassCard from "../components/GlassCard";
import { useEnhanceFlow } from "../hooks/useEnhanceFlow";

const MODES = [
  { id: "restore", label: "Full Restore", icon: Sparkles, desc: "Upscale + denoise + sharpen combined" },
  { id: "upscale", label: "Upscale", icon: ScanLine, desc: "Increase resolution with detail-preserving scaling" },
  { id: "sharpen", label: "Sharpen", icon: Zap, desc: "Boost clarity and crispness" },
  { id: "denoise", label: "Denoise", icon: Layers, desc: "Remove grain and compression artifacts" },
];

const RESOLUTIONS = ["720p", "1080p", "1440p", "4k"];

const ACCEPTED_TYPES = [".mp4", ".mov", ".avi", ".mkv", ".webm"];

export default function Enhance() {
  const flow = useEnhanceFlow();
  const { STAGES, stage } = flow;
  const [mode, setMode] = useState("restore");
  const [resolution, setResolution] = useState("1080p");
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);

  const onDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) flow.handleFile(file);
  };

  const onSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) flow.handleFile(file);
  };

  return (
    <section className="max-w-4xl mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold">
          Enhance a <span className="text-gradient">Video</span>
        </h1>
        <p className="mt-3 text-text-secondary">
          Upload your footage and let VIDEOLUX AI process it on our servers.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {/* --------------------------- IDLE / UPLOAD --------------------------- */}
        {(stage === STAGES.IDLE || stage === STAGES.UPLOADING) && (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={onDrop}
              onClick={() => stage === STAGES.IDLE && inputRef.current?.click()}
              className={`rounded-2xl border-2 border-dashed p-16 text-center cursor-pointer transition-colors ${
                dragActive
                  ? "border-brand-cyan bg-brand-cyan/5"
                  : "border-white/10 hover:border-brand-purple/40"
              }`}
            >
              <input
                ref={inputRef}
                type="file"
                accept="video/*"
                className="hidden"
                onChange={onSelect}
              />

              {stage === STAGES.IDLE ? (
                <>
                  <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-purple-cyan flex items-center justify-center shadow-glow mb-6">
                    <UploadCloud size={28} className="text-white" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">
                    Drag & drop your video here
                  </h3>
                  <p className="text-sm text-text-secondary mb-6">
                    or click to browse — {ACCEPTED_TYPES.join(", ")} supported
                  </p>
                  <Button as="span">Choose Video</Button>
                </>
              ) : (
                <>
                  <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-purple-cyan flex items-center justify-center shadow-glow mb-6">
                    <FileVideo size={28} className="text-white" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Uploading {flow.fileName}</h3>
                  <div className="max-w-sm mx-auto h-2 rounded-full bg-white/10 overflow-hidden mt-4">
                    <div
                      className="h-full bg-gradient-purple-cyan transition-all duration-200"
                      style={{ width: `${flow.uploadProgress}%` }}
                    />
                  </div>
                  <p className="text-xs text-text-secondary mt-3">{flow.uploadProgress}%</p>
                </>
              )}
            </div>
          </motion.div>
        )}

        {/* --------------------------- CONFIGURE --------------------------- */}
        {stage === STAGES.CONFIGURING && (
          <motion.div
            key="configure"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <GlassCard>
              <div className="flex items-center gap-3 mb-6">
                <FileVideo className="text-brand-cyan" size={22} />
                <div>
                  <p className="font-medium">{flow.fileName}</p>
                  {flow.meta?.durationSeconds ? (
                    <p className="text-xs text-text-secondary">
                      {Math.round(flow.meta.durationSeconds)}s
                      {flow.meta.width ? ` · ${flow.meta.width}×${flow.meta.height}` : ""}
                    </p>
                  ) : null}
                </div>
              </div>

              <h4 className="text-sm font-semibold text-text-secondary mb-3">
                ENHANCEMENT MODE
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                {MODES.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setMode(m.id)}
                    className={`rounded-xl p-4 text-left transition-all border ${
                      mode === m.id
                        ? "border-brand-cyan bg-brand-cyan/5"
                        : "border-white/10 hover:border-white/20"
                    }`}
                  >
                    <m.icon
                      size={18}
                      className={mode === m.id ? "text-brand-cyan" : "text-text-secondary"}
                    />
                    <p className="text-sm font-medium mt-2">{m.label}</p>
                    <p className="text-xs text-text-secondary mt-1">{m.desc}</p>
                  </button>
                ))}
              </div>

              <h4 className="text-sm font-semibold text-text-secondary mb-3">
                TARGET RESOLUTION
              </h4>
              <div className="flex flex-wrap gap-3 mb-8">
                {RESOLUTIONS.map((r) => (
                  <button
                    key={r}
                    onClick={() => setResolution(r)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                      resolution === r
                        ? "border-brand-purple bg-brand-purple/10 text-text-primary"
                        : "border-white/10 text-text-secondary hover:border-white/20"
                    }`}
                  >
                    {r.toUpperCase()}
                  </button>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  icon={Wand2}
                  className="flex-1"
                  onClick={() => flow.enhance({ mode, targetResolution: resolution })}
                >
                  Enhance Video
                </Button>
                <Button variant="secondary" onClick={flow.reset}>
                  Cancel
                </Button>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* --------------------------- PROCESSING --------------------------- */}
        {stage === STAGES.PROCESSING && (
          <motion.div
            key="processing"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <GlassCard className="text-center py-16">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                className="mx-auto w-16 h-16 rounded-2xl bg-gradient-purple-cyan flex items-center justify-center shadow-glow mb-6"
              >
                <Loader2 size={28} className="text-white" />
              </motion.div>
              <h3 className="font-semibold text-lg mb-2">Enhancing your video…</h3>
              <p className="text-sm text-text-secondary mb-6 max-w-sm mx-auto">
                {flow.job?.engine === "ai"
                  ? "Processing with a connected AI enhancement model."
                  : "Processing with our real-time FFmpeg enhancement engine."}
              </p>

              <div className="max-w-sm mx-auto h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full bg-gradient-purple-cyan transition-all duration-300"
                  style={{ width: `${flow.processProgress}%` }}
                />
              </div>
              <p className="text-xs text-text-secondary mt-3">{flow.processProgress}%</p>

              {flow.job?.engine === "ffmpeg" && (
                <div className="flex items-start gap-2 max-w-sm mx-auto mt-6 text-left text-xs text-text-secondary glass rounded-lg p-3">
                  <Info size={14} className="mt-0.5 shrink-0 text-brand-cyan" />
                  <span>
                    No neural AI model is connected in this environment, so VIDEOLUX AI is
                    running real classical video processing (upscaling/sharpening/denoising)
                    rather than simulating an AI result.
                  </span>
                </div>
              )}
            </GlassCard>
          </motion.div>
        )}

        {/* --------------------------- COMPLETED --------------------------- */}
        {stage === STAGES.COMPLETED && (
          <motion.div
            key="completed"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <GlassCard className="text-center py-16">
              <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-purple-cyan flex items-center justify-center shadow-glow mb-6">
                <CheckCircle2 size={28} className="text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Your video is ready!</h3>
              <p className="text-sm text-text-secondary mb-8">
                Enhanced with{" "}
                {flow.job?.engine === "ai" ? "our connected AI model" : "our FFmpeg processing engine"}.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button as="a" href={flow.downloadUrl} icon={Download}>
                  Download Enhanced Video
                </Button>
                <Button variant="secondary" icon={RotateCcw} onClick={flow.reset}>
                  Enhance Another
                </Button>
              </div>
              <p className="text-xs text-text-secondary mt-6">
                This file is removed from our servers after download or automatically within an hour.
              </p>
            </GlassCard>
          </motion.div>
        )}

        {/* --------------------------- FAILED --------------------------- */}
        {stage === STAGES.FAILED && (
          <motion.div
            key="failed"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <GlassCard className="text-center py-16">
              <div className="mx-auto w-16 h-16 rounded-2xl bg-red-500/20 flex items-center justify-center mb-6">
                <XCircle size={28} className="text-red-400" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Something went wrong</h3>
              <p className="text-sm text-text-secondary mb-8 max-w-sm mx-auto">
                {flow.error || "We couldn't process this video. Please try again."}
              </p>
              <Button variant="secondary" icon={RotateCcw} onClick={flow.reset}>
                Try Again
              </Button>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
