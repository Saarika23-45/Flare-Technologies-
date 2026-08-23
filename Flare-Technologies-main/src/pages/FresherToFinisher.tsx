import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Upload, Send, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import SEO from '@/components/SEO';

/* ── LIQUID GLASS CSS ──────────────────────────────────────────── */
const GLASS_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap');
  .lq-glass {
    background: rgba(255,255,255,0.01);
    background-blend-mode: luminosity;
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    border: none;
    box-shadow: inset 0 1px 1px rgba(255,255,255,0.1);
    position: relative;
    overflow: hidden;
  }
  .lq-glass::before {
    content: '';
    position: absolute; inset: 0;
    border-radius: inherit;
    padding: 1.4px;
    background: linear-gradient(180deg,
      rgba(255,255,255,0.45) 0%,
      rgba(255,255,255,0.15) 20%,
      rgba(255,255,255,0) 40%,
      rgba(255,255,255,0) 60%,
      rgba(255,255,255,0.15) 80%,
      rgba(255,255,255,0.45) 100%
    );
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
  }
  @keyframes f2f-grad { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
  .f2f-roles-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:1.25rem; }
  @media(max-width:900px){ .f2f-roles-grid{grid-template-columns:repeat(2,1fr);} }
  @media(max-width:560px){ .f2f-roles-grid{grid-template-columns:1fr;} }
  .f2f-how-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:1.25rem; }
  @media(max-width:700px){ .f2f-how-grid{grid-template-columns:1fr;} }
  @media(max-width:700px){ .pitch-2col{grid-template-columns:1fr !important; gap:2rem !important;} }
  @media(max-width:640px){ .f2f-hero-content{ padding-top: 4.5rem !important; } }
