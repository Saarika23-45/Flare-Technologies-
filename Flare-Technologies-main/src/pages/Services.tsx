import { useState } from 'react'
import ServicesComponent from "@/components/Services"
import SEO from "@/components/SEO"

const servicesPageSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "B2B Technical Marketing Services — Flare Technologies",
  "url": "https://www.flaretechnologies.in/services",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Automated Systems", "url": "https://www.flaretechnologies.in/main-services/automated-systems" },
    { "@type": "ListItem", "position": 2, "name": "Engineering & Development", "url": "https://www.flaretechnologies.in/main-services/engineering-development" },
    { "@type": "ListItem", "position": 3, "name": "Growth & Marketing", "url": "https://www.flaretechnologies.in/main-services/growth-marketing" },
    { "@type": "ListItem", "position": 4, "name": "Consulting & Strategy", "url": "https://www.flaretechnologies.in/main-services/consulting-strategy" },
    { "@type": "ListItem", "position": 5, "name": "Cloud Infrastructure", "url": "https://www.flaretechnologies.in/main-services/cloud-infrastructure" },
    { "@type": "ListItem", "position": 6, "name": "AI Solutions", "url": "https://www.flaretechnologies.in/main-services/ai-solutions" },
    { "@type": "ListItem", "position": 7, "name": "B2B Partnerships", "url": "https://www.flaretechnologies.in/main-services/b2b-partnerships" },
  ]
};

const faqs = [
  {
    q: "What services does Flare Technologies offer?",
    a: "Flare Technologies covers the full stack of B2B growth — automated systems, engineering and development, growth and marketing, consulting and strategy, cloud infrastructure, AI solutions, and long-term B2B partnerships. Every service is senior-led and delivered as a connected system, not a collection of isolated deliverables."
  },
  {
    q: "Does Flare Technologies work with businesses outside Bangalore?",
    a: "Yes. While we are based in Bangalore, we work with B2B businesses across India and remotely with clients internationally. All our engagements are structured to run smoothly regardless of location, with clear communication cadences and delivery ownership from day one."
  },
  {
    q: "What is technical marketing, and how is it different from regular marketing?",
    a: "Technical marketing combines deep product and engineering understanding with strategic marketing execution. Where regular marketing focuses on reach and brand, technical marketing focuses on making complex products legible to buyers — through precise content, automation, and demand systems that speak the language of technical buyers and decision-makers."
  },
  {
    q: "How long does a typical engagement take to show results?",
    a: "It depends on the scope, but most clients see measurable early indicators within 4 to 8 weeks of engagement start. Automation systems and infrastructure work tends to show impact faster; content and marketing strategies compound over 3 to 6 months. We set clear milestones upfront so you always know what to expect and when."
  },
  {
    q: "Do you offer ongoing support after a project is delivered?",
    a: "Yes. Most of our clients move into a retainer after the initial project — we offer custom ongoing plans that cover maintenance, iteration, performance monitoring, and continued execution. We are built for long-term partnerships, not one-off handoffs."
  },
  {
    q: "How do I get started with Flare Technologies?",
    a: "Book a free discovery call through the contact page or click Book Consultation in the navigation. We will spend 30 minutes understanding your business, your current challenges, and your goals — then come back with a clear proposal tailored to your situation. No generic decks, no sales pressure."
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map(f => ({
    "@type": "Question",
    "name": f.q,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": f.a
    }
  }))
};

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="jd-card"
      style={{
        background: 'var(--theme-surface)',
        border: '1px solid var(--theme-border)',
        borderRadius: '16px',
        overflow: 'hidden',
        transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(37,99,235,0.35)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--theme-border)'; }}
    >
      {/* Header — same pattern as jd-card-header in Careers */}
      <div
        onClick={() => setOpen(!open)}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: '1rem', padding: '1.25rem 1.5rem', cursor: 'pointer',
        }}
      >
        <h3 style={{
          fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 700,
          color: 'var(--theme-text-primary)', margin: 0, lineHeight: 1.4,
        }}>
          {q}
        </h3>
        <svg
          width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.5"
          strokeLinecap="round" strokeLinejoin="round"
          style={{
            color: 'var(--theme-text-secondary)', flexShrink: 0,
            transition: 'transform 0.25s ease',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
      {/* Body — same pattern as jd-card-body in Careers */}
      {open && (
        <div style={{
          padding: '0 1.5rem 1.25rem',
          borderTop: '1px solid var(--theme-border)',
        }}>
          <p style={{
            fontFamily: 'var(--font-body)', fontSize: '0.9rem',
            color: 'var(--theme-text-secondary)', lineHeight: 1.7, margin: '1rem 0 0',
          }}>
            {a}
          </p>
        </div>
      )}
    </div>
  );
}

interface ServicesPageProps {
    openModal: () => void;
}

export default function Services({ openModal }: ServicesPageProps) {
    return (
        <main className="min-h-screen">
            <SEO
                title="B2B Technical Marketing Services | Flare Technologies"
                description="Explore our services: technical content, marketing automation, video production, and agentic systems for B2B companies."
                canonical="https://www.flaretechnologies.in/services"
            />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesPageSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
            <ServicesComponent openModal={openModal} />

            {/* ── FAQ Section — below all existing service content ── */}
            <section style={{
                background: 'var(--bg-base)',
                padding: 'clamp(3rem, 6vw, 5rem) 1rem',
                borderTop: '1px solid var(--theme-border)',
            }}>
                <div className="container" style={{ maxWidth: '760px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                        <span className="section-badge">FAQ</span>
                        <h2 style={{
                            fontFamily: 'var(--font-heading)',
                            fontSize: 'clamp(1.5rem, 3.5vw, 2.25rem)',
                            fontWeight: 800,
                            color: 'var(--theme-text-primary)',
                            letterSpacing: '-0.02em',
                            marginTop: '0.5rem',
                        }}>
                            Frequently Asked Questions
                        </h2>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {faqs.map((f, i) => (
                            <FaqItem key={i} q={f.q} a={f.a} />
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}
