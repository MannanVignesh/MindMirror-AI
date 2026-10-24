"""
MindMirror AI - Model-Specific Evidence Explorer & Attribution Engine
Implements token and phrase occlusion:
Calculates Delta = P(stress | full text) - P(stress | text \ token/phrase)
to isolate positive (stress-inducing) and negative (mitigating) linguistic evidence.
"""

import re
from typing import Dict, Any, List, Tuple
from app.nlp import get_model_pipeline, tokenize_words


COMMON_STOPWORDS = {
    "a", "an", "the", "and", "or", "but", "in", "on", "at", "to", "for", "of", "with",
    "by", "from", "up", "about", "into", "over", "after", "is", "are", "was", "were",
    "be", "been", "being", "have", "has", "had", "do", "does", "did", "will", "would",
    "shall", "should", "may", "might", "must", "can", "could", "it", "this", "that"
}


def compute_phrase_and_token_occlusion(text: str, max_candidates: int = 25) -> Dict[str, Any]:
    """
    Performs occlusion attribution on tokens and key candidate phrases.
    Measures the exact marginal change in calibrated stress probability.
    """
    vectorizer, classifier = get_model_pipeline()

    if not text.strip():
        return {
            "status": "empty",
            "base_score": 0.0,
            "positive_attributions": [],
            "negative_attributions": [],
            "token_map": [],
            "stability_status": "inconclusive",
            "explanation_method": "Token & Phrase Occlusion",
            "method_semantics": "Occlusion measures how much the predicted class score shifts when a specific word or phrase is removed."
        }

    # Baseline probability
    base_prob = float(classifier.predict_proba(vectorizer.transform([text]))[0, 1])

    # Extract distinct meaningful words and 2-grams
    raw_tokens = re.findall(r"\b[\w'-]+\b", text)
    if not raw_tokens:
        return {
            "status": "empty",
            "base_score": base_prob,
            "positive_attributions": [],
            "negative_attributions": [],
            "token_map": [],
            "stability_status": "inconclusive",
            "explanation_method": "Token & Phrase Occlusion",
            "method_semantics": "Occlusion measures how much the predicted class score shifts when a specific word or phrase is removed."
        }

    candidate_units = set()

    # Add single informative tokens
    for t in raw_tokens:
        lower_t = t.lower()
        if len(lower_t) > 2 and lower_t not in COMMON_STOPWORDS:
            candidate_units.add(lower_t)

    # Add 2-gram phrases
    for i in range(len(raw_tokens) - 1):
        phrase = f"{raw_tokens[i].lower()} {raw_tokens[i+1].lower()}"
        candidate_units.add(phrase)

    # Occlude each candidate unit and observe Delta
    attributions = []

    for candidate in candidate_units:
        # Regex to remove whole phrase / word
        pattern = re.compile(rf"\b{re.escape(candidate)}\b", re.IGNORECASE)
        occluded_text = pattern.sub("", text)
        occluded_text = " ".join(occluded_text.split())

        if not occluded_text:
            continue

        occ_prob = float(classifier.predict_proba(vectorizer.transform([occluded_text]))[0, 1])
        # Delta: Positive means removing candidate lowered stress score (candidate pushed towards stress)
        delta = round(base_prob - occ_prob, 4)

        if abs(delta) >= 0.003:  # Filter out trivial micro-fluctuations
            attributions.append({
                "term": candidate,
                "attribution_delta": delta,
                "score_without_term": round(occ_prob, 4),
                "is_phrase": " " in candidate
            })

    # Sort attributions
    positive_contribs = sorted(
        [a for a in attributions if a["attribution_delta"] > 0],
        key=lambda x: x["attribution_delta"],
        reverse=True
    )[:max_candidates]

    negative_contribs = sorted(
        [a for a in attributions if a["attribution_delta"] < 0],
        key=lambda x: x["attribution_delta"]
    )[:max_candidates]

    # Stability Assessment
    max_delta = max([abs(a["attribution_delta"]) for a in attributions], default=0.0)
    if max_delta < 0.015:
        stability = "low_contrast_inconclusive"
        stability_note = "Attribution scores are weak (< 0.015 shift). The classification is dispersed across general context rather than concentrated key phrases."
    elif len(attributions) < 3:
        stability = "narrow_evidence"
        stability_note = "Only a small number of influential lexical tokens were detected in the supplied text."
    else:
        stability = "stable_contrast"
        stability_note = "Clear, concentrated lexical attributions were identified."

    # Build token-level highlight map for text rendering
    token_map = []
    term_to_delta = {a["term"]: a["attribution_delta"] for a in attributions}

    # Find matches and spans
    for match in re.finditer(r"\b[\w'-]+\b", text):
        w = match.group().lower()
        delta = term_to_delta.get(w, 0.0)
        token_map.append({
            "word": match.group(),
            "start": match.start(),
            "end": match.end(),
            "delta": delta,
            "type": "stress_driver" if delta > 0.02 else ("mitigating_driver" if delta < -0.02 else "neutral")
        })

    return {
        "status": "success",
        "base_score": round(base_prob, 4),
        "explanation_method": "Token & Phrase Occlusion",
        "method_semantics": (
            "Measures the marginal change in the model's text score when this specific word or phrase "
            "is omitted. A positive attribution means the phrase increased the text's stress score; "
            "a negative attribution means the phrase lowered the text's stress score."
        ),
        "stability_status": stability,
        "stability_note": stability_note,
        "positive_attributions": positive_contribs,
        "negative_attributions": negative_contribs,
        "token_map": token_map
    }
