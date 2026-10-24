'use client';

import React, { useState, useEffect } from 'react';
import { 
  Network, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  BarChart2, 
  Layers, 
  Eye, 
  Info,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { getCrossDomainEvaluation, getOcrEvaluation } from '../../lib/api';
import { CrossDomainResponse, OcrQualityResponse, CommunityResult } from '../../lib/types';

export default function CrossDomainEvaluationPage() {
  const [crossDomainData, setCrossDomainData] = useState<CrossDomainResponse | null>(null);
  const [ocrData, setOcrData] = useState<OcrQualityResponse | null>(null);
  const [selectedCommunity, setSelectedCommunity] = useState<string | null>('anxiety');
  const [activeTab, setActiveTab] = useState<'loco' | 'ocr'>('loco');

  useEffect(() => {
    getCrossDomainEvaluation().then(setCrossDomainData);
    getOcrEvaluation().then(setOcrData);
  }, []);

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span className="badge badge-info">Empirical NLP Research</span>
          <span className="badge badge-calm">Dreaddit Benchmark</span>
        </div>
        <h1 className="page-title">Cross-Domain Evaluation Suite</h1>
        <p className="page-subtitle">
          Rigorous Leave-One-Community-Out (LOCO) cross-domain validation across 10 subreddits and 5 domains, 
          alongside empirical OCR ingestion degradation experiments measuring the impact of recognition errors on model certainty.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem' }}>
        <button
          onClick={() => setActiveTab('loco')}
          className={`btn ${activeTab === 'loco' ? 'btn-primary' : 'btn-secondary'}`}
        >
          <Network size={16} />
          <span>Leave-One-Community-Out (LOCO) Validation</span>
        </button>
        <button
          onClick={() => setActiveTab('ocr')}
          className={`btn ${activeTab === 'ocr' ? 'btn-primary' : 'btn-secondary'}`}
        >
          <Eye size={16} />
          <span>OCR Ingestion Quality Degradation Experiment</span>
        </button>
      </div>

      {activeTab === 'loco' && crossDomainData && (
        <>
          {/* High-level Summary Metrics */}
          <div className="grid-4" style={{ marginBottom: '2.5rem' }}>
            <div className="stat-card glass-panel-hover">
              <span className="stat-label">Cross-Domain Macro-F1</span>
              <span className="stat-value" style={{ color: 'var(--calm-color)' }}>
                {(crossDomainData.overall_macro_f1 * 100).toFixed(2)}%
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Leave-One-Community-Out
              </span>
            </div>

            <div className="stat-card glass-panel-hover">
              <span className="stat-label">Overall Accuracy</span>
              <span className="stat-value" style={{ color: 'var(--info-color)' }}>
                {(crossDomainData.overall_accuracy * 100).toFixed(2)}%
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {crossDomainData.total_evaluated_samples} evaluated posts
              </span>
            </div>

            <div className="stat-card glass-panel-hover">
              <span className="stat-label">Overall Precision</span>
              <span className="stat-value" style={{ color: 'var(--text-accent)' }}>
                {(crossDomainData.overall_precision * 100).toFixed(2)}%
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Stress class precision
              </span>
            </div>

            <div className="stat-card glass-panel-hover">
              <span className="stat-label">Overall Recall</span>
              <span className="stat-value" style={{ color: '#ec4899' }}>
                {(crossDomainData.overall_recall * 100).toFixed(2)}%
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Sensitivity across held-out domains
              </span>
            </div>
          </div>

          {/* Aggregate Confusion Matrix & Protocol */}
          <div className="grid-2" style={{ marginBottom: '2.5rem' }}>
            <div className="glass-panel" style={{ padding: '1.75rem' }}>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>
                Overall Cross-Domain Confusion Matrix
              </h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                Aggregated across all 10 held-out iterations (N = {crossDomainData.total_evaluated_samples}).
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', maxWidth: '380px', margin: '0 auto' }}>
                <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '1.25rem', borderRadius: 'var(--radius-md)', textAlign: 'center', border: '1px solid var(--calm-border)' }}>
                  <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--calm-color)', fontWeight: 600 }}>True Negative (TN)</div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>{crossDomainData.overall_confusion_matrix.tn}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Correct Non-Stress</div>
                </div>

                <div style={{ background: 'rgba(244, 63, 94, 0.08)', padding: '1.25rem', borderRadius: 'var(--radius-md)', textAlign: 'center', border: '1px solid rgba(244, 63, 94, 0.3)' }}>
                  <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--stress-color)', fontWeight: 600 }}>False Positive (FP)</div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>{crossDomainData.overall_confusion_matrix.fp}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Over-predicted Stress</div>
                </div>

                <div style={{ background: 'rgba(244, 63, 94, 0.08)', padding: '1.25rem', borderRadius: 'var(--radius-md)', textAlign: 'center', border: '1px solid rgba(244, 63, 94, 0.3)' }}>
                  <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--stress-color)', fontWeight: 600 }}>False Negative (FN)</div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>{crossDomainData.overall_confusion_matrix.fn}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Missed Stress Signal</div>
                </div>

                <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '1.25rem', borderRadius: 'var(--radius-md)', textAlign: 'center', border: '1px solid var(--calm-border)' }}>
                  <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--calm-color)', fontWeight: 600 }}>True Positive (TP)</div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>{crossDomainData.overall_confusion_matrix.tp}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Correct Stress Detected</div>
                </div>
              </div>
            </div>

            {/* Protocol description */}
            <div className="glass-panel" style={{ padding: '1.75rem' }}>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>
                Leave-One-Community-Out Methodology
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1rem' }}>
                Standard train/test splits overestimate model generalization if text from the same online community is present in both sets. 
                In this LOCO experiment:
              </p>
              <ul style={{ paddingLeft: '1.25rem', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <li>For each of the 10 subreddits, the model is trained strictly on the remaining 9 communities.</li>
                <li>The held-out 10th community serves as the unseen domain test set.</li>
                <li>This ensures the classifier learns transferable stress language markers rather than subreddit-specific colloquialisms.</li>
                <li>Macro-F1, Precision, Recall, and Confusion Matrices are computed for each iteration.</li>
              </ul>
            </div>
          </div>

          {/* Per-Community Results Table */}
          <div className="glass-panel" style={{ padding: '1.75rem', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.35rem', marginBottom: '1rem' }}>
              Per-Subreddit Cross-Domain Performance Breakdown
            </h2>

            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Community (Subreddit)</th>
                    <th>Domain</th>
                    <th>Sample Count</th>
                    <th>Macro-F1</th>
                    <th>Accuracy</th>
                    <th>Precision</th>
                    <th>Recall</th>
                    <th>Confusion Matrix (TN / FP / FN / TP)</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.values(crossDomainData.per_community).map((c: CommunityResult) => (
                    <tr
                      key={c.community}
                      onClick={() => setSelectedCommunity(c.community)}
                      style={{ cursor: 'pointer', background: selectedCommunity === c.community ? 'rgba(99, 102, 241, 0.08)' : undefined }}
                    >
                      <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                        r/{c.community}
                      </td>
                      <td>
                        <span className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>
                          {c.domain.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td>{c.sample_count}</td>
                      <td style={{ fontWeight: 700, color: 'var(--calm-color)' }}>
                        {(c.macro_f1 * 100).toFixed(2)}%
                      </td>
                      <td>{(c.accuracy * 100).toFixed(2)}%</td>
                      <td>{(c.precision * 100).toFixed(2)}%</td>
                      <td>{(c.recall * 100).toFixed(2)}%</td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
                        [{c.confusion_matrix.tn}, {c.confusion_matrix.fp}, {c.confusion_matrix.fn}, {c.confusion_matrix.tp}]
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* OCR Degradation Quality Experiment Tab */}
      {activeTab === 'ocr' && ocrData && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="glass-panel" style={{ padding: '1.75rem' }}>
            <h2 style={{ fontSize: '1.35rem', marginBottom: '0.5rem' }}>
              OCR Ingestion Quality &amp; Classification Resilience Experiment
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', maxWidth: '850px' }}>
              To test the multimodal pipeline realistically, we simulated real-world OCR noise patterns 
              (character substitutions like &lsquo;l&rsquo;&rarr;&lsquo;1&rsquo;, dropped punctuation, scanner artifacts) across reference transcripts 
              to measure Character Error Rate (CER), Word Error Rate (WER), and resulting prediction probability shift (&#916;P).
            </p>

            <div className="table-wrapper" style={{ marginBottom: '1.5rem' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Degradation Tier</th>
                    <th>Simulated Noise Rate</th>
                    <th>Mean CER</th>
                    <th>Mean WER</th>
                    <th>Mean Score Shift (&#916;P)</th>
                    <th>Label Flip Rate (%)</th>
                    <th>Degraded Accuracy</th>
                    <th>Clean Accuracy</th>
                  </tr>
                </thead>
                <tbody>
                  {ocrData.degradation_tiers.map((tier, idx) => (
                    <tr key={idx}>
                      <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                        {tier.noise_level_label}
                      </td>
                      <td>{(tier.simulated_error_rate * 100).toFixed(0)}%</td>
                      <td style={{ fontFamily: 'var(--font-mono)' }}>{(tier.mean_cer * 100).toFixed(2)}%</td>
                      <td style={{ fontFamily: 'var(--font-mono)' }}>{(tier.mean_wer * 100).toFixed(2)}%</td>
                      <td style={{ fontWeight: 700, color: 'var(--warning-color)' }}>
                        &#177;{tier.mean_score_shift.toFixed(3)}
                      </td>
                      <td style={{ fontWeight: 700, color: tier.label_flip_rate > 0.08 ? 'var(--stress-color)' : 'var(--text-primary)' }}>
                        {(tier.label_flip_rate * 100).toFixed(1)}%
                      </td>
                      <td style={{ color: 'var(--calm-color)' }}>{(tier.degraded_accuracy * 100).toFixed(1)}%</td>
                      <td>{(tier.clean_accuracy * 100).toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Scientific Conclusions */}
            <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <CheckCircle2 size={16} style={{ color: 'var(--calm-color)' }} />
                Empirical Research Findings
              </h3>
              <ul style={{ paddingLeft: '1.25rem', fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                {ocrData.conclusions.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Paired Clean vs Degraded Text Comparisons */}
          <div className="glass-panel" style={{ padding: '1.75rem' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>
              Paired Text Comparison: Clean vs. Degraded OCR Text
            </h2>

            <div className="grid-2">
              {ocrData.paired_examples.map((item, idx) => (
                <div key={idx} style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>Sample #{idx + 1}</span>
                    <span className={`badge ${item.label_flipped ? 'badge-stress' : 'badge-calm'}`}>
                      {item.label_flipped ? 'Label Flipped!' : 'Consistent Prediction'}
                    </span>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--calm-color)', marginBottom: '0.2rem' }}>
                      Clean Reference Text (Score: {item.clean_score.toFixed(3)}):
                    </div>
                    <div style={{ fontSize: '0.825rem', color: 'var(--text-primary)', fontStyle: 'italic', background: 'rgba(0,0,0,0.2)', padding: '0.5rem', borderRadius: 'var(--radius-sm)' }}>
                      &ldquo;{item.clean_text}&rdquo;
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--warning-color)', marginBottom: '0.2rem' }}>
                      Degraded OCR Text (Score: {item.ocr_score.toFixed(3)}, &#916; = {item.score_delta.toFixed(3)}):
                    </div>
                    <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', fontStyle: 'italic', background: 'rgba(0,0,0,0.2)', padding: '0.5rem', borderRadius: 'var(--radius-sm)' }}>
                      &ldquo;{item.ocr_text}&rdquo;
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
