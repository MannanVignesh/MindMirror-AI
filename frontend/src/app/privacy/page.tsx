'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Lock, 
  Trash2, 
  PhoneCall, 
  AlertTriangle, 
  CheckCircle2, 
  FileX,
  HeartPulse,
  Scale
} from 'lucide-react';

export default function PrivacyAndLimitationsPage() {
  const handleClearBrowserData = () => {
    if (confirm("Clear all MindMirror AI local reflection logs and session data from this browser?")) {
      try {
        localStorage.removeItem('mindmirror_daily_reflections');
        localStorage.removeItem('mindmirror_save_reflections_opt_in');
        sessionStorage.clear();
        alert("Local storage and session caches successfully cleared.");
      } catch {
        // fallback
      }
    }
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span className="badge badge-stress">Safety &amp; Ethical Guardrails</span>
          <span className="badge badge-neutral">Zero-Retention Policy</span>
        </div>
        <h1 className="page-title">Privacy, Responsible Use &amp; Limitations</h1>
        <p className="page-subtitle">
          MindMirror AI is committed to transparency, scientific integrity, zero unwarranted data retention, 
          and strict boundaries that prevent non-clinical NLP tools from being misused as diagnostic instruments.
        </p>
      </div>

      {/* Mandatory Prominent Non-Clinical Disclaimer */}
      <div className="disclaimer-banner" style={{ marginBottom: '2.5rem', padding: '1.5rem', borderLeft: '5px solid var(--warning-color)' }}>
        <ShieldAlert size={26} style={{ color: 'var(--warning-color)', flexShrink: 0, marginTop: '2px' }} />
        <div>
          <h2 style={{ fontSize: '1.15rem', color: 'var(--warning-color)', marginBottom: '0.4rem', fontWeight: 700 }}>
            Mandatory Disclaimer of Non-Clinical Intended Use
          </h2>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-primary)', lineHeight: 1.6 }}>
            &ldquo;MindMirror AI analyzes language patterns in the content you provide. It cannot determine a person&apos;s actual mental state 
            or diagnose a condition. Its results may be wrong or affected by context, domain, language, and text-extraction errors. 
            Use the insights as a starting point for reflection, not as a substitute for professional support.&rdquo;
          </p>
        </div>
      </div>

      {/* Strict Ethical Guardrails: What MindMirror AI Never Does */}
      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.35rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertTriangle size={20} style={{ color: 'var(--stress-color)' }} />
          <span>Strict Ethical Prohibitions &amp; System Guardrails</span>
        </h2>

        <div className="grid-2">
          <div style={{ background: 'rgba(244, 63, 94, 0.05)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(244, 63, 94, 0.2)' }}>
            <h3 style={{ fontSize: '0.95rem', color: 'var(--stress-color)', marginBottom: '0.35rem', fontWeight: 700 }}>
              &times; Never Diagnoses Mental Health Conditions
            </h3>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              The system never issues psychiatric diagnoses (such as Major Depressive Disorder, Generalized Anxiety Disorder, or PTSD). 
              Linguistic indicators reflect vocabulary similarity to forum benchmarks, not clinical pathologies.
            </p>
          </div>

          <div style={{ background: 'rgba(244, 63, 94, 0.05)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(244, 63, 94, 0.2)' }}>
            <h3 style={{ fontSize: '0.95rem', color: 'var(--stress-color)', marginBottom: '0.35rem', fontWeight: 700 }}>
              &times; Never Assumes Actual Mental State
            </h3>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              MindMirror AI analyzes surface text syntax, words, and phrases. It does not possess insight into a person&apos;s internal feelings, 
              psychological consciousness, or biological state.
            </p>
          </div>

          <div style={{ background: 'rgba(244, 63, 94, 0.05)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(244, 63, 94, 0.2)' }}>
            <h3 style={{ fontSize: '0.95rem', color: 'var(--stress-color)', marginBottom: '0.35rem', fontWeight: 700 }}>
              &times; Never Claims Explanations Prove Causation
            </h3>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Token and phrase occlusion identifies marginal score changes (&Delta;P) within the mathematical model. 
              Attributions reflect model sensitivity, not the underlying cause of an individual&apos;s personal situation.
            </p>
          </div>

          <div style={{ background: 'rgba(244, 63, 94, 0.05)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(244, 63, 94, 0.2)' }}>
            <h3 style={{ fontSize: '0.95rem', color: 'var(--stress-color)', marginBottom: '0.35rem', fontWeight: 700 }}>
              &times; Never Guarantees Prevention, Treatment, or Cure
            </h3>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Guidance suggestions are supportive, non-coercive reflective prompts (e.g., taking a short pause, organizing tasks). 
              The application never prescribes medication, therapeutic protocols, or promises clinical improvement.
            </p>
          </div>
        </div>
      </div>

      {/* Data Handling & Privacy Architecture */}
      <div className="grid-2" style={{ marginBottom: '2.5rem' }}>
        <div className="glass-panel" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
            <Lock size={20} style={{ color: 'var(--calm-color)' }} />
            <h2 style={{ fontSize: '1.25rem' }}>Zero Default Data Retention</h2>
          </div>

          <ul style={{ paddingLeft: '1.25rem', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <li>
              <strong>In-Memory Processing:</strong> Uploaded PDF files, screenshots, and images are processed in volatile memory. 
              Files are immediately released after text extraction without persistent server storage.
            </li>
            <li>
              <strong>No Production Logging of Text:</strong> Raw user text and extracted content are never written to production logs, 
              preventing unintentional leakage of confidential journals or private correspondence.
            </li>
            <li>
              <strong>Secure File Validation:</strong> File uploads undergo strict MIME verification, size limits (15MB), 
              and memory sanitization to prevent code execution vulnerabilities.
            </li>
          </ul>
        </div>

        {/* Client-Side Sovereignty */}
        <div className="glass-panel" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
            <ShieldCheck size={20} style={{ color: 'var(--accent-primary)' }} />
            <h2 style={{ fontSize: '1.25rem' }}>Client-Side Data Sovereignty</h2>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
            Daily reflections recorded in the optional journal workflow reside exclusively within your web browser&apos;s 
            <code>localStorage</code>. No reflection entries are ever sent to backend servers or analytics third parties.
          </p>

          <button
            onClick={handleClearBrowserData}
            className="btn btn-secondary"
            style={{ color: 'var(--stress-color)', borderColor: 'var(--stress-border)', fontSize: '0.85rem' }}
          >
            <Trash2 size={16} />
            <span>Clear Local Storage &amp; Session Caches</span>
          </button>
        </div>
      </div>

      {/* 24/7 Crisis Support Helplines */}
      <div className="glass-panel" style={{ padding: '2rem', borderLeft: '5px solid var(--stress-color)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <HeartPulse size={22} style={{ color: 'var(--stress-color)' }} />
          <h2 style={{ fontSize: '1.35rem' }}>Crisis Resources &amp; Professional Support</h2>
        </div>

        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.5 }}>
          If you or someone you know is in acute distress or needs urgent help, please reach out to one of the following 
          free, confidential 24/7 services or contact local emergency services immediately:
        </p>

        <div className="grid-2">
          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
              988 Suicide &amp; Crisis Lifeline (USA &amp; Canada)
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--stress-color)', fontWeight: 600, marginTop: '0.2rem' }}>
              Call or Text 988
            </div>
            <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              Available 24 hours a day, 7 days a week. Free, confidential, and multi-lingual.
            </div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
              Crisis Text Line
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--stress-color)', fontWeight: 600, marginTop: '0.2rem' }}>
              Text HOME to 741741 (USA / UK / Canada)
            </div>
            <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              Connect with a trained crisis counselor via SMS anytime.
            </div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
              Befrienders Worldwide
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--info-color)', fontWeight: 600, marginTop: '0.2rem' }}>
              www.befrienders.org
            </div>
            <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              Global directory of confidential emotional support centers in over 30 countries.
            </div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
              The Trevor Project (LGBTQ Youth)
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--stress-color)', fontWeight: 600, marginTop: '0.2rem' }}>
              Call 1-866-488-7386 or Text START to 678-678
            </div>
            <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              Specialized 24/7 crisis intervention and suicide prevention for LGBTQ young people.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
