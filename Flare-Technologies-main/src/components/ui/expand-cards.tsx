"use client";

import { useState } from "react";
import { useTheme } from "@/context/theme-context";

interface CardItem {
  label?: string;
  value: string;
}

interface CardSection {
  title: string;
  accent: string;
  items: CardItem[] | string[];
}

const content: CardSection[] = [
  {
    title: "What You Get",
    accent: "#22d3ee",
    items: [
      { label: "Strategy", value: "A clear, actionable plan" },
      { label: "Planning", value: "The right tools chosen for you" },
      { label: "Development", value: "A fast, working product" },
      { label: "Optimization", value: "Support to keep you growing" }
    ]
  },
  {
    title: "Typical Timeline",
    accent: "#f472b6",
    items: [
      { label: "Strategy", value: "2–5 Days" },
      { label: "Planning", value: "5–10 Days" },
      { label: "Development", value: "2–6 Weeks" },
      { label: "Optimization", value: "Ongoing" }
    ]
  },
  {
    title: "How We Work",
    accent: "#10b981",
    items: [
      "We keep you in the loop weekly",
      "You'll always know what's next",
      "No hidden fees or surprises",
      "We won't ever go silent on you"
    ]
  },
  {
    title: "Why This Works",
    accent: "#fb923c",
    items: [
      { label: "Method", value: "We follow a proven method" },
      { label: "Logic", value: "No guessing—we use real data" },
      { label: "Future", value: "Built to handle future growth" },
      { label: "Focus", value: "Our focus is strictly your ROI" }
    ]
  }
];

const total = content.length;

