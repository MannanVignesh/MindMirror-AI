import React from 'react';
import Link from 'next/link';
import { ShieldCheck, HeartPulse, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="app-footer">
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div className="disclaimer-banner" style={{ textAlign: 'left' }}>
          <ShieldCheck size={20} style={{ color: 'var(--warning-color)', flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong>Research & Safety Notice:</strong> MindMirror AI analyzes observable language patterns in supplied content. 
            It cannot determine an author's actual internal mental state, diagnose a psychological condition, or replace qualified medical care. 
            All insights are intended as supportive, non-coercive reflective aids.
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
            <HeartPulse size={16} style={{ color: 'var(--stress-color)' }} />
            <span>MindMirror AI Framework &copy; 2026. Explainable Multimodal NLP for Everyday Wellbeing Signal Analysis.</span>
          </div>

          <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.825rem' }}>
            <Link href="/privacy" style={{ color: 'var(--text-secondary)' }}>Responsible Use & Limitations</Link>
            <Link href="/methodology" style={{ color: 'var(--text-secondary)' }}>Research Methodology</Link>
            <Link href="/cross-domain" style={{ color: 'var(--text-secondary)' }}>Cross-Domain Benchmarks</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
