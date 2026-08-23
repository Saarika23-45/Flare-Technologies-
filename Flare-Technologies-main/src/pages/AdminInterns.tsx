import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useCallback } from 'react';
import { flushSync } from 'react-dom';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import CertificateTemplate, {
  CERTIFICATE_WIDTH,
  CERTIFICATE_HEIGHT,
} from '@/components/CertificateTemplate';
import {
  calculateDuration,
  upsertCertificate,
  uploadCertificatePdf,
  type CertificateRecord,
} from '@/lib/certificates';
import {
  Award,
  Download,
  Plus,
  RefreshCw,
  Trash2,
  X,
  ChevronLeft,
} from 'lucide-react';

const ADMIN_PASSWORD = 'flare2026admin';

/* ─── Types ─────────────────────────────────────────────────────── */
interface Intern {
  id: number;
  name: string;
  role: string;
  start_date: string;
  end_date: string;
  created_at: string;
}

/* ─── Helpers ────────────────────────────────────────────────────── */
const isActive = (end: string) => {
  if (!end) return true;
  return new Date(`${end}T23:59:59`) >= new Date();
};

const inputStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '10px',
  color: '#fff',
  fontSize: '0.875rem',
  outline: 'none',
  padding: '0.65rem 0.85rem',
  width: '100%',
  boxSizing: 'border-box',
};

/* ─── Certificate Modal (self-contained, no Supabase F2F dependency) ── */
interface CertModalProps {
  intern: Intern;
  onClose: () => void;
}