const ExpandOnHover = () => {
  const [active, setActive] = useState(0);
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const cardBg = isLight ? '#ffffff' : '#000000';
  const cardBorder = isLight ? 'rgba(0,0,0,0.1)' : '#334155';
  const textPrimary = isLight ? '#0f172a' : '#ffffff';
  const textMuted = isLight ? '#475569' : '#93c5fd';
  const itemBorder = isLight ? 'rgba(0,0,0,0.07)' : 'rgba(255,255,255,0.05)';
  const navBg = isLight ? '#f1f5f9' : '#000000';
  const navBorder = isLight ? 'rgba(0,0,0,0.12)' : '#334155';
  const navColor = isLight ? '#0f172a' : '#e2e8f0';
  const dotInactive = isLight ? '#cbd5e1' : '#475569';

  const prev = () => setActive((active - 1 + total) % total);
  const next = () => setActive((active + 1) % total);

  // position offset relative to active: -2, -1, 0, +1, +2 ...
  const getOffset = (idx: number) => {
    let offset = idx - active;
    // wrap around
    if (offset > total / 2) offset -= total;
    if (offset < -total / 2) offset += total;
    return offset;
  };

  return (
    <div style={{ width: '100%', padding: '2rem 0 3rem' }}>

      {/* ── Carousel track ── */}
      <div style={{ position: 'relative', height: '420px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        {content.map((section, idx) => {
          const offset = getOffset(idx);
          const isActive = offset === 0;
          const isVisible = Math.abs(offset) <= 1; // only show -1, 0, +1

          if (!isVisible) return null;

          const translateX = offset * 340; // px shift per step
          const scale = isActive ? 1 : 0.82;
          const opacity = isActive ? 1 : 0.45;
          const zIndex = isActive ? 10 : 5;
          const blur = isActive ? 0 : 2;

          return (
            <div
              key={idx}
              onClick={() => !isActive && (offset < 0 ? prev() : next())}
              style={{
                position: 'absolute',
                width: '340px',
                height: '380px',
                borderRadius: '28px',
                border: `1px solid ${isActive ? section.accent : cardBorder}`,
                background: cardBg,
                backdropFilter: `blur(${blur}px)`,
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.25rem',
                transform: `translateX(${translateX}px) scale(${scale})`,
                opacity,
                zIndex,
                transition: 'all 0.45s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: isActive ? 'default' : 'pointer',
                overflow: 'hidden',
                boxShadow: isLight ? '0 4px 24px rgba(0,0,0,0.1)' : 'none',
              }}
            >
              {/* Accent glow */}
              {isActive && (
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0, height: '50%',
                  background: section.accent, opacity: 0.07, filter: 'blur(40px)',
                  pointerEvents: 'none',
                }} />
              )}

              {/* Title */}
              <h4 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.5rem',
                fontWeight: 900,
                color: section.accent,
                letterSpacing: '-0.02em',
                margin: 0,
                textTransform: 'uppercase',
              }}>
                {section.title}
              </h4>

              {/* Items */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', position: 'relative', zIndex: 1 }}>
                {section.items.map((item, i) => (
                  <div key={i} style={{ borderBottom: `1px solid ${itemBorder}`, paddingBottom: '0.75rem' }}>
                    {typeof item === 'string' ? (
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem' }}>
                      <span style={{ color: '#10b981', fontWeight: 900, marginTop: '1px' }}>✔</span>
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.9375rem', color: textPrimary, fontWeight: 600, lineHeight: 1.4 }}>{item}</span>
                      </div>
                    ) : (
                      <>
                        <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.65rem', fontWeight: 700, color: textMuted, textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '0.2rem' }}>{item.label}</span>
                        <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', color: textPrimary, fontWeight: 800, lineHeight: 1.3 }}>{item.value}</span>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Nav buttons + dots ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', marginTop: '1.5rem' }}>
        {/* Prev */}
        <button
          onClick={prev}
          style={{
            width: '40px', height: '40px', borderRadius: '50%',
            background: navBg,
            border: `1px solid ${navBorder}`,
            color: navColor, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = isLight ? '#e2e8f0' : '#111827'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = navBg; }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        {/* Dots */}
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          {content.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              style={{
                width: i === active ? '20px' : '6px',
                height: '6px',
                borderRadius: '99px',
                background: i === active ? content[active].accent : dotInactive,
                border: 'none', cursor: 'pointer', padding: 0,
                transition: 'all 0.3s ease',
              }}
            />
          ))}
        </div>

        {/* Next */}
        <button
          onClick={next}
          style={{
            width: '40px', height: '40px', borderRadius: '50%',
            background: navBg,
            border: `1px solid ${navBorder}`,
            color: navColor, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = isLight ? '#e2e8f0' : '#111827'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = navBg; }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      {/* Mobile: simple accordion fallback */}
      <div className="flex lg:hidden flex-col gap-3 w-full mt-4">
        {content.map((section, idx) => {
          const isExpanded = idx === active;
          return (
            <div
              key={idx}
              className="relative overflow-hidden rounded-2xl border transition-all duration-300"
              style={{
                background: isExpanded ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.02)',
                borderColor: isExpanded ? section.accent : 'rgba(255,255,255,0.1)',
              }}
            >
              <button
                className="w-full flex items-center justify-between p-5 text-left"
                onClick={() => setActive(isExpanded ? (idx + 1) % total : idx)}
              >
                <span className="font-black uppercase tracking-tight text-lg" style={{ color: isExpanded ? section.accent : '#fff' }}>
                  {section.title}
                </span>
                <span className="text-xl font-bold transition-transform duration-300" style={{ color: section.accent, transform: isExpanded ? 'rotate(45deg)' : 'rotate(0deg)' }}>+</span>
              </button>
              {isExpanded && (
                <div className="px-5 pb-5 space-y-4">
                  {section.items.map((item, i) => (
                    <div key={i} className="flex flex-col border-b border-white/5 pb-3">
                      {typeof item === 'string' ? (
                        <div className="flex items-start gap-3">
                          <span className="text-[#10b981] font-black mt-0.5">✔</span>
                          <span className="text-base text-white font-bold leading-tight">{item}</span>
                        </div>
                      ) : (
                        <>
                          <span className="text-[0.6rem] font-bold opacity-40 uppercase tracking-widest mb-1">{item.label}</span>
                          <span className="text-lg text-white font-black leading-tight">{item.value}</span>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ExpandOnHover;
