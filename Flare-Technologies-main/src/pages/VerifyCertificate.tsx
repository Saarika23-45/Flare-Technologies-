import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CheckCircle, XCircle } from 'lucide-react';
import SEO from '@/components/SEO';
import {
  calculateDuration,
  fetchCertificateById,
  formatCertificateDate,
  type CertificateRecord,
} from '@/lib/certificates';

export default function VerifyCertificate() {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [cert, setCert] = useState<CertificateRecord | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      const record = await fetchCertificateById(id);
      if (!cancelled) {
        setCert(record);
        setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [id]);

  const dateRange = cert
    ? `${formatCertificateDate(cert.start_date)} – ${formatCertificateDate(cert.end_date)}`
    : '';
  const duration = cert ? calculateDuration(cert.start_date, cert.end_date) : '';

  return (
    <>
      <SEO
        title="Certificate Verification | Flare Technologies"
        description="Verify a Fresher to Finisher program certificate issued by Flare Technologies."
        canonical={`https://www.flaretechnologies.in/verify/${id ?? ''}`}
      />
      <main
        style={{
          minHeight: '100vh',
          background: '#060b17',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'clamp(5rem,10vw,7rem) 1rem 3rem',
        }}
      >
        <div
          style={{
            background: '#0f172a',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '16px',
            padding: '2.75rem 2rem',
            width: '100%',
            maxWidth: '520px',
            textAlign: 'center',
          }}
        >
          {loading ? (
            <p style={{ color: 'rgba(255,255,255,0.4)', margin: 0 }}>Verifying...</p>
          ) : cert ? (
            <>
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: '50%',
                  background: 'rgba(255,140,0,0.12)',
                  border: '1px solid rgba(255,140,0,0.35)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.5rem',
                }}
              >
                <CheckCircle size={36} color="#FF8C00" />
              </div>
              <h1
                style={{
                  color: '#fff',
                  fontWeight: 900,
                  fontSize: 'clamp(1.75rem, 4vw, 2.15rem)',
                  margin: '0 0 0.75rem',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.15,
                }}
              >
                ✓ Certificate Verified
              </h1>
              <p
                style={{
                  color: 'rgba(255,255,255,0.45)',
                  fontSize: '0.9rem',
                  margin: '0 0 1.5rem',
                  lineHeight: 1.5,
                }}
              >
                This certificate is authentic and was issued by Flare Technologies.
              </p>

              <div
                style={{
                  background: 'rgba(255,140,0,0.06)',
                  border: '1px solid rgba(255,140,0,0.25)',
                  borderRadius: '10px',
                  padding: '0.85rem 1rem',
                  marginBottom: '1.75rem',
                  textAlign: 'left',
                }}
              >
                <p
                  style={{
                    color: 'rgba(255,255,255,0.4)',
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    margin: '0 0 0.35rem',
                  }}
                >
                  Certificate ID
                </p>
                <p
                  style={{
                    color: '#FF8C00',
                    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    margin: 0,
                    wordBreak: 'break-all',
                    lineHeight: 1.4,
                  }}
                >
                  {cert.id}
                </p>
              </div>

              <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 0.25rem' }}>Name</p>
                  <p style={{ color: '#fff', fontWeight: 700, fontSize: '1.05rem', margin: 0 }}>{cert.name}</p>
                </div>
                <div>
                  <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 0.25rem' }}>Program</p>
                  <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.9rem', margin: 0 }}>{cert.program}</p>
                </div>
                <div>
                  <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 0.25rem' }}>Duration</p>
                  <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.9rem', margin: 0 }}>{dateRange}</p>
                  {duration && duration !== '—' && duration !== 'Invalid date range' && (
                    <p style={{ color: '#FF8C00', fontSize: '0.82rem', margin: '0.25rem 0 0', fontWeight: 600 }}>{duration}</p>
                  )}
                </div>
              </div>
            </>
          ) : (
            <>
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.25rem',
                }}
              >
                <XCircle size={32} color="rgba(255,255,255,0.35)" />
              </div>
              <h1 style={{ color: '#fff', fontWeight: 800, fontSize: '1.35rem', margin: '0 0 0.5rem' }}>
                Certificate not found
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', margin: 0 }}>
                We could not verify this certificate. Please check the link and try again.
              </p>
            </>
          )}
        </div>
      </main>
    </>
  );
}
