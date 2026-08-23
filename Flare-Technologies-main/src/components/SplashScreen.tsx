import { useEffect, useState } from 'react';

export default function SplashScreen({ onDone }: { onDone: () => void }) {
  const [splashVisible, setSplashVisible] = useState(true);
  const [wordState, setWordState] = useState<0 | 1 | 2>(0);

  useEffect(() => {
    const t1 = setTimeout(() => setWordState(1), 1800);
    const t2 = setTimeout(() => setWordState(2), 2200);
    const t3 = setTimeout(() => setSplashVisible(false), 3800);
    const t4 = setTimeout(() => onDone(), 4500);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [onDone]);

  const word = wordState === 2 ? 'Scale' : 'Build';
  const wordOpacity = wordState === 1 ? 0 : 1;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 99999,
      background: '#0f172a',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      gap: '1.5rem', padding: '0 2rem',
      opacity: splashVisible ? 1 : 0,
      transition: 'opacity 0.7s ease',
      pointerEvents: splashVisible ? 'all' : 'none',
    }}>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .sp-row {
          animation: fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.2s both;
          display: flex; align-items: center; justify-content: center;
          gap: clamp(0.5rem, 2vw, 1rem); flex-wrap: nowrap;
        }
        .sp-bar { animation: fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.5s both; }
        .sp-sub { animation: fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.65s both; }

        /* Animated gradient border box */
        @keyframes borderRotate {
          0%   { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        .sp-word-outer {
          padding: 2px;
          border-radius: 14px;
          background: linear-gradient(90deg, #2563eb, #06b6d4, #7c3aed, #2563eb);
          background-size: 200% 100%;
          animation: borderRotate 2.5s linear infinite;
          box-shadow: 0 0 32px rgba(37,99,235,0.3), 0 0 60px rgba(6,182,212,0.15);
          flex-shrink: 0;
        }
        .sp-word-inner {
          display: inline-flex; align-items: center; justify-content: center;
          border-radius: 12px;
          background: #0f172a;
          padding: 0.1em 0.45em;
          min-width: clamp(190px, 40vw, 440px);
          height: clamp(58px, 12vw, 105px);
        }
        .sp-word {
          font-family: var(--font-heading, sans-serif);
          font-size: clamp(2rem, 8vw, 5.5rem);
          font-weight: 900; letter-spacing: -0.04em; line-height: 1;
          background: linear-gradient(90deg, #2563eb, #06b6d4);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          white-space: nowrap;
          transition: opacity 0.35s ease;
        }
        /* Floating dots */
        @keyframes floatDot {
          0%,100% { transform: translateY(0); opacity: 0.4; }
          50% { transform: translateY(-12px); opacity: 0.8; }
        }
        .sp-dot {
          position: absolute; border-radius: 50%; pointer-events: none;
          animation: floatDot ease-in-out infinite;
        }
      `}</style>

      {/* Floating accent dots */}
      <div className="sp-dot" style={{ width:'8px', height:'8px', background:'#2563eb', top:'20%', left:'15%', animationDuration:'3s', animationDelay:'0s' }} />
      <div className="sp-dot" style={{ width:'5px', height:'5px', background:'#06b6d4', top:'30%', right:'18%', animationDuration:'4s', animationDelay:'1s' }} />
      <div className="sp-dot" style={{ width:'6px', height:'6px', background:'#7c3aed', bottom:'25%', left:'20%', animationDuration:'3.5s', animationDelay:'0.5s' }} />
      <div className="sp-dot" style={{ width:'4px', height:'4px', background:'#06b6d4', bottom:'20%', right:'15%', animationDuration:'5s', animationDelay:'1.5s' }} />

      {/* Main row */}
      <div className="sp-row" style={{ position: 'relative', zIndex: 1 }}>

        {/* Animated gradient border box — cycles Build → Scale */}
        <div className="sp-word-outer">
          <div className="sp-word-inner">
            <span className="sp-word" style={{ opacity: wordOpacity }}>
              {word}
            </span>
          </div>
        </div>

        <span style={{
          fontFamily: 'var(--font-heading, sans-serif)',
          fontSize: 'clamp(2rem, 8vw, 5.5rem)',
          fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1,
          color: '#fff', whiteSpace: 'nowrap', flexShrink: 0,
        }}>
          Enterprise
        </span>
      </div>

      {/* Divider */}
      <div className="sp-bar" style={{
        position: 'relative', zIndex: 1,
        width: 'clamp(60px, 12vw, 120px)', height: '2px',
        background: 'linear-gradient(90deg, #2563eb, #06b6d4, #7c3aed)',
        borderRadius: '2px',
      }} />

      {/* Tagline */}
      <div className="sp-sub" style={{
        position: 'relative', zIndex: 1,
        fontFamily: 'var(--font-body, sans-serif)',
        fontSize: 'clamp(0.7rem, 1.8vw, 0.95rem)',
        fontWeight: 500, color: 'rgba(148,163,184,0.85)',
        letterSpacing: '0.1em', textTransform: 'uppercase', textAlign: 'center',
      }}>
        India's First Technical Marketing Company
      </div>

    </div>
  );
}
