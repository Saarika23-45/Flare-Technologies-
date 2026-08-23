import { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { mainServicesData } from '@/data/mainServicesData';
import { ArrowLeft, CheckCircle2, ArrowRight } from 'lucide-react';
import SEO from '@/components/SEO';

interface Props { openModal: () => void; }

export default function MainServiceDetail({ openModal }: Props) {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const svc = mainServicesData.find(s => s.slug === slug);

  useEffect(() => {
    if (typeof window !== 'undefined') window.scrollTo(0, 0);
  }, [slug]);

  if (!svc) {
    return (
      <main style={{ minHeight: '100vh', background: 'var(--bg-base)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem', textAlign: 'center', padding: '2rem' }}>
        <h1 style={{ color: 'var(--theme-text-primary)', fontSize: '2rem', fontWeight: 800 }}>Service Not Found</h1>
        <Link to="/services" className="btn btn-primary">← Back to Services</Link>
      </main>
    );
  }

  return (
    <main style={{ background: 'var(--bg-base)', minHeight: '100vh', paddingBottom: '5rem' }}>
      <SEO
        title={`${svc.label} | Flare Technologies`}
        description={svc.tagline}
        canonical={`https://www.flaretechnologies.in/main-services/${svc.slug}`}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Service",
        "name": svc.label,
        "description": svc.tagline,
        "url": `https://www.flaretechnologies.in/main-services/${svc.slug}`,
        "provider": {
          "@type": "Organization",
          "name": "Flare Technologies",
          "url": "https://www.flaretechnologies.in"
        },
        "areaServed": {
          "@type": "Country",
          "name": "India"
        },
        "serviceOutput": svc.outcomes[0] ?? svc.tagline
      }) }} />

      {/* ── HERO ── */}
      <div style={{ position: 'relative', height: 'clamp(320px, 45vw, 520px)', overflow: 'hidden' }}>
        <img
          src={svc.heroImage}
          alt={svc.label}
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
        />
        {/* Dark gradient overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, color-mix(in srgb, var(--theme-bg-main) 40%, transparent) 0%, color-mix(in srgb, var(--theme-bg-main) 92%, transparent) 100%)' }} />
        {/* Colored accent line at bottom */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '3px', background: `linear-gradient(90deg, ${svc.color}, transparent)` }} />

        {/* Hero content */}
        <div className="container" style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: 'clamp(5rem,10vw,8rem) 1rem 2.5rem' }}>
          <Link
            to="/services"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--theme-text-secondary)', fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none', marginBottom: '1.25rem', width: 'fit-content' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--theme-text-primary)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--theme-text-secondary)')}
          >
            <ArrowLeft style={{ width: '14px', height: '14px' }} /> Back to Services
          </Link>
          <span style={{ display: 'inline-block', padding: '0.25rem 0.75rem', borderRadius: '999px', border: `1px solid ${svc.color}50`, background: `${svc.color}15`, color: svc.color, fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.75rem', width: 'fit-content' }}>
            {svc.label}
          </span>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.75rem, 5vw, 3.25rem)', fontWeight: 900, color: 'var(--theme-text-primary)', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '0.75rem', maxWidth: '720px' }}>
            {svc.headline}
          </h1>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(0.9rem, 2vw, 1.0625rem)', color: 'var(--theme-text-secondary)', lineHeight: 1.65, maxWidth: '580px' }}>
            {svc.tagline}
          </p>
        </div>
      </div>

      <div className="container" style={{ padding: '0 1rem', maxWidth: '1100px', margin: '0 auto' }}>

        {/* ── SUB-SERVICES ── */}
        <section style={{ padding: '3.5rem 0 2.5rem' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.25rem, 3vw, 1.75rem)', fontWeight: 800, color: 'var(--theme-text-primary)', marginBottom: '0.5rem' }}>
            What's Included
          </h2>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9375rem', color: 'var(--theme-text-secondary)', marginBottom: '2rem' }}>
            Every engagement under {svc.label} covers these core areas.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))', gap: '1rem' }}>
            {svc.subServices.map((sub, i) => (
              <div key={i} style={{
                background: 'var(--theme-surface)',
                border: `1px solid ${svc.color}20`,
                borderRadius: '14px',
                padding: '1.25rem 1.5rem',
                display: 'flex',
                gap: '0.875rem',
                alignItems: 'flex-start',
                transition: 'border-color 0.2s, box-shadow 0.2s',
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = `${svc.color}50`; (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 20px ${svc.color}15`; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = `${svc.color}20`; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
              >
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: svc.color, flexShrink: 0, marginTop: '6px', boxShadow: `0 0 8px ${svc.color}80` }} />
                <div>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.9375rem', fontWeight: 700, color: 'var(--theme-text-primary)', marginBottom: '0.3rem' }}>{sub.title}</h3>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8375rem', color: 'var(--theme-text-secondary)', lineHeight: 1.6, margin: 0 }}>{sub.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── PROCESS + OUTCOMES ── */}
        <section style={{ padding: '2.5rem 0', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 440px), 1fr))', gap: '3rem', alignItems: 'start' }}>

          {/* Process — flowchart style */}
          <div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.25rem, 3vw, 1.75rem)', fontWeight: 800, color: 'var(--theme-text-primary)', marginBottom: '0.5rem' }}>
              How We Execute
            </h2>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9375rem', color: 'var(--theme-text-secondary)', marginBottom: '2rem' }}>
              A structured, repeatable process that delivers results every time.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {svc.process.map((step, i) => (
                <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'stretch' }}>
                  {/* Left: number + connector line */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                    <div style={{
                      width: '36px', height: '36px', borderRadius: '50%',
                      background: `${svc.color}18`,
                      border: `2px solid ${svc.color}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: 'var(--font-heading)', fontSize: '0.8125rem', fontWeight: 800,
                      color: svc.color, flexShrink: 0,
                    }}>
                      {String(i + 1).padStart(2, '0')}
                    </div>
                    {i < svc.process.length - 1 && (
                      <div style={{ width: '2px', flex: 1, background: `${svc.color}25`, margin: '4px 0' }} />
                    )}
                  </div>
                  {/* Right: content */}
                  <div style={{ paddingBottom: i < svc.process.length - 1 ? '1.5rem' : '0', paddingTop: '4px' }}>
                    <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 700, color: 'var(--theme-text-primary)', marginBottom: '0.3rem' }}>{step.title}</h3>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: 'var(--theme-text-secondary)', lineHeight: 1.65, margin: 0 }}>{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Outcomes */}
          <div style={{ position: 'sticky', top: '6rem' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.25rem, 3vw, 1.75rem)', fontWeight: 800, color: 'var(--theme-text-primary)', marginBottom: '0.5rem' }}>
              Key Outcomes
            </h2>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9375rem', color: 'var(--theme-text-secondary)', marginBottom: '2rem' }}>
              What you can expect when we work together.
            </p>
            <div style={{
              background: 'var(--theme-surface)',
              border: `1px solid ${svc.color}25`,
              borderRadius: '20px',
              padding: '2rem',
              boxShadow: `0 0 40px ${svc.color}10`,
            }}>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {svc.outcomes.map((outcome, i) => (
                  <li key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                    <CheckCircle2 style={{ width: '18px', height: '18px', color: svc.color, flexShrink: 0, marginTop: '2px' }} />
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.9375rem', color: 'var(--theme-text-primary)', lineHeight: 1.55 }}>{outcome}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section style={{ padding: '2.5rem 0 1rem' }}>
          <div style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '20px',
            padding: 'clamp(2rem, 4vw, 3.5rem)',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '500px', height: '300px', background: `radial-gradient(ellipse, ${svc.color}12 0%, transparent 70%)`, pointerEvents: 'none' }} />
            <div style={{ position: 'relative', zIndex: 1, maxWidth: '520px', margin: '0 auto' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.375rem, 3vw, 2rem)', fontWeight: 800, color: 'var(--theme-text-primary)', marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>
                Ready to Get Started?
              </h3>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9375rem', color: 'var(--theme-text-secondary)', lineHeight: 1.65, marginBottom: '2rem' }}>
                Book a free discovery call and we'll map out exactly how {svc.label} can work for your business.
              </p>
              <button onClick={openModal} className="btn btn-primary btn-large">
                Book a Free Call
              </button>
            </div>
          </div>
        </section>

        {/* ── OTHER SERVICES ── */}
        <section style={{ padding: '2.5rem 0' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 700, color: 'var(--theme-text-secondary)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>
            Explore Other Services
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            {mainServicesData.filter(s => s.slug !== svc.slug).map((other, i) => (
              <button
                key={i}
                onClick={() => navigate(`/main-services/${other.slug}`)}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                  padding: '0.45rem 1rem', borderRadius: '999px',
                  border: `1px solid ${other.color}30`, background: `${other.color}08`,
                  color: other.color, fontSize: '0.8125rem', fontWeight: 600,
                  cursor: 'pointer', transition: 'all 0.2s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = `${other.color}18`; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = `${other.color}08`; }}
              >
                {other.label} <ArrowRight style={{ width: '12px', height: '12px' }} />
              </button>
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}
