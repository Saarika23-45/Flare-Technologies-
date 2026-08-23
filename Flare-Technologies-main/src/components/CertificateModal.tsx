import { useCallback, useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { X, Award, Download } from 'lucide-react';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import CertificateTemplate, { CERTIFICATE_HEIGHT, CERTIFICATE_WIDTH } from '@/components/CertificateTemplate';
import {
  calculateDuration,
  fetchCertificateByApplicationId,
  upsertCertificate,
  uploadCertificatePdf,
  type CertificateRecord,
} from '@/lib/certificates';

interface F2FApplicationForCert {
  id: number;
  name: string;
  role: string;
}

interface CertificateModalProps {
  app: F2FApplicationForCert;
  onClose: () => void;
  onSaved?: (applicationId: number) => void;
}

const inputStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '10px',
  color: '#fff',
  fontSize: '0.875rem',
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box',
  padding: '0.65rem 0.85rem',
};

const DEFAULT_PROGRAM = 'Fresher to Finisher Program';

async function renderCertificatePdf(
  templateEl: HTMLElement,
  certificateId: string | null,
): Promise<Blob> {
  if (certificateId) {
    await new Promise((resolve) => setTimeout(resolve, 350));
  }

  const dataUrl = await toPng(templateEl, {
    width: CERTIFICATE_WIDTH,
    height: CERTIFICATE_HEIGHT,
    pixelRatio: 2,
    cacheBust: true,
  });

  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'px',
    format: [CERTIFICATE_WIDTH, CERTIFICATE_HEIGHT],
  });
  pdf.addImage(dataUrl, 'PNG', 0, 0, CERTIFICATE_WIDTH, CERTIFICATE_HEIGHT);
  return pdf.output('blob');
}

