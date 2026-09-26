import ffmpeg from "fluent-ffmpeg";
import ffprobeStatic from "ffprobe-static";
import ffmpegStatic from "ffmpeg-static";

// Prefer explicit env paths, then bundled static binaries, then system PATH.
if (process.env.FFMPEG_PATH) {
  ffmpeg.setFfmpegPath(process.env.FFMPEG_PATH);
} else if (ffmpegStatic) {
  ffmpeg.setFfmpegPath(ffmpegStatic);
}

if (process.env.FFPROBE_PATH) {
  ffmpeg.setFfprobePath(process.env.FFPROBE_PATH);
} else if (ffprobeStatic?.path) {
  ffmpeg.setFfprobePath(ffprobeStatic.path);
}

/**
 * Builds an FFmpeg filter chain for the requested enhancement mode.
 * This is REAL video processing (not a placeholder) — classical filters
 * for upscaling, sharpening and denoising, run entirely on the server.
 */
function buildFilters(mode, targetResolution) {
  const resolutionMap = {
    "720p": 1280,
    "1080p": 1920,
    "1440p": 2560,
    "4k": 3840,
  };
  const width = resolutionMap[targetResolution] || 1920;

  switch (mode) {
    case "upscale":
      return [`scale=${width}:-2:flags=lanczos`, "unsharp=5:5:0.8:5:5:0.4"];
    case "sharpen":
      return ["unsharp=5:5:1.2:5:5:0.6"];
    case "denoise":
      return ["hqdn3d=4:3:6:4.5", "unsharp=5:5:0.5:5:5:0.3"];
    case "restore":
    default:
      return [
        `scale=${width}:-2:flags=lanczos`,
        "hqdn3d=3:2:4:3",
        "unsharp=5:5:1.0:5:5:0.5",
        "eq=contrast=1.05:brightness=0.01:saturation=1.08",
      ];
  }
}

export function probeVideo(inputPath) {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(inputPath, (err, metadata) => {
      if (err) return reject(err);
      const stream = metadata.streams.find((s) => s.codec_type === "video");
      resolve({
        durationSeconds: Number(metadata.format?.duration) || 0,
        width: stream?.width,
        height: stream?.height,
        codec: stream?.codec_name,
      });
    });
  });
}

/**
 * Runs the enhancement job. Resolves with { outputPath } on success.
 * Calls onProgress(percent) as ffmpeg reports progress.
 */
export function enhanceVideo({ inputPath, outputPath, mode, targetResolution, onProgress }) {
  return new Promise((resolve, reject) => {
    const filters = buildFilters(mode, targetResolution);

    const command = ffmpeg(inputPath)
      .videoFilters(filters)
      .outputOptions([
        "-c:v libx264",
        "-preset medium",
        "-crf 18",
        "-c:a aac",
        "-b:a 192k",
        "-movflags +faststart",
      ])
      .on("progress", (progress) => {
        if (onProgress && typeof progress.percent === "number") {
          onProgress(Math.min(99, Math.max(1, Math.round(progress.percent))));
        }
      })
      .on("end", () => resolve({ outputPath }))
      .on("error", (err) => reject(err))
      .save(outputPath);

    return command;
  });
}
