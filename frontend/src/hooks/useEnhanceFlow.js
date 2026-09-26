import { useCallback, useRef, useState } from "react";
import { uploadVideo, startProcessing, getJobStatus, getDownloadUrl } from "../api/client";

const STAGES = {
  IDLE: "idle",
  UPLOADING: "uploading",
  CONFIGURING: "configuring",
  PROCESSING: "processing",
  COMPLETED: "completed",
  FAILED: "failed",
};

export function useEnhanceFlow() {
  const [stage, setStage] = useState(STAGES.IDLE);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processProgress, setProcessProgress] = useState(0);
  const [job, setJob] = useState(null);
  const [meta, setMeta] = useState(null);
  const [error, setError] = useState(null);
  const [fileName, setFileName] = useState(null);
  const pollRef = useRef(null);

  const reset = useCallback(() => {
    clearInterval(pollRef.current);
    setStage(STAGES.IDLE);
    setUploadProgress(0);
    setProcessProgress(0);
    setJob(null);
    setMeta(null);
    setError(null);
    setFileName(null);
  }, []);

  const handleFile = useCallback(async (file) => {
    setError(null);
    setFileName(file.name);
    setStage(STAGES.UPLOADING);
    setUploadProgress(0);
    try {
      const res = await uploadVideo(file, setUploadProgress);
      setJob(res.job);
      setMeta(res.meta);
      setStage(STAGES.CONFIGURING);
    } catch (err) {
      setError(err.message);
      setStage(STAGES.FAILED);
    }
  }, []);

  const enhance = useCallback(
    async (options) => {
      if (!job) return;
      setError(null);
      setStage(STAGES.PROCESSING);
      setProcessProgress(0);
      try {
        await startProcessing(job.id, options);

        pollRef.current = setInterval(async () => {
          try {
            const res = await getJobStatus(job.id);
            setJob(res.job);
            setProcessProgress(res.job.progress || 0);

            if (res.job.status === "completed") {
              clearInterval(pollRef.current);
              setStage(STAGES.COMPLETED);
            } else if (res.job.status === "failed") {
              clearInterval(pollRef.current);
              setError(res.job.error || "Processing failed.");
              setStage(STAGES.FAILED);
            }
          } catch (err) {
            clearInterval(pollRef.current);
            setError(err.message);
            setStage(STAGES.FAILED);
          }
        }, 1200);
      } catch (err) {
        setError(err.message);
        setStage(STAGES.FAILED);
      }
    },
    [job]
  );

  const downloadUrl = job ? getDownloadUrl(job.id) : null;

  return {
    STAGES,
    stage,
    uploadProgress,
    processProgress,
    job,
    meta,
    error,
    fileName,
    handleFile,
    enhance,
    downloadUrl,
    reset,
  };
}
