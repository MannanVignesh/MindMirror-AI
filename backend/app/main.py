"""
MindMirror AI - FastAPI Inference and Ingestion API
Provides endpoints for multimodal extraction, NLP inference, occlusion attribution,
and research evaluation benchmarks.
"""

import os
import json
from typing import Optional, Dict, Any
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from app.ingestion import extract_from_text, extract_from_pdf, extract_from_image
from app.nlp import run_full_nlp_analysis, get_model_pipeline
from app.explainer import compute_phrase_and_token_occlusion
from app.guidance import generate_interpretation_and_guidance

app = FastAPI(
    title="MindMirror AI - Multimodal NLP Wellbeing Research API",
    description="Explainable NLP framework for everyday emotional wellbeing signal analysis",
    version="1.0.0"
)

# Enable CORS for Next.js frontend (local development and Vercel deployments)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ARTIFACTS_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "artifacts"))
STORE_DIR = os.path.join(os.path.expanduser("~"), ".mindmirror_store")


def read_artifact_json(filename: str) -> Dict[str, Any]:
    """Reads an artifact JSON file from artifacts directory or user store directory."""
    paths = [
        os.path.join(ARTIFACTS_DIR, filename),
        os.path.join(STORE_DIR, filename)
    ]
    for p in paths:
        if os.path.exists(p):
            with open(p, "r", encoding="utf-8") as f:
                return json.load(f)
    raise HTTPException(status_code=404, detail=f"Artifact {filename} not found.")


class AnalyzeRequest(BaseModel):
    text: str
    context: Optional[str] = "unsure"


class ExplainRequest(BaseModel):
    text: str


@app.get("/api/health")
def health_check():
    """Health status and model readiness check."""
    model_ready = False
    try:
        get_model_pipeline()
        model_ready = True
    except Exception:
        pass

    return {
        "status": "healthy",
        "service": "MindMirror AI Backend API",
        "model_loaded": model_ready,
        "supported_inputs": ["typed_text", "pdf", "image/png", "image/jpeg", "image/webp"]
    }


@app.post("/api/extract")
async def extract_content(
    file: Optional[UploadFile] = File(None),
    raw_text: Optional[str] = Form(None)
):
    """
    Ingests and normalizes content from text, PDF, or image files.
    Returns extraction metadata and editable text preview.
    """
    if file is not None and file.filename:
        filename = file.filename
        content = await file.read()
        lower_name = filename.lower()

        if lower_name.endswith(".pdf"):
            result = extract_from_pdf(content, filename=filename)
        elif any(lower_name.endswith(ext) for ext in [".png", ".jpg", ".jpeg", ".webp"]):
            result = extract_from_image(content, filename=filename)
        elif lower_name.endswith(".txt"):
            try:
                text_content = content.decode("utf-8")
            except UnicodeDecodeError:
                text_content = content.decode("latin-1", errors="ignore")
            result = extract_from_text(text_content)
        else:
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported file format '{filename}'. Please supply a TXT, PDF, PNG, JPG, or WebP file."
            )
        return result

    if raw_text is not None:
        return extract_from_text(raw_text)

    raise HTTPException(
        status_code=400,
        detail="No input provided. Please provide either a file upload or text."
    )


@app.post("/api/analyze")
def analyze_text(request: AnalyzeRequest):
    """
    Runs supervised stress classification, text-level emotion analysis,
    explicit linguistic feature extraction, and non-clinical guidance.
    """
    text = request.text.strip()
    if not text:
        raise HTTPException(status_code=400, detail="Cannot analyze empty text.")

    # 1. Run core NLP models
    nlp_results = run_full_nlp_analysis(text)

    # 2. Generate plain-language interpretation and guidance
    guidance_results = generate_interpretation_and_guidance(
        stress_analysis=nlp_results["stress_classification"],
        emotion_analysis=nlp_results["emotion_analysis"],
        linguistic_features=nlp_results["linguistic_features"],
        context=request.context or "unsure"
    )

    return {
        "text_summary": {
            "character_count": len(text),
            "word_count": len(text.split())
        },
        "stress_classification": nlp_results["stress_classification"],
        "emotion_analysis": nlp_results["emotion_analysis"],
        "linguistic_features": nlp_results["linguistic_features"],
        "guidance": guidance_results
    }


@app.post("/api/explain")
def explain_attributions(request: ExplainRequest):
    """
    Computes token and phrase occlusion attributions showing positive and
    negative shifts in the stress classifier probability.
    """
    text = request.text.strip()
    if not text:
        raise HTTPException(status_code=400, detail="Cannot explain empty text.")

    explanation = compute_phrase_and_token_occlusion(text)
    return explanation


@app.get("/api/evaluate/cross-domain")
def get_cross_domain_evaluation():
    """Returns Dreaddit Leave-One-Community-Out cross-domain experiment results."""
    return read_artifact_json("cross_domain_results.json")


@app.get("/api/evaluate/ocr")
def get_ocr_evaluation():
    """Returns Multimodal OCR Ingestion Quality degradation experiment results."""
    return read_artifact_json("ocr_quality_results.json")


@app.get("/api/models")
def get_model_benchmarks():
    """Returns baseline vs fine-tuned transformer model comparison and calibration curves."""
    return read_artifact_json("model_comparison.json")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
