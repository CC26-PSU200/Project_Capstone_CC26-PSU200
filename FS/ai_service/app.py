from pathlib import Path
from typing import List, Optional
import json

import joblib
import numpy as np
import tensorflow as tf
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field


BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "model" / "diagnoku_biner_best.keras"
ARTIFACT_DIR = BASE_DIR / "artifacts"
FEATURE_LIST_PATH = ARTIFACT_DIR / "feature_list.json"
LABEL_ENCODER_PATH = ARTIFACT_DIR / "label_encoder.joblib"


class SparseBinaryInputNorm(tf.keras.layers.Layer):
    """Custom layer used by the saved Keras model.

    The saved weights contain two trainable vectors with the same length as the
    symptom feature vector. The layer applies a simple per-feature affine
    transform: output = input * scale + bias.
    """

    def __init__(self, epsilon=1e-6, **kwargs):
        super().__init__(**kwargs)
        self.epsilon = epsilon

    def build(self, input_shape):
        feature_dim = int(input_shape[-1])
        self.scale = self.add_weight(
            name="scale",
            shape=(feature_dim,),
            initializer="ones",
            trainable=True,
        )
        self.bias = self.add_weight(
            name="bias",
            shape=(feature_dim,),
            initializer="zeros",
            trainable=True,
        )

    def call(self, inputs):
        inputs = tf.cast(inputs, tf.float32)
        return inputs * self.scale + self.bias

    def get_config(self):
        config = super().get_config()
        config.update({"epsilon": self.epsilon})
        return config


class SymptomRequest(BaseModel):
    symptoms: List[str] = Field(..., min_items=1, max_items=50)
    top_k: Optional[int] = Field(3, ge=1, le=10)


class PredictionItem(BaseModel):
    rank: int
    disease: str
    confidence: float
    confidence_pct: str


class PredictionResponse(BaseModel):
    predictions: List[PredictionItem]
    matched_symptoms: List[str]
    unmatched_symptoms: List[str]
    n_active_features: int
    warning: Optional[str] = None


class DiagnoKuInferenceEngine:
    def __init__(self, model, features, label_encoder):
        self.model = model
        self.features = features
        self.label_encoder = label_encoder
        self.feature_index = {feature.lower().strip(): idx for idx, feature in enumerate(features)}
        self.n_features = len(features)

    @classmethod
    def load(cls, artifact_dir: Path, model_path: Path):
        with open(FEATURE_LIST_PATH, "r", encoding="utf-8") as f:
            feature_data = json.load(f)

        features = feature_data["features"]
        label_encoder = joblib.load(LABEL_ENCODER_PATH)
        model = tf.keras.models.load_model(
            model_path,
            custom_objects={"SparseBinaryInputNorm": SparseBinaryInputNorm},
            compile=False,
        )
        return cls(model=model, features=features, label_encoder=label_encoder)

    def _vectorize_symptoms(self, symptoms: List[str]):
        vector = np.zeros((self.n_features,), dtype=np.float32)
        matched = []
        unmatched = []

        for raw_symptom in symptoms:
            key = raw_symptom.lower().strip()
            idx = self.feature_index.get(key)
            if idx is None:
                unmatched.append(raw_symptom)
                continue
            vector[idx] = 1.0
            matched.append(self.features[idx])

        return vector, matched, unmatched

    def predict(self, symptoms: List[str], top_k: int = 3):
        vector, matched, unmatched = self._vectorize_symptoms(symptoms)
        active_features = int(vector.sum())

        if active_features == 0:
            return {
                "predictions": [],
                "matched_symptoms": matched,
                "unmatched_symptoms": unmatched,
                "n_active_features": active_features,
                "warning": "Tidak ada gejala yang cocok dengan daftar fitur model.",
            }

        input_tensor = np.expand_dims(vector, axis=0)
        probs = self.model.predict(input_tensor, verbose=0)[0]
        top_indices = np.argsort(probs)[::-1][:top_k]
        class_labels = self.label_encoder.inverse_transform(top_indices)

        predictions = []
        for rank, (class_index, disease_name) in enumerate(zip(top_indices, class_labels), start=1):
            confidence = float(probs[class_index])
            predictions.append(
                {
                    "rank": rank,
                    "disease": str(disease_name),
                    "confidence": confidence,
                    "confidence_pct": f"{confidence * 100:.2f}%",
                }
            )

        return {
            "predictions": predictions,
            "matched_symptoms": matched,
            "unmatched_symptoms": unmatched,
            "n_active_features": active_features,
            "warning": None,
        }

    def get_available_symptoms(self):
        return self.features


app = FastAPI(
    title="DiagnoKu API",
    description="Medical symptom classification API",
    version="1.0.0",
)

engine: Optional[DiagnoKuInferenceEngine] = None


@app.on_event("startup")
async def load_model():
    global engine
    engine = DiagnoKuInferenceEngine.load(ARTIFACT_DIR, MODEL_PATH)


@app.get("/health")
async def health():
    if engine is None:
        raise HTTPException(status_code=503, detail="Model belum siap")
    return {
        "status": "ok",
        "n_diseases": int(len(engine.label_encoder.classes_)),
        "n_features": int(engine.n_features),
    }


@app.get("/symptoms")
async def get_symptoms():
    if engine is None:
        raise HTTPException(status_code=503, detail="Model belum siap")
    symptoms = engine.get_available_symptoms()
    return {"symptoms": symptoms, "total": len(symptoms)}


@app.get("/diseases")
async def get_diseases():
    if engine is None:
        raise HTTPException(status_code=503, detail="Model belum siap")
    diseases = [str(item) for item in engine.label_encoder.classes_]
    return {"diseases": diseases, "total": len(diseases)}


@app.post("/predict", response_model=PredictionResponse)
async def predict(request: SymptomRequest):
    if engine is None:
        raise HTTPException(status_code=503, detail="Model belum siap")

    result = engine.predict(request.symptoms, top_k=request.top_k or 3)
    if not result["predictions"]:
        raise HTTPException(status_code=422, detail=result.get("warning"))
    return result


@app.get("/")
async def root():
    return {"message": "DiagnoKu API is running"}
