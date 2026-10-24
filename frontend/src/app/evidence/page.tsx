'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Layers, 
  Info, 
  ArrowUpRight, 
  ArrowDownRight, 
  AlertTriangle, 
  CheckCircle2, 
  RotateCcw,
  Sparkles,
  Search,
  SlidersHorizontal,
  HelpCircle
} from 'lucide-react';
import { explainText } from '../../lib/api';
import { ExplanationResponse, AttributionItem, TokenMapItem } from '../../lib/types';

const DEFAULT_SAMPLE_TEXT = "I am completely overwhelmed by my thesis defense next week. I haven't slept properly in days and my chest feels tight every morning when I open my email. The constant pressure from my committee is suffocating and I feel totally paralyzed by intrusive doubts about failing.";

export default function EvidenceExplorerPage() {
  const [inputText, setInputText] = useState(DEFAULT_SAMPLE_TEXT);
  const [explanation, setExplanation] = useState<ExplanationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hoveredToken, setHoveredToken] = useState<TokenMapItem | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'positive' | 'negative'>('all');

  // Load from sessionStorage if available from previous analysis run
  useEffect(() => {
    try {
      const cachedText = sessionStorage.getItem('mindmirror_analyzed_text');
      const cachedExpl = sessionStorage.getItem('mindmirror_explanation');
      if (cachedText) {
        setInputText(cachedText);
      }
      if (cachedExpl) {
        setExplanation(JSON.parse(cachedExpl));
      } else {
        // Run initial explanation on default sample
        fetchExplanation(cachedText || DEFAULT_SAMPLE_TEXT);
      }
    } catch {
      fetchExplanation(DEFAULT_SAMPLE_TEXT);
    }
  }, []);

  const fetchExplanation = async (text: string) => {
    if (!text.trim()) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await explainText(text.trim());
      setExplanation(result);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to compute occlusion attributions';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompute = () => {
    fetchExplanation(inputText);
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span className="badge badge-info">Explainable AI</span>
          <span className="badge badge-stress">Token &amp; Phrase Occlusion</span>
        </div>
        <h1 className="page-title">Evidence Explorer</h1>
        <p className="page-subtitle">
          Isolate the exact words and phrases that materially influence the model&apos;s output using systematic 
          token and phrase occlusion. Observe how removing individual terms alters the calibrated stress probability.
        </p>
      </div>

      {/* Attribution Methodology Notice */}
      <div className="glass-panel" style={{ padding: '1.25rem 1.5rem', marginBottom: '2rem', borderLeft: '4px solid #ec4899' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
          <HelpCircle size={22} style={{ color: '#ec4899', flexShrink: 0, marginTop: '2px' }} />
          <div>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.25rem' }}>
              How Occlusion Attribution Works
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              For each word or phrase, the pipeline calculates &#916; = P(stress | full text) - P(stress | text without term). 
              A <strong>positive attribution (+&#916;)</strong> indicates that removing the word lowered the stress score, meaning the term 
              drove the model toward a stress classification. A <strong>negative attribution (-&#916;)</strong> indicates that removing the term 
              raised the stress score, reflecting a calming or mitigating signal.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Text Input Panel */}
      <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <label className="form-label">
            Supplied Text for Occlusion Analysis:
          </label>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Edit text to re-compute attributions in real time
          </span>
        </div>

        <textarea
          rows={4}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="form-textarea"
          style={{ width: '100%', marginBottom: '1rem', resize: 'vertical' }}
          placeholder="Enter text to analyze word attributions..."
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <button
            onClick={handleCompute}
            disabled={isLoading || !inputText.trim()}
            className="btn btn-primary"
          >
            <Sparkles size={16} />
            <span>{isLoading ? 'Computing Occlusion...' : 'Re-calculate Attributions'}</span>
          </button>

          {explanation && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span className="badge badge-neutral">
                Base Score: <strong>{explanation.base_score.toFixed(3)}</strong>
              </span>

              <span className={`badge ${
                explanation.stability_status === 'stable_contrast' ? 'badge-calm' : 
                explanation.stability_status === 'narrow_evidence' ? 'badge-warning' : 'badge-neutral'
              }`}>
                Stability: {explanation.stability_status.replace(/_/g, ' ')}
              </span>
            </div>
          )}
        </div>

        {error && (
          <div className="disclaimer-banner" style={{ marginTop: '1rem', borderColor: 'var(--stress-border)', color: 'var(--stress-color)' }}>
            <AlertTriangle size={16} />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Token Heatmap View */}
      {explanation && (
        <div className="glass-panel" style={{ padding: '1.75rem', marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
            <div>
              <h2 style={{ fontSize: '1.35rem' }}>Interactive Word Influence Map</h2>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                Hover over words to see their marginal impact (&#916;) on the model score.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.75rem' }}>
              <span className="badge badge-stress">Stress Driver (+&#916;)</span>
              <span className="badge badge-calm">Mitigating Driver (-&#916;)</span>
              <span className="badge badge-neutral">Neutral</span>
            </div>
          </div>

          {/* Interactive highlighted tokens rendering */}
          <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1.5rem', borderRadius: 'var(--radius-md)', lineHeight: 2.0, fontSize: '1.05rem', border: '1px solid var(--border-subtle)' }}>
            {explanation.token_map.map((token, idx) => {
              const delta = token.delta;
              let className = "occlusion-token";
              if (delta >= 0.06) className += " token-stress-high";
              else if (delta > 0.015) className += " token-stress-mid";
              else if (delta <= -0.06) className += " token-mitigating-high";
              else if (delta < -0.015) className += " token-mitigating-mid";

              return (
                <span
                  key={idx}
                  className={className}
                  onMouseEnter={() => setHoveredToken(token)}
                  onMouseLeave={() => setHoveredToken(null)}
                  style={{ cursor: delta !== 0 ? 'pointer' : 'default' }}
                >
                  {token.word}
                </span>
              );
            })}
          </div>

          {/* Hover details tooltip banner */}
          <div style={{ marginTop: '1rem', minHeight: '38px', padding: '0.5rem 1rem', background: 'rgba(255, 255, 255, 0.04)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem' }}>
            {hoveredToken && hoveredToken.delta !== 0 ? (
              <>
                <div>
                  Token: <strong>&ldquo;{hoveredToken.word}&rdquo;</strong> &bull; Marginal Contribution: 
                  <strong style={{ color: hoveredToken.delta > 0 ? 'var(--stress-color)' : 'var(--calm-color)', marginLeft: '0.35rem' }}>
                    {hoveredToken.delta > 0 ? `+${hoveredToken.delta.toFixed(4)}` : hoveredToken.delta.toFixed(4)}
                  </strong>
                </div>
                <div style={{ color: 'var(--text-muted)' }}>
                  {hoveredToken.delta > 0 ? "Pushed model toward stress detection" : "Mitigated or reduced stress detection"}
                </div>
              </>
            ) : (
              <span style={{ color: 'var(--text-muted)' }}>Hover over highlighted words above to inspect their attribution contribution.</span>
            )}
          </div>
        </div>
      )}

      {/* Structured Attributions Tables (Positive vs Negative) */}
      {explanation && (
        <div className="grid-2" style={{ marginBottom: '2.5rem' }}>
          {/* Positive Attributions */}
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
              <ArrowUpRight size={20} style={{ color: 'var(--stress-color)' }} />
              <h3 style={{ fontSize: '1.15rem' }}>Top Positive Stress Drivers (+&#916;)</h3>
              <span className="badge badge-stress" style={{ marginLeft: 'auto' }}>
                {explanation.positive_attributions.length} items
              </span>
            </div>

            {explanation.positive_attributions.length > 0 ? (
              <div className="table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Word / Phrase</th>
                      <th>Attribution (&#916;)</th>
                      <th>Score w/o Term</th>
                    </tr>
                  </thead>
                  <tbody>
                    {explanation.positive_attributions.map((item, idx) => (
                      <tr key={idx}>
                        <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                          &ldquo;{item.term}&rdquo; {item.is_phrase && <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>[phrase]</span>}
                        </td>
                        <td style={{ color: 'var(--stress-color)', fontWeight: 700 }}>
                          +{item.attribution_delta.toFixed(4)}
                        </td>
                        <td>
                          {item.score_without_term.toFixed(3)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                No significant positive stress-driving phrases were detected.
              </div>
            )}
          </div>

          {/* Negative (Mitigating) Attributions */}
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
              <ArrowDownRight size={20} style={{ color: 'var(--calm-color)' }} />
              <h3 style={{ fontSize: '1.15rem' }}>Mitigating / Protective Signals (-&#916;)</h3>
              <span className="badge badge-calm" style={{ marginLeft: 'auto' }}>
                {explanation.negative_attributions.length} items
              </span>
            </div>

            {explanation.negative_attributions.length > 0 ? (
              <div className="table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Word / Phrase</th>
                      <th>Attribution (&#916;)</th>
                      <th>Score w/o Term</th>
                    </tr>
                  </thead>
                  <tbody>
                    {explanation.negative_attributions.map((item, idx) => (
                      <tr key={idx}>
                        <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                          &ldquo;{item.term}&rdquo; {item.is_phrase && <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>[phrase]</span>}
                        </td>
                        <td style={{ color: 'var(--calm-color)', fontWeight: 700 }}>
                          {item.attribution_delta.toFixed(4)}
                        </td>
                        <td>
                          {item.score_without_term.toFixed(3)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                No mitigating or calming phrases were isolated in this passage.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Stability and Scientific Humility Statement */}
      {explanation && (
        <div className="glass-panel" style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.2rem' }}>
              Explanation Stability Assessment:
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              {explanation.stability_note}
            </div>
          </div>

          <Link href="/insights" className="btn btn-secondary">
            <span>Proceed to Emotional Insights</span>
            <ArrowUpRight size={16} />
          </Link>
        </div>
      )}
    </div>
  );
}
