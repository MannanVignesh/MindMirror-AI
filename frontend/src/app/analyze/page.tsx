'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { 
  Upload, 
  FileText, 
  Image as ImageIcon, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  RotateCcw, 
  Sliders, 
  Info,
  ShieldAlert,
  Layers,
  Activity
} from 'lucide-react';
import { extractContent, analyzeText, explainText } from '../../lib/api';
import { 
  ExtractionResult, 
  AnalysisResponse, 
  ExplanationResponse, 
  ContextType 
} from '../../lib/types';

const SAMPLE_PRESETS = [
  {
    name: "Overwhelmed Graduate Student",
    context: "work_academic" as ContextType,
    text: "I am completely overwhelmed by my thesis defense next week. I haven't slept properly in days and my chest feels tight every morning when I open my email. The constant pressure from my committee is suffocating and I feel totally paralyzed by intrusive doubts about failing."
  },
  {
    name: "Grounding Morning Reflection",
    context: "personal_journal" as ContextType,
    text: "Woke up early and brewed a warm cup of coffee before the household got busy. Taking twenty minutes to read and practice slow breathing helped clear the morning fog. Focusing on one manageable task at a time today."
  },
  {
    name: "Financial Strain & Emergency",
    context: "personal_journal" as ContextType,
    text: "My car transmission failed on the highway today and the repair estimate is $1,400. My savings account is empty and rent is due on Friday. I have been shaking with panic and crying in the parking lot because I have no idea how I will survive this month."
  },
  {
    name: "Workplace Burnout Excerpt",
    context: "work_academic" as ContextType,
    text: "Working 70 hours a week between corporate deliverables and urgent client escalations has pushed me to utter exhaustion. I am waking up with intense tension headaches and severe nausea. Everything feels like an insurmountable uphill battle."
  }
];