function InternCertModal({ intern, onClose }: CertModalProps) {
  const captureRef = useRef<HTMLDivElement>(null);
  const [name, setName] = useState(intern.name);
  const [program, setProgram] = useState(`${intern.role} — Internship Program`);
  const [startDate, setStartDate] = useState(intern.start_date);
  const [endDate, setEndDate] = useState(intern.end_date);
  const [existingCert, setExistingCert] = useState<CertificateRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [savedUrl, setSavedUrl] = useState<string | null>(null);
  const [canDownload, setCanDownload] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const duration = calculateDuration(startDate, endDate);
  const previewCertId = existingCert?.id ?? null;

  /* load existing cert keyed by intern id (offset by 900000 to avoid clash) */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const { data } = await supabase
        .from('certificates')
        .select('*')
        .eq('source_application_id', intern.id + 900000)
        .maybeSingle();
      if (cancelled) return;
      const cert = data as CertificateRecord | null;
      setExistingCert(cert);
      if (cert) {
        setName(cert.name);
        setProgram(cert.program);
        setStartDate(cert.start_date);
        setEndDate(cert.end_date);
        if (cert.certificate_file_url) setSavedUrl(cert.certificate_file_url);
      }
      setCanDownload(false);
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [intern.id]);

  useEffect(() => () => { if (previewUrl) URL.revokeObjectURL(previewUrl); }, [previewUrl]);

  const invalidate = () => { setHasGenerated(false); setCanDownload(false); };

  const renderPdf = useCallback(async (el: HTMLElement, certId: string | null): Promise<Blob> => {
    if (certId) await new Promise(r => setTimeout(r, 350));
    const dataUrl = await toPng(el, { width: CERTIFICATE_WIDTH, height: CERTIFICATE_HEIGHT, pixelRatio: 2, cacheBust: true });
    const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: [CERTIFICATE_WIDTH, CERTIFICATE_HEIGHT] });
    pdf.addImage(dataUrl, 'PNG', 0, 0, CERTIFICATE_WIDTH, CERTIFICATE_HEIGHT);
    return pdf.output('blob');
  }, []);

  const handleGenerate = async () => {
    if (!captureRef.current) return;
    if (!name.trim() || !program.trim() || !startDate || !endDate) { setError('Fill in all fields first.'); return; }
    if (duration === 'Invalid date range') { setError('End date must be after start date.'); return; }
    setError(null); setGenerating(true);
    try {
      const blob = await renderPdf(captureRef.current, previewCertId);
      setPreviewUrl(prev => { if (prev) URL.revokeObjectURL(prev); return URL.createObjectURL(blob); });
      setPdfBlob(blob); setHasGenerated(true);
    } catch { setError('Failed to generate. Please try again.'); }
    finally { setGenerating(false); }
  };

  const handleSave = async () => {
    if (!pdfBlob || !hasGenerated) return;
    setError(null); setSaving(true);
    try {
      let cert = await upsertCertificate({
        source_application_id: intern.id + 900000,
        name: name.trim(), program: program.trim(), start_date: startDate, end_date: endDate,
      });
      if (!cert) { setError('Failed to save record.'); return; }

      // flushSync updates existingCert so CertificateTemplate re-renders with the real cert.id
      // This makes the QR code appear in the hidden capture target before we re-capture
      flushSync(() => setExistingCert(cert));

      // Wait for QR to fully render inside the hidden template before re-capturing
      // QRCode.toDataURL is async so we need enough time for the useEffect + render cycle
      let finalBlob = pdfBlob;
      if (captureRef.current) {
        await new Promise(r => setTimeout(r, 800)); // wait for QR useEffect to complete
        finalBlob = await renderPdf(captureRef.current, cert.id);
        setPreviewUrl(prev => { if (prev) URL.revokeObjectURL(prev); return URL.createObjectURL(finalBlob); });
        setPdfBlob(finalBlob);
      }

      const fileUrl = await uploadCertificatePdf(cert.id, finalBlob);
      if (!fileUrl) { setError('Saved but file upload failed. Try saving again.'); return; }

      cert = await upsertCertificate({
        source_application_id: intern.id + 900000,
        name: name.trim(), program: program.trim(), start_date: startDate, end_date: endDate,
        certificate_file_url: fileUrl,
      });
      if (!cert) { setError('File uploaded but URL update failed.'); return; }

      setExistingCert(cert); setSavedUrl(fileUrl); setCanDownload(true);
    } catch { setError('Failed to save. Please try again.'); }
    finally { setSaving(false); }
  };

  const downloadUrl = canDownload ? (savedUrl ?? previewUrl) : null;

  return (
    <>
      <div onClick={e => e.target === e.currentTarget && onClose()} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
        <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', width: '100%', maxWidth: '920px', maxHeight: '92vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Header */}
          <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Award size={15} color="#FF8C00" />
                <span style={{ color: '#fff', fontWeight: 700, fontSize: '1rem' }}>{existingCert ? 'Regenerate Certificate' : 'Generate Certificate'}</span>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', margin: '0.2rem 0 0' }}>{intern.name}</p>
            </div>
            <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '0.45rem', cursor: 'pointer', color: 'rgba(255,255,255,0.5)', display: 'flex' }}>
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem' }}>
            {loading ? (
              <p style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', padding: '2rem' }}>Loading...</p>
            ) : (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '0.85rem', marginBottom: '1rem' }}>
                  <label style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.72rem', fontWeight: 600 }}>Name</span>
                    <input type="text" value={name} onChange={e => { setName(e.target.value); invalidate(); }} style={inputStyle} />
                  </label>
                  <label style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.72rem', fontWeight: 600 }}>Program / Role</span>
                    <input type="text" value={program} onChange={e => { setProgram(e.target.value); invalidate(); }} style={inputStyle} />
                  </label>
                  <label style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.72rem', fontWeight: 600 }}>Start Date</span>
                    <input type="date" value={startDate} onChange={e => { setStartDate(e.target.value); invalidate(); }} style={inputStyle} />
                  </label>
                  <label style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.72rem', fontWeight: 600 }}>End Date</span>
                    <input type="date" value={endDate} onChange={e => { setEndDate(e.target.value); invalidate(); }} style={inputStyle} />
                  </label>
                </div>

                <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.82rem', margin: '0 0 1rem' }}>
                  Duration: <span style={{ color: '#FF8C00', fontWeight: 600 }}>{duration}</span>
                </p>

                {error && <p style={{ color: '#f87171', fontSize: '0.82rem', margin: '0 0 1rem' }}>{error}</p>}

                <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
                  <button onClick={handleGenerate} disabled={generating} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255,140,0,0.08)', border: '1px solid rgba(255,140,0,0.25)', borderRadius: '8px', padding: '0.5rem 1rem', color: '#FF8C00', cursor: generating ? 'wait' : 'pointer', fontSize: '0.8rem', fontWeight: 600, opacity: generating ? 0.6 : 1 }}>
                    {generating ? 'Generating...' : 'Generate'}
                  </button>
                  <button onClick={handleSave} disabled={!hasGenerated || saving} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: hasGenerated ? 'linear-gradient(135deg,#FF8C00,#e67300)' : 'rgba(255,255,255,0.04)', border: hasGenerated ? 'none' : '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '0.5rem 1rem', color: hasGenerated ? '#fff' : 'rgba(255,255,255,0.35)', cursor: !hasGenerated || saving ? 'not-allowed' : 'pointer', fontSize: '0.8rem', fontWeight: 600, opacity: saving ? 0.6 : 1 }}>
                    {saving ? 'Saving...' : canDownload ? 'Saved ✓' : 'Save'}
                  </button>
                  {downloadUrl ? (
                    <a href={downloadUrl} download={`certificate-${intern.name.replace(/\s+/g, '-').toLowerCase()}.pdf`} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '0.5rem 1rem', color: 'rgba(255,255,255,0.75)', fontSize: '0.8rem', fontWeight: 600, textDecoration: 'none' }}>
                      <Download size={13} /> Download PDF
                    </a>
                  ) : (
                    <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem', margin: 0, alignSelf: 'center', lineHeight: 1.4 }}>
                      Save first to unlock Download &amp; QR code.
                    </p>
                  )}
                </div>

                {previewUrl ? (
                  <div>
                    <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 0.5rem' }}>Preview</p>
                    <iframe src={previewUrl} title="Certificate preview" style={{ width: '100%', height: '420px', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', background: '#fff' }} />
                  </div>
                ) : (
                  <div style={{ overflow: 'auto', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', background: '#fff' }}>
                    <div style={{ transform: 'scale(0.55)', transformOrigin: 'top left', width: CERTIFICATE_WIDTH * 0.55 }}>
                      <CertificateTemplate name={name} program={program} startDate={startDate} endDate={endDate} certificateId={previewCertId} issuedAt={existingCert?.issued_at ?? existingCert?.updated_at} />
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Hidden capture target */}
      <div aria-hidden style={{ position: 'fixed', left: '-10000px', top: 0, zIndex: -1 }}>
        <div ref={captureRef}>
          <CertificateTemplate name={name} program={program} startDate={startDate} endDate={endDate} certificateId={previewCertId} issuedAt={existingCert?.issued_at ?? existingCert?.updated_at} />
        </div>
      </div>
    </>
  );
}

/* ─── Main Page ──────────────────────────────────────────────────── */
export default function AdminInterns() {
  const navigate = useNavigate();
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('flare_admin_auth') === 'true');
  const [password, setPassword] = useState('');

  const doLogin = () => {
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem('flare_admin_auth', 'true');
      setAuthed(true);
    } else {
      alert('Wrong password');
    }
  };

  const [interns, setInterns] = useState<Intern[]>([]);
  const [loading, setLoading] = useState(false);
  const [certIntern, setCertIntern] = useState<Intern | null>(null);

  /* Add form */
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newStart, setNewStart] = useState('');
  const [newEnd, setNewEnd] = useState('');
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  const fetchInterns = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('interns')
      .select('*')
      .order('start_date', { ascending: false });
    if (!error && data) setInterns(data as Intern[]);
    // If table doesn't exist yet, just show empty list — error shown when user tries to add
    setLoading(false);
  };

  useEffect(() => { if (authed) fetchInterns(); }, [authed]);

  const addIntern = async () => {
    if (!newName.trim() || !newRole.trim() || !newStart) {
      setAddError('Name, role and start date are required.');
      return;
    }
    setAdding(true); setAddError(null);
    const { error } = await supabase.from('interns').insert({
      name: newName.trim(),
      role: newRole.trim(),
      start_date: newStart,
      end_date: newEnd || null,
    });
    if (error) {
      if (error.code === '42P01') {
        setAddError(
          'The "interns" table does not exist in Supabase yet. ' +
          'Please run this SQL in your Supabase SQL editor:\n\n' +
          'create table interns (\n' +
          '  id bigint generated always as identity primary key,\n' +
          '  name text not null,\n' +
          '  role text not null,\n' +
          '  start_date date not null,\n' +
          '  end_date date,\n' +
          '  created_at timestamptz default now()\n' +
          ');'
        );
      } else {
        setAddError(`Error: ${error.message}`);
      }
      setAdding(false);
      return;
    }
    setNewName(''); setNewRole(''); setNewStart(''); setNewEnd('');
    setShowAddForm(false);
    await fetchInterns();
    setAdding(false);
  };

  const deleteIntern = async (id: number) => {
    if (!confirm('Delete this intern record?')) return;
    await supabase.from('interns').delete().eq('id', id);
    setInterns(prev => prev.filter(i => i.id !== id));
  };

  /* ── Login ── */
  if (!authed) {
    return (
      <main style={{ minHeight: '100vh', background: '#060b17', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '2.5rem', width: '100%', maxWidth: '360px', textAlign: 'center' }}>
          <h1 style={{ color: '#fff', fontWeight: 800, fontSize: '1.2rem', marginBottom: '0.4rem' }}>Admin Access</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', marginBottom: '1.75rem' }}>Intern Management</p>
          <input type="password" placeholder="Password" value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && doLogin()}
            style={{ ...inputStyle, marginBottom: '1rem' }} />
          <button onClick={doLogin} style={{ width: '100%', background: 'linear-gradient(135deg,#FF8C00,#e67300)', border: 'none', borderRadius: '10px', padding: '0.75rem', color: '#fff', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer' }}>
            Login
          </button>
        </div>
      </main>
    );
  }

  const activeCount = interns.filter(i => isActive(i.end_date)).length;
  const pastCount = interns.filter(i => !isActive(i.end_date)).length;

  /* ── Dashboard ── */
  return (
    <>
      {certIntern && <InternCertModal intern={certIntern} onClose={() => setCertIntern(null)} />}

      <main style={{ minHeight: '100vh', background: '#060b17', padding: 'clamp(5.5rem,12vw,8rem) 1rem 3rem' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                <span style={{ background: 'rgba(255,140,0,0.12)', border: '1px solid rgba(255,140,0,0.3)', color: '#FF8C00', fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.12em', padding: '0.2rem 0.7rem', borderRadius: '999px', textTransform: 'uppercase' }}>Admin</span>
              </div>
              <h1 style={{ color: '#fff', fontWeight: 900, fontSize: 'clamp(1.5rem,4vw,2rem)', margin: 0, letterSpacing: '-0.02em' }}>Intern Management</h1>
              <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.85rem', margin: '0.2rem 0 0' }}>
                {interns.length} total &nbsp;·&nbsp;
                <span style={{ color: '#22c55e' }}>●</span> {activeCount} active &nbsp;·&nbsp;
                <span style={{ color: '#ef4444' }}>●</span> {pastCount} past
              </p>
            </div>
            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
              <button onClick={() => navigate('/admin')} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '0.5rem 1rem', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>
                <ChevronLeft size={13} /> Back to Admin
              </button>
              <button onClick={fetchInterns} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '0.5rem 1rem', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: '0.85rem' }}>
                <RefreshCw size={13} /> Refresh
              </button>
              <button onClick={() => setShowAddForm(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'linear-gradient(135deg,#FF8C00,#e67300)', border: 'none', borderRadius: '8px', padding: '0.5rem 1rem', color: '#fff', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700 }}>
                <Plus size={13} /> Add Intern
              </button>
            </div>
          </div>

          {/* Summary cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(140px,1fr))', gap: '0.65rem', marginBottom: '1.75rem' }}>
            {[
              { label: 'Total', count: interns.length, color: '#fff', bg: 'rgba(255,255,255,0.04)', border: 'rgba(255,255,255,0.1)' },
              { label: 'Active', count: activeCount, color: '#22c55e', bg: 'rgba(34,197,94,0.08)', border: 'rgba(34,197,94,0.3)' },
              { label: 'Past', count: pastCount, color: '#ef4444', bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.3)' },
            ].map(card => (
              <div key={card.label} style={{ background: card.bg, border: `1px solid ${card.border}`, borderRadius: '12px', padding: '0.85rem 1rem' }}>
                <p style={{ color: card.color, fontSize: '1.6rem', fontWeight: 900, margin: '0 0 0.15rem', lineHeight: 1 }}>{card.count}</p>
                <p style={{ color: card.color, fontSize: '0.72rem', fontWeight: 600, margin: 0, opacity: 0.75 }}>{card.label}</p>
              </div>
            ))}
          </div>

          {/* Add Intern Form */}
          {showAddForm && (
            <div style={{ background: '#0f172a', border: '1px solid rgba(255,140,0,0.25)', borderRadius: '16px', padding: '1.5rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h3 style={{ color: '#fff', fontWeight: 700, fontSize: '1rem', margin: 0 }}>Add New Intern</h3>
                <button onClick={() => { setShowAddForm(false); setAddError(null); }} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', display: 'flex' }}>
                  <X size={18} />
                </button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '0.85rem', marginBottom: '1rem' }}>
                <label style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.72rem', fontWeight: 600 }}>Full Name *</span>
                  <input type="text" placeholder="e.g. Priya Sharma" value={newName} onChange={e => setNewName(e.target.value)} style={inputStyle} />
                </label>
                <label style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.72rem', fontWeight: 600 }}>Role *</span>
                  <input type="text" placeholder="e.g. Full Stack Developer Intern" value={newRole} onChange={e => setNewRole(e.target.value)} style={inputStyle} />
                </label>
                <label style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.72rem', fontWeight: 600 }}>Start Date *</span>
                  <input type="date" value={newStart} onChange={e => setNewStart(e.target.value)} style={inputStyle} />
                </label>
                <label style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.72rem', fontWeight: 600 }}>End Date <span style={{ opacity: 0.5 }}>(leave blank if ongoing)</span></span>
                  <input type="date" value={newEnd} onChange={e => setNewEnd(e.target.value)} style={inputStyle} />
                </label>
              </div>
              {addError && <p style={{ color: '#f87171', fontSize: '0.82rem', margin: '0 0 0.75rem' }}>{addError}</p>}
              <button onClick={addIntern} disabled={adding} style={{ background: 'linear-gradient(135deg,#FF8C00,#e67300)', border: 'none', borderRadius: '10px', padding: '0.65rem 1.5rem', color: '#fff', fontWeight: 700, fontSize: '0.875rem', cursor: adding ? 'wait' : 'pointer', opacity: adding ? 0.6 : 1 }}>
                {adding ? 'Adding...' : 'Add Intern'}
              </button>
            </div>
          )}

          {/* Intern List */}
          {loading ? (
            <p style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', padding: '3rem' }}>Loading...</p>
          ) : interns.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 2rem', background: '#0f172a', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.07)' }}>
              <p style={{ color: 'rgba(255,255,255,0.3)', margin: '0 0 1rem' }}>No interns added yet.</p>
              <button onClick={() => setShowAddForm(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'linear-gradient(135deg,#FF8C00,#e67300)', border: 'none', borderRadius: '10px', padding: '0.65rem 1.25rem', color: '#fff', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer' }}>
                <Plus size={14} /> Add your first intern
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {interns.map(intern => {
                const active = isActive(intern.end_date);
                const duration = calculateDuration(intern.start_date, intern.end_date);
                return (
                  <div key={intern.id} style={{ background: '#0f172a', border: `1px solid ${active ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.15)'}`, borderRadius: '13px', overflow: 'hidden' }}>
                    <div style={{ padding: '1rem 1.3rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>

                      {/* Status dot + info */}
                      <div style={{ flex: 1, minWidth: '180px', display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                        {/* Pulsing dot */}
                        <div style={{ marginTop: '0.3rem', flexShrink: 0, position: 'relative', width: 12, height: 12 }}>
                          <span style={{ display: 'block', width: 12, height: 12, borderRadius: '50%', background: active ? '#22c55e' : '#ef4444' }} />
                          {active && (
                            <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'rgba(34,197,94,0.4)', animation: 'intern-pulse 1.8s ease-out infinite' }} />
                          )}
                        </div>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.3rem' }}>
                            <span style={{ color: '#fff', fontWeight: 700, fontSize: '0.95rem' }}>{intern.name}</span>
                            <span style={{ background: 'rgba(255,140,0,0.1)', border: '1px solid rgba(255,140,0,0.25)', color: '#FF8C00', fontSize: '0.67rem', fontWeight: 700, padding: '0.1rem 0.55rem', borderRadius: '999px' }}>
                              {intern.role}
                            </span>
                            <span style={{ background: active ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', border: `1px solid ${active ? 'rgba(34,197,94,0.35)' : 'rgba(239,68,68,0.3)'}`, color: active ? '#22c55e' : '#f87171', fontSize: '0.65rem', fontWeight: 700, padding: '0.1rem 0.5rem', borderRadius: '999px' }}>
                              {active ? 'Active' : 'Past'}
                            </span>
                          </div>
                          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.78rem', margin: '0 0 0.1rem' }}>
                            {intern.start_date} → {intern.end_date || 'Present'}
                          </p>
                          {duration !== '—' && duration !== 'Invalid date range' && (
                            <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.72rem', margin: 0 }}>
                              Duration: {duration}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0, flexWrap: 'wrap' }}>
                        <button onClick={() => setCertIntern(intern)} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.4rem 0.9rem', borderRadius: '8px', border: '1px solid rgba(255,140,0,0.4)', background: 'rgba(255,140,0,0.08)', color: '#FF8C00', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer' }}>
                          <Award size={13} /> Certificate
                        </button>
                        <button onClick={() => deleteIntern(intern.id)} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.4rem 0.75rem', borderRadius: '8px', border: '1px solid rgba(239,68,68,0.25)', background: 'rgba(239,68,68,0.06)', color: '#f87171', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer' }}>
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <style>{`
        @keyframes intern-pulse {
          0%   { transform: scale(1);   opacity: 0.8; }
          70%  { transform: scale(2.2); opacity: 0; }
          100% { transform: scale(2.2); opacity: 0; }
        }
      `}</style>
    </>
  );
}
