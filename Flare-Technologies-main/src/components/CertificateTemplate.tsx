import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { calculateDuration, formatCertificateDate } from '@/lib/certificates';

export const CERTIFICATE_WIDTH = 1123;
export const CERTIFICATE_HEIGHT = 794;
export const VERIFY_BASE_URL = 'https://www.flaretechnologies.in/verify';

interface CertificateTemplateProps {
  name: string;
  program: string;
  startDate: string;
  endDate: string;
  certificateId?: string | null;
  issuedAt?: string | null;
}

export default function CertificateTemplate({
  name,
  program,
  startDate,
  endDate,
  certificateId,
  issuedAt,
}: CertificateTemplateProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const duration = calculateDuration(startDate, endDate);
  const issuedLabel = issuedAt
    ? formatCertificateDate(issuedAt.slice(0, 10))
    : startDate
      ? formatCertificateDate(startDate)
      : '—';

  useEffect(() => {
    if (!certificateId) {
      setQrDataUrl(null);
      return;
    }
    QRCode.toDataURL(`${VERIFY_BASE_URL}/${certificateId}`, {
      width: 100,
      margin: 1,
      color: { dark: '#0f172a', light: '#FBF8F3' },
    })
      .then(setQrDataUrl)
      .catch(() => setQrDataUrl(null));
  }, [certificateId]);

  return (
    <div
      style={{
        width: CERTIFICATE_WIDTH,
        height: CERTIFICATE_HEIGHT,
        background: '#FBF8F3',
        boxSizing: 'border-box',
        padding: '22px',
        fontFamily: 'var(--font-body), Inter, system-ui, sans-serif',
        color: '#0f172a',
        position: 'relative',
      }}
    >
      {/* Outer navy border + inner orange accent */}
      <div
        style={{
          width: '100%',
          height: '100%',
          boxSizing: 'border-box',
          border: '2px solid #0f172a',
          padding: '5px',
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            boxSizing: 'border-box',
            border: '1.5px solid #FF8C00',
            padding: '28px 40px 22px',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Header: logo + company name (~2×) */}
          <div style={{ textAlign: 'center', marginBottom: '8px', flexShrink: 0 }}>
            <img
              src="/logo.webp"
              alt="Flare Technologies"
              style={{ height: 104, width: 'auto', marginBottom: '10px', display: 'inline-block' }}
            />
            <h1
              style={{
                fontFamily: 'var(--font-heading), Sora, system-ui, sans-serif',
                fontSize: '68px',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                margin: '0 0 6px',
                color: '#0f172a',
                lineHeight: 1.05,
              }}
            >
              Flare Technologies
            </h1>
            <div
              style={{
                width: 280,
                height: 3,
                margin: '0 auto 12px',
                background: 'linear-gradient(90deg, #FF8C00, #eab308, #22c55e, #3b82f6, #a855f7)',
                borderRadius: 2,
              }}
            />
            <p
              style={{
                fontFamily: 'var(--font-heading), Sora, system-ui, sans-serif',
                fontSize: '26px',
                fontWeight: 600,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: '#FF8C00',
                margin: 0,
                lineHeight: 1.2,
              }}
            >
              Certificate of Completion
            </p>
          </div>

          {/* Body */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              padding: '6px 24px',
              minHeight: 0,
            }}
          >
            <p
              style={{
                fontSize: '32px',
                lineHeight: 1.35,
                color: 'rgba(15,23,42,0.65)',
                margin: '0 0 12px',
              }}
            >
              This certifies that
            </p>
            <p
              style={{
                fontFamily: 'var(--font-heading), Sora, system-ui, sans-serif',
                fontSize: '36px',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                color: '#0f172a',
                margin: '0 0 14px',
                lineHeight: 1.2,
              }}
            >
              {name || '—'}
            </p>
            <p
              style={{
                fontSize: '32px',
                lineHeight: 1.45,
                color: 'rgba(15,23,42,0.7)',
                margin: 0,
                maxWidth: 900,
              }}
            >
              has successfully completed{' '}
              <span style={{ fontWeight: 600, color: '#0f172a' }}>{program || '—'}</span>
              {' '}from{' '}
              <span style={{ fontWeight: 600, color: '#0f172a' }}>
                {startDate ? formatCertificateDate(startDate) : '—'}
              </span>
              {' '}to{' '}
              <span style={{ fontWeight: 600, color: '#0f172a' }}>
                {endDate ? formatCertificateDate(endDate) : '—'}
              </span>
              {duration && duration !== '—' && duration !== 'Invalid date range' ? (
                <> ({duration})</>
              ) : null}
              .
            </p>
          </div>

          {/* Footer: three zones — date/ID | signature | QR */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1.15fr 1fr',
              alignItems: 'flex-end',
              gap: '20px',
              marginTop: '10px',
              flexShrink: 0,
            }}
          >
            {/* Bottom-left: issued + ID (~2×, still muted) */}
            <div style={{ minWidth: 0, textAlign: 'left' }}>
              <p
                style={{
                  fontSize: '22px',
                  color: 'rgba(15,23,42,0.45)',
                  margin: '0 0 4px',
                  letterSpacing: '0.03em',
                  lineHeight: 1.2,
                }}
              >
                Issued: {issuedLabel}
              </p>
              <p
                style={{
                  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                  fontSize: '20px',
                  color: 'rgba(15,23,42,0.4)',
                  margin: 0,
                  wordBreak: 'break-all',
                  lineHeight: 1.25,
                }}
              >
                ID: {certificateId || '—'}
              </p>
            </div>

            {/* Bottom-center: signature block, decoupled from QR */}
            <div style={{ textAlign: 'center', paddingBottom: '2px' }}>
              <div
                style={{
                  width: 200,
                  borderTop: '2px solid rgba(15,23,42,0.35)',
                  margin: '0 auto 10px',
                }}
              />
              <p
                style={{
                  fontFamily: 'var(--font-heading), Sora, system-ui, sans-serif',
                  fontSize: '28px',
                  fontWeight: 700,
                  fontStyle: 'italic',
                  color: '#0f172a',
                  margin: '0 0 4px',
                  lineHeight: 1.15,
                }}
              >
                Adity Singh
              </p>
              <p
                style={{
                  fontSize: '22px',
                  color: 'rgba(15,23,42,0.5)',
                  margin: 0,
                  lineHeight: 1.2,
                }}
              >
                Founder, Flare Technologies
              </p>
            </div>

            {/* Bottom-right: QR alone */}
            <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              {qrDataUrl ? (
                <>
                  <img src={qrDataUrl} alt="Verification QR code" width={88} height={88} style={{ display: 'block' }} />
                  <p style={{ fontSize: '18px', color: 'rgba(15,23,42,0.4)', margin: '5px 0 0', letterSpacing: '0.04em', lineHeight: 1.1 }}>
                    Scan to verify
                  </p>
                </>
              ) : (
                <div
                  style={{
                    width: 88,
                    height: 88,
                    border: '1.5px dashed rgba(15,23,42,0.2)',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '10px',
                    fontWeight: 600,
                    color: 'rgba(15,23,42,0.35)',
                    textAlign: 'center',
                    padding: '6px',
                    boxSizing: 'border-box',
                    lineHeight: 1.3,
                  }}
                >
                  [QR — appears after saving]
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