`;

/* ── VIDEO URL ─────────────────────────────────────────────────── */
const VIDEO_SRC = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_115001_bcdaa3b4-03de-47e7-ad63-ae3e392c32d4.mp4';
/* ── ROLES DATA ─────────────────────────────────────────────────── */
const roles = [
  { title: "Founder's Office", color: '#FF8C00', hook: "Maybe you started something once and it didn't work out. But for those few months, you knew what it felt like to carry something on your shoulders.", tagline: "We want that person back in the game.", detail: "Work directly with Flare's founder: strategy, proposals, real decisions, the actual inside view of running an agency." },
  { title: 'Design', color: '#a855f7', hook: "Maybe you've spent hours perfecting a poster for a college fest that nobody paid you for, just because it had to look right.", tagline: "That obsession? We need it.", detail: "Design real creatives for real, live client brands. Not mock briefs for a portfolio nobody will see." },
  { title: 'Video & Motion', color: '#06b6d4', hook: "Maybe you've stayed up all night editing a 30-second reel that got 200 views, and you still don't regret a second of it.", tagline: "That commitment is exactly what we're looking for.", detail: "Shoot and edit real content for brands people actually follow." },
  { title: 'Growth & Outreach', color: '#10b981', hook: "Maybe you're the one in your friend group who can convince anyone of anything. The one who got everyone to agree on one restaurant.", tagline: "Scale that up.", detail: "Own outreach and lead generation for real client pipelines." },
  { title: 'Product', color: '#3b82f6', hook: "Maybe you've looked at an app you use every day and thought 'I could make this better' and actually sketched out how.", tagline: "Now build it for real.", detail: "Help shape and build what Flare and its clients actually ship." },
  { title: 'Project Management', color: '#f59e0b', hook: "Maybe you're the one who always ends up making the group project actually happen while everyone else just talks about it.", tagline: "We have entire client accounts that need you.", detail: "Keep real client work on track across teams and deadlines." },
  { title: 'HR', color: '#ec4899', hook: "Maybe you're the one your friends come to when they need to be heard, or need a plan, or just need someone who gets it.", tagline: "That's a skill. A rare one.", detail: "Help build the team and culture behind everything Flare does." },
];

/* ── HOW IT WORKS ───────────────────────────────────────────────── */
const howItWorks = [
  { label: '3 Months', detail: 'No pay. All training, mentorship, and real client work covered by us.', img: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&q=60&auto=format&fit=crop' },
  { label: 'Live Brands', detail: 'You work directly on brands Flare already manages. Not simulated projects.', img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=60&auto=format&fit=crop' },
  { label: 'Honest Outcome', detail: "If you're good, you're hired. If not there yet, we tell you honestly and help you find where you fit.", img: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=600&q=60&auto=format&fit=crop' },
];

/* ── VIDEO HERO ─────────────────────────────────────────────────── */
const VideoHero: React.FC<{ onCTA: () => void }> = ({ onCTA }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const fadingOutRef = useRef(false);
  const rafRef = useRef<number>(0);

  const fadeTo = (target: number, duration: number, onDone?: () => void) => {
    cancelAnimationFrame(rafRef.current);
    const vid = videoRef.current;
    if (!vid) return;
    const start = Number(vid.style.opacity) || 0;
    const startTime = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - startTime) / duration, 1);
      vid.style.opacity = String(start + (target - start) * t);
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
      else { vid.style.opacity = String(target); onDone?.(); }
    };
    rafRef.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    // Inject a <link rel="preload"> so the browser fetches the video immediately
    const preloadLink = document.createElement('link');
    preloadLink.rel = 'preload';
    preloadLink.as = 'video';
    preloadLink.href = VIDEO_SRC;
    document.head.appendChild(preloadLink);

    const vid = videoRef.current;
    if (!vid) return () => { preloadLink.remove(); };
    vid.style.opacity = '0';

    // loadeddata fires as soon as the first frame is ready — much faster than canplay
    const handleLoadedData = () => { fadingOutRef.current = false; fadeTo(1, 400); };
    const handleTimeUpdate = () => {
      if (!vid.duration) return;
      const remaining = vid.duration - vid.currentTime;
      if (remaining <= 0.55 && !fadingOutRef.current) {
        fadingOutRef.current = true;
        fadeTo(0, 500);
      }
    };
    const handleEnded = () => {
      vid.style.opacity = '0';
      fadingOutRef.current = false;
      setTimeout(() => { vid.currentTime = 0; vid.play(); fadeTo(1, 400); }, 100);
    };

    vid.addEventListener('loadeddata', handleLoadedData);
    vid.addEventListener('timeupdate', handleTimeUpdate);
    vid.addEventListener('ended', handleEnded);
    return () => {
      cancelAnimationFrame(rafRef.current);
      preloadLink.remove();
      vid.removeEventListener('loadeddata', handleLoadedData);
      vid.removeEventListener('timeupdate', handleTimeUpdate);
      vid.removeEventListener('ended', handleEnded);
    };
  }, []);

  return (
    <section style={{ position: 'relative', minHeight: '100svh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', background: '#000' }}>
      {/* Video — preload="auto" tells browser to buffer it immediately */}
      <video
        ref={videoRef}
        src={VIDEO_SRC}
        autoPlay muted playsInline loop={false}
        preload="auto"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transform: 'translateY(17%)', opacity: 0, zIndex: 0 }}
      />
      {/* Dark overlay for text readability */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.35) 40%, rgba(0,0,0,0.65) 100%)', zIndex: 1 }} />

      {/* Content */}
      <div className="f2f-hero-content" style={{ position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: '720px', width: '100%', padding: '5rem 1.5rem 2rem' }}>
        <motion.span
          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          style={{ display: 'inline-block', fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)', marginBottom: '1.5rem' }}>
          Flare Technologies Presents
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
          style={{ fontFamily: "'Instrument Serif', serif", fontSize: 'clamp(3.5rem,10vw,7rem)', fontWeight: 400, letterSpacing: '-0.02em', lineHeight: 1.0, margin: '0 0 1.5rem', color: '#ffffff', textShadow: '0 2px 40px rgba(0,0,0,0.7)' }}>
          Fresher to{' '}
          <span style={{ fontStyle: 'italic', background: 'linear-gradient(90deg,#FF8C00,#ffb347,#FF8C00)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundSize: '200% 100%', animation: 'f2f-grad 3s ease infinite' }}>Finisher</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.25 }}
          style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(1rem,2.2vw,1.2rem)', color: 'rgba(255,255,255,0.88)', lineHeight: 1.7, maxWidth: '540px', margin: '0 auto 0.75rem' }}>
          You don't need to have it all figured out. You just need to want it badly enough.
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7, delay: 0.4 }}
          style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(0.8rem,1.4vw,0.92rem)', color: 'rgba(255,255,255,0.75)', lineHeight: 1.7, maxWidth: '460px', margin: '0 auto 2.5rem' }}>
          In 7 years, we've built 200+ companies. We know exactly what kind of person it takes. And we're done waiting for them to find us.
        </motion.p>

        <motion.button
          initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.5 }}
          onClick={onCTA}
          className="lq-glass"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', padding: '0.85rem 2.25rem', borderRadius: '999px', color: '#fff', fontWeight: 700, fontSize: '1rem', fontFamily: 'var(--font-body)', cursor: 'pointer', background: 'rgba(255,140,0,0.18)', transition: 'background 0.2s' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,140,0,0.3)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,140,0,0.18)'; }}>
          Show us what you've got <ArrowRight size={17} />
        </motion.button>
      </div>

      {/* Scroll hint */}
      <div style={{ position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
        <div style={{ width: '1px', height: '40px', background: 'linear-gradient(180deg, transparent, rgba(255,255,255,0.35))', animation: 'f2f-grad 2s ease infinite' }} />
      </div>
    </section>
  );
};

/* ── APPLY FORM ─────────────────────────────────────────────────── */
interface F2FFormState { name: string; email: string; phone: string; why: string; role: string; }

const ApplySection: React.FC<{ preselect?: string | null }> = ({ preselect }) => {
  const [form, setForm] = useState<F2FFormState>({ name: '', email: '', phone: '', why: '', role: preselect || '' });
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => { if (preselect) setForm(prev => ({ ...prev, role: preselect })); }, [preselect]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      if (f.size > 10 * 1024 * 1024) { setErrorMsg('File must be under 10MB'); e.target.value = ''; return; }
      setFile(f); setErrorMsg('');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.role) { setErrorMsg('Please select a role'); return; }
    if (!file) { setErrorMsg('Please upload your resume'); return; }
    setStatus('uploading'); setErrorMsg('');
    try {
      const ext = file.name.split('.').pop();
      const fileName = `f2f-${Date.now()}-${form.name.replace(/\s+/g, '-')}.${ext}`;
      const { error: uploadError } = await supabase.storage.from('resumes').upload(fileName, file, { contentType: file.type });
      if (uploadError) throw uploadError;
      const { data: urlData } = supabase.storage.from('resumes').getPublicUrl(fileName);
      const { error: dbError } = await supabase.from('f2f_applications').insert([{
        name: form.name, role: form.role, why: form.why,
        resume_url: urlData.publicUrl, email: form.email, phone: form.phone,
      }]);
      if (dbError) throw dbError;
      setStatus('success');
    } catch (err: unknown) {
      setStatus('error');
      setErrorMsg((err as { message?: string }).message || 'Something went wrong. Try again.');
    }
  };

  const inp: React.CSSProperties = { width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '12px', padding: '0.85rem 1rem', color: '#fff', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box', fontFamily: 'var(--font-body)' };
  const lbl: React.CSSProperties = { display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: '0.4rem' };

  if (status === 'success') return (
    <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
      <CheckCircle size={52} color="#10b981" style={{ margin: '0 auto 1rem' }} />
      <h3 style={{ color: '#fff', fontWeight: 800, fontSize: '1.4rem', marginBottom: '0.5rem' }}>We got it.</h3>
      <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1rem', maxWidth: '380px', margin: '0 auto' }}>
        We'll look at what you've made and reach out if it resonates. Good luck. If you made it this far, you probably don't need it.
      </p>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div>
        <label style={lbl}>Your Name *</label>
        <input required name="name" type="text" placeholder="Full name" value={form.name} onChange={handleChange} style={inp} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
        <div>
          <label style={lbl}>Email *</label>
          <input required name="email" type="email" placeholder="you@email.com" value={form.email} onChange={handleChange} style={inp} />
        </div>
        <div>
          <label style={lbl}>Phone *</label>
          <input required name="phone" type="tel" placeholder="+91 XXXXX XXXXX" value={form.phone} onChange={handleChange} style={inp} />
        </div>
      </div>
      <div>
        <label style={lbl}>Which role? *</label>
        <select required name="role" value={form.role} onChange={handleChange}
          style={{ ...inp, appearance: 'none', cursor: 'pointer', color: form.role ? '#fff' : 'rgba(255,255,255,0.35)', background: '#0d1526' }}>
          <option value="" disabled style={{ background: '#0d1526', color: 'rgba(255,255,255,0.35)' }}>Select a track</option>
          {roles.map(r => <option key={r.title} value={r.title} style={{ background: '#0d1526', color: '#fff' }}>{r.title}</option>)}
        </select>
      </div>
      <div>
        <label style={lbl}>Upload your resume *</label>
        <input ref={fileRef} type="file" accept=".pdf,.doc,.docx" onChange={handleFile} style={{ display: 'none' }} />
        {file ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '10px', padding: '0.7rem 1rem' }}>
            <Upload size={14} color="#10b981" />
            <span style={{ color: '#10b981', fontSize: '0.875rem', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.name}</span>
            <button type="button" onClick={() => { setFile(null); if (fileRef.current) fileRef.current.value = ''; }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#f87171', padding: '2px' }}><X size={14} /></button>
          </div>
        ) : (
          <button type="button" onClick={() => fileRef.current?.click()} style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px dashed rgba(255,255,255,0.18)', borderRadius: '10px', padding: '0.9rem', color: 'rgba(255,255,255,0.45)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.875rem', fontFamily: 'var(--font-body)' }}>
            <Upload size={15} /> Click to upload resume (PDF/DOC)
          </button>
        )}
      </div>
      <div>
        <label style={lbl}>Why do you want in? *</label>
        <textarea required name="why" rows={3} placeholder="Be honest. One sentence or a paragraph. Just make it real."
          value={form.why} onChange={handleChange} style={{ ...inp, resize: 'none' }} />
      </div>
      {errorMsg && <p style={{ color: '#f87171', fontSize: '0.82rem', margin: 0 }}>{errorMsg}</p>}
      <button type="submit" disabled={status === 'uploading'}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.9rem 2rem', background: 'linear-gradient(135deg,#FF8C00,#ff6b00)', color: '#fff', fontWeight: 800, fontSize: '1rem', border: 'none', borderRadius: '999px', cursor: 'pointer', fontFamily: 'var(--font-body)', boxShadow: '0 4px 24px rgba(255,140,0,0.35)', transition: 'transform 0.2s, box-shadow 0.2s' }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(255,140,0,0.5)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 24px rgba(255,140,0,0.35)'; }}>
        {status === 'uploading' ? 'Sending...' : <><Send size={16} /> Show us what you've got</>}
      </button>
    </form>
  );
};

/* ── ROLE CARD ──────────────────────────────────────────────────── */
const RoleCard: React.FC<{ role: typeof roles[0]; onApply: (t: string) => void }> = ({ role, onApply }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.5 }}
    style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${role.color}33`, borderRadius: '20px', padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '0.9rem' }}
    whileHover={{ y: -5, boxShadow: `0 16px 40px -8px ${role.color}30` }}
    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = `${role.color}66`; }}
    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = `${role.color}33`; }}
  >
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
      <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 800, color: role.color, margin: 0 }}>{role.title}</h3>
      <button type="button" onClick={() => onApply(role.title)}
        style={{ padding: '0.3rem 0.85rem', border: `1px solid ${role.color}`, color: role.color, background: 'transparent', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-body)', whiteSpace: 'nowrap', transition: 'background 0.2s' }}
        onMouseEnter={e => { e.currentTarget.style.background = `${role.color}18`; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
        Apply
      </button>
    </div>
    <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.88rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, margin: 0, fontStyle: 'italic' }}>"{role.hook}"</p>
    <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', fontWeight: 700, color: role.color, margin: 0 }}>{role.tagline}</p>
    <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.65, margin: 0, paddingTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>{role.detail}</p>
  </motion.div>
);

