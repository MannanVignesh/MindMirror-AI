'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  FileSearch, 
  Layers, 
  Activity, 
  CalendarHeart, 
  Network, 
  GitCompare, 
  BookOpen, 
  ShieldAlert, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck,
  Brain,
  Cpu,
  Eye,
  FileText
} from 'lucide-react';

export default function OverviewPage() {
  return (
    <div className="page-container">
      {/* Hero Section */}
      <div style={{ textAlign: 'center', marginBottom: '3.5rem', paddingTop: '1rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <span className="badge badge-info">Multimodal NLP Framework</span>
          <span className="badge badge-calm">Explainable AI</span>
          <span className="badge badge-neutral">Non-Clinical Research</span>
        </div>

        <h1 style={{ fontSize: '2.75rem', fontWeight: 800, lineHeight: 1.15, marginBottom: '1.25rem', maxWidth: '980px', margin: '0 auto 1.25rem' }}>
          MindMirror AI: Explainable Multimodal NLP for Everyday Emotional Wellbeing Signal Analysis
        </h1>

        <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', maxWidth: '820px', margin: '0 auto 2rem', lineHeight: 1.6 }}>
          An integrated text-analysis and wellbeing-reflection research tool. Ingests content from typed text, PDF documents, 
          and screenshots, extracts linguistic signals with calibrated probability models, pinpoints influential phrases via token occlusion, 
          and offers transparent, non-clinical reflection guidance.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <Link href="/analyze" className="btn btn-primary" style={{ padding: '0.8rem 1.75rem', fontSize: '1rem' }}>
            <span>Analyze Text or Document</span>
            <ArrowRight size={18} />
          </Link>
          <Link href="/methodology" className="btn btn-secondary" style={{ padding: '0.8rem 1.5rem', fontSize: '1rem' }}>
            <BookOpen size={18} />
            <span>Research Methodology</span>
          </Link>
        </div>
      </div>

      {/* Prominent Mandatory Safety Disclaimer */}
      <div className="disclaimer-banner" style={{ marginBottom: '3rem' }}>
        <ShieldAlert size={24} style={{ color: 'var(--warning-color)', flexShrink: 0, marginTop: '2px' }} />
        <div>
          <strong style={{ fontSize: '0.95rem' }}>Non-Diagnostic Scientific Boundary:</strong>
          <p style={{ marginTop: '0.25rem' }}>
            MindMirror AI analyzes language patterns in the content you provide. It cannot determine a person&apos;s actual mental state 
            or diagnose a condition. Its results may be wrong or affected by context, domain, language, and text-extraction errors. 
            Use the insights as a starting point for reflection, not as a substitute for professional support.
          </p>
        </div>
      </div>

      {/* Validated Research Metrics Highlights */}
      <div className="grid-4" style={{ marginBottom: '3.5rem' }}>
        <div className="stat-card glass-panel-hover">
          <span className="stat-label">Cross-Domain Macro-F1</span>
          <span className="stat-value" style={{ color: 'var(--calm-color)' }}>94.15%</span>
          <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>LOCO tested across 10 subreddits</span>
        </div>

        <div className="stat-card glass-panel-hover">
          <span className="stat-label">Calibration Error (ECE)</span>
          <span className="stat-value" style={{ color: 'var(--info-color)' }}>0.0087</span>
          <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>Platt Scaling 5-fold cross-validation</span>
        </div>

        <div className="stat-card glass-panel-hover">
          <span className="stat-label">Ingestion Modalities</span>
          <span className="stat-value" style={{ color: 'var(--text-accent)' }}>4 Sources</span>
          <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>Typed Text, PDF, Screenshot, Photos</span>
        </div>

        <div className="stat-card glass-panel-hover">
          <span className="stat-label">Attribution Method</span>
          <span className="stat-value" style={{ color: '#ec4899' }}>Occlusion</span>
          <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>Direct phrase delta calculation</span>
        </div>
      </div>

      {/* Architecture & Pipeline Flow */}
      <div className="glass-panel" style={{ padding: '2.25rem', marginBottom: '3.5rem' }}>
        <div style={{ marginBottom: '1.75rem', textAlign: 'center' }}>
          <span className="badge badge-info" style={{ marginBottom: '0.5rem' }}>System Architecture</span>
          <h2 style={{ fontSize: '1.85rem' }}>The Explainable Multimodal Pipeline</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            All inputs pass through identical validated text-analysis and attribution pipelines without fabrication.
          </p>
        </div>

        <div className="grid-3">
          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <div style={{ background: 'rgba(99, 102, 241, 0.2)', padding: '0.5rem', borderRadius: 'var(--radius-sm)', color: '#818cf8' }}>
                <FileText size={20} />
              </div>
              <h3 style={{ fontSize: '1.1rem' }}>1. Multimodal Ingestion</h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Parses embedded PDF text with scanned-page OCR fallback. Ingests PNG/JPG/WebP images with EXIF orientation correction, 
              reporting OCR confidence and exposing an editable preview to catch extraction errors.
            </p>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <div style={{ background: 'rgba(6, 182, 212, 0.2)', padding: '0.5rem', borderRadius: 'var(--radius-sm)', color: '#22d3ee' }}>
                <Cpu size={20} />
              </div>
              <h3 style={{ fontSize: '1.1rem' }}>2. Calibrated NLP Inference</h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Executes supervised binary stress classification trained on Dreaddit benchmarks with Platt Sigmoid probability calibration. 
              Outputs text-level scores with honest uncertainty bounds, distinct from separate emotion classifiers.
            </p>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <div style={{ background: 'rgba(244, 63, 94, 0.2)', padding: '0.5rem', borderRadius: 'var(--radius-sm)', color: '#fb7185' }}>
                <Eye size={20} />
              </div>
              <h3 style={{ fontSize: '1.1rem' }}>3. Evidence Attribution</h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Occludes candidate tokens and phrases systematically to measure the marginal delta &#916; = P(full) - P(without term). 
              Explicitly distinguishes positive stress drivers from negative mitigating signals with stability checks.
            </p>
          </div>
        </div>
      </div>

      {/* Workspace Pages Grid */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.75rem', marginBottom: '1.25rem' }}>Application Modules & Research Pages</h2>
        <div className="grid-3">
          <Link href="/analyze" className="glass-panel glass-panel-hover" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <FileSearch size={24} style={{ color: '#818cf8' }} />
              <ArrowRight size={16} style={{ color: 'var(--text-muted)' }} />
            </div>
            <h3 style={{ fontSize: '1.15rem' }}>Analyze Text or Document</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Unified ingestion for typed text, multi-page PDFs, and screenshots with editable preview and real OCR.
            </p>
          </Link>

          <Link href="/evidence" className="glass-panel glass-panel-hover" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Layers size={24} style={{ color: '#ec4899' }} />
              <ArrowRight size={16} style={{ color: 'var(--text-muted)' }} />
            </div>
            <h3 style={{ fontSize: '1.15rem' }}>Evidence Explorer</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Interactive token heatmap and phrase-level occlusion tables showing positive and mitigating linguistic attributions.
            </p>
          </Link>

          <Link href="/insights" className="glass-panel glass-panel-hover" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Activity size={24} style={{ color: 'var(--calm-color)' }} />
              <ArrowRight size={16} style={{ color: 'var(--text-muted)' }} />
            </div>
            <h3 style={{ fontSize: '1.15rem' }}>Emotional-Language Insights</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Calibrated text stress score, 7-emotion breakdown, explicit linguistic features, plain language interpretation, and next steps.
            </p>
          </Link>

          <Link href="/reflection" className="glass-panel glass-panel-hover" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <CalendarHeart size={24} style={{ color: '#f59e0b' }} />
              <ArrowRight size={16} style={{ color: 'var(--text-muted)' }} />
            </div>
            <h3 style={{ fontSize: '1.15rem' }}>Daily Reflection (Optional)</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Self-reported mood & perceived stress journal with client-side localStorage privacy and genuine trend logging.
            </p>
          </Link>

          <Link href="/cross-domain" className="glass-panel glass-panel-hover" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Network size={24} style={{ color: '#06b6d4' }} />
              <ArrowRight size={16} style={{ color: 'var(--text-muted)' }} />
            </div>
            <h3 style={{ fontSize: '1.15rem' }}>Cross-Domain Evaluation</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Leave-One-Community-Out benchmarks across 10 subreddits, confusion matrices, and the OCR noise degradation experiment.
            </p>
          </Link>

          <Link href="/models" className="glass-panel glass-panel-hover" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <GitCompare size={24} style={{ color: '#8b5cf6' }} />
              <ArrowRight size={16} style={{ color: 'var(--text-muted)' }} />
            </div>
            <h3 style={{ fontSize: '1.15rem' }}>Model Comparison</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Calibrated Logistic Regression baseline vs fine-tuned transformer with reliability calibration diagrams and Brier loss.
            </p>
          </Link>

          <Link href="/methodology" className="glass-panel glass-panel-hover" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <BookOpen size={24} style={{ color: '#38bdf8' }} />
              <ArrowRight size={16} style={{ color: 'var(--text-muted)' }} />
            </div>
            <h3 style={{ fontSize: '1.15rem' }}>Research Methodology</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Data provenance of the Dreaddit corpus, occlusion mathematics, probability calibration protocol, and experimental controls.
            </p>
          </Link>

          <Link href="/privacy" className="glass-panel glass-panel-hover" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <ShieldCheck size={24} style={{ color: '#10b981' }} />
              <ArrowRight size={16} style={{ color: 'var(--text-muted)' }} />
            </div>
            <h3 style={{ fontSize: '1.15rem' }}>Privacy, Safety & Limitations</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Zero-retention data policy, safety guardrails, non-clinical constraints, and 24/7 crisis resource contacts.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
