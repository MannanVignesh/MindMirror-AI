'use client';

import React from 'react';
import Link from 'next/link';
import { 
  BookOpen, 
  FileCode, 
  Scale, 
  Cpu, 
  Layers, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight,
  Database,
  Calculator
} from 'lucide-react';

export default function MethodologyPage() {
  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span className="badge badge-info">Scientific Framework</span>
          <span className="badge badge-neutral">Reproducible Research</span>
        </div>
        <h1 className="page-title">Research Methodology &amp; Mathematical Formulation</h1>
        <p className="page-subtitle">
          Detailed documentation of data provenance, mathematical formulation of token occlusion attributions, 
          Platt scaling probability calibration, and experimental controls governing the MindMirror AI framework.
        </p>
      </div>

      {/* Main Research Contribution Overview */}
      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.4rem', marginBottom: '1rem' }}>
          Core Research Contributions
        </h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
          MindMirror AI introduces an explainable, multimodal text-analysis pipeline designed specifically for non-clinical 
          emotional and stress-related language signal reflection. The proposed system combines:
        </p>

        <div className="grid-2">
          <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <h3 style={{ fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <CheckCircle2 size={16} style={{ color: 'var(--calm-color)' }} />
              Multimodal Document Ingestion
            </h3>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Standardizes typed text, multi-page PDFs, and images into a single validated NLP pipeline. Employs embedded text extraction 
              with OCR fallback for scanned pages and EXIF orientation correction. Exposes an editable review preview to intercept recognition errors.
            </p>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <h3 style={{ fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <CheckCircle2 size={16} style={{ color: 'var(--calm-color)' }} />
              Platt-Calibrated Inference
            </h3>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Supervised binary classifier trained on the Dreaddit benchmark with 5-fold cross-validated Platt scaling (sigmoid), 
              achieving an Expected Calibration Error (ECE) of 0.0087 and preventing extreme overconfident probability estimates.
            </p>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <h3 style={{ fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <CheckCircle2 size={16} style={{ color: 'var(--calm-color)' }} />
              Model-Specific Occlusion Attribution
            </h3>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Calculates the exact marginal score change &#916; = P(full) - P(without phrase), strictly separating positive stress drivers 
              from mitigating protective signals without fabricating arbitrary attribution percentages.
            </p>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <h3 style={{ fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <CheckCircle2 size={16} style={{ color: 'var(--calm-color)' }} />
              Cross-Domain &amp; Ingestion Resilience
            </h3>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Empirical Leave-One-Community-Out (LOCO) evaluation across 10 subreddits and controlled noise degradation experiments 
              evaluating CER, WER, and label flip rates under realistic optical scanning artifacts.
            </p>
          </div>
        </div>
      </div>

      {/* Dataset Provenance */}
      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <Database size={22} style={{ color: 'var(--info-color)' }} />
          <h2 style={{ fontSize: '1.4rem' }}>Dataset Provenance: Dreaddit Benchmark</h2>
        </div>

        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
          MindMirror AI models are trained and validated on the Dreaddit dataset (Turcan &amp; McKeown, EMNLP 2019), 
          the established academic standard for stress analysis in social media discourse. The dataset encompasses 10 subreddits 
          stratified across 5 distinct domains:
        </p>

        <div className="table-wrapper" style={{ marginBottom: '1.5rem' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Domain Category</th>
                <th>Subreddits</th>
                <th>Underlying Sociolinguistic Stressor</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Mental Health</td>
                <td>r/anxiety, r/ptsd</td>
                <td>Somatic panic, intrusive memories, sleep disruption, hypervigilance</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Interpersonal</td>
                <td>r/relationships, r/survivorsofabuse</td>
                <td>Communication friction, stonewalling, boundary violations, psychological recovery</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Financial</td>
                <td>r/povertyfinance, r/almosthomeless, r/food_pantry</td>
                <td>Overdrafts, eviction notices, vehicle failures, emergency assistance</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Social Distress</td>
                <td>r/assistance, r/homeless</td>
                <td>Utility shutoffs, shelter access, safety concerns, dignity preservation</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>General Stress</td>
                <td>r/stress</td>
                <td>Workplace deadlines, cognitive overload, academic exhaustion</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Mathematical Formulations */}
      <div className="grid-2" style={{ marginBottom: '2.5rem' }}>
        {/* Occlusion Math */}
        <div className="glass-panel" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
            <Calculator size={20} style={{ color: '#ec4899' }} />
            <h3 style={{ fontSize: '1.2rem' }}>Token &amp; Phrase Occlusion Math</h3>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1rem' }}>
            For a text input <em>X = (t<sub>1</sub>, t<sub>2</sub>, ..., t<sub>n</sub>)</em> and binary stress class <em>Y &isin; &#123;0, 1&#125;</em>:
          </p>

          <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '1rem', borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: '#f43f5e', textAlign: 'center', marginBottom: '1rem' }}>
            &Delta;(t<sub>i</sub>) = P(Y = 1 | X) &minus; P(Y = 1 | X \ &#123;t<sub>i</sub>&#125;)
          </div>

          <ul style={{ paddingLeft: '1.25rem', fontSize: '0.825rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <li><strong>Positive Attribution (&Delta; &gt; 0):</strong> Omission reduces the stress score &rarr; token pushed model toward predicting stress.</li>
            <li><strong>Negative Attribution (&Delta; &lt; 0):</strong> Omission increases the stress score &rarr; token exercised a buffering or calming influence.</li>
            <li><strong>Stability Threshold:</strong> If max(|&Delta;|) &lt; 0.015, the explanation is flagged as <em>low contrast / inconclusive</em>.</li>
          </ul>
        </div>

        {/* Calibration Math */}
        <div className="glass-panel" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
            <Scale size={20} style={{ color: 'var(--calm-color)' }} />
            <h3 style={{ fontSize: '1.2rem' }}>Probability Calibration (Platt Scaling)</h3>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1rem' }}>
            Raw decision values <em>f(X)</em> are transformed into calibrated empirical probabilities via a learned logistic function:
          </p>

          <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '1rem', borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: 'var(--calm-color)', textAlign: 'center', marginBottom: '1rem' }}>
            P(Y = 1 | f) = 1 / [1 + exp(A &middot; f(X) + B)]
          </div>

          <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            Parameters <em>A</em> and <em>B</em> are estimated via maximum likelihood on held-out 5-fold validation folds to prevent in-sample overfitting. 
            Expected Calibration Error (ECE) is quantified by binning predictions into <em>M</em> equal intervals:
          </p>

          <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-accent)', textAlign: 'center', marginTop: '0.5rem' }}>
            ECE = &sum; (|B<sub>m</sub>| / N) &middot; |acc(B<sub>m</sub>) &minus; conf(B<sub>m</sub>)|
          </div>
        </div>
      </div>

      {/* Navigation Card */}
      <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Inspect Experimental Verification Data</div>
          <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>Review the exact Leave-One-Community-Out empirical numbers and OCR degradation benchmarks.</div>
        </div>
        <Link href="/cross-domain" className="btn btn-primary">
          <span>Go to Cross-Domain Benchmarks</span>
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
