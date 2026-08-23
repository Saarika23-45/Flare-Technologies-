import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Upload, X, Eye } from 'lucide-react';
import type { CaseStudy } from './AdminCaseStudies';

const EMPTY: Omit<CaseStudy, 'id' | 'created_at' | 'updated_at'> = {
  title: '', client: '', industry: '', summary: '',
  challenge: '', solution: '', results: '',
  metric1_value: '', metric1_label: '',
  metric2_value: '', metric2_label: '',
  metric3_value: '', metric3_label: '',
  tags: '', cover_url: '', status: 'draft',
};

// Shared styles (module-level, never recreated)
const inputStyle: React.CSSProperties = {
  width: '100%', boxSizing: 'border-box',
  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '9px', padding: '0.65rem 0.9rem',
  color: '#fff', fontSize: '0.875rem', outline: 'none', fontFamily: 'inherit',
};
const taStyle: React.CSSProperties = { ...inputStyle, resize: 'vertical', lineHeight: 1.6 };
const labelStyle: React.CSSProperties = {
  color: 'rgba(255,255,255,0.4)', fontSize: '0.72rem', fontWeight: 700,
  textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.4rem', display: 'block',
};

// ── Card wrapper ──────────────────────────────────────────────────────────
function Card({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', overflow: 'hidden' }}>
      <div style={{ padding: '0.9rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <p style={{ color: '#fff', fontWeight: 700, fontSize: '0.875rem', margin: 0 }}>{title}</p>
        {subtitle && <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', margin: '0.15rem 0 0' }}>{subtitle}</p>}
      </div>
      <div style={{ padding: '1.25rem' }}>{children}</div>
    </div>
  );
}

// ── Section block for preview ─────────────────────────────────────────────
function Section({ title, text }: { title: string; text: string }) {
  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 0.5rem' }}>{title}</p>
      <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', lineHeight: 1.7, margin: 0, whiteSpace: 'pre-line' }}>{text}</p>
    </div>
  );
}

// ── Preview modal (outside main component) ────────────────────────────────
function PreviewModal({ form, onClose }: { form: typeof EMPTY; onClose: () => void }) {
  return (
    <div onClick={e => e.target === e.currentTarget && onClose()} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.88)', zIndex: 1000, overflow: 'auto', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: '760px', margin: '0 auto', background: '#0f172a', borderRadius: '20px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
        {form.cover_url && <img src={form.cover_url} alt="" style={{ width: '100%', height: '280px', objectFit: 'cover' }} />}
        <div style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
            {form.industry && <span style={{ background: 'rgba(255,140,0,0.1)', border: '1px solid rgba(255,140,0,0.3)', color: '#FF8C00', fontSize: '0.72rem', fontWeight: 700, padding: '0.2rem 0.65rem', borderRadius: '999px' }}>{form.industry}</span>}
            {form.tags && form.tags.split(',').map(t => t.trim()).filter(Boolean).map(t => (
              <span key={t} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem', padding: '0.15rem 0.55rem', borderRadius: '999px' }}>{t}</span>
            ))}
          </div>
          <h2 style={{ color: '#fff', fontWeight: 900, fontSize: '1.75rem', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>{form.title || 'Untitled'}</h2>
          {form.client && <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>Client: <strong style={{ color: 'rgba(255,255,255,0.7)' }}>{form.client}</strong></p>}
          {form.summary && <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '1rem', lineHeight: 1.75, marginBottom: '2rem', fontStyle: 'italic', borderLeft: '3px solid #FF8C00', paddingLeft: '1rem' }}>{form.summary}</p>}
          {(form.metric1_value || form.metric2_value || form.metric3_value) && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: '1rem', marginBottom: '2rem' }}>
              {[{ val: form.metric1_value, lbl: form.metric1_label }, { val: form.metric2_value, lbl: form.metric2_label }, { val: form.metric3_value, lbl: form.metric3_label }]
                .filter(m => m.val).map((m, i) => (
                  <div key={i} style={{ background: 'rgba(255,140,0,0.07)', border: '1px solid rgba(255,140,0,0.2)', borderRadius: '12px', padding: '1rem', textAlign: 'center' }}>
                    <p style={{ color: '#FF8C00', fontWeight: 900, fontSize: '1.8rem', margin: '0 0 0.2rem', lineHeight: 1 }}>{m.val}</p>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.78rem', margin: 0 }}>{m.lbl}</p>
                  </div>
                ))}
            </div>
          )}
          {form.challenge && <Section title="The Challenge" text={form.challenge} />}
          {form.solution  && <Section title="Our Solution"  text={form.solution} />}
          {form.results   && <Section title="Results & Outcomes" text={form.results} />}
          <button onClick={onClose} style={{ marginTop: '1.5rem', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '0.5rem 1.2rem', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <X size={14} /> Close Preview
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Editor ───────────────────────────────────────────────────────────
export default function CaseStudyEditor() {
  const navigate   = useNavigate();
  const { id }     = useParams();
  const isNew      = id === 'new';

  const [form, setForm]           = useState({ ...EMPTY });
  const [saving, setSaving]       = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saved, setSaved]         = useState(false);
  const [preview, setPreview]     = useState(false);

  useEffect(() => {
    if (!isNew) {
      supabase.from('case_studies').select('*').eq('id', id).single().then(({ data }) => {
        if (data) setForm(data as CaseStudy);
      });
    }
  }, [id, isNew]);

  const set = (field: string, value: string) =>
    setForm(f => ({ ...f, [field]: value }));

  const uploadCover = async (file: File) => {
    if (file.size > 5 * 1024 * 1024) { alert('Max file size is 5MB'); return; }
    setUploading(true);
    const ext  = file.name.split('.').pop();
    const path = `covers/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from('resumes').upload(path, file, { upsert: true });
    if (!error) {
      const { data } = supabase.storage.from('resumes').getPublicUrl(path);
      set('cover_url', data.publicUrl);
    } else { alert('Upload failed: ' + error.message); }
    setUploading(false);
  };

  const save = async (publish?: boolean) => {
    if (!form.title.trim()) { alert('Title is required'); return; }
    setSaving(true);
    // Never send id, created_at in the payload — Supabase manages them
    const { id: _id, created_at: _ca, updated_at: _ua, ...rest } = form as CaseStudy;
    const payload = { ...rest, status: publish ? 'published' : form.status, updated_at: new Date().toISOString() };
    let error;
    if (isNew) {
      const res = await supabase.from('case_studies').insert([payload]).select().single();
      error = res.error;
      if (!error && res.data) navigate(`/admin/case-studies/${res.data.id}`, { replace: true });
    } else {
      const res = await supabase.from('case_studies').update(payload).eq('id', id);
      error = res.error;
    }
    if (error) { alert('Save failed: ' + error.message); }
    else { setSaved(true); setTimeout(() => setSaved(false), 2500); if (publish) setForm(f => ({ ...f, status: 'published' })); }
    setSaving(false);
  };

  return (
    <>
      {preview && <PreviewModal form={form} onClose={() => setPreview(false)} />}

      <main style={{ minHeight: '100vh', background: '#060b17', padding: 'clamp(5.5rem,12vw,8rem) 1rem 4rem' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>

          {/* ── Header ── */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <button onClick={() => navigate('/admin/case-studies')} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '0.45rem', cursor: 'pointer', color: 'rgba(255,255,255,0.5)', display: 'flex' }}>
                <ArrowLeft size={16} />
              </button>
              <div>
                <h1 style={{ color: '#fff', fontWeight: 900, fontSize: 'clamp(1.2rem,4vw,1.6rem)', margin: 0, letterSpacing: '-0.02em' }}>
                  {isNew ? 'New Case Study' : 'Edit Case Study'}
                </h1>
                <p style={{ color: form.status === 'published' ? '#FF8C00' : 'rgba(255,255,255,0.3)', fontSize: '0.78rem', margin: '0.15rem 0 0', fontWeight: 600 }}>
                  {form.status === 'published' ? '● Published' : '○ Draft'}
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button onClick={() => setPreview(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '0.5rem 0.9rem', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: '0.82rem' }}>
                <Eye size={13} /> Preview
              </button>
              <button onClick={() => save()} disabled={saving} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', padding: '0.5rem 0.9rem', color: '#fff', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600, opacity: saving ? 0.6 : 1 }}>
                <Save size={13} /> {saved ? 'Saved ✓' : 'Save Draft'}
              </button>
              <button onClick={() => save(true)} disabled={saving} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: 'linear-gradient(135deg,#FF8C00,#e67300)', border: 'none', borderRadius: '8px', padding: '0.5rem 1rem', color: '#fff', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 700, opacity: saving ? 0.6 : 1 }}>
                {form.status === 'published' ? 'Update & Publish' : 'Publish'}
              </button>
            </div>
          </div>

          {/* ── Form ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            {/* Cover Image */}
            <Card title="Cover Image">
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                {form.cover_url && (
                  <div style={{ position: 'relative', flexShrink: 0 }}>
                    <img src={form.cover_url} alt="" style={{ width: 120, height: 80, objectFit: 'cover', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }} />
                    <button onClick={() => set('cover_url', '')} style={{ position: 'absolute', top: -6, right: -6, background: '#0f172a', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '50%', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'rgba(255,255,255,0.6)' }}>
                      <X size={11} />
                    </button>
                  </div>
                )}
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.04)', border: '1px dashed rgba(255,255,255,0.15)', borderRadius: '9px', padding: '0.75rem 1rem', cursor: 'pointer', color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem', fontWeight: 600 }}>
                    <Upload size={14} />
                    {uploading ? 'Uploading…' : 'Upload cover image (JPG/PNG, max 5MB)'}
                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => e.target.files?.[0] && uploadCover(e.target.files[0])} />
                  </label>
                  <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.7rem', marginTop: '0.4rem' }}>Or paste a URL below</p>
                  <input value={form.cover_url} onChange={e => set('cover_url', e.target.value)} placeholder="https://..." style={{ ...inputStyle, marginTop: '0.4rem' }} />
                </div>
              </div>
            </Card>

            {/* Basic Info */}
            <Card title="Basic Info">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {/* Title */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle}>Case Study Title *</label>
                  <input value={form.title} onChange={e => set('title', e.target.value)} style={inputStyle} placeholder="e.g. 300% Revenue Growth for XYZ Store" />
                </div>
                {/* Client */}
                <div>
                  <label style={labelStyle}>Client / Company Name</label>
                  <input value={form.client} onChange={e => set('client', e.target.value)} style={inputStyle} placeholder="e.g. Acme Corp" />
                </div>
                {/* Industry */}
                <div>
                  <label style={labelStyle}>Industry</label>
                  <input value={form.industry} onChange={e => set('industry', e.target.value)} style={inputStyle} placeholder="e.g. E-Commerce, SaaS, Healthcare…" />
                </div>
                {/* Summary */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle}>Summary / Tagline</label>
                  <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.72rem', margin: '-0.1rem 0 0.4rem' }}>One punchy line shown on the card — e.g. "300% revenue growth in 90 days"</p>
                  <textarea value={form.summary} onChange={e => set('summary', e.target.value)} style={{ ...taStyle, minHeight: 72 }} />
                </div>
                {/* Tags */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle}>Tags</label>
                  <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.72rem', margin: '-0.1rem 0 0.4rem' }}>Comma-separated: Automation, SEO, Web Development</p>
                  <input value={form.tags} onChange={e => set('tags', e.target.value)} style={inputStyle} placeholder="Automation, SEO, Web Development" />
                </div>
              </div>
            </Card>

            {/* Key Metrics */}
            <Card title="Key Metrics" subtitle="3 headline numbers shown prominently on the Results page">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem' }}>
                {([1, 2, 3] as const).map(n => (
                  <div key={n} style={{ background: 'rgba(255,140,0,0.04)', border: '1px solid rgba(255,140,0,0.12)', borderRadius: '10px', padding: '0.9rem' }}>
                    <label style={{ ...labelStyle, color: 'rgba(255,140,0,0.6)' }}>Metric {n}</label>
                    <input
                      value={(form as Record<string, string>)[`metric${n}_value`]}
                      onChange={e => set(`metric${n}_value`, e.target.value)}
                      placeholder="300%"
                      style={{ ...inputStyle, marginBottom: '0.5rem', fontWeight: 700, fontSize: '1rem', color: '#FF8C00' }}
                    />
                    <input
                      value={(form as Record<string, string>)[`metric${n}_label`]}
                      onChange={e => set(`metric${n}_label`, e.target.value)}
                      placeholder="Revenue Growth"
                      style={{ ...inputStyle, fontSize: '0.8rem' }}
                    />
                  </div>
                ))}
              </div>
            </Card>

            {/* The Story */}
            <Card title="The Story">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <label style={labelStyle}>The Challenge</label>
                  <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.72rem', margin: '-0.1rem 0 0.4rem' }}>What problem was the client facing? Be specific.</p>
                  <textarea value={form.challenge} onChange={e => set('challenge', e.target.value)} style={{ ...taStyle, minHeight: 140 }} />
                </div>
                <div>
                  <label style={labelStyle}>Our Solution</label>
                  <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.72rem', margin: '-0.1rem 0 0.4rem' }}>What did Flare build or do? How was it different?</p>
                  <textarea value={form.solution} onChange={e => set('solution', e.target.value)} style={{ ...taStyle, minHeight: 140 }} />
                </div>
                <div>
                  <label style={labelStyle}>Results & Outcomes</label>
                  <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.72rem', margin: '-0.1rem 0 0.4rem' }}>Measurable outcomes. Use bullet points (one per line starting with •)</p>
                  <textarea value={form.results} onChange={e => set('results', e.target.value)} style={{ ...taStyle, minHeight: 180 }} />
                </div>
              </div>
            </Card>

            {/* Visibility */}
            <Card title="Visibility">
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                {(['draft', 'published'] as const).map(s => (
                  <button key={s} onClick={() => set('status', s)} style={{
                    padding: '0.5rem 1.1rem', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer',
                    border: `1px solid ${form.status === s ? (s === 'published' ? 'rgba(255,140,0,0.4)' : 'rgba(255,255,255,0.2)') : 'rgba(255,255,255,0.08)'}`,
                    background: form.status === s ? (s === 'published' ? 'rgba(255,140,0,0.1)' : 'rgba(255,255,255,0.06)') : 'transparent',
                    color: form.status === s ? (s === 'published' ? '#FF8C00' : '#fff') : 'rgba(255,255,255,0.35)',
                  }}>{s === 'published' ? '● Published' : '○ Draft'}</button>
                ))}
              </div>
              <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.75rem', marginTop: '0.6rem' }}>
                Published case studies appear on the Results page. Drafts are only visible here.
              </p>
            </Card>

            {/* Save bar */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.6rem', paddingTop: '0.5rem' }}>
              <button onClick={() => save()} disabled={saving} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', padding: '0.6rem 1.1rem', color: '#fff', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, opacity: saving ? 0.6 : 1 }}>
                <Save size={14} /> {saved ? 'Saved ✓' : 'Save Draft'}
              </button>
              <button onClick={() => save(true)} disabled={saving} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: 'linear-gradient(135deg,#FF8C00,#e67300)', border: 'none', borderRadius: '8px', padding: '0.6rem 1.2rem', color: '#fff', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 700, opacity: saving ? 0.6 : 1 }}>
                {form.status === 'published' ? 'Update & Publish' : 'Publish to Results Page'}
              </button>
            </div>

          </div>
        </div>
      </main>
    </>
  );
}