/* ── MAIN PAGE ──────────────────────────────────────────────────── */
const FresherToFinisher: React.FC = () => {
  const [applyRole, setApplyRole] = useState<string | null>(null);
  const applyRef = useRef<HTMLDivElement>(null);

  const scrollToApply = (role?: string) => {
    if (role) setApplyRole(role);
    applyRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <>
      <SEO
        title="Fresher to Finisher | Flare Technologies"
        description="Zero cost. Real work. Three months. Flare Technologies is building its next cohort. 7 tracks, live client work, and a shot at getting hired."
        canonical="https://www.flaretechnologies.in/fresher-to-finisher"
      />
      <main style={{ background: '#060b17', color: '#fff', overflowX: 'hidden' }}>
        <style>{GLASS_CSS}</style>

        {/* ── VIDEO HERO ─────────────────────────────── */}
        <VideoHero onCTA={() => scrollToApply()} />

        {/* ── THE PITCH ──────────────────────────────── */}
        <section style={{ padding: 'clamp(5rem,9vw,6.5rem) clamp(1rem,4vw,2rem)', borderTop: '1px solid rgba(255,255,255,0.06)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '50%', left: '0', transform: 'translateY(-50%)', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,140,0,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ maxWidth: '1000px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
            <div className="pitch-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
              <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
                <span style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#FF8C00', display: 'block', marginBottom: '1.25rem' }}>The Pitch</span>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.75rem,4vw,2.5rem)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.2, color: '#fff', margin: '0 0 1.5rem' }}>
                  This is the platform<br />for <span style={{ color: '#FF8C00' }}>that person.</span>
                </h2>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '1.05rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.8, margin: '0 0 0.75rem' }}>We don't care what your resume says.</p>
                <p style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: 700, color: 'rgba(255,255,255,0.85)', lineHeight: 1.6, margin: 0 }}>We care what you're willing to build.</p>
              </motion.div>
              <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.15 }} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                {[
                  { text: "Maybe you feel like you're lagging behind. Maybe you tried something. A startup, a project, an idea. And it didn't work.", em: true },
                  { text: "Maybe everyone around you is collecting internships like trophies, and you don't have one.", em: true },
                  { text: "Maybe you have something different in you that nobody's bothered to notice yet.", em: true },
                ].map((item, i) => (
                  <div key={i} style={{ background: 'rgba(255,140,0,0.07)', border: '1px solid rgba(255,140,0,0.25)', borderRadius: '14px', padding: '1rem 1.25rem' }}>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', color: i === 2 ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.75)', lineHeight: 1.75, margin: 0, fontStyle: 'italic', fontWeight: i === 2 ? 600 : 400 }}>{item.text}</p>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── WHAT WE ACTUALLY DO ────────────────────── */}
        <section style={{ padding: 'clamp(5rem,9vw,6.5rem) clamp(1rem,4vw,2rem)', background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', bottom: 0, right: '5%', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,140,0,0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <span style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#FF8C00', display: 'block', marginBottom: '0.75rem' }}>What We Actually Do</span>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.75rem,4vw,2.4rem)', fontWeight: 900, letterSpacing: '-0.03em', color: '#fff', lineHeight: 1.2, margin: '0 0 1rem' }}>
                We prepare you. We build you. We pitch you. We get you hired.
              </h2>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.75 }}>
                All of it, for zero cost. Three months of honest, real work is all we ask.
              </p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}
              style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.65rem', marginBottom: '2.5rem' }}>
              {['Skills', 'Confidence', 'Real Portfolio', 'Live Client Work', 'Actual Placement'].map(pill => (
                <span key={pill} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.4rem 1rem', background: 'rgba(255,140,0,0.1)', border: '1px solid rgba(255,140,0,0.3)', borderRadius: '999px', fontSize: '0.83rem', fontWeight: 700, color: '#FF8C00', fontFamily: 'var(--font-body)' }}>
                  <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#FF8C00', display: 'inline-block', flexShrink: 0 }} />{pill}
                </span>
              ))}
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}
              style={{ background: 'linear-gradient(135deg, rgba(255,140,0,0.06) 0%, rgba(255,107,0,0.03) 100%)', border: '1px solid rgba(255,140,0,0.2)', borderRadius: '18px', padding: '1.75rem 2rem', display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '1.25rem', alignItems: 'start' }}>
              <div style={{ width: '3px', background: 'linear-gradient(180deg,#FF8C00,rgba(255,140,0,0.2))', borderRadius: '3px', alignSelf: 'stretch', minHeight: '55px' }} />
              <div>
                <p style={{ fontFamily: 'var(--font-heading)', fontSize: '0.72rem', fontWeight: 800, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.12em', margin: '0 0 0.5rem' }}>What this isn't</p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.97rem', color: 'rgba(255,255,255,0.68)', lineHeight: 1.8, margin: 0 }}>
                  This isn't an internship that has you fetching coffee. This isn't a certificate course that teaches you theory. This is real client work, from day one, with real stakes. Because that's the only way anyone actually gets good at anything.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── HOW IT WORKS: compact with bg images, no icons ─── */}
        <section style={{ padding: 'clamp(3.5rem,7vw,5rem) clamp(1rem,4vw,2rem)' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} style={{ marginBottom: '2rem', textAlign: 'center' }}>
              <span style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#FF8C00', display: 'block', marginBottom: '0.5rem' }}>How It Works</span>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.35rem,3vw,1.9rem)', fontWeight: 900, letterSpacing: '-0.02em', color: '#fff', margin: 0 }}>Simple. No fluff.</h2>
            </motion.div>
            <div className="f2f-how-grid">
              {howItWorks.map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
                  style={{ position: 'relative', borderRadius: '18px', overflow: 'hidden', minHeight: '200px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                  {/* Background image */}
                  <img src={item.img} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }} />
                  {/* Gradient overlay */}
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(6,11,23,0.2) 0%, rgba(6,11,23,0.92) 75%)', zIndex: 1 }} />
                  {/* Content */}
                  <div style={{ position: 'relative', zIndex: 2, padding: '1.5rem' }}>
                    <p style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', fontWeight: 800, color: '#fff', margin: '0 0 0.4rem' }}>{item.label}</p>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'rgba(255,255,255,0.62)', lineHeight: 1.65, margin: 0 }}>{item.detail}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── THE ROLES ──────────────────────────────── */}
        <section style={{ padding: 'clamp(5rem,9vw,6.5rem) clamp(1rem,4vw,2rem)', background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <span style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#FF8C00', display: 'block', marginBottom: '0.75rem' }}>Seven Tracks</span>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.5rem,4vw,2.25rem)', fontWeight: 900, letterSpacing: '-0.02em', color: '#fff', margin: '0 0 0.75rem' }}>Find your role</h2>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.97rem', color: 'rgba(255,255,255,0.5)', maxWidth: '480px', margin: '0 auto', lineHeight: 1.7 }}>
                Apply only if you're genuinely passionate about the work, not the title.
              </p>
            </motion.div>
            <div className="f2f-roles-grid">
              {roles.map(role => (
                <RoleCard key={role.title} role={role} onApply={(title) => { setApplyRole(title); scrollToApply(title); }} />
              ))}
            </div>
          </div>
        </section>

        {/* ── THE FILTER: no heading ──────────────────── */}
        <section style={{ padding: 'clamp(3rem,5vw,4rem) clamp(1rem,4vw,2rem)', borderTop: '1px solid rgba(255,255,255,0.06)', position: 'relative', overflow: 'hidden', textAlign: 'center' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 70% 100% at 50% 50%, rgba(255,140,0,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ maxWidth: '560px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <p style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.25rem,3vw,1.75rem)', fontWeight: 900, letterSpacing: '-0.02em', color: '#fff', lineHeight: 1.3, margin: '0 0 0.75rem' }}>
                If you love working and people haven't noticed yet,<br />this is where you prove it.
              </p>
              <button onClick={() => scrollToApply()}
                style={{ marginTop: '1.25rem', display: 'inline-flex', alignItems: 'center', gap: '0.45rem', padding: '0.75rem 2rem', background: 'linear-gradient(135deg,#FF8C00,#ff6b00)', color: '#fff', fontWeight: 800, fontSize: '0.95rem', border: 'none', borderRadius: '999px', cursor: 'pointer', fontFamily: 'var(--font-body)', boxShadow: '0 4px 20px rgba(255,140,0,0.35)', transition: 'transform 0.2s,box-shadow 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(255,140,0,0.55)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 20px rgba(255,140,0,0.35)'; }}>
                I'm ready <ArrowRight size={15} />
              </button>
            </motion.div>
          </div>
        </section>

        {/* ── APPLY FORM ─────────────────────────────── */}
        <section ref={applyRef} style={{ padding: 'clamp(5rem,9vw,6.5rem) clamp(1rem,4vw,2rem)', background: 'rgba(255,140,0,0.04)', borderTop: '1px solid rgba(255,140,0,0.15)' }}>
          <div style={{ maxWidth: '540px', margin: '0 auto' }}>
            <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} style={{ marginBottom: '1.75rem', textAlign: 'center' }}>
              <span style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#FF8C00', display: 'block', marginBottom: '0.75rem' }}>How to Apply</span>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.5rem,4vw,2rem)', fontWeight: 900, color: '#fff', margin: '0 0 0.75rem' }}>Show us what you've got.</h2>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.97rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.7 }}>
                Your name, your role, your resume, and one line on why you want in. That's it.
              </p>
            </motion.div>
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '2rem' }}>
              <ApplySection preselect={applyRole} />
            </div>
          </div>
        </section>

      </main>
    </>
  );
};

export default FresherToFinisher;
