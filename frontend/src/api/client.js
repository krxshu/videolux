const BASE_URL = import.meta.env.VITE_API_URL || "/api";

async function parseJsonSafe(res) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

export async function uploadVideo(file, onUploadProgress) {
  const formData = new FormData();
  formData.append("video", file);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${BASE_URL}/upload`);

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onUploadProgress) {
        onUploadProgress(Math.round((e.loaded / e.total) * 100));
      }
    };

    xhr.onload = () => {
      let data = null;
      try {
        data = JSON.parse(xhr.responseText);
      } catch {
        /* noop */
      }
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(data);
      } else {
        reject(new Error(data?.error || "Upload failed. Please try again."));
      }
    };

    xhr.onerror = () => reject(new Error("Network error during upload."));
    xhr.send(formData);
  });
}

export async function startProcessing(jobId, options) {
  const res = await fetch(`${BASE_URL}/process/${jobId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(options),
  });
  const data = await parseJsonSafe(res);
  if (!res.ok) throw new Error(data?.error || "Could not start processing.");
  return data;
}

export async function getJobStatus(jobId) {
  const res = await fetch(`${BASE_URL}/status/${jobId}`);
  const data = await parseJsonSafe(res);
  if (!res.ok) throw new Error(data?.error || "Could not fetch status.");
  return data;
}

export function getDownloadUrl(jobId) {
  return `${BASE_URL}/status/${jobId}/download`;
}
