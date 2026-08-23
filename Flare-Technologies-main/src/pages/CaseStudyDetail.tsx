import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { ArrowLeft } from 'lucide-react';
import SEO from '@/components/SEO';

interface CaseStudy {
  id: number;
  created_at: string;
  title: string;
  client: string;
  industry: string;
  summary: string;
  challenge: string;
  solution: string;
  results: string;
  metric1_value: string; metric1_label: string;
  metric2_value: string; metric2_label: string;
  metric3_value: string; metric3_label: string;
  tags: string;
  cover_url: string;
  status: string;
}

export default function CaseStudyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cs, setCs] = useState<CaseStudy | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    supabase
      .from('case_studies')
      .select('*')
      .eq('id', id)
      .eq('status', 'published')
      .single()
      .then(({ data }) => {
        setCs(data as CaseStudy);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <main style={{ minHeight: '100vh', background: '#060b17', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'rgba(255,255,255,0.4)' }}>Loading…</p>
      </main>
    );
  }

  if (!cs) {
    return (
      <main style={{ minHeight: '100vh', background: '#060b17', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1.1rem' }}>Case study not found.</p>
        <Link to="/results" style={{ color: '#FF8C00', fontWeight: 700, textDecoration: 'none' }}>← Back to Results</Link>
      </main>
    );
  }

  const tags = cs.tags ? cs.tags.split(',').map(t => t.trim()).filter(Boolean) : [];
  const metrics = [
    { val: cs.metric1_value, lbl: cs.metric1_label },
    { val: cs.metric2_value, lbl: cs.metric2_label },
    { val: cs.metric3_value, lbl: cs.metric3_label },
  ].filter(m => m.val);

  return (
    <main style={{ minHeight: '100vh', background: '#060b17', paddingBottom: '5rem' }}>
      <SEO
        title={`${cs.title} | Case Study — Flare Technologies`}
        description={cs.summary ? cs.summary.slice(0, 155) : `See how Flare Technologies delivered results for ${cs.client || 'this client'}.`}
        canonical={`https://www.flaretechnologies.in/case-studies/${cs.id}`}
        image={cs.cover_url || undefined}
      />

      {/* Hero cover */}
      <div style={{ position: 'relative', width: '100%', height: 'clamp(280px,45vw,520px)', overflow: 'hidden' }}>
        {cs.cover_url ? (
          <img src={cs.cover_url} alt={cs.title} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg,#0f172a,#1e293b)' }} />
        )}
        {/* gradient overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(6,11,23,0.3) 0%, rgba(6,11,23,0.92) 100%)' }} />

        {/* Back button */}
        <button
          onClick={() => navigate('/results')}
          style={{ position: 'absolute', top: 'clamp(5rem,10vw,7rem)', left: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', borderRadius: '999px', padding: '0.45rem 1rem', color: '#fff', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer' }}
        >
          <ArrowLeft size={14} /> Back to Results
        </button>

        {/* Title over image */}
        <div style={{ position: 'absolute', bottom: '2.5rem', left: 0, right: 0, padding: '0 clamp(1.25rem,5vw,4rem)' }}>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
            {cs.industry && (
              <span style={{ background: 'rgba(255,140,0,0.15)', border: '1px solid rgba(255,140,0,0.4)', color: '#FF8C00', fontSize: '0.72rem', fontWeight: 700, padding: '0.2rem 0.7rem', borderRadius: '999px' }}>
                {cs.industry}
              </span>
            )}
            {tags.map(t => (
              <span key={t} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.6)', fontSize: '0.7rem', padding: '0.15rem 0.6rem', borderRadius: '999px' }}>{t}</span>
            ))}
          </div>
          <h1 style={{ color: '#fff', fontWeight: 900, fontSize: 'clamp(1.6rem,4vw,3rem)', letterSpacing: '-0.03em', lineHeight: 1.1, margin: 0, maxWidth: '800px' }}>
            {cs.title}
          </h1>
          {cs.client && (
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
              Client: <strong style={{ color: 'rgba(255,255,255,0.8)' }}>{cs.client}</strong>
            </p>
          )}
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '3rem clamp(1.25rem,5vw,2rem) 0' }}>

        {/* Summary */}
        {cs.summary && (
          <p style={{ fontSize: 'clamp(1rem,2.5vw,1.25rem)', color: 'rgba(255,255,255,0.75)', lineHeight: 1.75, fontStyle: 'italic', borderLeft: '3px solid #FF8C00', paddingLeft: '1.25rem', marginBottom: '3rem' }}>
            {cs.summary}
          </p>
        )}

        {/* Metrics */}
        {metrics.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${metrics.length}, 1fr)`, gap: '1rem', marginBottom: '3.5rem' }}>
            {metrics.map((m, i) => (
              <div key={i} style={{ background: '#0f172a', border: '1px solid rgba(255,140,0,0.2)', borderRadius: '16px', padding: 'clamp(1rem,3vw,1.75rem)', textAlign: 'center' }}>
                <p style={{ color: '#FF8C00', fontWeight: 900, fontSize: 'clamp(2rem,5vw,3.5rem)', margin: '0 0 0.3rem', lineHeight: 1 }}>{m.val}</p>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', margin: 0, lineHeight: 1.4 }}>{m.lbl}</p>
              </div>
            ))}
          </div>
        )}

        {/* Story sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          {cs.challenge && <StorySection label="The Challenge" text={cs.challenge} accent="#2563EB" />}
          {cs.solution  && <StorySection label="Our Solution"  text={cs.solution}   accent="#FF8C00" />}
          {cs.results   && <StorySection label="Results & Outcomes" text={cs.results} accent="#10b981" />}
        </div>

        {/* Bottom CTA */}
        <div style={{ marginTop: '4rem', background: '#0f172a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '2.5rem', textAlign: 'center' }}>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>Want similar results?</p>
          <h3 style={{ color: '#fff', fontWeight: 900, fontSize: 'clamp(1.2rem,3vw,1.75rem)', margin: '0 0 1.5rem', letterSpacing: '-0.02em' }}>Let's talk about your business</h3>
          <Link to="/contact" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'linear-gradient(135deg,#FF8C00,#e67300)', border: 'none', borderRadius: '10px', padding: '0.75rem 1.75rem', color: '#fff', fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none' }}>
            Book a Free Consultation →
          </Link>
        </div>

      </div>
    </main>
  );
}

function StorySection({ label, text, accent }: { label: string; text: string; accent: string }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
        <div style={{ width: 4, height: 28, background: accent, borderRadius: '2px', flexShrink: 0 }} />
        <h2 style={{ color: '#fff', fontWeight: 800, fontSize: 'clamp(1.1rem,2.5vw,1.4rem)', margin: 0, letterSpacing: '-0.01em' }}>{label}</h2>
      </div>
      <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 'clamp(0.9rem,2vw,1rem)', lineHeight: 1.8, margin: 0, whiteSpace: 'pre-line', paddingLeft: '1rem' }}>
        {text}
      </p>
    </div>
  );
}
