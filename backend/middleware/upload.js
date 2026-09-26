import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { nanoid } from "nanoid";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const UPLOAD_DIR = path.join(__dirname, "..", process.env.UPLOAD_DIR || "temp/uploads");
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const ALLOWED_MIME = [
  "video/mp4",
  "video/quicktime",
  "video/x-msvideo",
  "video/x-matroska",
  "video/webm",
  "video/mpeg",
];

const MAX_FILE_SIZE_BYTES = (Number(process.env.MAX_FILE_SIZE_MB) || 500) * 1024 * 1024;

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    // Server-generated, unguessable filename — the original name is preserved
    // only in memory/job metadata, never used on disk.
    const ext = path.extname(file.originalname) || ".mp4";
    cb(null, `${nanoid(16)}${ext}`);
  },
});

function fileFilter(req, file, cb) {
  if (!ALLOWED_MIME.includes(file.mimetype)) {
    const err = new Error("Unsupported video format.");
    err.status = 400;
    err.publicMessage =
      "Unsupported video format. Please upload MP4, MOV, AVI, MKV or WebM.";
    return cb(err);
  }
  cb(null, true);
}

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_FILE_SIZE_BYTES },
});

export { UPLOAD_DIR };
