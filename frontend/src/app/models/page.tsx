'use client';

import React, { useState, useEffect } from 'react';
import { 
  GitCompare, 
  Cpu, 
  CheckCircle2, 
  AlertTriangle, 
  Zap, 
  BarChart3, 
  HelpCircle,
  Scale
} from 'lucide-react';
import { getModelComparison } from '../../lib/api';
import { ModelComparisonResponse, ModelBenchmarkItem } from '../../lib/types';

export default function ModelComparisonPage() {
  const [data, setData] = useState<ModelComparisonResponse | null>(null);

  useEffect(() => {
    getModelComparison().then(setData);
  }, []);

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span className="badge badge-info">Model Benchmarks</span>
          <span className="badge badge-calm">Probability Calibration</span>
        </div>
        <h1 className="page-title">Model Comparison &amp; Calibration</h1>
        <p className="page-subtitle">
          Direct comparative analysis between the Calibrated TF-IDF + Logistic Regression baseline, 
          fine-tuned contextual transformer architecture, and uncalibrated models, emphasizing calibration reliability and inference efficiency.
        </p>
      </div>

      {data && (
        <>
          {/* Models Comparative Grid */}
          <div className="grid-3" style={{ marginBottom: '2.5rem' }}>
            {data.models.map((model) => (
              <div 
                key={model.id}
                className="glass-panel glass-panel-hover" 
                style={{ 
                  padding: '1.75rem', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  borderTop: model.id === 'tfidf_logreg_baseline' ? '3px solid var(--calm-color)' : model.id === 'transformer_fine_tuned' ? '3px solid #8b5cf6' : '3px solid var(--warning-color)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <span className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>{model.type}</span>
                  {model.id === 'tfidf_logreg_baseline' && (
                    <span className="badge badge-calm" style={{ fontSize: '0.7rem' }}>Active Model</span>
                  )}
                </div>

                <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', minHeight: '52px' }}>
                  {model.name}
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem', marginBottom: '1.25rem', fontSize: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Macro-F1 Score:</span>
                    <strong style={{ color: 'var(--calm-color)', fontSize: '0.95rem' }}>{(model.macro_f1 * 100).toFixed(2)}%</strong>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Accuracy:</span>
                    <strong>{(model.accuracy * 100).toFixed(2)}%</strong>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Expected Calibration Error (ECE):</span>
                    <strong style={{ color: model.expected_calibration_error < 0.03 ? 'var(--calm-color)' : 'var(--warning-color)' }}>
                      {model.expected_calibration_error.toFixed(4)}
                    </strong>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Brier Score Loss:</span>
                    <strong>{model.brier_score.toFixed(4)}</strong>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Inference Latency:</span>
                    <strong style={{ color: 'var(--text-accent)' }}>~{model.inference_latency_ms} ms</strong>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Parameter Scale:</span>
                    <span>{model.parameter_count}</span>
                  </div>
                </div>

                <div style={{ marginTop: 'auto', background: 'rgba(255, 255, 255, 0.02)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  <strong>Calibration Method:</strong> {model.calibration_method}
                </div>
              </div>
            ))}
          </div>

          {/* Calibration Curve / Reliability Diagram */}
          <div className="grid-2" style={{ alignItems: 'start', marginBottom: '2.5rem' }}>
            <div className="glass-panel" style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
                <h2 style={{ fontSize: '1.25rem' }}>Reliability Calibration Diagram</h2>
                <span className="badge badge-info">Platt Sigmoid 5-Fold</span>
              </div>

              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                Compares mean predicted probability against actual fraction of positive stress labels across bins.
              </p>

              {/* Visual Reliability Curve SVG */}
              <div style={{ background: 'rgba(0, 0, 0, 0.25)', padding: '1.25rem', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                <svg viewBox="0 0 320 220" style={{ width: '100%', height: '220px', overflow: 'visible' }}>
                  {/* Grid Lines */}
                  <line x1="40" y1="20" x2="300" y2="20" stroke="rgba(255,255,255,0.06)" />
                  <line x1="40" y1="65" x2="300" y2="65" stroke="rgba(255,255,255,0.06)" />
                  <line x1="40" y1="110" x2="300" y2="110" stroke="rgba(255,255,255,0.06)" />
                  <line x1="40" y1="155" x2="300" y2="155" stroke="rgba(255,255,255,0.06)" />
                  <line x1="40" y1="200" x2="300" y2="200" stroke="rgba(255,255,255,0.15)" />

                  <line x1="40" y1="20" x2="40" y2="200" stroke="rgba(255,255,255,0.15)" />
                  <line x1="105" y1="20" x2="105" y2="200" stroke="rgba(255,255,255,0.06)" />
                  <line x1="170" y1="20" x2="170" y2="200" stroke="rgba(255,255,255,0.06)" />
                  <line x1="235" y1="20" x2="235" y2="200" stroke="rgba(255,255,255,0.06)" />
                  <line x1="300" y1="20" x2="300" y2="200" stroke="rgba(255,255,255,0.06)" />

                  {/* Ideal Diagonal Line (Perfect Calibration y = x) */}
                  <line x1="40" y1="200" x2="300" y2="20" stroke="rgba(255,255,255,0.3)" strokeDasharray="4" strokeWidth="1.5" />

                  {/* Calibrated Model Curve Points */}
                  {(() => {
                    const curve = data.calibration_analysis.curve;
                    const pts = curve.prob_pred.map((p, i) => {
                      const t = curve.prob_true[i];
                      const x = 40 + p * 260;
                      const y = 200 - t * 180;
                      return `${x},${y}`;
                    }).join(' ');

                    return (
                      <>
                        <polyline fill="none" stroke="var(--calm-color)" strokeWidth="2.5" points={pts} />
                        {curve.prob_pred.map((p, i) => {
                          const t = curve.prob_true[i];
                          const x = 40 + p * 260;
                          const y = 200 - t * 180;
                          return <circle key={i} cx={x} cy={y} r="4" fill="var(--calm-color)" />;
                        })}
                      </>
                    );
                  })()}

                  {/* Axis Labels */}
                  <text x="170" y="218" fill="var(--text-muted)" fontSize="10" textAnchor="middle">Mean Predicted Score</text>
                  <text x="18" y="110" fill="var(--text-muted)" fontSize="10" textAnchor="middle" transform="rotate(-90 18 110)">Fraction of Positives</text>
                </svg>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', fontSize: '0.75rem', marginTop: '0.5rem', color: 'var(--text-secondary)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <div style={{ width: '12px', height: '2px', background: 'var(--calm-color)' }} />
                    Calibrated Classifier (Platt Sigmoid)
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <div style={{ width: '12px', height: '2px', borderTop: '2px dashed rgba(255,255,255,0.4)' }} />
                    Perfect Calibration (y = x)
                  </span>
                </div>
              </div>
            </div>

            {/* Why Calibration Matters for Wellbeing Signal Analysis */}
            <div className="glass-panel" style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
                <Scale size={20} style={{ color: 'var(--info-color)' }} />
                <h2 style={{ fontSize: '1.25rem' }}>Why Calibration Matters in Wellbeing NLP</h2>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                <p>
                  In high-stakes text domains relating to stress, uncalibrated models often produce extreme overconfident probabilities 
                  (clustering unnaturally close to 0.0 or 1.0) despite modest actual confidence.
                </p>

                <p>
                  <strong>Platt Scaling (Sigmoid 5-Fold Cross-Validation)</strong> maps raw log-odds outputs to empirical probabilities on held-out data. 
                  When MindMirror AI reports a score of <strong>0.70</strong>, it means that among benchmark texts receiving that score, 
                  approximately 70% genuinely exhibit validated stress indicators.
                </p>

                <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                    Evaluation Metrics Definitions:
                  </div>
                  <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                    <li><strong>ECE (Expected Calibration Error):</strong> Weighted average difference between predicted confidence and observed accuracy. Lower is better.</li>
                    <li><strong>Brier Score:</strong> Mean squared difference between predicted probability and actual binary label. Measures calibration and discrimination simultaneously.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
