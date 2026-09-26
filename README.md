# VIDEOLUX AI

**Enhance Your Videos With AI** — Upscale, sharpen, restore and transform your
videos into stunning high-quality footage.

A full-stack video enhancement app: a React/Vite/Tailwind/Framer Motion
frontend and a Node/Express backend that performs **real** video processing
with FFmpeg, built with a clean seam for plugging in a real AI upscaling
model/API later.

```
videolux-ai/
├── backend/     Express API + FFmpeg processing engine
└── frontend/    React + Vite + Tailwind + Framer Motion UI
```

---

## 1. Prerequisites

- Node.js 18+
- npm
- FFmpeg does **not** need to be installed system-wide — the backend bundles
  static FFmpeg/FFprobe binaries via `ffmpeg-static` / `ffprobe-static`. If you
  prefer a system install, set `FFMPEG_PATH` / `FFPROBE_PATH` in `.env`.

## 2. Backend setup

```bash
cd backend
cp .env.example .env
npm install
npm run dev        # nodemon, http://localhost:5000
# or: npm start
```

Health check: `GET http://localhost:5000/api/health`

### Backend API

| Method | Endpoint                       | Description                                   |
|--------|---------------------------------|------------------------------------------------|
| POST   | `/api/upload`                  | Multipart upload (`video` field). Returns a `jobId` + metadata. |
| POST   | `/api/process/:jobId`          | Body: `{ mode, targetResolution }`. Starts async processing. |
| GET    | `/api/status/:jobId`           | Poll processing status/progress.               |
| GET    | `/api/status/:jobId/download`  | Streams the finished file, then deletes it server-side. |

Enhancement modes: `upscale`, `sharpen`, `denoise`, `restore`.
Target resolutions: `720p`, `1080p`, `1440p`, `4k`.

## 3. Frontend setup

```bash
cd frontend
npm install
npm run dev         # http://localhost:5173
```

The Vite dev server proxies `/api/*` to `http://localhost:5000` (see
`vite.config.js`). For a production build, set `VITE_API_URL` to your
deployed backend URL and run `npm run build`.

---

## 4. How enhancement actually works (no fake results)

VIDEOLUX AI is built so it **never fabricates an AI enhancement result**:

- `backend/services/aiEnhancer.js` is a pluggable adapter for a real AI
  upscaling model or hosted API. Until you configure `AI_PROVIDER_*` in
  `.env` and implement `runAIEnhancement()`, `isAIAvailable()` returns
  `false`.
- When no AI provider is connected, the backend runs a **real** FFmpeg
  pipeline (`backend/services/ffmpegService.js`) — Lanczos upscaling,
  `unsharp`, `hqdn3d` denoising and a light color pass — genuine processing,
  not a simulated/demo file.
- The frontend is transparent about which engine ran: the processing and
  result screens tell the user whether their video was enhanced with a
  connected AI model or with the classical FFmpeg engine. Nothing is ever
  labeled "AI-enhanced" unless an AI model actually ran.

### Connecting a real AI model later

1. Implement your provider's request/response handling inside
   `runAIEnhancement()` in `backend/services/aiEnhancer.js`.
2. Set in `backend/.env`:
   ```
   AI_PROVIDER_ENABLED=true
   AI_PROVIDER_API_URL=...
   AI_PROVIDER_API_KEY=...
   ```
3. Restart the backend. `/api/process/:jobId` will automatically prefer the
   AI path and fall back to FFmpeg only if the AI call throws.

---

## 5. Storage & privacy

- Uploaded files are written to `backend/temp/uploads/` with a randomly
  generated filename (`nanoid`) — the browser and API responses never see a
  real server file path.
- Processed output is written to `backend/temp/processed/`.
- A background sweep (`services/cleanup.js`) deletes both the source and
  processed files for any job older than `FILE_TTL_MINUTES` (default 60),
  and files are also deleted immediately once a user downloads their result.
- Job metadata lives in memory (`services/jobStore.js`). For a
  multi-instance production deployment, swap this for Redis/a database —
  the module's small `get/create/update/delete` interface is designed for a
  drop-in replacement.

## 6. Design system

| Token             | Value      |
|--------------------|------------|
| Background         | `#070A13`  |
| Secondary Background | `#111827` |
| Purple              | `#6C5CE7` |
| Electric Cyan       | `#00D9FF` |
| Violet              | `#8B5CF6` |
| Primary Text        | `#F8FAFC` |
| Secondary Text      | `#94A3B8` |

Gradients: Purple → Cyan, Purple → Violet. Glassmorphism (`.glass` utility in
`index.css`) is used selectively on cards, the navbar and modals — not on
every surface — and glow effects are limited to primary CTAs and icon tiles.

## 7. Production notes

- Put the backend behind a reverse proxy (nginx) with HTTPS.
- Set `FRONTEND_ORIGIN` to your deployed frontend's exact origin for CORS.
- Tune `MAX_FILE_SIZE_MB` and add request-rate limiting (e.g. `express-rate-limit`)
  before exposing this publicly.
- For horizontal scaling, move the job store to Redis and the temp storage to
  a shared volume or object storage (S3 + presigned URLs) instead of local disk.
