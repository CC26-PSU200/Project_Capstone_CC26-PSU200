import {
  getSymptomSuggestions,
  normalizeSymptomInput,
  translateDisease,
  translateSymptom,
} from "../utils/labelTranslator.js";
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://127.0.0.1:8000";

async function fetchJson(path, options = {}) {
  const response = await fetch(`${AI_SERVICE_URL}${path}`, options);
  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data?.detail || "Gagal memanggil AI service.");
    error.statusCode = response.status;
    error.details = data;
    throw error;
  }

  return data;
}

function normalizeSymptoms(input) {
  if (!input || input.symptoms == null) {
    const error = new Error("Field 'symptoms' harus berupa array.");
    error.statusCode = 400;
    throw error;
  }

  const symptoms = Array.isArray(input.symptoms)
    ? input.symptoms
    : String(input.symptoms)
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

  if (symptoms.length === 0) {
    const error = new Error("Field 'symptoms' harus berisi minimal satu gejala.");
    error.statusCode = 400;
    throw error;
  }

  return {
    symptoms: symptoms.map((item) => normalizeSymptomInput(item)),
    top_k: Number.isInteger(input.top_k) ? input.top_k : Number.parseInt(input.top_k ?? 3, 10) || 3,
  };
}

export async function predictDisease(payload) {
  const body = normalizeSymptoms(payload);

  const result = await fetchJson("/predict", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const prediksi = result.predictions.map((item) => ({
    peringkat: item.rank,
    penyakit: translateDisease(item.disease),
    penyakit_asli: item.disease,
    tingkat_kepercayaan: item.confidence,
    persen_kepercayaan: item.confidence_pct,
  }));

  return {
    prediksi,
    gejala_cocok: result.matched_symptoms.map((item) => ({
      nama: translateSymptom(item),
      nama_asli: item,
    })),
    gejala_tidak_cocok: result.unmatched_symptoms.map((item) => ({
      nama: translateSymptom(item),
      nama_asli: item,
    })),
    jumlah_gejala_aktif: result.n_active_features,
    peringatan: result.warning,
  };
}

export async function getSymptoms() {
  const result = await fetchJson("/symptoms");
  return {
    gejala: result.symptoms.map((item) => ({
      nama: translateSymptom(item),
      nama_asli: item,
    })),
    saran: getSymptomSuggestions(),
    total: result.total,
  };
}

export async function getDiseases() {
  const result = await fetchJson("/diseases");
  return {
    penyakit: result.diseases.map((item) => ({
      nama: translateDisease(item),
      nama_asli: item,
    })),
    total: result.total,
  };
}
