'use client';

import React, { useState, useEffect } from 'react';
import { 
  CalendarHeart, 
  Trash2, 
  Download, 
  ShieldCheck, 
  TrendingUp, 
  Smile, 
  Meh, 
  Frown, 
  AlertCircle,
  PlusCircle,
  Clock,
  FileCheck
} from 'lucide-react';
import { DailyReflectionEntry } from '../../lib/types';

const STORAGE_KEY = 'mindmirror_daily_reflections';
const OPT_IN_KEY = 'mindmirror_save_reflections_opt_in';

export default function DailyReflectionPage() {
  const [entries, setEntries] = useState<DailyReflectionEntry[]>([]);
  const [saveLocally, setSaveLocally] = useState<boolean>(true);

  // Form State
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [moodRating, setMoodRating] = useState<number>(3); // 1-5
  const [stressLevel, setStressLevel] = useState<number>(5); // 1-10
  const [notes, setNotes] = useState<string>('');
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  useEffect(() => {
    setSelectedDate(new Date().toISOString().split('T')[0]);
    try {
      const optIn = localStorage.getItem(OPT_IN_KEY);
      if (optIn !== null) {
        setSaveLocally(optIn === 'true');
      }
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setEntries(JSON.parse(raw));
      }
    } catch {
      // localStorage unavailable fallback
    }
  }, []);

  const handleToggleOptIn = (checked: boolean) => {
    setSaveLocally(checked);
    try {
      localStorage.setItem(OPT_IN_KEY, String(checked));
      if (!checked) {
        // user opted out of saving
      }
    } catch {
      // fallback
    }
  };

  const handleAddEntry = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry: DailyReflectionEntry = {
      id: `reflection_${Date.now()}`,
      date: selectedDate,
      timestamp: Date.now(),
      moodRating,
      stressLevel,
      notes: notes.trim()
    };

    if (saveLocally) {
      const updated = [newEntry, ...entries];
      setEntries(updated);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // quota exceeded
      }
    }

    setNotes('');
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleDeleteEntry = (id: string) => {
    const filtered = entries.filter(e => e.id !== id);
    setEntries(filtered);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    } catch {
      // fallback
    }
  };

  const handleClearAll = () => {
    if (confirm("Are you sure you want to delete all saved daily reflections from this device? This action cannot be undone.")) {
      setEntries([]);
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        // fallback
      }
    }
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(entries, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", `mindmirror_reflections_${new Date().toISOString().split('T')[0]}.json`);
    dlAnchorElem.click();
  };

  const getMoodLabel = (rating: number) => {
    switch (rating) {
      case 1: return { text: "Very Low", color: "var(--stress-color)" };
      case 2: return { text: "Low", color: "#fb923c" };
      case 3: return { text: "Balanced", color: "var(--info-color)" };
      case 4: return { text: "Good", color: "#34d399" };
      case 5: return { text: "Excellent", color: "var(--calm-color)" };
      default: return { text: "Neutral", color: "var(--text-muted)" };
    }
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span className="badge badge-warning">Optional Daily Workflow</span>
          <span className="badge badge-neutral">Client-Side Sovereignty</span>
        </div>
        <h1 className="page-title">Daily Reflection Log</h1>
        <p className="page-subtitle">
          Record self-reported mood, perceived stress, and optional notes. This reflection workflow is completely 
          separate from document analysis. All logs are stored strictly client-side on your device and are never transmitted or retained.
        </p>
      </div>

      {/* Mandatory User-Reported Labeling Notice */}
      <div className="disclaimer-banner" style={{ marginBottom: '2rem' }}>
        <ShieldCheck size={20} style={{ color: 'var(--calm-color)', flexShrink: 0, marginTop: '2px' }} />
        <div>
          <strong style={{ color: 'var(--text-primary)' }}>User-Reported Data Standard:</strong>
          <p style={{ marginTop: '0.2rem' }}>
            Check-ins recorded here represent your self-reported perceptions, not AI-inferred psychiatric states. 
            Trends are displayed only when genuine data exists, and are never used to make clinical diagnostic claims.
          </p>
        </div>
      </div>

      <div className="grid-2" style={{ alignItems: 'start', marginBottom: '2.5rem' }}>
        {/* Check-in Entry Form */}
        <div className="glass-panel" style={{ padding: '1.75rem' }}>
          <h2 style={{ fontSize: '1.35rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
            Record Today&apos;s Reflection
          </h2>

          <form onSubmit={handleAddEntry}>
            <div className="form-group">
              <label className="form-label">Check-In Date:</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="form-input"
                required
              />
            </div>

            {/* Self-Reported Mood Selector */}
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <label className="form-label">Self-Reported Mood:</label>
                <span style={{ fontWeight: 700, color: getMoodLabel(moodRating).color, fontSize: '0.9rem' }}>
                  {getMoodLabel(moodRating).text} ({moodRating}/5)
                </span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {[1, 2, 3, 4, 5].map((r) => (
                  <button
                    type="button"
                    key={r}
                    onClick={() => setMoodRating(r)}
                    className="btn"
                    style={{
                      flex: 1,
                      background: moodRating === r ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255, 255, 255, 0.03)',
                      borderColor: moodRating === r ? 'var(--accent-primary)' : 'var(--border-subtle)',
                      padding: '0.5rem 0',
                      flexDirection: 'column',
                      gap: '0.2rem'
                    }}
                  >
                    <span style={{ fontSize: '1.1rem' }}>
                      {r <= 2 ? '🌧️' : r === 3 ? '⛅' : '☀️'}
                    </span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{r}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Perceived Stress Slider */}
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <label className="form-label">Perceived Stress Level:</label>
                <span style={{ fontWeight: 700, color: stressLevel >= 7 ? 'var(--stress-color)' : stressLevel >= 4 ? 'var(--warning-color)' : 'var(--calm-color)', fontSize: '0.9rem' }}>
                  {stressLevel} / 10 {stressLevel >= 7 ? '(High Strain)' : stressLevel >= 4 ? '(Moderate)' : '(Mild / Low)'}
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={stressLevel}
                onChange={(e) => setStressLevel(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--accent-primary)' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                <span>1 (Completely Calm)</span>
                <span>5 (Manageable Demands)</span>
                <span>10 (Severe Pressure)</span>
              </div>
            </div>

            {/* Qualitative Notes */}
            <div className="form-group">
              <label className="form-label">Optional Personal Notes / Reflections:</label>
              <textarea
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="What demands, interactions, or routines were present today?"
                className="form-textarea"
                style={{ resize: 'vertical' }}
              />
            </div>

            {/* Privacy opt-in toggle */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem', background: 'rgba(255, 255, 255, 0.02)', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
              <input
                type="checkbox"
                id="optin_check"
                checked={saveLocally}
                onChange={(e) => handleToggleOptIn(e.target.checked)}
                style={{ accentColor: 'var(--accent-primary)', width: '16px', height: '16px' }}
              />
              <label htmlFor="optin_check" style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                Save reflection logs in browser localStorage on this device
              </label>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              <PlusCircle size={16} />
              <span>Record Daily Check-In</span>
            </button>

            {saveSuccess && (
              <div style={{ marginTop: '0.75rem', color: 'var(--calm-color)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem', justifyContent: 'center' }}>
                <FileCheck size={16} />
                <span>Reflection entry saved locally!</span>
              </div>
            )}
          </form>
        </div>

        {/* Genuine Longitudinal Trend Graph */}
        <div className="glass-panel" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <TrendingUp size={20} style={{ color: 'var(--info-color)' }} />
              <h2 style={{ fontSize: '1.25rem' }}>Self-Reported Trajectory</h2>
            </div>
            <span className="badge badge-neutral">{entries.length} recorded</span>
          </div>

          {entries.length >= 2 ? (
            <div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                Chronological visualization of your self-reported logs. Requires multiple genuine entries to illustrate patterns.
              </p>

              {/* SVG Trend Chart */}
              <div style={{ background: 'rgba(0, 0, 0, 0.25)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }}>
                <svg viewBox="0 0 400 160" style={{ width: '100%', height: '160px', overflow: 'visible' }}>
                  {/* Grid Lines */}
                  <line x1="0" y1="40" x2="400" y2="40" stroke="rgba(255,255,255,0.06)" strokeDasharray="3" />
                  <line x1="0" y1="80" x2="400" y2="80" stroke="rgba(255,255,255,0.06)" strokeDasharray="3" />
                  <line x1="0" y1="120" x2="400" y2="120" stroke="rgba(255,255,255,0.06)" strokeDasharray="3" />

                  {/* Draw Stress Line (Scale 1-10 mapped to y: 140 to 20) */}
                  {(() => {
                    const sorted = [...entries].reverse().slice(-7);
                    const step = 400 / Math.max(1, sorted.length - 1);
                    const points = sorted.map((entry, idx) => {
                      const x = idx * step;
                      const y = 140 - ((entry.stressLevel - 1) / 9) * 110;
                      return `${x},${y}`;
                    }).join(' ');

                    return (
                      <>
                        <polyline
                          fill="none"
                          stroke="var(--stress-color)"
                          strokeWidth="2.5"
                          points={points}
                        />
                        {sorted.map((entry, idx) => {
                          const x = idx * step;
                          const y = 140 - ((entry.stressLevel - 1) / 9) * 110;
                          return (
                            <circle
                              key={idx}
                              cx={x}
                              cy={y}
                              r="4"
                              fill="var(--stress-color)"
                            />
                          );
                        })}
                      </>
                    );
                  })()}
                </svg>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--stress-color)' }} />
                    Perceived Stress (1-10)
                  </span>
                  <span>Latest {Math.min(7, entries.length)} Logs</span>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ padding: '2.5rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              <Clock size={36} style={{ color: 'var(--border-accent)', marginBottom: '0.75rem' }} />
              <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                Trend Analysis Requires &#8805; 2 Entries
              </div>
              <p style={{ fontSize: '0.825rem', maxWidth: '320px', margin: '0 auto' }}>
                Log daily check-ins over consecutive days to see self-reported trajectories. 
                MindMirror AI never derives clinical inferences from a single upload.
              </p>
            </div>
          )}

          {/* Controls to export or clear */}
          {entries.length > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem', marginTop: '1rem' }}>
              <button
                onClick={handleExportJSON}
                className="btn btn-secondary"
                style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
              >
                <Download size={14} />
                <span>Export JSON</span>
              </button>

              <button
                onClick={handleClearAll}
                className="btn btn-secondary"
                style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem', color: 'var(--stress-color)' }}
              >
                <Trash2 size={14} />
                <span>Delete All Logs</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Historical Entries Table */}
      {entries.length > 0 && (
        <div className="glass-panel" style={{ padding: '1.75rem', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Saved Reflection Log History</h2>
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Mood (1-5)</th>
                  <th>Perceived Stress</th>
                  <th>Personal Notes</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((item) => (
                  <tr key={item.id}>
                    <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{item.date}</td>
                    <td>
                      <span className="badge badge-neutral" style={{ color: getMoodLabel(item.moodRating).color }}>
                        {getMoodLabel(item.moodRating).text} ({item.moodRating})
                      </span>
                    </td>
                    <td>
                      <span style={{ fontWeight: 700, color: item.stressLevel >= 7 ? 'var(--stress-color)' : item.stressLevel >= 4 ? 'var(--warning-color)' : 'var(--calm-color)' }}>
                        {item.stressLevel} / 10
                      </span>
                    </td>
                    <td style={{ maxWidth: '320px', fontSize: '0.825rem' }}>
                      {item.notes || <span style={{ color: 'var(--text-muted)' }}>None recorded</span>}
                    </td>
                    <td>
                      <button
                        onClick={() => handleDeleteEntry(item.id)}
                        className="btn btn-secondary"
                        style={{ padding: '0.25rem 0.5rem', borderRadius: 'var(--radius-sm)' }}
                        title="Delete this entry"
                      >
                        <Trash2 size={13} style={{ color: 'var(--stress-color)' }} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
