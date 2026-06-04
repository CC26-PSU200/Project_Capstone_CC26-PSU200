
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from typing import List, Optional
import tensorflow as tf
import numpy as np
import json, os
from joblib import load

# ── Custom layer harus diimport sebelum load model ────────────────────────────
# from diagnoku_model import SparseBinaryInputNorm
# (salin class SparseBinaryInputNorm dan DiagnoKuInferenceEngine ke file ini)

app = FastAPI(
    title       = "DiagnoKu API",
    description = "Medical symptom classification — Top-3 disease prediction",
    version     = "1.0.0",
)

# ── Load artifacts on startup ─────────────────────────────────────────────────
ARTIFACT_DIR = "diagnoku_biner_artifacts"
MODEL_PATH   = "diagnoku_biner_best.keras"

@app.on_event("startup")
async def load_model():
    global engine
    engine = DiagnoKuInferenceEngine.load(ARTIFACT_DIR, MODEL_PATH)

# ── Request/Response schemas ──────────────────────────────────────────────────
class SymptomRequest(BaseModel):
    symptoms : List[str] = Field(..., min_items=1, max_items=50,
                                 example=["fever", "cough", "fatigue"])
    top_k    : Optional[int] = Field(3, ge=1, le=10)

class PredictionItem(BaseModel):
    rank           : int
    disease        : str
    confidence     : float
    confidence_pct : str

class PredictionResponse(BaseModel):
    predictions         : List[PredictionItem]
    matched_symptoms    : List[str]
    unmatched_symptoms  : List[str]
    n_active_features   : int
    warning             : Optional[str] = None

# ── Endpoints ─────────────────────────────────────────────────────────────────
@app.post("/predict", response_model=PredictionResponse)
async def predict(request: SymptomRequest):
    result = engine.predict(request.symptoms, top_k=request.top_k)
    if not result["predictions"]:
        raise HTTPException(status_code=422, detail=result.get("warning"))
    return result

@app.get("/symptoms")
async def get_symptoms():
    return {"symptoms": engine.get_available_symptoms(),
            "total"   : len(engine.get_available_symptoms())}

@app.get("/health")
async def health():
    return {"status": "ok", "n_diseases": len(engine.le.classes_),
            "n_features": engine.n_features}
