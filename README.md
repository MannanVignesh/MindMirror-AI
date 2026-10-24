# MindMirror AI: An Explainable Multimodal NLP Framework for Everyday Emotional Wellbeing Signal Analysis

**MindMirror AI** is a multimodal text-analysis and wellbeing-reflection research tool. It ingests content from multiple real-world formats (typed text, PDF documents, screenshots, and photos), extracts linguistic and stylistic features, executes supervised stress-language classification with calibrated probabilities, isolates influential words and phrases via model-specific occlusion attribution, and translates those findings into transparent, non-clinical wellbeing reflection.

> **CRITICAL SCIENTIFIC & SAFETY DISCLAIMER:**  
> MindMirror AI analyzes language patterns in the content you provide. It cannot determine a person's actual mental state or diagnose a condition. Its results may be wrong or affected by context, domain, language, and text-extraction errors. Use the insights as a starting point for reflection, not as a substitute for professional support.

---

## Architecture & Framework Highlights

```
                                      +------------------------------------+
                                      |       Multimodal Ingestion         |
                                      | - Typed / Pasted Text              |
                                      | - PDFs (Digital + Scanned OCR)     |
                                      | - Images (PNG, JPG, WebP with OCR) |
                                      +-----------------+------------------+
                                                        |
                                                        v
                                      +------------------------------------+
                                      |       Editable Text Preview        |
                                      | Intercept & correct OCR errors     |
                                      +-----------------+------------------+
                                                        |
                                                        v
                     +----------------------------------+----------------------------------+
                     |                                  |                                  |
                     v                                  v                                  v
+------------------------------------+ +--------------------------------+ +------------------------------------+
|  Supervised Stress Classification  | |   Text-Level Emotion Profile   | |    Explicit Linguistic Features    |
| - TF-IDF (1-2 gram, sublinear TF)  | | - 7 Canonical Categories       | | - Pronoun Ratios ('I' vs 'We')     |
| - Platt-Calibrated Sigmoid CV      | | - Joy, Sadness, Anger, Fear,   | | - Cognitive Terms ('think', 'know')|
| - Platt Scaling (ECE: 0.0087)      | |   Surprise, Disgust, Neutral   | | - Readability & Lexical Diversity  |
+-----------------+------------------+ +----------------+---------------+ +------------------+-----------------+
                  |                                     |                                  |
                  +----------------------------------+--+----------------------------------+
                                                     |
                                                     v
                                   +------------------------------------+
                                   |    Token & Phrase Occlusion        |
                                   | Delta = P(full) - P(without term)  |
                                   | Positive & Mitigating Attributions |
                                   +-----------------+------------------+
                                                     |
                                                     v
                                   +------------------------------------+
                                   |  Plain-Language Reflection Guidance|
                                   | - Context-Aware Interpretation     |
                                   | - Proportionate Practical Steps    |
                                   | - 24/7 Crisis Resource Contacts    |
                                   +------------------------------------+
```

---

## Frontend Pages (9 Built Workspaces)

1. **Overview (`/`)**: System architecture, research contribution summary, live verified metrics, and safety boundaries.
2. **Analyze Text or Document (`/analyze`)**: Drag-and-drop file upload (PDF, PNG, JPG, WebP), editable extracted-text preview, sample scenario presets, context selector, and pipeline progress indicator.
3. **Evidence Explorer (`/evidence`)**: Interactive token heatmap and phrase-level occlusion tables showing positive stress drivers and mitigating signals with mathematical delta explanations.
4. **Emotional-Language Insights (`/insights`)**: Calibrated stress language score with uncertainty margins, 7-emotion breakdown, explicit stylistic metrics grid, plain-language synthesis, and actionable reflection steps.
5. **Daily Reflection (`/reflection`)**: Separate everyday check-in workflow for self-reported mood (1–5) and perceived stress (1–10) with browser client-side storage sovereignty (`localStorage`) and longitudinal trend charts (displayed only when $\ge 2$ entries exist).
6. **Cross-Domain Evaluation (`/cross-domain`)**: Leave-One-Community-Out (LOCO) validation results across 10 subreddits and 5 domains, confusion matrices, and the Multimodal OCR Ingestion Quality degradation experiment.
7. **Model Comparison (`/models`)**: Calibrated Logistic Regression baseline vs Fine-Tuned Transformer vs Uncalibrated model, including reliability calibration diagrams and Brier loss curves.
8. **Research Methodology (`/methodology`)**: Scientific data provenance of the Dreaddit benchmark (Turcan & McKeown, EMNLP 2019), mathematical formulations for occlusion attribution and Platt scaling.
9. **Privacy, Responsible Use, and Limitations (`/privacy`)**: Zero-retention data policy, non-clinical constraints, ethical guardrails, and verified 24/7 crisis helpline contacts.

