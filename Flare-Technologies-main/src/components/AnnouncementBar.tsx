import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, ArrowRight, Zap } from 'lucide-react'

export function AnnouncementBar() {
  const [dismissed, setDismissed] = useState(false)
  const navigate = useNavigate()

  if (dismissed) return null

  return (
    <>
      <style>{`
        @keyframes ann-pulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 6px rgba(255,140,0,0.9); }
          50%       { opacity: 0.4; box-shadow: 0 0 2px rgba(255,140,0,0.3); }
        }
        @keyframes ann-in {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .ann-bar {
          width: 100%;
          background: transparent;
          border: none;
          border-radius: 0;
          animation: ann-in 0.5s ease forwards;
          position: relative; z-index: 5;
        }
        .ann-bar::after { display: none; }
        .ann-bar::after {
          content: ''; position: absolute; inset: 0; pointer-events: none;
          background: radial-gradient(ellipse 60% 100% at 50% 50%, rgba(255,140,0,0.07) 0%, transparent 70%);
        }
        .ann-inner {
          display: flex; align-items: center; justify-content: center;
          padding: 0.7rem 2.5rem 0.7rem 1rem;
          gap: 0.65rem; position: relative;
        }
        .ann-dot {
          width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0;
          background: #FF8C00; animation: ann-pulse 1.5s ease infinite;
        }
        .ann-badge {
          display: inline-flex; align-items: center; gap: 0.25rem;
          font-size: 0.62rem; font-weight: 900; letter-spacing: 0.1em;
          text-transform: uppercase; color: #FF8C00;
          background: rgba(255,140,0,0.12); border: 1px solid rgba(255,140,0,0.3);
          border-radius: 999px; padding: 0.15rem 0.6rem; flex-shrink: 0;
        }
        .ann-divider { width: 1px; height: 16px; background: rgba(255,140,0,0.25); flex-shrink: 0; }
        .ann-text-full {
          font-size: 0.85rem; font-weight: 700; color: rgba(255,255,255,1);
          font-family: var(--font-body); white-space: nowrap;
          display: flex; align-items: center; gap: 0.45rem; cursor: pointer;
          text-shadow: 0 1px 8px rgba(0,0,0,0.6);
        }
        .ann-text-short {
          display: none;
          font-size: 0.82rem; font-weight: 800; color: #fff;
          font-family: var(--font-body); white-space: nowrap; cursor: pointer;
          text-shadow: 0 1px 8px rgba(0,0,0,0.6);
        }
        .ann-highlight { color: #FF8C00; font-weight: 800; }
        .ann-dot-sep { color: rgba(255,140,0,0.45); }
        .ann-apply {
          display: inline-flex; align-items: center; gap: 0.3rem;
          background: linear-gradient(135deg, #FF8C00, #e67000);
          color: #fff; font-weight: 700; font-size: 0.7rem;
          border: none; border-radius: 999px; padding: 0.3rem 0.9rem;
          cursor: pointer; white-space: nowrap; flex-shrink: 0;
          box-shadow: 0 2px 10px rgba(255,140,0,0.4);
          font-family: var(--font-body);
          transition: transform 0.15s, box-shadow 0.15s;
        }
        .ann-apply:hover { transform: translateY(-1px); box-shadow: 0 4px 16px rgba(255,140,0,0.5); }
        .ann-close {
          position: absolute; right: 0.6rem;
          background: none; border: none; cursor: pointer;
          color: rgba(255,255,255,0.3); padding: 0.25rem;
          display: flex; align-items: center; transition: color 0.15s;
        }
        .ann-close:hover { color: rgba(255,255,255,0.65); }
        @media (max-width: 600px) {
          .ann-badge { display: none; }
          .ann-divider { display: none; }
          .ann-text-full { display: none; }
          .ann-text-short { display: block; }
          .ann-inner { gap: 0.5rem; padding: 0.65rem 2.5rem 0.65rem 0.75rem; }
        }
      `}</style>

      <div className="ann-bar">
        <div className="ann-inner">
          <div className="ann-dot" />
          <span className="ann-badge"><Zap size={9} /> New</span>
          <div className="ann-divider" />

          <span className="ann-text-full" onClick={() => navigate('/fresher-to-finisher')}>
            Flare Technologies Presents
            <span className="ann-dot-sep">·</span>
            <span className="ann-highlight">Fresher to Finisher</span>
            <span className="ann-dot-sep">·</span>
            Zero cost. Real work. 7 tracks. Apply before cohort closes.
          </span>

          <span className="ann-text-short" onClick={() => navigate('/fresher-to-finisher')}>
            <span className="ann-highlight">Fresher to Finisher</span> — Apply now
          </span>

          <button className="ann-apply" onClick={() => navigate('/fresher-to-finisher')}>
            Apply <ArrowRight size={11} />
          </button>
          <button className="ann-close" onClick={() => setDismissed(true)} aria-label="Dismiss">
            <X size={13} />
          </button>
        </div>
      </div>
    </>
  )
}