export default function CertificateModal({ app, onClose, onSaved }: CertificateModalProps) {
  const captureRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [existingCert, setExistingCert] = useState<CertificateRecord | null>(null);
  const [name, setName] = useState(app.name);
  const [program, setProgram] = useState(DEFAULT_PROGRAM);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [savedUrl, setSavedUrl] = useState<string | null>(null);
  /** Download is only unlocked immediately after a successful Save of the current values. */
  const [canDownload, setCanDownload] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const previewCertificateId = existingCert?.id ?? null;
  const duration = calculateDuration(startDate, endDate);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const cert = await fetchCertificateByApplicationId(app.id);
      if (cancelled) return;
      setExistingCert(cert);
      if (cert) {
        setName(cert.name);
        setProgram(cert.program);
        setStartDate(cert.start_date);
        setEndDate(cert.end_date);
        if (cert.certificate_file_url) setSavedUrl(cert.certificate_file_url);
      } else {
        setName(app.name);
        setProgram(app.role ? `${app.role} — ${DEFAULT_PROGRAM}` : DEFAULT_PROGRAM);
      }
      // Download must wait for a Save in this session — never unlock from a prior save alone.
      setCanDownload(false);
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [app.id, app.name, app.role]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const invalidatePreview = () => {
    setHasGenerated(false);
    setCanDownload(false);
  };

  const handleGenerate = useCallback(async () => {
    if (!captureRef.current) return;
    if (!name.trim() || !program.trim() || !startDate || !endDate) {
      setError('Please fill in all fields before generating.');
      return;
    }
    if (duration === 'Invalid date range') {
      setError('End date must be on or after start date.');
      return;
    }

    setError(null);
    setGenerating(true);
    try {
      const blob = await renderCertificatePdf(captureRef.current, previewCertificateId);
      setPreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return URL.createObjectURL(blob);
      });
      setPdfBlob(blob);
      setHasGenerated(true);
    } catch {
      setError('Failed to generate certificate preview. Please try again.');
    } finally {
      setGenerating(false);
    }
  }, [name, program, startDate, endDate, duration, previewCertificateId]);

  const handleSave = async () => {
    if (!pdfBlob || !hasGenerated) return;

    setError(null);
    setSaving(true);
    try {
      let cert = await upsertCertificate({
        source_application_id: app.id,
        name: name.trim(),
        program: program.trim(),
        start_date: startDate,
        end_date: endDate,
      });
      if (!cert) {
        setError('Failed to save certificate record.');
        return;
      }

      let finalBlob = pdfBlob;
      if (captureRef.current) {
        flushSync(() => setExistingCert(cert));
        finalBlob = await renderCertificatePdf(captureRef.current, cert.id);
        setPreviewUrl((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return URL.createObjectURL(finalBlob);
        });
        setPdfBlob(finalBlob);
      }

      const fileUrl = await uploadCertificatePdf(cert.id, finalBlob);
      if (!fileUrl) {
        setError('Certificate saved but file upload failed. Please try saving again.');
        return;
      }

      cert = await upsertCertificate({
        source_application_id: app.id,
        name: name.trim(),
        program: program.trim(),
        start_date: startDate,
        end_date: endDate,
        certificate_file_url: fileUrl,
      });
      if (!cert) {
        setError('File uploaded but failed to update certificate URL.');
        return;
      }

      setExistingCert(cert);
      setSavedUrl(fileUrl);
      setCanDownload(true);
      onSaved?.(app.id);
    } catch {
      setError('Failed to save certificate. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const downloadUrl = canDownload ? (savedUrl ?? previewUrl) : null;

  return (
    <>
      <div
        onClick={(e) => e.target === e.currentTarget && onClose()}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.8)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
        }}
      >
        <div
          style={{
            background: '#0f172a',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '920px',
            maxHeight: '92vh',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              padding: '1rem 1.25rem',
              borderBottom: '1px solid rgba(255,255,255,0.07)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Award size={15} color="#FF8C00" />
                <span style={{ color: '#fff', fontWeight: 700, fontSize: '1rem' }}>
                  {existingCert ? 'Regenerate Certificate' : 'Generate Certificate'}
                </span>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', margin: '0.2rem 0 0' }}>
                {app.name}
              </p>
            </div>
            <button
              onClick={onClose}
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '8px',
                padding: '0.45rem',
                cursor: 'pointer',
                color: 'rgba(255,255,255,0.5)',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <X size={18} />
            </button>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem' }}>
            {loading ? (
              <p style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', padding: '2rem' }}>Loading...</p>
            ) : (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.85rem', marginBottom: '1rem' }}>
                  <label style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.72rem', fontWeight: 600 }}>Name</span>
                    <input type="text" value={name} onChange={(e) => { setName(e.target.value); invalidatePreview(); }} style={inputStyle} />
                  </label>
                  <label style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.72rem', fontWeight: 600 }}>Program</span>
                    <input type="text" value={program} onChange={(e) => { setProgram(e.target.value); invalidatePreview(); }} style={inputStyle} />
                  </label>
                  <label style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.72rem', fontWeight: 600 }}>Start date</span>
                    <input type="date" value={startDate} onChange={(e) => { setStartDate(e.target.value); invalidatePreview(); }} style={inputStyle} />
                  </label>
                  <label style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.72rem', fontWeight: 600 }}>End date</span>
                    <input type="date" value={endDate} onChange={(e) => { setEndDate(e.target.value); invalidatePreview(); }} style={inputStyle} />
                  </label>
                </div>

                <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.82rem', margin: '0 0 1rem' }}>
                  Duration: <span style={{ color: '#FF8C00', fontWeight: 600 }}>{duration}</span>
                </p>

                {error && (
                  <p style={{ color: '#f87171', fontSize: '0.82rem', margin: '0 0 1rem' }}>{error}</p>
                )}

                <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
                  <button
                    onClick={handleGenerate}
                    disabled={generating}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      background: 'rgba(255,140,0,0.08)',
                      border: '1px solid rgba(255,140,0,0.25)',
                      borderRadius: '8px',
                      padding: '0.5rem 1rem',
                      color: '#FF8C00',
                      cursor: generating ? 'wait' : 'pointer',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      opacity: generating ? 0.6 : 1,
                    }}
                  >
                    {generating ? 'Generating...' : 'Generate'}
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={!hasGenerated || saving}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      background: hasGenerated ? 'linear-gradient(135deg,#FF8C00,#e67300)' : 'rgba(255,255,255,0.04)',
                      border: hasGenerated ? 'none' : '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      padding: '0.5rem 1rem',
                      color: hasGenerated ? '#fff' : 'rgba(255,255,255,0.35)',
                      cursor: !hasGenerated || saving ? 'not-allowed' : 'pointer',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      opacity: saving ? 0.6 : 1,
                    }}
                  >
                    {saving ? 'Saving...' : canDownload ? 'Saved ✓' : 'Save'}
                  </button>
                  {downloadUrl ? (
                    <a
                      href={downloadUrl}
                      download={`certificate-${app.name.replace(/\s+/g, '-').toLowerCase()}.pdf`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                        padding: '0.5rem 1rem',
                        color: 'rgba(255,255,255,0.75)',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        textDecoration: 'none',
                      }}
                    >
                      <Download size={13} /> Download
                    </a>
                  ) : (
                    <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem', margin: 0, alignSelf: 'center', maxWidth: '280px', lineHeight: 1.4 }}>
                      Save the certificate first to generate its verification QR — Download will unlock after that.
                    </p>
                  )}
                </div>

                {previewUrl ? (
                  <div>
                    <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 0.5rem' }}>
                      Preview
                    </p>
                    <iframe
                      src={previewUrl}
                      title="Certificate preview"
                      style={{ width: '100%', height: '420px', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', background: '#fff' }}
                    />
                  </div>
                ) : (
                  <div style={{ overflow: 'auto', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', background: '#fff' }}>
                    <div style={{ transform: 'scale(0.55)', transformOrigin: 'top left', width: CERTIFICATE_WIDTH * 0.55 }}>
                      <CertificateTemplate
                        name={name}
                        program={program}
                        startDate={startDate}
                        endDate={endDate}
                        certificateId={previewCertificateId}
                        issuedAt={existingCert?.issued_at ?? existingCert?.updated_at}
                      />
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <div aria-hidden style={{ position: 'fixed', left: '-10000px', top: 0, zIndex: -1 }}>
        <div ref={captureRef}>
          <CertificateTemplate
            name={name}
            program={program}
            startDate={startDate}
            endDate={endDate}
            certificateId={previewCertificateId}
            issuedAt={existingCert?.issued_at ?? existingCert?.updated_at}
          />
        </div>
      </div>
    </>
  );
}