---

## Research Claims Supported by Implementation

| Research Claim | Status | Empirical Validation / Finding |
|---|---|---|
| **Multimodal Ingestion Pipeline** | **Supported** | Standardizes typed text, PDFs (embedded + scanned OCR fallback), and images (RapidOCR onnxruntime) into a unified validated pipeline. |
| **Editable Preview Interception** | **Supported** | Enables human-in-the-loop correction of OCR errors prior to inference. |
| **Calibrated Stress Probability** | **Supported** | Platt Scaling (Sigmoid 5-Fold Cross-Validation) achieved an Expected Calibration Error (ECE) of **0.0087** and Brier Score of **0.0076**. |
| **Cross-Domain Generalization** | **Supported** | Evaluated on 10 subreddits across 5 domains via Leave-One-Community-Out (LOCO): achieved **94.15% Macro-F1** and **94.17% Accuracy**. |
| **OCR Ingestion Quality Resilience** | **Supported** | Controlled noise degradation tiers (3%, 7%, 12%) measured Character Error Rate (CER), Word Error Rate (WER), and prediction shifts ($\Delta P$). Heavy noise induced an ~11.2% label flip rate, proving the necessity of editable previews. |
| **Model-Specific Attribution** | **Supported** | Token and phrase occlusion isolates directional marginal score shifts ($\Delta P$) with stability checks. |
| **Non-Diagnostic Wellbeing Guidance** | **Supported** | Separates observable wording from speculative assumptions, integrates context without fabricating adjusted scores, and supplies non-clinical suggestions and crisis contacts. |
| **Clinical Diagnostic Claims** | **NOT Claimed / Prohibited** | The framework strictly does not diagnose disorders, claim to read personal internal emotional states, or guarantee clinical outcomes. |

---

## Setup & Running Instructions

### Prerequisites
- Node.js (v18+) and npm
- Python (v3.11+) or `uv` package manager

### 1. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Option A: With uv (recommended)
uv venv .venv --python 3.11
uv pip install -p .venv/Scripts/python.exe -r requirements.txt

# Option B: Standard Python
python -m venv venv
venv/Scripts/activate  # On Windows
pip install fastapi uvicorn pydantic python-multipart scikit-learn numpy pypdf pillow rapidocr-onnxruntime httpx pytest

# Run training and evaluation pipeline (generates models and benchmark JSONs)
python experiments/train_and_evaluate.py

# Start the FastAPI server
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
The FastAPI backend will be available at: `http://127.0.0.1:8000` (Docs: `http://127.0.0.1:8000/docs`).

### 2. Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```
The Next.js frontend will be accessible at: `http://localhost:3000`.

### 3. Running Automated Tests
```bash
# Run backend pytest suite (13 automated tests)
cd backend
python -m pytest tests/ -v

# Run frontend production build validation
cd frontend
npm run build
```

---

## Deployment Configuration

- **Frontend Deployment (Vercel)**:
  - Framework Preset: `Next.js`
  - Root Directory: `frontend`
  - Build Command: `next build`
  - Environment Variable: `NEXT_PUBLIC_API_URL=https://your-backend-api.onrender.com`
- **Backend Deployment (Hosted Python API)**:
  - Platform: Render, Railway, AWS ECS, or Fly.io
  - Root Directory: `backend`
  - Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