export default function AnalyzePage() {
  const [activeTab, setActiveTab] = useState<'upload' | 'text'>('upload');
  const [textInput, setTextInput] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [context, setContext] = useState<ContextType>('unsure');

  // Extraction State
  const [extractionResult, setExtractionResult] = useState<ExtractionResult | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionError, setExtractionError] = useState<string | null>(null);

  // Analysis State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null);
  const [explanationResult, setExplanationResult] = useState<ExplanationResponse | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    setSelectedFile(file);
    setExtractionError(null);
    setIsExtracting(true);
    setAnalysisResult(null);
    setExplanationResult(null);

    try {
      const result = await extractContent(file);
      setExtractionResult(result);
      setTextInput(result.extracted_text);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'File extraction failed';
      setExtractionError(msg);
    } finally {
      setIsExtracting(false);
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setTextInput(val);
    if (!extractionResult || extractionResult.source_type === 'typed_text') {
      const words = val.trim() ? val.trim().split(/\s+/).length : 0;
      setExtractionResult({
        source_type: 'typed_text',
        extracted_text: val,
        page_count: 1,
        word_count: words,
        char_count: val.length,
        ocr_applied: false,
        ocr_confidence: null,
        warnings: words < 5 && words > 0 ? ["Text is brief (< 5 words). Classification confidence may be limited."] : [],
        status: words > 0 ? 'success' : 'warning'
      });
    } else {
      // User edited OCR/PDF text
      setExtractionResult({
        ...extractionResult,
        extracted_text: val,
        word_count: val.trim() ? val.trim().split(/\s+/).length : 0,
        char_count: val.length
      });
    }
  };

  const applyPreset = (preset: typeof SAMPLE_PRESETS[0]) => {
    setSelectedFile(null);
    setTextInput(preset.text);
    setContext(preset.context);
    setActiveTab('text');
    setExtractionResult({
      source_type: 'typed_text',
      extracted_text: preset.text,
      page_count: 1,
      word_count: preset.text.split(' ').length,
      char_count: preset.text.length,
      ocr_applied: false,
      ocr_confidence: null,
      warnings: [],
      status: 'success'
    });
    setAnalysisResult(null);
    setExplanationResult(null);
  };

  const runAnalysisPipeline = async () => {
    const textToAnalyze = textInput.trim();
    if (!textToAnalyze) {
      setAnalysisError("Please supply or extract text before starting analysis.");
      return;
    }

    setIsAnalyzing(true);
    setAnalysisError(null);
    setAnalysisProgress('Running calibrated supervised stress classifier and emotion models...');

    try {
      const analysis = await analyzeText(textToAnalyze, context);
      setAnalysisResult(analysis);

      setAnalysisProgress('Calculating token and phrase occlusion attributions...');
      const explanation = await explainText(textToAnalyze);
      setExplanationResult(explanation);

      // Cache for other tabs to inspect
      try {
        sessionStorage.setItem('mindmirror_analyzed_text', textToAnalyze);
        sessionStorage.setItem('mindmirror_analysis', JSON.stringify(analysis));
        sessionStorage.setItem('mindmirror_explanation', JSON.stringify(explanation));
      } catch {
        // storage quota fallback
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Analysis pipeline failed';
      setAnalysisError(msg);
    } finally {
      setIsAnalyzing(false);
      setAnalysisProgress('');
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setTextInput('');
    setExtractionResult(null);
    setAnalysisResult(null);
    setExplanationResult(null);
    setExtractionError(null);
    setAnalysisError(null);
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span className="badge badge-info">Document Ingestion & Analysis</span>
          <span className="badge badge-neutral">Interactive Review</span>
        </div>
        <h1 className="page-title">Analyze Text or Document</h1>
        <p className="page-subtitle">
          Ingest text from typed input, multi-page PDFs, screenshots, or photos. Review and edit the extracted content 
          to correct OCR errors before executing calibrated NLP inference and occlusion attribution.
        </p>
      </div>

      {/* Preset Buttons */}
      <div style={{ marginBottom: '1.75rem', display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
          Sample Scenarios:
        </span>
        {SAMPLE_PRESETS.map((p, idx) => (
          <button
            key={idx}
            onClick={() => applyPreset(p)}
            className="btn btn-secondary"
            style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem', borderRadius: 'var(--radius-sm)' }}
          >
            {p.name}
          </button>
        ))}
      </div>

      <div className="grid-2" style={{ alignItems: 'start', marginBottom: '2.5rem' }}>
        {/* Input & Extraction Panel */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border-subtle)', marginBottom: '1.25rem', gap: '0.5rem' }}>
            <button
              onClick={() => setActiveTab('upload')}
              className={`btn ${activeTab === 'upload' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ borderRadius: 'var(--radius-sm) var(--radius-sm) 0 0', borderBottom: 'none', padding: '0.5rem 1rem' }}
            >
              <Upload size={16} />
              <span>Upload PDF or Image</span>
            </button>
            <button
              onClick={() => setActiveTab('text')}
              className={`btn ${activeTab === 'text' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ borderRadius: 'var(--radius-sm) var(--radius-sm) 0 0', borderBottom: 'none', padding: '0.5rem 1rem' }}
            >
              <FileText size={16} />
              <span>Type / Paste Text</span>
            </button>
          </div>

          {activeTab === 'upload' && (
            <div style={{ marginBottom: '1.5rem' }}>
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    handleFileSelect(e.dataTransfer.files[0]);
                  }
                }}
                style={{
                  border: '2px dashed var(--border-medium)',
                  borderRadius: 'var(--radius-md)',
                  padding: '2.5rem 1.5rem',
                  textAlign: 'center',
                  cursor: 'pointer',
                  background: 'rgba(255, 255, 255, 0.02)',
                  transition: 'border-color var(--transition-fast)'
                }}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  accept=".pdf, .png, .jpg, .jpeg, .webp, .txt"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileSelect(e.target.files[0]);
                    }
                  }}
                />
                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginBottom: '0.75rem', color: '#818cf8' }}>
                  <FileText size={28} />
                  <ImageIcon size={28} />
                </div>
                <div style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.35rem' }}>
                  {selectedFile ? selectedFile.name : 'Click to select or drag and drop a document'}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Supports PDF (digital & scanned), PNG, JPEG, WebP (up to 15MB)
                </div>
              </div>

              {isExtracting && (
                <div style={{ marginTop: '0.75rem', color: 'var(--text-accent)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div className="pulse" style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-primary)' }} />
                  Extracting text and running OCR where necessary...
                </div>
              )}

              {extractionError && (
                <div className="disclaimer-banner" style={{ marginTop: '0.75rem', borderColor: 'var(--stress-border)', color: 'var(--stress-color)' }}>
                  <AlertCircle size={16} />
                  <span>{extractionError}</span>
                </div>
              )}
            </div>
          )}

          {/* Context Selector */}
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Sliders size={14} />
              <span>Optional Content Context (Informs interpretation, preserves raw model score):</span>
            </label>
            <select
              value={context}
              onChange={(e) => setContext(e.target.value as ContextType)}
              className="form-select"
            >
              <option value="unsure">Unsure / Unspecified Text</option>
              <option value="personal_journal">Personal Reflection or Journal Entry</option>
              <option value="message_conversation">Direct Message or Chat Conversation</option>
              <option value="work_academic">Work or Academic Assignment Text</option>
              <option value="social_media">Social Media Post or Forum Content</option>
              <option value="fiction_general">Fiction, Literature, or Third-Party Narrative</option>
            </select>
          </div>

          {/* Extraction Summary Badges */}
          {extractionResult && (
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.4rem' }}>
                <span className="badge badge-info">Source: {extractionResult.source_type}</span>
                <span className="badge badge-neutral">{extractionResult.word_count} words</span>
                <span className="badge badge-neutral">{extractionResult.char_count} chars</span>
                {extractionResult.page_count > 1 && (
                  <span className="badge badge-neutral">{extractionResult.page_count} pages</span>
                )}
                {extractionResult.ocr_applied && (
                  <span className="badge badge-calm">
                    OCR Applied ({extractionResult.ocr_confidence !== null ? `${(extractionResult.ocr_confidence * 100).toFixed(0)}% conf` : 'Completed'})
                  </span>
                )}
              </div>

              {extractionResult.warnings.map((w, i) => (
                <div key={i} style={{ fontSize: '0.775rem', color: 'var(--warning-color)', display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.25rem' }}>
                  <Info size={13} />
                  <span>{w}</span>
                </div>
              ))}
            </div>
          )}

          {/* Editable Text Area */}
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <label className="form-label">
                Extracted Text (Review & Correct before Analysis):
              </label>
              {textInput && (
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Editable in-place
                </span>
              )}
            </div>
            <textarea
              rows={10}
              value={textInput}
              onChange={handleTextChange}
              placeholder="Type, paste, or upload text to analyze..."
              className="form-textarea"
              style={{ width: '100%', resize: 'vertical', fontFamily: 'var(--font-sans)', fontSize: '0.9rem' }}
            />
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              onClick={runAnalysisPipeline}
              disabled={isAnalyzing || isExtracting || !textInput.trim()}
              className="btn btn-primary"
              style={{ flex: 1 }}
            >
              <Sparkles size={16} />
              <span>{isAnalyzing ? 'Running Models...' : 'Run Genuine NLP Analysis'}</span>
            </button>

            <button
              onClick={handleReset}
              disabled={isAnalyzing || isExtracting}
              className="btn btn-secondary"
            >
              <RotateCcw size={16} />
              <span>Reset</span>
            </button>
          </div>

          {isAnalyzing && (
            <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'rgba(99, 102, 241, 0.1)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-accent)', fontSize: '0.85rem', color: 'var(--text-accent)' }}>
              <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Inference Pipeline Active:</div>
              <div>{analysisProgress}</div>
            </div>
          )}

          {analysisError && (
            <div className="disclaimer-banner" style={{ marginTop: '1rem', borderColor: 'var(--stress-border)', color: 'var(--stress-color)' }}>
              <AlertCircle size={16} />
              <span>{analysisError}</span>
            </div>
          )}
        </div>

        {/* Results Preview & Deep Link Panel */}
        <div>
          {analysisResult ? (
            <div className="glass-panel" style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
                <h2 style={{ fontSize: '1.35rem' }}>Analysis Results Summary</h2>
                <span className={`badge ${analysisResult.stress_classification.binary_decision === 1 ? 'badge-stress' : 'badge-calm'}`}>
                  {analysisResult.stress_classification.predicted_category_name}
                </span>
              </div>

              {/* Stress Score Gauge */}
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                    Calibrated Stress Language Score:
                  </span>
                  <span style={{ fontSize: '1.75rem', fontFamily: 'var(--font-heading)', fontWeight: 800, color: analysisResult.stress_classification.calibrated_score >= 0.5 ? 'var(--stress-color)' : 'var(--calm-color)' }}>
                    {analysisResult.stress_classification.calibrated_score.toFixed(3)}
                  </span>
                </div>

                {/* Progress bar */}
                <div style={{ width: '100%', height: '8px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '4px', overflow: 'hidden', marginBottom: '0.5rem' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${(analysisResult.stress_classification.calibrated_score * 100).toFixed(1)}%`,
                      background: analysisResult.stress_classification.calibrated_score >= 0.5 ? 'var(--stress-color)' : 'var(--calm-color)',
                      transition: 'width 0.4s ease'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <span>Uncertainty Margin: [{analysisResult.stress_classification.uncertainty_interval[0].toFixed(3)}, {analysisResult.stress_classification.uncertainty_interval[1].toFixed(3)}]</span>
                  <span>Model: {analysisResult.stress_classification.model_version.split(' ')[0]}</span>
                </div>
              </div>

              {/* Primary Emotion Profile */}
              <div style={{ marginBottom: '1.25rem', padding: '1rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    Dominant Text Tone:
                  </span>
                  <span className="badge badge-info" style={{ textTransform: 'capitalize' }}>
                    {analysisResult.emotion_analysis.dominant_emotion}
                  </span>
                </div>
                <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                  {analysisResult.emotion_analysis.interpretation}
                </div>
              </div>

              {/* Context Warning if present */}
              {analysisResult.guidance.context_warnings.length > 0 && (
                <div className="disclaimer-banner" style={{ marginBottom: '1.25rem' }}>
                  <Info size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div style={{ fontSize: '0.8rem' }}>
                    {analysisResult.guidance.context_warnings[0]}
                  </div>
                </div>
              )}

              {/* Top Attribution Preview */}
              {explanationResult && explanationResult.positive_attributions.length > 0 && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                    Key Words Influencing the Output:
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                    {explanationResult.positive_attributions.slice(0, 6).map((a, idx) => (
                      <span key={idx} className="badge badge-stress" style={{ fontSize: '0.8rem' }}>
                        &ldquo;{a.term}&rdquo; (+{a.attribution_delta.toFixed(3)})
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Interactive Deep-Dives Navigation */}
              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <Link
                  href="/evidence"
                  className="btn btn-secondary"
                  style={{ justifyContent: 'space-between', padding: '0.75rem 1rem' }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Layers size={17} style={{ color: '#ec4899' }} />
                    <strong>Explore Token & Phrase Evidence Map</strong>
                  </span>
                  <ArrowRight size={16} />
                </Link>

                <Link
                  href="/insights"
                  className="btn btn-secondary"
                  style={{ justifyContent: 'space-between', padding: '0.75rem 1rem' }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Activity size={17} style={{ color: 'var(--calm-color)' }} />
                    <strong>View Full Emotional Profile & Next Steps</strong>
                  </span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          ) : (
            <div className="glass-panel" style={{ padding: '2.5rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '380px' }}>
              <Sparkles size={40} style={{ color: 'var(--border-accent)', marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Awaiting Analysis Execution</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', maxWidth: '340px' }}>
                Select a sample preset or upload a document to inspect the extracted content and run genuine calibrated inference.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
