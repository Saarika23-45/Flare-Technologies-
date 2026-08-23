import React, { useEffect, useRef } from 'react';

const stats = [
  { value: '100+', label: 'Projects Delivered' },
  { value: '4+',   label: 'Countries Served' },
  { value: '18+',  label: 'Industries Served' },
];

const WhoWeAre: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    if (sectionRef.current) {
      sectionRef.current.querySelectorAll('.scroll-anim').forEach(el => observer.observe(el));
    }
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: 'var(--theme-bg-main)',
        borderTop: '1px solid var(--theme-border)',
        padding: 'clamp(3rem, 6vw, 5rem) 0',
      }}
    >
      <div className="container">
        <div
          className="scroll-anim slide-up"
          style={{
            position: 'relative',
            zIndex: 1,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 420px), 1fr))',
            gap: '3rem',
            alignItems: 'center',
          }}
        >
          {/* Left: badge + headline + body + stats */}
          <div>
            <span className="section-badge">Who We Are</span>
            <h2 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
              fontWeight: 800,
              color: 'var(--theme-text-primary)',
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
              margin: '0.5rem 0 0.5rem',
            }}>
              More than an agency.{' '}
              <span style={{ color: 'var(--theme-primary)' }}>Your growth engineering partner.</span>
            </h2>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(0.9375rem, 2vw, 1.0625rem)',
              color: 'var(--theme-text-secondary)',
              lineHeight: 1.75,
              margin: '1rem 0 2rem',
              maxWidth: '820px',
            }}>
              Built for the modern business, Flare Technologies connects the dots between technology, automation, and marketing — so your business doesn't have to manage three vendors to do one job. We are a team of developers, designers, and growth strategists committed to one goal: building systems that help businesses save time, reach more customers, and grow faster.
            </p>

            {/* Stats row */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0',
              borderTop: '1px solid var(--theme-border)',
              borderBottom: '1px solid var(--theme-border)',
            }}>
              {stats.map((stat, i) => (
                <div
                  key={i}
                  style={{
                    flex: '1 1 120px',
                    padding: '1.5rem 1.25rem',
                    borderRight: i < stats.length - 1 ? '1px solid var(--theme-border)' : 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.25rem',
                  }}
                >
                  <span style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                    fontWeight: 900,
                    color: 'var(--theme-primary)',
                    lineHeight: 1,
                    letterSpacing: '-0.02em',
                  }}>
                    {stat.value}
                  </span>
                  <span style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.8125rem',
                    color: 'var(--theme-text-muted)',
                    fontWeight: 500,
                  }}>
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
          {/* Right: image */}
          <div style={{
            position: 'relative',
            borderRadius: '20px',
            overflow: 'hidden',
            aspectRatio: '4/3',
            boxShadow: '0 24px 64px rgba(0,0,0,0.25)',
            border: '1px solid var(--theme-border)',
            flexShrink: 0,
          }}>
            <img
              src="/who-we-are.webp"
              alt="Flare Technologies team"
              width="800"
              height="1198"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center',
                display: 'block',
              }}
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhoWeAre;
