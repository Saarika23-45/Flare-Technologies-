import { useCallback, useEffect, useRef, useState } from 'react';
import { X, FileSignature, Download } from 'lucide-react';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import OfferLetterTemplate, {
  OFFER_LETTER_PAGE_HEIGHT,
  OFFER_LETTER_WIDTH,
} from '@/components/OfferLetterTemplate';
import {
  OFFER_LETTER_ROLES,
  addThreeMonths,
  guessRoleFromApplicationRole,
  type OfferLetterRole,
} from '@/lib/offerLetterContent';
import { formatCertificateDate, calculateDuration } from '@/lib/certificates';

interface F2FApplicationForOffer {
  id: number;
  name: string;
  role: string;
}

interface OfferLetterModalProps {
  app: F2FApplicationForOffer;
  onClose: () => void;
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

async function renderOfferLetterPdf(templateEl: HTMLElement): Promise<Blob> {
  // Allow fonts/images a brief moment to settle before capture
  await new Promise((resolve) => setTimeout(resolve, 200));

  const dataUrl = await toPng(templateEl, {
    width: OFFER_LETTER_WIDTH,
    height: templateEl.offsetHeight,
    pixelRatio: 2,
    cacheBust: true,
  });

  const img = new Image();
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error('Failed to load captured image'));
    img.src = dataUrl;
  });

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'px',
    format: [OFFER_LETTER_WIDTH, OFFER_LETTER_PAGE_HEIGHT],
  });

  const pageW = OFFER_LETTER_WIDTH;
  const pageH = OFFER_LETTER_PAGE_HEIGHT;
  const imgW = pageW;
  const imgH = (img.height / img.width) * imgW;

  // Prefer a single page when content fits (or is only a few px over due to rounding).
  // Avoid creating a mostly-blank trailing page from tiny remainders.
  const SLACK = 8;
  if (imgH <= pageH + SLACK) {
    pdf.addImage(dataUrl, 'PNG', 0, 0, imgW, Math.min(imgH, pageH));
    return pdf.output('blob');
  }

  let heightLeft = imgH;
  let position = 0;
  let page = 0;

  while (heightLeft > SLACK) {
    if (page > 0) pdf.addPage([pageW, pageH], 'portrait');
    pdf.addImage(dataUrl, 'PNG', 0, position, imgW, imgH);
    heightLeft -= pageH;
    position -= pageH;
    page += 1;
    if (page > 20) break;
  }

  return pdf.output('blob');
}

export default function OfferLetterModal({ app, onClose }: OfferLetterModalProps) {
  const captureRef = useRef<HTMLDivElement>(null);
  const guessed = guessRoleFromApplicationRole(app.role);
  const [name, setName] = useState(app.name);
  const [role, setRole] = useState<OfferLetterRole>(guessed ?? OFFER_LETTER_ROLES[0]);
  const [joiningDate, setJoiningDate] = useState('');
  const [generating, setGenerating] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const endDate = joiningDate ? addThreeMonths(joiningDate) : '';

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleGenerate = useCallback(async () => {
    if (!captureRef.current) return;
    if (!name.trim() || !joiningDate) {
      setError('Please fill in candidate name and joining date before generating.');
      return;
    }

    setError(null);
    setGenerating(true);
    try {
      const blob = await renderOfferLetterPdf(captureRef.current);
      setPreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return URL.createObjectURL(blob);
      });
    } catch {
      setError('Failed to generate offer letter. Please try again.');
    } finally {
      setGenerating(false);
    }
  }, [name, joiningDate]);

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
                <FileSignature size={15} color="#FF8C00" />
                <span style={{ color: '#fff', fontWeight: 700, fontSize: '1rem' }}>
                  Generate Offer Letter
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
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.85rem', marginBottom: '1rem' }}>
              <label style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.72rem', fontWeight: 600 }}>Candidate name</span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => { setName(e.target.value); setPreviewUrl((prev) => { if (prev) URL.revokeObjectURL(prev); return null; }); }}
                  style={inputStyle}
                />
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.72rem', fontWeight: 600 }}>Program / Role</span>
                <select
                  value={role}
                  onChange={(e) => {
                    setRole(e.target.value as OfferLetterRole);
                    setPreviewUrl((prev) => { if (prev) URL.revokeObjectURL(prev); return null; });
                  }}
                  style={{ ...inputStyle, cursor: 'pointer' }}
                >
                  {OFFER_LETTER_ROLES.map((r) => (
                    <option key={r} value={r} style={{ background: '#0f172a', color: '#fff' }}>{r}</option>
                  ))}
                </select>
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.72rem', fontWeight: 600 }}>Joining date</span>
                <input
                  type="date"
                  value={joiningDate}
                  onChange={(e) => {
                    setJoiningDate(e.target.value);
                    setPreviewUrl((prev) => { if (prev) URL.revokeObjectURL(prev); return null; });
                  }}
                  style={inputStyle}
                />
              </label>
            </div>

            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.82rem', margin: '0 0 1rem' }}>
              End date (auto):{' '}
              <span style={{ color: '#FF8C00', fontWeight: 600 }}>
                {endDate ? formatCertificateDate(endDate) : '—'}
              </span>
              {joiningDate && endDate && (
                <span style={{ color: 'rgba(255,255,255,0.35)' }}>
                  {' '}· {calculateDuration(joiningDate, endDate)}
                </span>
              )}
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
              {previewUrl && (
                <a
                  href={previewUrl}
                  download={`offer-letter-${name.trim().replace(/\s+/g, '-').toLowerCase() || 'intern'}.pdf`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    background: 'linear-gradient(135deg,#FF8C00,#e67300)',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '0.5rem 1rem',
                    color: '#fff',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    textDecoration: 'none',
                  }}
                >
                  <Download size={13} /> Download
                </a>
              )}
            </div>

            {previewUrl ? (
              <div>
                <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 0.5rem' }}>
                  Preview
                </p>
                <iframe
                  src={previewUrl}
                  title="Offer letter preview"
                  style={{ width: '100%', height: '520px', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', background: '#fff' }}
                />
              </div>
            ) : (
              <div style={{ overflow: 'auto', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', background: '#fff', maxHeight: '420px' }}>
                <div style={{ transform: 'scale(0.55)', transformOrigin: 'top left', width: OFFER_LETTER_WIDTH * 0.55 }}>
                  <OfferLetterTemplate
                    candidateName={name}
                    role={role}
                    joiningDate={joiningDate}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div aria-hidden style={{ position: 'fixed', left: '-10000px', top: 0, zIndex: -1 }}>
        <div ref={captureRef}>
          <OfferLetterTemplate
            candidateName={name}
            role={role}
            joiningDate={joiningDate}
          />
        </div>
      </div>
    </>
  );
}
