/**
 * Minimal in-memory job store.
 *
 * For a production deployment with multiple server instances, replace this
 * with Redis or a database table — the interface (get/set/delete) is kept
 * intentionally small so that swap is a drop-in change.
 */
const jobs = new Map();

export function createJob(job) {
  jobs.set(job.id, {
    progress: 0,
    status: "uploaded", // uploaded -> queued -> processing -> completed -> failed
    engine: null, // 'ai' | 'ffmpeg'
    error: null,
    createdAt: Date.now(),
    ...job,
  });
  return jobs.get(job.id);
}

export function getJob(id) {
  return jobs.get(id) || null;
}

export function updateJob(id, patch) {
  const existing = jobs.get(id);
  if (!existing) return null;
  const updated = { ...existing, ...patch, updatedAt: Date.now() };
  jobs.set(id, updated);
  return updated;
}

export function deleteJob(id) {
  jobs.delete(id);
}

export function allJobs() {
  return Array.from(jobs.values());
}

/** Public-safe view of a job — never leaks server file paths. */
export function toPublicJob(job) {
  if (!job) return null;
  return {
    id: job.id,
    status: job.status,
    progress: job.progress,
    engine: job.engine,
    mode: job.mode,
    originalName: job.originalName,
    error: job.error,
    createdAt: job.createdAt,
    downloadReady: job.status === "completed",
  };
}
