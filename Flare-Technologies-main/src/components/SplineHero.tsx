'use client'

import { motion } from 'framer-motion'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/context/theme-context'
import { AnnouncementBar } from '@/components/AnnouncementBar'

export function SplineHero() {
  const { theme, toggleTheme } = useTheme();

  return (
    <section style={{
      position: 'relative',
      width: '100%',
      minHeight: '88svh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
      overflow: 'hidden',
      background: 'var(--theme-bg-main)',
    }}>

      <style>{`
        @keyframes gradShift {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .theme-toggle {
          position: absolute; top: 4rem; right: 1.5rem; z-index: 20;
          border: 1px solid var(--theme-border);
          background: var(--theme-surface);
          color: var(--theme-text-primary);
          border-radius: 999px; padding: 0.35rem 0.8rem;
          display: inline-flex; align-items: center; gap: 0.4rem;
          font-weight: 700; font-size: 0.75rem; cursor: pointer;
          backdrop-filter: blur(8px); transition: all 0.2s ease;
        }
        .theme-toggle:hover {
          border-color: color-mix(in srgb, var(--theme-primary) 50%, var(--theme-border));
        }
      `}</style>

      {/* Background image */}      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <img
          src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=50&auto=format&fit=crop&fm=webp"
          srcSet="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&q=50&auto=format&fit=crop&fm=webp 400w, https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=50&auto=format&fit=crop&fm=webp 800w, https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&q=50&auto=format&fit=crop&fm=webp 1200w"
          sizes="100vw" alt="" width={1200} height={800}
          fetchPriority="high" loading="eager"
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg, rgba(6,11,23,0.65) 0%, rgba(6,11,23,0.45) 100%)',
        }} />
      </div>

      {/* Grid overlay */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
        backgroundImage: 'linear-gradient(var(--theme-grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--theme-grid-line) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }} />

      {/* Theme toggle */}
      <button type="button" className="theme-toggle" onClick={toggleTheme}
        aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
        {theme === 'dark' ? <Sun size={13} /> : <Moon size={13} />}
        {theme === 'dark' ? 'Light' : 'Dark'}
      </button>

      {/* Content — centered in remaining space */}
      <div style={{ position: 'relative', zIndex: 10, flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 'clamp(6rem,14vw,9rem) 1.5rem 3rem' }}>
        <div style={{ maxWidth: '760px', width: '100%' }}>
          <motion.h1
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2.5rem, 7vw, 5rem)',
              fontWeight: 900, lineHeight: 1.08,
              letterSpacing: '-0.035em',
              color: '#ffffff',
              margin: '0 0 1.1rem',
              textShadow: '0 2px 16px rgba(0,0,0,0.5)',
            }}
          >
            India's First{' '}
            <span style={{
              background: 'linear-gradient(90deg, var(--theme-primary), var(--theme-accent), var(--theme-primary))',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundSize: '200% 100%', animation: 'gradShift 4s ease infinite',
            }}>
              B2B Technical
            </span>{' '}
            Marketing Company
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(0.9375rem, 2vw, 1.125rem)',
              color: 'rgba(255,255,255,0.85)',
              lineHeight: 1.7, maxWidth: '580px', margin: '0 auto',
              textShadow: '0 1px 8px rgba(0,0,0,0.4)',
            }}
          >
            We combine deep technical understanding with marketing intelligence to help B2B businesses communicate better, generate demand, and grow faster.
          </motion.p>

          {/* ── F2F bar — same width as paragraph ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            style={{ maxWidth: '580px', margin: '2rem auto 0' }}
          >
            <AnnouncementBar />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
