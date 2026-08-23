import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';
import {
  RefreshCw, Eye, CheckCircle, PauseCircle, XCircle,
  X, FileText, ChevronDown, Search, Download, FileSignature,
} from 'lucide-react';
// --- DISCONNECTED (certificate feature, paused — see offer letter pivot) ---
// import CertificateModal from '@/components/CertificateModal';
// import { fetchCertificateApplicationIds } from '@/lib/certificates';
// --- END DISCONNECTED ---
import OfferLetterModal from '@/components/OfferLetterModal';

const ADMIN_PASSWORD = 'flare2026admin';

type Status = 'New' | 'Viewed' | 'Shortlisted' | 'Rejected' | 'On Hold';

interface F2FApplication {
  id: number;
  created_at: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  why: string;
  resume_url: string;
  status: Status;
}

const STATUS_CONFIG: Record<Status, { color: string; bg: string; border: string; dot: string }> = {
  New:         { color: 'rgba(255,255,255,0.75)', bg: 'rgba(255,255,255,0.05)',  border: 'rgba(255,255,255,0.15)', dot: 'rgba(255,255,255,0.5)'  },
  Viewed:      { color: 'rgba(255,255,255,0.55)', bg: 'rgba(255,255,255,0.03)',  border: 'rgba(255,255,255,0.1)',  dot: 'rgba(255,255,255,0.35)' },
  Shortlisted: { color: '#FF8C00',                bg: 'rgba(255,140,0,0.1)',     border: 'rgba(255,140,0,0.35)',  dot: '#FF8C00'                },
  'On Hold':   { color: 'rgba(255,255,255,0.6)',  bg: 'rgba(255,255,255,0.04)',  border: 'rgba(255,255,255,0.12)', dot: 'rgba(255,255,255,0.4)' },
  Rejected:    { color: 'rgba(255,255,255,0.3)',  bg: 'rgba(255,255,255,0.02)',  border: 'rgba(255,255,255,0.07)', dot: 'rgba(255,255,255,0.2)' },
};

const STATUS_TABS: (Status | 'All')[] = ['All', 'New', 'Viewed', 'Shortlisted', 'On Hold', 'Rejected'];

