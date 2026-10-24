"""
Comprehensive Automated Test Suite for MindMirror AI Backend
Validates:
1. Ingestion of text, images (with OCR), and PDFs.
2. Calibrated stress classification, emotion profiling, and linguistic feature extraction.
3. Token and phrase occlusion attribution mathematics.
4. Context-aware guidance, non-clinical interpretation, and crisis support.
5. All FastAPI REST endpoints.
"""

import os
import io
import pytest
from PIL import Image, ImageDraw
import pypdf
from fastapi.testclient import TestClient

from app.main import app
from app.ingestion import extract_from_text, extract_from_image, extract_from_pdf
from app.nlp import analyze_stress_language, classify_emotions, extract_linguistic_features, run_full_nlp_analysis
from app.explainer import compute_phrase_and_token_occlusion
from app.guidance import generate_interpretation_and_guidance


@pytest.fixture
def client():
    return TestClient(app)


# 1. Ingestion Tests
def test_typed_text_ingestion():
    sample = "I have been feeling intense anxiety and panic about my examinations."
    res = extract_from_text(sample)
    assert res["status"] == "success"
    assert res["source_type"] == "typed_text"
    assert res["word_count"] == 11
    assert res["ocr_applied"] is False


def test_empty_text_ingestion():
    res = extract_from_text("   ")
    assert res["status"] == "warning"
    assert res["word_count"] == 0
    assert "Supplied text is empty." in res["warnings"]


def test_image_ocr_ingestion():
    # Generate synthetic image with rendered text using Pillow
    img = Image.new("RGB", (400, 100), color="white")
    draw = ImageDraw.Draw(img)
    draw.text((20, 35), "MINDMIRROR STRESS TEST", fill="black")

    img_byte_arr = io.BytesIO()
    img.save(img_byte_arr, format="PNG")
    img_bytes = img_byte_arr.getvalue()

    res = extract_from_image(img_bytes, filename="screenshot_sample.png")
    assert res["source_type"] == "screenshot"
    assert res["ocr_applied"] is True
    assert res["status"] in ["success", "warning"]
    assert "extracted_text" in res


def test_pdf_ingestion():
    # Create simple digital PDF in memory
    writer = pypdf.PdfWriter()
    writer.add_blank_page(width=300, height=300)
    pdf_buf = io.BytesIO()
    writer.write(pdf_buf)
    pdf_bytes = pdf_buf.getvalue()

    res = extract_from_pdf(pdf_bytes, filename="sample.pdf")
    assert res["source_type"] == "pdf"
    assert res["page_count"] == 1


# 2. NLP Inference Tests
def test_calibrated_stress_classification():
    stress_text = "I feel completely overwhelmed and suffocating from relentless pressure and panic."
    res = analyze_stress_language(stress_text)

    assert "calibrated_score" in res
    assert 0.0 <= res["calibrated_score"] <= 1.0
    assert res["binary_decision"] in [0, 1]
    assert len(res["uncertainty_interval"]) == 2
    assert res["uncertainty_interval"][0] <= res["uncertainty_interval"][1]
    assert "Platt-Calibrated" in res["model_version"]


def test_emotion_classification():
    joy_text = "I am so grateful and happy to celebrate this peaceful morning."
    res = classify_emotions(joy_text)
    assert res["dominant_emotion"] == "joy"
    assert res["scores"]["joy"] > res["scores"]["sadness"]

    sad_text = "I have been crying all evening feeling devastated and heartbroken."
    res_sad = classify_emotions(sad_text)
    assert res_sad["dominant_emotion"] in ["sadness", "fear"]


def test_explicit_linguistic_features():
    sample = "I think I realize that my schedule is too demanding, but we can manage."
    feats = extract_linguistic_features(sample)
    assert feats["total_words"] > 0
    assert feats["first_person_singular_count"] >= 2  # 'I', 'my'
    assert feats["first_person_plural_count"] >= 1  # 'we'
    assert feats["cognitive_terms_count"] >= 2  # 'think', 'realize'
    assert feats["type_token_ratio"] > 0.5
    assert feats["flesch_reading_ease"] >= 0.0


# 3. Occlusion Attribution Tests
def test_token_and_phrase_occlusion():
    sample = "I feel completely overwhelmed by intense constant pressure and panic."
    res = compute_phrase_and_token_occlusion(sample)

    assert res["status"] == "success"
    assert "base_score" in res
    assert res["explanation_method"] == "Token & Phrase Occlusion"
    assert len(res["positive_attributions"]) > 0
    assert len(res["token_map"]) > 0

    # Ensure delta semantics
    top_driver = res["positive_attributions"][0]
    assert top_driver["attribution_delta"] > 0
    assert top_driver["score_without_term"] < res["base_score"]


# 4. Context & Guidance Tests
def test_context_awareness_and_guidance():
    nlp_results = run_full_nlp_analysis("Severe pressure and panic in this chapter.")
    guidance = generate_interpretation_and_guidance(
        stress_analysis=nlp_results["stress_classification"],
        emotion_analysis=nlp_results["emotion_analysis"],
        linguistic_features=nlp_results["linguistic_features"],
        context="fiction_general"
    )

    assert guidance["raw_score_preserved"] is True
    assert len(guidance["context_warnings"]) > 0
    assert "Fiction" in guidance["context_warnings"][0]
    assert len(guidance["practical_suggestions"]) > 0
    assert len(guidance["crisis_resources"]) > 0


# 5. FastAPI Endpoint Tests
def test_api_health(client):
    res = client.get("/api/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "healthy"
    assert data["model_loaded"] is True


def test_api_analyze(client):
    res = client.post("/api/analyze", json={
        "text": "The pressure is suffocating and I am exhausted.",
        "context": "personal_journal"
    })
    assert res.status_code == 200
    data = res.json()
    assert "stress_classification" in data
    assert "emotion_analysis" in data
    assert "linguistic_features" in data
    assert "guidance" in data


def test_api_explain(client):
    res = client.post("/api/explain", json={
        "text": "I feel completely overwhelmed by my thesis defense."
    })
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "success"
    assert "positive_attributions" in data
    assert "negative_attributions" in data


def test_api_evaluations(client):
    r1 = client.get("/api/evaluate/cross-domain")
    assert r1.status_code == 200
    assert "per_community" in r1.json()

    r2 = client.get("/api/evaluate/ocr")
    assert r2.status_code == 200
    assert "degradation_tiers" in r2.json()

    r3 = client.get("/api/models")
    assert r3.status_code == 200
    assert len(r3.json()["models"]) >= 2
