'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  Sun, 
  Moon,
  Radio
} from 'lucide-react';
import { checkBackendHealth } from '../lib/api';

const NAV_ITEMS = [
  { href: '/', label: 'Overview', icon: Sparkles },
  { href: '/analyze', label: 'Analyze Document', icon: FileSearch },
  { href: '/evidence', label: 'Evidence Explorer', icon: Layers },
  { href: '/insights', label: 'Emotional Insights', icon: Activity },
  { href: '/reflection', label: 'Daily Reflection', icon: CalendarHeart },
  { href: '/cross-domain', label: 'Cross-Domain', icon: Network },
  { href: '/models', label: 'Model Comparison', icon: GitCompare },
  { href: '/methodology', label: 'Methodology', icon: BookOpen },
  { href: '/privacy', label: 'Privacy & Safety', icon: ShieldAlert },
];

export default function Navigation() {
  const pathname = usePathname();
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [apiOnline, setApiOnline] = useState<boolean | null>(null);

  useEffect(() => {
    checkBackendHealth().then(status => {
      setApiOnline(status.ok);
    });

    const interval = setInterval(() => {
      checkBackendHealth().then(status => setApiOnline(status.ok));
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
  };

  return (
    <header className="nav-header">
      <Link href="/" className="nav-brand">
        <Sparkles size={22} style={{ color: '#818cf8' }} />
        <span>MindMirror AI</span>
      </Link>

      <nav className="nav-links">
        {NAV_ITEMS.map(item => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-link ${isActive ? 'active' : ''}`}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                <Icon size={15} />
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div 
          className="badge" 
          style={{ 
            fontSize: '0.7rem', 
            background: apiOnline ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)',
            color: apiOnline ? 'var(--calm-color)' : 'var(--warning-color)',
            border: `1px solid ${apiOnline ? 'var(--calm-border)' : 'var(--warning-border)'}`
          }}
          title={apiOnline ? "FastAPI backend online and connected" : "Backend connecting / Standalone evaluation mode"}
        >
          <Radio size={12} className={apiOnline ? "pulse" : ""} />
          <span>{apiOnline ? "API Live" : "Standalone"}</span>
        </div>

        <button 
          onClick={toggleTheme}
          className="btn btn-secondary"
          style={{ padding: '0.4rem 0.6rem', borderRadius: 'var(--radius-sm)' }}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          aria-label="Toggle Theme"
        >
          {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
        </button>
      </div>
    </header>
  );
}