function exportCSV(apps: F2FApplication[]) {
  const headers = ['Name', 'Email', 'Phone', 'Role', 'Why', 'Status', 'Applied On', 'Resume URL'];
  const rows = apps.map(a => [
    a.name, a.email, a.phone, a.role,
    (a.why ?? '').replace(/"/g, '""'),
    a.status,
    new Date(a.created_at).toLocaleDateString('en-IN'),
    a.resume_url ?? '',
  ].map(v => `"${v}"`).join(','));
  const csv = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `f2f-applications-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export default function AdminF2F() {
  const navigate = useNavigate();
  const [authed, setAuthed]             = useState(() => sessionStorage.getItem('flare_admin_auth') === 'true');
  const [password, setPassword]         = useState('');

  const doLogin = () => {
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem('flare_admin_auth', 'true');
      setAuthed(true);
    } else {
      alert('Wrong password');
    }
  };
  const [apps, setApps]                 = useState<F2FApplication[]>([]);
  const [loading, setLoading]           = useState(false);
  const [statusFilter, setStatusFilter] = useState<Status | 'All'>('All');
  const [roleFilter, setRoleFilter]     = useState('All');
  const [search, setSearch]             = useState('');
  const [pdfApp, setPdfApp]             = useState<F2FApplication | null>(null);
  // --- DISCONNECTED (certificate feature, paused — see offer letter pivot) ---
  // const [certModalApp, setCertModalApp] = useState<F2FApplication | null>(null);
  // const [certAppIds, setCertAppIds]     = useState<Set<number>>(new Set());
  // --- END DISCONNECTED ---
  const [offerLetterModalApp, setOfferLetterModalApp] = useState<F2FApplication | null>(null);
  const [expandedId, setExpandedId]     = useState<number | null>(null);
  const [updatingId, setUpdatingId]     = useState<number | null>(null);

  const fetchApps = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('f2f_applications')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) setApps(data as F2FApplication[]);
    // --- DISCONNECTED (certificate feature, paused — see offer letter pivot) ---
    // const certIds = await fetchCertificateApplicationIds();
    // setCertAppIds(new Set(certIds));
    // --- END DISCONNECTED ---
    setLoading(false);
  };

  useEffect(() => { if (authed) fetchApps(); }, [authed]);

  const updateStatus = async (id: number, status: Status) => {
    setUpdatingId(id);
    const { error } = await supabase.from('f2f_applications').update({ status }).eq('id', id);
    if (!error) {
      setApps(prev => prev.map(a => a.id === id ? { ...a, status } : a));
      if (pdfApp?.id === id) setPdfApp(prev => prev ? { ...prev, status } : prev);
    }
    setUpdatingId(null);
  };

  const openPdf = async (app: F2FApplication) => {
    setPdfApp(app);
    if (app.status === 'New') await updateStatus(app.id, 'Viewed');
  };

  const roleList = ['All', ...Array.from(new Set(apps.map(a => a.role).filter(Boolean)))];

  const q = search.trim().toLowerCase();
  const filtered = apps.filter(a => {
    const matchStatus = statusFilter === 'All' || a.status === statusFilter;
    const matchRole   = roleFilter   === 'All' || a.role === roleFilter;
    const matchSearch = !q || [a.name, a.email ?? ''].some(f => f.toLowerCase().includes(q));
    return matchStatus && matchRole && matchSearch;
  });

  const countOf = (s: Status | 'All') =>
    s === 'All' ? apps.length : apps.filter(a => a.status === s).length;

  const inputStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '10px',
    color: '#fff',
    fontSize: '0.875rem',
    outline: 'none',
  };

  /* ── Login ── */
  if (!authed) {
    return (
      <main style={{ minHeight: '100vh', background: '#060b17', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '2.5rem', width: '100%', maxWidth: '360px', textAlign: 'center' }}>
          <h1 style={{ color: '#fff', fontWeight: 800, fontSize: '1.2rem', marginBottom: '0.4rem' }}>Admin Access</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', marginBottom: '1.75rem' }}>Fresher to Finisher Applications</p>
          <input type="password" placeholder="Password" value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && doLogin()}
            style={{ ...inputStyle, width: '100%', padding: '0.75rem 1rem', marginBottom: '1rem', boxSizing: 'border-box' }} />
          <button onClick={doLogin}
            style={{ width: '100%', background: 'linear-gradient(135deg,#FF8C00,#e67300)', border: 'none', borderRadius: '10px', padding: '0.75rem', color: '#fff', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer' }}>
            Login
          </button>
        </div>
      </main>
    );
  }

  /* ── Action button ── */
  const ActionBtn = ({ app, status, icon, label }: { app: F2FApplication; status: Status; icon: React.ReactNode; label: string }) => {
    const isActive = app.status === status;
    const isShortlist = status === 'Shortlisted';
    return (
      <button onClick={() => !isActive && updateStatus(app.id, status)} disabled={isActive || updatingId === app.id}
        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.35rem 0.75rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 600, cursor: isActive ? 'default' : 'pointer', border: isActive ? (isShortlist ? '1px solid rgba(255,140,0,0.45)' : '1px solid rgba(255,255,255,0.1)') : '1px solid rgba(255,255,255,0.1)', background: isActive ? (isShortlist ? 'rgba(255,140,0,0.12)' : 'rgba(255,255,255,0.04)') : 'transparent', color: isActive ? (isShortlist ? '#FF8C00' : 'rgba(255,255,255,0.4)') : 'rgba(255,255,255,0.4)', opacity: updatingId === app.id ? 0.5 : 1, transition: 'all 0.15s' }}>
        {icon}{label}
      </button>
    );
  };

  /* ── PDF Modal ── */
  const PdfModal = () => {
    if (!pdfApp) return null;
    const cfg = STATUS_CONFIG[pdfApp.status];
    return (
      <div onClick={e => e.target === e.currentTarget && setPdfApp(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
        <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', width: '100%', maxWidth: '860px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                <span style={{ color: '#fff', fontWeight: 700, fontSize: '1rem' }}>{pdfApp.name}</span>
                <span style={{ background: 'rgba(255,140,0,0.1)', border: '1px solid rgba(255,140,0,0.3)', color: '#FF8C00', fontSize: '0.68rem', fontWeight: 700, padding: '0.12rem 0.55rem', borderRadius: '999px' }}>{pdfApp.role}</span>
                <span style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.color, fontSize: '0.68rem', fontWeight: 700, padding: '0.12rem 0.55rem', borderRadius: '999px' }}>
                  <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: cfg.dot, marginRight: 4, verticalAlign: 'middle' }} />{pdfApp.status}
                </span>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', margin: '0.2rem 0 0' }}>{pdfApp.email}{pdfApp.phone && ` · ${pdfApp.phone}`}</p>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <ActionBtn app={pdfApp} status="Shortlisted" icon={<CheckCircle size={13} />} label="Shortlist" />
              <ActionBtn app={pdfApp} status="On Hold"     icon={<PauseCircle size={13} />} label="Hold" />
              <ActionBtn app={pdfApp} status="Rejected"    icon={<XCircle size={13} />}     label="Reject" />
            </div>
            <button onClick={() => setPdfApp(null)} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '0.45rem', cursor: 'pointer', color: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', flexShrink: 0 }}><X size={18} /></button>
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '40vh', padding: '2rem', gap: '1.25rem', background: '#0a1628' }}>
            {pdfApp.resume_url ? (
              <>
                <div style={{ width: 72, height: 72, borderRadius: '16px', background: 'rgba(37,99,235,0.12)', border: '1px solid rgba(37,99,235,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FileText size={32} color="#6694f5" /></div>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ color: '#fff', fontWeight: 700, fontSize: '1rem', margin: '0 0 0.35rem' }}>{pdfApp.name}'s Resume</p>
                  {pdfApp.why && <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', fontStyle: 'italic', maxWidth: '480px', lineHeight: 1.65, margin: '0 0 0.75rem' }}>"{pdfApp.why}"</p>}
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                  <a href={pdfApp.resume_url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'linear-gradient(135deg,#2563EB,#1d4ed8)', borderRadius: '10px', padding: '0.7rem 1.5rem', color: '#fff', fontWeight: 700, fontSize: '0.88rem', textDecoration: 'none' }}>
                    <Eye size={15} /> View Resume
                  </a>
                  <a href={pdfApp.resume_url} download style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,140,0,0.1)', border: '1px solid rgba(255,140,0,0.3)', borderRadius: '10px', padding: '0.7rem 1.5rem', color: '#FF8C00', fontWeight: 700, fontSize: '0.88rem', textDecoration: 'none' }}>
                    <Download size={15} /> Download
                  </a>
                </div>
              </>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', color: 'rgba(255,255,255,0.3)' }}>
                <FileText size={40} /><p style={{ margin: 0 }}>No resume uploaded</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  /* ── Dashboard ── */
  return (
    <>
      {pdfApp && <PdfModal />}
      {/* --- DISCONNECTED (certificate feature, paused — see offer letter pivot) --- */}
      {/* {certModalApp && (
        <CertificateModal
          app={certModalApp}
          onClose={() => setCertModalApp(null)}
          onSaved={(applicationId) => setCertAppIds((prev) => new Set(prev).add(applicationId))}
        />
      )} */}
      {/* --- END DISCONNECTED --- */}
      {offerLetterModalApp && (
        <OfferLetterModal
          app={offerLetterModalApp}
          onClose={() => setOfferLetterModalApp(null)}
        />
      )}
      <main style={{ minHeight: '100vh', background: '#060b17', padding: 'clamp(5.5rem,12vw,8rem) 1rem 3rem' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                <span style={{ background: 'rgba(255,140,0,0.12)', border: '1px solid rgba(255,140,0,0.3)', color: '#FF8C00', fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.12em', padding: '0.2rem 0.7rem', borderRadius: '999px', textTransform: 'uppercase' }}>Fresher to Finisher</span>
              </div>
              <h1 style={{ color: '#fff', fontWeight: 900, fontSize: 'clamp(1.5rem,4vw,2rem)', margin: 0, letterSpacing: '-0.02em' }}>Applications</h1>
              <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.85rem', margin: '0.2rem 0 0' }}>{apps.length} total submissions</p>
            </div>
            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
              <button onClick={() => navigate('/admin')} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '0.5rem 1rem', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>
                Careers Apps
              </button>
              <button onClick={() => exportCSV(apps)} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255,140,0,0.08)', border: '1px solid rgba(255,140,0,0.25)', borderRadius: '8px', padding: '0.5rem 1rem', color: '#FF8C00', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>
                <Download size={13} /> Export CSV
              </button>
              <button onClick={fetchApps} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '0.5rem 1rem', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: '0.85rem' }}>
                <RefreshCw size={13} /> Refresh
              </button>
            </div>
          </div>

          {/* Summary cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(120px,1fr))', gap: '0.65rem', marginBottom: '1.75rem' }}>
            {(Object.entries(STATUS_CONFIG) as [Status, typeof STATUS_CONFIG[Status]][]).map(([s, cfg]) => {
              const isActive = statusFilter === s;
              return (
                <div key={s} onClick={() => setStatusFilter(isActive ? 'All' : s)} style={{ background: isActive ? cfg.bg : 'rgba(255,255,255,0.02)', border: `1px solid ${isActive ? cfg.border : 'rgba(255,255,255,0.07)'}`, borderRadius: '12px', padding: '0.85rem 1rem', cursor: 'pointer', transition: 'all 0.15s' }}>
                  <p style={{ color: isActive ? cfg.color : '#fff', fontSize: '1.6rem', fontWeight: 900, margin: '0 0 0.15rem', lineHeight: 1 }}>{countOf(s)}</p>
                  <p style={{ color: isActive ? cfg.color : 'rgba(255,255,255,0.35)', fontSize: '0.72rem', fontWeight: 600, margin: 0 }}>{s}</p>
                </div>
              );
            })}
          </div>

          {/* Search */}
          <div style={{ position: 'relative', marginBottom: '1rem' }}>
            <Search size={14} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.25)', pointerEvents: 'none' }} />
            <input type="text" placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)} style={{ ...inputStyle, width: '100%', boxSizing: 'border-box', padding: '0.65rem 2.4rem' }} />
            {search && <button onClick={() => setSearch('')} style={{ position: 'absolute', right: '0.7rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', display: 'flex', padding: '0.2rem' }}><X size={14} /></button>}
          </div>

          {/* Status tabs */}
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
            {STATUS_TABS.map(s => {
              const isActive = statusFilter === s;
              const isShortlist = s === 'Shortlisted';
              return (
                <button key={s} onClick={() => setStatusFilter(s)} style={{ padding: '0.32rem 0.8rem', borderRadius: '999px', fontSize: '0.77rem', fontWeight: 600, cursor: 'pointer', border: `1px solid ${isActive ? (isShortlist ? 'rgba(255,140,0,0.4)' : 'rgba(255,255,255,0.2)') : 'rgba(255,255,255,0.08)'}`, background: isActive ? (isShortlist ? 'rgba(255,140,0,0.1)' : 'rgba(255,255,255,0.06)') : 'transparent', color: isActive ? (isShortlist ? '#FF8C00' : 'rgba(255,255,255,0.8)') : 'rgba(255,255,255,0.4)', transition: 'all 0.15s' }}>
                  {s} <span style={{ opacity: 0.55 }}>({countOf(s)})</span>
                </button>
              );
            })}
          </div>

          {/* Role filter */}
          {roleList.length > 2 && (
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1.25rem', alignItems: 'center' }}>
              <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.06em' }}>TRACK</span>
              {roleList.map(r => (
                <button key={r} onClick={() => setRoleFilter(r)} style={{ padding: '0.25rem 0.65rem', borderRadius: '999px', fontSize: '0.73rem', fontWeight: 600, cursor: 'pointer', border: `1px solid ${roleFilter === r ? 'rgba(255,140,0,0.35)' : 'rgba(255,255,255,0.08)'}`, background: roleFilter === r ? 'rgba(255,140,0,0.08)' : 'transparent', color: roleFilter === r ? '#FF8C00' : 'rgba(255,255,255,0.4)' }}>{r}</button>
              ))}
            </div>
          )}

          {/* List */}
          {loading ? (
            <p style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', padding: '3rem' }}>Loading...</p>
          ) : filtered.length === 0 ? (
            <p style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', padding: '3rem' }}>No applications found.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {filtered.map(app => {
                const cfg = STATUS_CONFIG[app.status] ?? STATUS_CONFIG['New'];
                const isExpanded = expandedId === app.id;
                const isShortlisted = app.status === 'Shortlisted';
                return (
                  <div key={app.id} style={{ background: '#0f172a', border: `1px solid ${isShortlisted ? 'rgba(255,140,0,0.2)' : 'rgba(255,255,255,0.07)'}`, borderRadius: '13px', overflow: 'hidden', opacity: app.status === 'Rejected' ? 0.65 : 1 }}>
                    <div style={{ padding: '1rem 1.3rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                      <div style={{ flex: 1, minWidth: '180px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.3rem' }}>
                          <span style={{ color: '#fff', fontWeight: 700, fontSize: '0.9rem' }}>{app.name}</span>
                          <span style={{ background: 'rgba(255,140,0,0.1)', border: '1px solid rgba(255,140,0,0.25)', color: '#FF8C00', fontSize: '0.67rem', fontWeight: 700, padding: '0.1rem 0.5rem', borderRadius: '999px' }}>{app.role}</span>
                          <span style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.color, fontSize: '0.67rem', fontWeight: 600, padding: '0.1rem 0.5rem', borderRadius: '999px', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                            <span style={{ width: 5, height: 5, borderRadius: '50%', background: cfg.dot, flexShrink: 0 }} />{app.status}
                          </span>
                        </div>
                        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem', margin: '0 0 0.1rem' }}>{app.email}{app.phone && ` · ${app.phone}`}</p>
                        <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.7rem', margin: 0 }}>
                          {new Date(app.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap', flexShrink: 0 }}>
                        {app.resume_url && (
                          <button onClick={() => openPdf(app)} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.38rem 0.85rem', borderRadius: '8px', border: '1px solid rgba(37,99,235,0.35)', background: 'rgba(37,99,235,0.08)', color: '#6694f5', fontSize: '0.77rem', fontWeight: 600, cursor: 'pointer' }}>
                            <Eye size={12} /> Resume
                          </button>
                        )}
                        {/* --- DISCONNECTED (certificate feature, paused — see offer letter pivot) --- */}
                        {/* {isShortlisted && (
                          <button onClick={() => setCertModalApp(app)} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.38rem 0.85rem', borderRadius: '8px', border: '1px solid rgba(255,140,0,0.35)', background: 'rgba(255,140,0,0.08)', color: '#FF8C00', fontSize: '0.77rem', fontWeight: 600, cursor: 'pointer' }}>
                            <Award size={12} /> {certAppIds.has(app.id) ? 'View/Regenerate Certificate' : 'Generate Certificate'}
                          </button>
                        )} */}
                        {/* --- END DISCONNECTED --- */}
                        {isShortlisted && (
                          <button onClick={() => setOfferLetterModalApp(app)} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.38rem 0.85rem', borderRadius: '8px', border: '1px solid rgba(255,140,0,0.35)', background: 'rgba(255,140,0,0.08)', color: '#FF8C00', fontSize: '0.77rem', fontWeight: 600, cursor: 'pointer' }}>
                            <FileSignature size={12} /> Generate Offer Letter
                          </button>
                        )}
                        <ActionBtn app={app} status="Shortlisted" icon={<CheckCircle size={12} />} label="Shortlist" />
                        <ActionBtn app={app} status="On Hold"     icon={<PauseCircle size={12} />} label="Hold" />
                        <ActionBtn app={app} status="Rejected"    icon={<XCircle size={12} />}     label="Reject" />
                        <button onClick={() => setExpandedId(isExpanded ? null : app.id)} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '7px', padding: '0.38rem', cursor: 'pointer', color: 'rgba(255,255,255,0.35)', display: 'flex', alignItems: 'center', transition: 'transform 0.2s', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                          <ChevronDown size={14} />
                        </button>
                      </div>
                    </div>
                    {isExpanded && app.why && (
                      <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '0.9rem 1.3rem' }}>
                        <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 0.25rem' }}>Why They Want In</p>
                        <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.85rem', margin: 0, lineHeight: 1.65, fontStyle: 'italic' }}>"{app.why}"</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
