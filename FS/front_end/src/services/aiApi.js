const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

async function fetchJson(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, options);
  const data = await response.json();

  if (!response.ok) {
    const message = data?.message || data?.detail || "Gagal memuat data AI.";
    const error = new Error(message);
    error.statusCode = response.status;
    error.details = data;
    throw error;
  }

  return data;
}

export async function getSymptoms() {
  return fetchJson("/api/ai/symptoms");
}

export async function getDiseases() {
  return fetchJson("/api/ai/diseases");
}

export async function predictSymptoms(symptoms, topK = 3) {
  return fetchJson("/api/ai/predict", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      symptoms,
      top_k: topK,
    }),
  });
}
