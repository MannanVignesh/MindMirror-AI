"""
MindMirror AI - Plain-Language Interpretation and Practical Guidance Module
Adheres strictly to research guidelines:
1. Distinguishes observable text patterns from the writer's actual internal state.
2. Incorporates user-selected context transparently (does not mutate raw model scores).
3. Provides supportive, non-coercive, non-clinical wellbeing next steps.
4. Includes verified crisis helpline resources and clear medical disclaimers.
"""

from typing import Dict, Any, List

CONTEXT_DESCRIPTIONS = {
    "personal_journal": "Personal reflection or journal entry",
    "message_conversation": "Message or conversation excerpt",
    "work_academic": "Work or academic text",
    "social_media": "Social-media post or forum content",
    "fiction_general": "Fiction, literature, or general third-person document",
    "unsure": "Unspecified / general text"
}


def generate_interpretation_and_guidance(
    stress_analysis: Dict[str, Any],
    emotion_analysis: Dict[str, Any],
    linguistic_features: Dict[str, Any],
    context: str = "unsure"
) -> Dict[str, Any]:
    """
    Synthesizes NLP signals into transparent plain-language interpretation
    and non-clinical practical reflection recommendations.
    """
    calibrated_score = stress_analysis.get("calibrated_score", 0.0)
    is_stress_present = calibrated_score >= 0.50
    dominant_emotion = emotion_analysis.get("dominant_emotion", "neutral")
    p1_sing_ratio = linguistic_features.get("first_person_singular_ratio", 0.0)
    cog_ratio = linguistic_features.get("cognitive_terms_ratio", 0.0)
    affect_ratio = linguistic_features.get("affective_stress_terms_ratio", 0.0)

    context_label = CONTEXT_DESCRIPTIONS.get(context, "Unspecified context")

    # 1. Plain-Language Linguistic Interpretation
    observable_points = []
    if is_stress_present:
        observable_points.append(f"The text exhibits high lexical density of pressure, fatigue, or strain (calibrated score: {calibrated_score:.2f}).")
    else:
        observable_points.append(f"The text exhibits predominantly balanced, neutral, or non-acute language patterns (calibrated score: {calibrated_score:.2f}).")

    if affect_ratio > 0.04:
        observable_points.append("Observable wording includes multiple explicit terms denoting exhaustion, helplessness, or acute urgency.")

    if p1_sing_ratio > 0.08:
        observable_points.append(f"A high ratio of first-person singular pronouns ('I', 'me', 'my' at {p1_sing_ratio:.1%}) suggests focused self-referential reflection.")

    if cog_ratio > 0.05:
        observable_points.append(f"Substantial cognitive processing terms ('think', 'realize', 'understand' at {cog_ratio:.1%}) indicate active analytical processing or appraisal.")

    if dominant_emotion != "neutral":
        observable_points.append(f"The secondary emotional sentiment profile leans toward '{dominant_emotion.capitalize()}'.")

    interpretation_text = " ".join(observable_points)

    # 2. Contextual Boundary Notice (Transparent contrast between raw score and context)
    context_warnings = []
    if context in ["fiction_general", "work_academic"]:
        context_warnings.append(
            f"Context Alert ({context_label}): This content is indicated as literary, academic, or professional material. "
            "Stress-related language in this document reflects dramatic narrative tension, scholarly subject matter, or work "
            "requirements, and MUST NOT be conflated with personal psychological distress of the author or reader."
        )
    elif context == "message_conversation":
        context_warnings.append(
            f"Context Alert ({context_label}): This text represents conversational messages. "
            "Communicative tone can be influenced by conversational pacing, irony, or interpersonal dynamics. "
            "The model evaluates the isolated message text, not the overall relationship or mental condition."
        )
    elif context == "social_media":
        context_warnings.append(
            f"Context Alert ({context_label}): Social media posts frequently employ hyperbole, stylized venting, or platform norms. "
            "Elevated scores describe linguistic posturing and venting language rather than a validated clinical state."
        )

    # 3. Proportionate Practical Next Steps
    next_steps = []
    if is_stress_present:
        next_steps.append({
            "title": "Take a 10–15 Minute Cognitive Pause",
            "description": "Step away from the screen or current task. Engage in gentle box breathing (4s in, 4s hold, 4s out, 4s hold) or physical stretching to release somatic tension.",
            "category": "Immediate Regulation"
        })
        next_steps.append({
            "title": "Isolate the Underlying Demand",
            "description": "Identify which specific circumstance described in the text is driving the feeling of pressure (e.g., workload, communication friction, or financial strain).",
            "category": "Reflection"
        })
        next_steps.append({
            "title": "Break Demands into Micro-Tasks",
            "description": "If facing multiple complex requirements, select only the single next physical step rather than trying to solve the entirety of the situation at once.",
            "category": "Actionable Planning"
        })
        next_steps.append({
            "title": "Reach Out to a Trusted Ally",
            "description": "Sharing a demanding experience with a friend, mentor, or family member can provide grounding perspective and relieve isolated rumination.",
            "category": "Social Support"
        })
    else:
        next_steps.append({
            "title": "Acknowledge Grounded Progress",
            "description": "Notice routines or practices that supported clarity and equilibrium in this passage, and consider noting them down for future reference.",
            "category": "Reinforcement"
        })
        next_steps.append({
            "title": "Maintain Balanced Work Pacing",
            "description": "Continue pacing activities steadily without overcommitting schedule buffers.",
            "category": "Pacing"
        })

    # Qualified professional support recommendation for acute or persistent distress
    support_advisory = (
        "If you or someone you are reading about is experiencing persistent distress, severe anxiety, "
        "or feelings of hopelessness that interfere with daily life, consider consulting a licensed counselor, "
        "physician, or mental health professional for personalized guidance."
    )

    crisis_resources = [
        {"name": "988 Suicide & Crisis Lifeline (USA & Canada)", "contact": "Call or Text 988 (Available 24/7, Free & Confidential)"},
        {"name": "Crisis Text Line", "contact": "Text HOME to 741741 (USA/UK/Canada)"},
        {"name": "Befrienders Worldwide", "contact": "https://www.befrienders.org (Global network of confidential emotional support centers)"},
        {"name": "The Trevor Project", "contact": "Call 1-866-488-7386 or Text START to 678-678 (LGBTQ youth support)"}
    ]

    return {
        "interpretation": interpretation_text,
        "context_applied": context,
        "context_label": context_label,
        "context_warnings": context_warnings,
        "raw_score_preserved": True,
        "practical_suggestions": next_steps,
        "support_advisory": support_advisory,
        "crisis_resources": crisis_resources
    }
