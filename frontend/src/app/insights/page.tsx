'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Activity, 
  HelpCircle, 
  Brain, 
  BookOpen, 
  HeartHandshake, 
  PhoneCall, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Layers, 
  CalendarHeart,
  BarChart2,
  Sliders,
  Scale
} from 'lucide-react';
import { analyzeText } from '../../lib/api';
import { AnalysisResponse, ContextType } from '../../lib/types';

const DEFAULT_SAMPLE_TEXT = "I am completely overwhelmed by my thesis defense next week. I haven't slept properly in days and my chest feels tight every morning when I open my email. The constant pressure from my committee is suffocating and I feel totally paralyzed by intrusive doubts about failing.";

export default function EmotionalInsightsPage() {
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [context, setContext] = useState<ContextType>('work_academic');

  useEffect(() => {
    try {
      const cached = sessionStorage.getItem('mindmirror_analysis');
      if (cached) {
        setAnalysis(JSON.parse(cached));
      } else {
        fetchAnalysis(DEFAULT_SAMPLE_TEXT, 'work_academic');
      }
    } catch {
      fetchAnalysis(DEFAULT_SAMPLE_TEXT, 'work_academic');
    }
  }, []);

  const fetchAnalysis = async (text: string, ctx: ContextType) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await analyzeText(text, ctx);
      setAnalysis(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Analysis failed';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleContextChange = (newContext: ContextType) => {
    setContext(newContext);
    const text = sessionStorage.getItem('mindmirror_analyzed_text') || DEFAULT_SAMPLE_TEXT;
    fetchAnalysis(text, newContext);
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span className="badge badge-info">Linguistic Profiling</span>
          <span className="badge badge-calm">Explainable Wellbeing Signals</span>
        </div>
        <h1 className="page-title">Emotional-Language Insights</h1>
        <p className="page-subtitle">
          Transparent, calibrated linguistic profiling of submitted text. Connects supervised stress models, 
          emotion analysis, and explicit stylistic features to cautious plain-language interpretation and non-clinical next steps.
        </p>
      </div>

      {isLoading && (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-accent)' }}>
          Loading calibrated profile and linguistic features...
        </div>
      )}

      {error && (
        <div className="disclaimer-banner" style={{ marginBottom: '2rem', borderColor: 'var(--stress-border)', color: 'var(--stress-color)' }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {analysis && (
        <>
          {/* Section A: Calibrated Stress Language Score Card */}
          <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
              <div>
                <span className="badge badge-neutral" style={{ marginBottom: '0.4rem' }}>
                  Model: {analysis.stress_classification.model_version}
                </span>
                <h2 style={{ fontSize: '1.65rem' }}>Calibrated Stress-Language Score</h2>
              </div>

              <span className={`badge ${analysis.stress_classification.binary_decision === 1 ? 'badge-stress' : 'badge-calm'}`} style={{ fontSize: '0.85rem', padding: '0.4rem 0.9rem' }}>
                {analysis.stress_classification.predicted_category_name}
              </span>
            </div>

            <div className="grid-2" style={{ alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '3.25rem', fontFamily: 'var(--font-heading)', fontWeight: 800, color: analysis.stress_classification.calibrated_score >= 0.5 ? 'var(--stress-color)' : 'var(--calm-color)' }}>
                    {analysis.stress_classification.calibrated_score.toFixed(3)}
                  </span>
                  <span style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>
                    / 1.000 (calibrated probability)
                  </span>
                </div>

                {/* Progress bar */}
                <div style={{ width: '100%', height: '10px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '5px', overflow: 'hidden', marginBottom: '0.75rem' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${(analysis.stress_classification.calibrated_score * 100).toFixed(1)}%`,
                      background: analysis.stress_classification.calibrated_score >= 0.5 ? 'var(--stress-color)' : 'var(--calm-color)',
                      transition: 'width 0.4s ease'
                    }}
                  />
                </div>

                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Estimated Uncertainty Margin: <strong>[{analysis.stress_classification.uncertainty_interval[0].toFixed(3)}, {analysis.stress_classification.uncertainty_interval[1].toFixed(3)}]</strong>
                </div>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '0.35rem' }}>
                  Strict Score Semantics Notice:
                </strong>
                {analysis.stress_classification.score_semantics}
              </div>
            </div>
          </div>

          {/* Section B: Documented Emotion Classifier vs Stress Classifier */}
          <div className="grid-2" style={{ marginBottom: '2.5rem' }}>
            {/* Emotion Profile */}
            <div className="glass-panel" style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Activity size={20} style={{ color: 'var(--info-color)' }} />
                  <h3 style={{ fontSize: '1.2rem' }}>Text-Level Emotion Tone Profile</h3>
                </div>
                <span className="badge badge-info" style={{ textTransform: 'capitalize' }}>
                  {analysis.emotion_analysis.dominant_emotion}
                </span>
              </div>

              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                Evaluates surface emotional sentiment across 7 canonical categories with local negation handling. 
                Emotion tone does not equate to psychiatric assessment.
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {Object.entries(analysis.emotion_analysis.scores).map(([emo, score]) => (
                  <div key={emo}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.2rem', textTransform: 'capitalize' }}>
                      <span style={{ color: emo === analysis.emotion_analysis.dominant_emotion ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                        {emo}
                      </span>
                      <span>{(score * 100).toFixed(1)}%</span>
                    </div>
                    <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div
                        style={{
                          height: '100%',
                          width: `${(score * 100).toFixed(1)}%`,
                          background: emo === 'joy' ? 'var(--calm-color)' : emo === 'sadness' || emo === 'fear' ? 'var(--stress-color)' : emo === 'anger' ? '#f97316' : 'var(--info-color)'
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Context Re-evaluation & Transparent Warning */}
            <div className="glass-panel" style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
                <Sliders size={20} style={{ color: 'var(--warning-color)' }} />
                <h3 style={{ fontSize: '1.2rem' }}>Context-Aware Interpretation</h3>
              </div>

              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label" style={{ fontSize: '0.8rem' }}>
                  Current Document Context Category:
                </label>
                <select
                  value={context}
                  onChange={(e) => handleContextChange(e.target.value as ContextType)}
                  className="form-select"
                  style={{ fontSize: '0.85rem', padding: '0.5rem 0.75rem' }}
                >
                  <option value="unsure">Unsure / Unspecified Text</option>
                  <option value="personal_journal">Personal Reflection or Journal Entry</option>
                  <option value="message_conversation">Direct Message or Chat Conversation</option>
                  <option value="work_academic">Work or Academic Assignment Text</option>
                  <option value="social_media">Social Media Post or Forum Content</option>
                  <option value="fiction_general">Fiction, Literature, or Third-Party Narrative</option>
                </select>
              </div>

              {analysis.guidance.context_warnings.length > 0 ? (
                <div className="disclaimer-banner" style={{ marginBottom: '1rem', borderColor: 'var(--warning-border)' }}>
                  <AlertCircle size={18} style={{ color: 'var(--warning-color)', flexShrink: 0 }} />
                  <div style={{ fontSize: '0.825rem' }}>
                    {analysis.guidance.context_warnings[0]}
                  </div>
                </div>
              ) : (
                <div style={{ padding: '0.75rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-sm)', fontSize: '0.825rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                  No contextual overrides active. Content evaluated as direct personal discourse.
                </div>
              )}

              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                <strong>Preservation of Raw Output:</strong> Context awareness informs the qualitative guidance below, 
                without altering the model&apos;s trained parameters or fabricating synthetic scores.
              </div>
            </div>
          </div>

          {/* Section C: Explicit Linguistic Features Grid */}
          <div className="glass-panel" style={{ padding: '1.75rem', marginBottom: '2.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>
              Explicit Linguistic &amp; Stylistic Features (Directly Computed)
            </h3>

            <div className="grid-4">
              <div className="stat-card">
                <span className="stat-label">1st Person Singular (&lsquo;I&rsquo;, &lsquo;me&rsquo;)</span>
                <span className="stat-value" style={{ fontSize: '1.4rem' }}>
                  {(analysis.linguistic_features.first_person_singular_ratio * 100).toFixed(1)}%
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {analysis.linguistic_features.first_person_singular_count} occurrences
                </span>
              </div>

              <div className="stat-card">
                <span className="stat-label">Cognitive Terms (&lsquo;think&rsquo;, &lsquo;realize&rsquo;)</span>
                <span className="stat-value" style={{ fontSize: '1.4rem' }}>
                  {(analysis.linguistic_features.cognitive_terms_ratio * 100).toFixed(1)}%
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {analysis.linguistic_features.cognitive_terms_count} terms detected
                </span>
              </div>

              <div className="stat-card">
                <span className="stat-label">Affective Stress Words</span>
                <span className="stat-value" style={{ fontSize: '1.4rem', color: analysis.linguistic_features.affective_stress_terms_count > 0 ? 'var(--stress-color)' : 'var(--text-primary)' }}>
                  {(analysis.linguistic_features.affective_stress_terms_ratio * 100).toFixed(1)}%
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {analysis.linguistic_features.affective_stress_terms_count} acute terms
                </span>
              </div>

              <div className="stat-card">
                <span className="stat-label">Lexical Diversity (TTR)</span>
                <span className="stat-value" style={{ fontSize: '1.4rem' }}>
                  {analysis.linguistic_features.type_token_ratio.toFixed(2)}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Type-to-token ratio
                </span>
              </div>

              <div className="stat-card">
                <span className="stat-label">Flesch Reading Ease</span>
                <span className="stat-value" style={{ fontSize: '1.4rem' }}>
                  {analysis.linguistic_features.flesch_reading_ease.toFixed(0)}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Avg sent: {analysis.linguistic_features.avg_sentence_length} words
                </span>
              </div>

              <div className="stat-card">
                <span className="stat-label">1st Person Plural (&lsquo;we&rsquo;, &lsquo;us&rsquo;)</span>
                <span className="stat-value" style={{ fontSize: '1.4rem' }}>
                  {(analysis.linguistic_features.first_person_plural_ratio * 100).toFixed(1)}%
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Social orientation
                </span>
              </div>

              <div className="stat-card">
                <span className="stat-label">Punctuation Intensity</span>
                <span className="stat-value" style={{ fontSize: '1.4rem' }}>
                  {analysis.linguistic_features.exclamation_mark_count} ! / {analysis.linguistic_features.question_mark_count} ?
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Exclamations &amp; questions
                </span>
              </div>

              <div className="stat-card">
                <span className="stat-label">All-Caps Word Ratio</span>
                <span className="stat-value" style={{ fontSize: '1.4rem' }}>
                  {(analysis.linguistic_features.all_caps_word_ratio * 100).toFixed(1)}%
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Stylistic emphasis
                </span>
              </div>
            </div>
          </div>

          {/* Section D: Plain-Language Interpretation */}
          <div className="glass-panel" style={{ padding: '1.75rem', marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <Brain size={20} style={{ color: 'var(--accent-primary)' }} />
              <h3 style={{ fontSize: '1.25rem' }}>Plain-Language Linguistic Synthesis</h3>
            </div>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-primary)', lineHeight: 1.6, background: 'rgba(255, 255, 255, 0.02)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              {analysis.guidance.interpretation}
            </p>
          </div>

          {/* Section E: Practical Wellbeing Next Steps */}
          <div className="glass-panel" style={{ padding: '1.75rem', marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <HeartHandshake size={20} style={{ color: 'var(--calm-color)' }} />
              <h3 style={{ fontSize: '1.25rem' }}>Practical, Proportionate Next Steps</h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              Concrete, non-coercive reflections connected to the detected linguistic signals. 
              These suggestions do not promise cures or replace professional support.
            </p>

            <div className="grid-2">
              {analysis.guidance.practical_suggestions.map((sug, idx) => (
                <div key={idx} style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                    <h4 style={{ fontSize: '0.975rem', color: 'var(--text-primary)' }}>{sug.title}</h4>
                    <span className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>{sug.category}</span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    {sug.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Section F: Verified 24/7 Crisis Support Resources */}
          <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: '4px solid var(--stress-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <PhoneCall size={20} style={{ color: 'var(--stress-color)' }} />
              <h3 style={{ fontSize: '1.15rem' }}>Verified Support &amp; Crisis Contacts</h3>
            </div>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              {analysis.guidance.support_advisory}
            </p>

            <div className="grid-2">
              {analysis.guidance.crisis_resources.map((res, i) => (
                <div key={i} style={{ padding: '0.75rem 1rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{res.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--stress-color)', marginTop: '0.15rem' }}>{res.contact}</div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
