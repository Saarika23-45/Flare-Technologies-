import { formatCertificateDate } from '@/lib/certificates';
import {
  ROLE_RESPONSIBILITIES,
  addThreeMonths,
  type OfferLetterRole,
} from '@/lib/offerLetterContent';

/** A4 portrait at 96 DPI — designed to fit one page. */
export const OFFER_LETTER_WIDTH = 794;
export const OFFER_LETTER_PAGE_HEIGHT = 1123;

const INK = '#0f172a';
const INK_MUTED = 'rgba(15, 23, 42, 0.85)';
const ACCENT = '#FF8C00';

interface OfferLetterTemplateProps {
  candidateName: string;
  role: OfferLetterRole;
  joiningDate: string;
}

function BulletItem({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '8px',
        marginBottom: '3px',
        color: INK,
      }}
    >
      <span
        style={{
          flexShrink: 0,
          width: '12px',
          textAlign: 'center',
          color: INK,
          fontSize: '12px',
          lineHeight: '18px',
          fontWeight: 700,
        }}
        aria-hidden
      >
        •
      </span>
      <span style={{ flex: 1, color: INK, fontSize: '12px', lineHeight: '18px' }}>{children}</span>
    </div>
  );
}

export default function OfferLetterTemplate({
  candidateName,
  role,
  joiningDate,
}: OfferLetterTemplateProps) {
  const endDate = joiningDate ? addThreeMonths(joiningDate) : '';
  const todayLabel = formatCertificateDate(new Date().toISOString().slice(0, 10));
  const joiningLabel = joiningDate ? formatCertificateDate(joiningDate) : '—';
  const endLabel = endDate ? formatCertificateDate(endDate) : '—';
  const responsibilities = ROLE_RESPONSIBILITIES[role];
  const displayName = candidateName.trim() || '—';

  const bodyPara: React.CSSProperties = {
    fontSize: '12px',
    lineHeight: 1.5,
    margin: '0 0 10px',
    textAlign: 'justify',
    color: INK,
  };

  return (
    <div
      style={{
        width: OFFER_LETTER_WIDTH,
        height: OFFER_LETTER_PAGE_HEIGHT,
        background: '#ffffff',
        boxSizing: 'border-box',
        padding: '40px 52px 36px',
        fontFamily: 'var(--font-body), Inter, system-ui, sans-serif',
        color: INK,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Letterhead */}
      <div style={{ textAlign: 'center', marginBottom: '12px', flexShrink: 0 }}>
        <img
          src="/logo.png"
          alt="Flare Technologies"
          style={{ height: 40, width: 'auto', marginBottom: '8px', display: 'inline-block' }}
        />
        <h1
          style={{
            fontFamily: 'var(--font-heading), Sora, system-ui, sans-serif',
            fontSize: '18px',
            fontWeight: 700,
            letterSpacing: '0.14em',
            margin: 0,
            color: INK,
          }}
        >
          FLARE TECHNOLOGIES
        </h1>
      </div>

      {/* Divider under letterhead */}
      <div
        style={{
          height: '1px',
          width: '100%',
          background: ACCENT,
          marginBottom: '14px',
          flexShrink: 0,
        }}
      />

      {/* Header block */}
      <div
        style={{
          fontSize: '12px',
          lineHeight: 1.55,
          marginBottom: '12px',
          color: INK,
          flexShrink: 0,
        }}
      >
        <p style={{ margin: '0 0 1px', color: INK }}>
          <strong style={{ color: INK }}>Date:</strong> {todayLabel}
        </p>
        <p style={{ margin: '0 0 1px', color: INK }}>
          <strong style={{ color: INK }}>Candidate:</strong> {displayName}
        </p>
        <p style={{ margin: '0 0 1px', color: INK }}>
          <strong style={{ color: INK }}>Role:</strong> {role} Intern
        </p>
        <p style={{ margin: '0 0 1px', color: INK }}>
          <strong style={{ color: INK }}>Joining Date:</strong> {joiningLabel}
        </p>
        <p style={{ margin: 0, color: INK }}>
          <strong style={{ color: INK }}>Location:</strong> Bengaluru
        </p>
      </div>

      {/* Greeting */}
      <p style={{ fontSize: '13px', margin: '0 0 10px', lineHeight: 1.45, color: INK, flexShrink: 0 }}>
        Dear {displayName},
      </p>

      {/* Opening */}
      <p style={bodyPara}>
        Congratulations! We are pleased to offer you the position of {role} Intern at FLARE
        TECHNOLOGIES under our Freshers to Finishers Hiring Program. We are excited to welcome
        you and look forward to supporting your professional growth over the next three months.
      </p>

      {/* Program description */}
      <p style={bodyPara}>
        Our Freshers to Finishers Program is designed to help aspiring professionals transition from
        academic learning to practical industry experience. During your internship, you will work on real
        projects, collaborate with experienced team members, receive mentorship, and gain exposure to
        business processes relevant to your role.
      </p>

      {/* Role & Responsibilities */}
      <h2
        style={{
          fontFamily: 'var(--font-heading), Sora, system-ui, sans-serif',
          fontSize: '14px',
          fontWeight: 700,
          margin: '2px 0 6px',
          color: ACCENT,
          flexShrink: 0,
        }}
      >
        Role & Responsibilities
      </h2>
      <p style={{ ...bodyPara, marginBottom: '6px' }}>
        Your role responsibilities include the following:
      </p>
      <div style={{ margin: '0 0 10px', paddingLeft: '2px', flexShrink: 0 }}>
        {responsibilities.map((item) => (
          <BulletItem key={item}>{item}</BulletItem>
        ))}
      </div>

      {/* Internship Details */}
      <h2
        style={{
          fontFamily: 'var(--font-heading), Sora, system-ui, sans-serif',
          fontSize: '14px',
          fontWeight: 700,
          margin: '2px 0 6px',
          color: ACCENT,
          flexShrink: 0,
        }}
      >
        Internship Details
      </h2>
      <div style={{ margin: '0 0 10px', paddingLeft: '2px', flexShrink: 0 }}>
        <BulletItem>
          <strong style={{ color: INK }}>Duration:</strong>{' '}
          <span style={{ color: INK }}>3 Months ({joiningLabel} – {endLabel})</span>
        </BulletItem>
        <BulletItem>
          <strong style={{ color: INK }}>Employment Type:</strong>{' '}
          <span style={{ color: INK }}>Full-Time Internship</span>
        </BulletItem>
        <BulletItem>
          <strong style={{ color: INK }}>Reporting To:</strong>{' '}
          <span style={{ color: INK }}>Assigned Mentor / Reporting Manager</span>
        </BulletItem>
        <BulletItem>
          <strong style={{ color: INK }}>Program:</strong>{' '}
          <span style={{ color: INK }}>Freshers to Finishers</span>
        </BulletItem>
        <BulletItem>
          <strong style={{ color: INK }}>Full-Time Opportunity:</strong>{' '}
          <span style={{ color: INK }}>Performance-Based upon successful completion.</span>
        </BulletItem>
      </div>

      {/* Expectations */}
      <p style={bodyPara}>
        As an intern, you are expected to maintain professionalism, confidentiality, effective
        communication, accountability, and timely completion of assigned work. Performance will be
        evaluated based on learning, ownership, quality of work, teamwork, and overall contribution.
      </p>

      {/* Disclaimer */}
      <p style={bodyPara}>
        This internship is intended as a learning opportunity and does not guarantee employment.
        High-performing interns may be considered for a full-time role based on performance and business
        requirements. Either party may discontinue the internship with reasonable notice. All company and
        client information must remain confidential during and after your internship.
      </p>

      {/* Closing */}
      <p style={{ ...bodyPara, marginBottom: '12px' }}>
        We are delighted to welcome you to FLARE TECHNOLOGIES and wish you every success
        throughout this journey.
      </p>

      {/* Closing divider before signatures */}
      <div
        style={{
          height: '1px',
          width: '100%',
          background: 'rgba(15, 23, 42, 0.2)',
          marginBottom: '14px',
          flexShrink: 0,
        }}
      />

      {/* Signatures — no marginTop:auto (that forced a full-page stretch / blank 2nd page) */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: '32px',
          flexShrink: 0,
        }}
      >
        <p style={{ fontSize: '12px', margin: 0, lineHeight: 1.7, color: INK }}>
          Candidate Signature: __________&nbsp;&nbsp;Date: _______
        </p>
        <div style={{ textAlign: 'right', fontSize: '12px', lineHeight: 1.5, color: INK }}>
          <p style={{ margin: '0 0 1px', fontWeight: 600, color: INK }}>Authorized Signatory</p>
          <p style={{ margin: '0 0 1px', fontWeight: 700, color: INK }}>Adity Singh</p>
          <p style={{ margin: '0 0 1px', color: INK_MUTED }}>Founder & CEO</p>
          <p style={{ margin: 0, letterSpacing: '0.06em', fontWeight: 600, color: INK }}>
            FLARE TECHNOLOGIES
          </p>
        </div>
      </div>
    </div>
  );
}
