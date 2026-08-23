import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';
import { Plus, ArrowLeft, Edit2, Trash2, Eye, EyeOff, RefreshCw } from 'lucide-react';

export interface CaseStudy {
  id: number;
  created_at: string;
  updated_at: string;
  title: string;
  client: string;
  industry: string;
  summary: string;
  challenge: string;
  solution: string;
  results: string;
  metric1_value: string;
  metric1_label: string;
  metric2_value: string;
  metric2_label: string;
  metric3_value: string;
  metric3_label: string;
  tags: string;
  cover_url: string;
  status: 'draft' | 'published';
}

export default function AdminCaseStudies() {
  const navigate = useNavigate();
  const [studies, setStudies] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [toggling, setToggling] = useState<number | null>(null);

  const fetch = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('case_studies')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) setStudies(data as CaseStudy[]);
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const toggleStatus = async (cs: CaseStudy) => {
    setToggling(cs.id);
    const newStatus = cs.status === 'published' ? 'draft' : 'published';
    const { error } = await supabase.from('case_studies').update({ status: newStatus }).eq('id', cs.id);
    if (!error) setStudies(prev => prev.map(s => s.id === cs.id ? { ...s, status: newStatus } : s));
    setToggling(null);
  };

  const deleteStudy = async (id: number) => {
    if (!confirm('Delete this case study? This cannot be undone.')) return;
    setDeleting(id);
    await supabase.from('case_studies').delete().eq('id', id);
    setStudies(prev => prev.filter(s => s.id !== id));
    setDeleting(null);
  };

  const published = studies.filter(s => s.status === 'published').length;
  const drafts = studies.filter(s => s.status === 'draft').length;

  return (
    <main style={{ minHeight: '100vh', background: '#060b17', padding: 'clamp(5.5rem,12vw,8rem) 1rem 3rem' }}>
      <div style={{ maxWidth: '960px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button onClick={() => navigate('/admin')} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '0.45rem', cursor: 'pointer', color: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center' }}>
              <ArrowLeft size={16} />
            </button>
            <div>
              <h1 style={{ color: '#fff', fontWeight: 900, fontSize: 'clamp(1.4rem,4vw,1.9rem)', margin: 0, letterSpacing: '-0.02em' }}>Case Studies</h1>
              <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.82rem', margin: '0.2rem 0 0' }}>
                {published} published · {drafts} draft
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <button onClick={fetch} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '0.5rem 1rem', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: '0.82rem' }}>
              <RefreshCw size={13} /> Refresh
            </button>
            <button onClick={() => navigate('/admin/case-studies/new')} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'linear-gradient(135deg,#FF8C00,#e67300)', border: 'none', borderRadius: '8px', padding: '0.5rem 1.1rem', color: '#fff', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 700 }}>
              <Plus size={14} /> New Case Study
            </button>
          </div>
        </div>

        {/* List */}
        {loading ? (
          <p style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', padding: '3rem' }}>Loading…</p>
        ) : studies.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', background: '#0f172a', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.07)' }}>
            <p style={{ color: 'rgba(255,255,255,0.4)', marginBottom: '1.25rem' }}>No case studies yet.</p>
            <button onClick={() => navigate('/admin/case-studies/new')} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'linear-gradient(135deg,#FF8C00,#e67300)', border: 'none', borderRadius: '8px', padding: '0.6rem 1.25rem', color: '#fff', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 700 }}>
              <Plus size={14} /> Create your first case study
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {studies.map(cs => (
              <div key={cs.id} style={{ background: '#0f172a', border: `1px solid ${cs.status === 'published' ? 'rgba(255,140,0,0.2)' : 'rgba(255,255,255,0.07)'}`, borderRadius: '13px', padding: '1rem 1.3rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                {/* Cover thumb */}
                {cs.cover_url ? (
                  <div style={{ width: 56, height: 56, borderRadius: '8px', overflow: 'hidden', flexShrink: 0, background: 'rgba(255,255,255,0.05)' }}>
                    <img src={cs.cover_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ) : (
                  <div style={{ width: 56, height: 56, borderRadius: '8px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '1.4rem' }}>📄</span>
                  </div>
                )}
                {/* Info */}
                <div style={{ flex: 1, minWidth: '180px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.25rem' }}>
                    <span style={{ color: '#fff', fontWeight: 700, fontSize: '0.9rem' }}>{cs.title || 'Untitled'}</span>
                    <span style={{
                      fontSize: '0.65rem', fontWeight: 700, padding: '0.1rem 0.5rem', borderRadius: '999px',
                      background: cs.status === 'published' ? 'rgba(255,140,0,0.1)' : 'rgba(255,255,255,0.05)',
                      border: `1px solid ${cs.status === 'published' ? 'rgba(255,140,0,0.3)' : 'rgba(255,255,255,0.1)'}`,
                      color: cs.status === 'published' ? '#FF8C00' : 'rgba(255,255,255,0.4)',
                    }}>{cs.status === 'published' ? 'Published' : 'Draft'}</span>
                  </div>
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem', margin: '0 0 0.1rem' }}>
                    {cs.client && <span>{cs.client}</span>}
                    {cs.client && cs.industry && <span style={{ color: 'rgba(255,255,255,0.2)' }}> · </span>}
                    {cs.industry && <span>{cs.industry}</span>}
                  </p>
                  <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.7rem', margin: 0 }}>
                    {new Date(cs.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
                {/* Actions */}
                <div style={{ display: 'flex', gap: '0.4rem', flexShrink: 0 }}>
                  <button
                    onClick={() => toggleStatus(cs)}
                    disabled={toggling === cs.id}
                    title={cs.status === 'published' ? 'Unpublish' : 'Publish'}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.38rem 0.75rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)', color: 'rgba(255,255,255,0.5)', opacity: toggling === cs.id ? 0.5 : 1 }}
                  >
                    {cs.status === 'published' ? <><EyeOff size={12} /> Unpublish</> : <><Eye size={12} /> Publish</>}
                  </button>
                  <button
                    onClick={() => navigate(`/admin/case-studies/${cs.id}`)}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.38rem 0.75rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', border: '1px solid rgba(37,99,235,0.3)', background: 'rgba(37,99,235,0.07)', color: '#6694f5' }}
                  >
                    <Edit2 size={12} /> Edit
                  </button>
                  <button
                    onClick={() => deleteStudy(cs.id)}
                    disabled={deleting === cs.id}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.38rem 0.75rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', border: '1px solid rgba(248,113,113,0.2)', background: 'rgba(248,113,113,0.05)', color: 'rgba(248,113,113,0.7)', opacity: deleting === cs.id ? 0.5 : 1 }}
                  >
                    <Trash2 size={12} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
