import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { servicesData, ServiceCategory, SubService } from '@/data/servicesData';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

interface ServiceDetailProps {
    openModal: () => void;
}

const ServiceDetail = ({ openModal }: ServiceDetailProps) => {
    const { slug } = useParams<{ slug: string }>();
    const [service, setService] = useState<{ category: ServiceCategory; sub: SubService } | null>(null);

    useEffect(() => {
        window.scrollTo(0, 0);
        for (const cat of servicesData) {
            const sub = cat.subServices.find(s => s.slug === slug);
            if (sub) {
                setService({ category: cat, sub });
                return;
            }
        }
        setService(null);
    }, [slug]);

    /* ── 404 State ── */
    if (!service) {
        return (
            <section style={{
                minHeight: '100vh',
                background: 'var(--bg-base)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: '2rem',
            }}>
                <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.25rem', fontWeight: 700, color: 'var(--theme-text-primary)', marginBottom: '1rem' }}>
                    Service Not Found
                </h1>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                    The service you're looking for doesn't exist or has been moved.
                </p>
                <Link to="/services" style={{
                    fontFamily: 'var(--font-body)', fontSize: '0.9375rem', fontWeight: 600,
                    color: 'var(--theme-text-primary)', textDecoration: 'none',
                    padding: '0.75rem 1.75rem', borderRadius: '999px',
                    background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)',
                    transition: 'background 0.2s',
                }}>
                    ← Back to Services
                </Link>
            </section>
        );
    }

    const { category, sub } = service;

    return (
        <main style={{ background: 'var(--bg-base)', minHeight: '100vh', paddingTop: 'clamp(5.5rem, 12vw, 10rem)', paddingBottom: '5rem' }}>

            {/* ── Ambient Glow ── */}
            <div style={{
                position: 'absolute', top: 0, right: 0, width: '500px', height: '500px',
                background: 'color-mix(in srgb, var(--theme-primary) 16%, transparent)', borderRadius: '50%', filter: 'blur(150px)',
                pointerEvents: 'none',
            }} />

            <div className="container" style={{ padding: '0 1rem', maxWidth: '80rem', margin: '0 auto', position: 'relative', zIndex: 10 }}>

                {/* ── Back Link ── */}
                <div style={{ marginBottom: '2.5rem' }}>
                    <Link
                        to="/services"
                        style={{
                            fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 600,
                            color: 'var(--text-secondary)', textDecoration: 'none',
                            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                            transition: 'color 0.2s',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.color = 'var(--theme-text-primary)')}
                        onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
                    >
                        <ArrowLeft style={{ width: '16px', height: '16px' }} />
                        Back to {category.name}
                    </Link>
                </div>

                {/* ══════════════════════════════════════ */}
                {/* ── HERO SECTION ── */}
                {/* ══════════════════════════════════════ */}
                <div style={{ maxWidth: '720px', marginBottom: '4rem' }}>
                    {/* Category Badge */}
                    <span className="section-badge">{category.name}</span>

                    {/* H1 */}
                    <h1 style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: 'clamp(2rem, 4.5vw, 2.75rem)',
                        fontWeight: 700,
                        color: 'var(--theme-text-primary)',
                        letterSpacing: '-0.02em',
                        lineHeight: 1.18,
                        marginBottom: '1.25rem',
                    }}>
                        {sub.heroHeadline}
                    </h1>

                    {/* Subtitle */}
                    <p style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '1.0625rem',
                        color: 'var(--text-secondary)',
                        lineHeight: 1.7,
                        maxWidth: '560px',
                    }}>
                        {sub.shortDesc}
                    </p>
                </div>

                {/* ══════════════════════════════════════ */}
                {/* ── CONTENT GRID ── */}
                {/* ══════════════════════════════════════ */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr',
                    gap: '3rem',
                    marginBottom: '4rem',
                }}>
                    <style>{`
                        @media (min-width: 1024px) {
                            .sd-content-grid {
                                grid-template-columns: 7fr 5fr !important;
                                gap: 4rem !important;
                            }
                        }
                    `}</style>
                    <div className="sd-content-grid" style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr',
                        gap: '3rem',
                    }}>

                        {/* ── LEFT: Execution Process ── */}
                        <div>
                            <h2 style={{
                                fontFamily: 'var(--font-heading)',
                                fontSize: '1.375rem',
                                fontWeight: 700,
                                color: 'var(--theme-text-primary)',
                                letterSpacing: '-0.01em',
                                paddingBottom: '1rem',
                                marginBottom: '2rem',
                                borderBottom: '1px solid rgba(255,255,255,0.07)',
                            }}>
                                Execution Process
                            </h2>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                {sub.process.map((step, index) => {
                                    const colonIndex = step.indexOf(': ');
                                    const title = colonIndex > -1 ? step.substring(0, colonIndex) : `Step ${index + 1}`;
                                    const description = colonIndex > -1 ? step.substring(colonIndex + 2) : step;

                                    return (
                                        <div key={index} style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
                                            {/* Number Circle */}
                                            <div style={{
                                                width: '40px', height: '40px', minWidth: '40px',
                                                borderRadius: '50%',
                                                background: 'rgba(255,255,255,0.04)',
                                                border: '1px solid rgba(255,255,255,0.08)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                fontFamily: 'var(--font-heading)',
                                                fontSize: '0.9375rem', fontWeight: 700, color: 'var(--flare-orange)',
                                            }}>
                                                {index + 1}
                                            </div>

                                            {/* Step Content */}
                                            <div style={{ paddingTop: '2px' }}>
                                                <h3 style={{
                                                    fontFamily: 'var(--font-heading)',
                                                    fontSize: '1.0625rem',
                                                    fontWeight: 700,
                                                    color: 'var(--theme-text-primary)',
                                                    letterSpacing: '-0.01em',
                                                    marginBottom: '0.375rem',
                                                    lineHeight: 1.35,
                                                }}>
                                                    {title}
                                                </h3>
                                                <p style={{
                                                    fontFamily: 'var(--font-body)',
                                                    fontSize: '0.9375rem',
                                                    color: 'var(--text-secondary)',
                                                    lineHeight: 1.65,
                                                }}>
                                                    {description}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* ── RIGHT: Key Outcomes ── */}
                        <div>
                            <div style={{
                                background: 'rgba(255,255,255,0.02)',
                                border: '1px solid rgba(255,255,255,0.06)',
                                borderRadius: '1.25rem',
                                padding: '2rem',
                                position: 'sticky',
                                top: '8rem',
                            }}>
                                <h3 style={{
                                    fontFamily: 'var(--font-heading)',
                                    fontSize: '1.125rem',
                                    fontWeight: 700,
                                    color: 'var(--theme-text-primary)',
                                    letterSpacing: '-0.01em',
                                    paddingBottom: '1rem',
                                    marginBottom: '1.5rem',
                                    borderBottom: '1px solid rgba(255,255,255,0.07)',
                                }}>
                                    Key Outcomes
                                </h3>

                                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>
                                    {sub.benefits.map((benefit, i) => (
                                        <li key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                                            <CheckCircle2 style={{ width: '18px', height: '18px', color: 'var(--flare-orange)', flexShrink: 0, marginTop: '2px' }} />
                                            <span style={{
                                                fontFamily: 'var(--font-body)',
                                                fontSize: '0.9375rem',
                                                color: 'var(--theme-text-secondary)',
                                                lineHeight: 1.55,
                                            }}>
                                                {benefit}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ══════════════════════════════════════ */}
                {/* ── BOTTOM CTA ── */}
                {/* ══════════════════════════════════════ */}
                <div style={{
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: '1.25rem',
                    padding: 'clamp(2.5rem, 5vw, 4rem)',
                    textAlign: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                }}>
                    {/* Subtle gradient accent */}
                    <div style={{
                        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                        background: 'radial-gradient(ellipse at bottom left, color-mix(in srgb, var(--theme-primary) 18%, transparent), transparent 60%)',
                        pointerEvents: 'none',
                    }} />

                    <div style={{ position: 'relative', zIndex: 10, maxWidth: '520px', margin: '0 auto' }}>
                        <h3 style={{
                            fontFamily: 'var(--font-heading)',
                            fontSize: 'clamp(1.5rem, 3vw, 1.875rem)',
                            fontWeight: 700,
                            color: 'var(--theme-text-primary)',
                            letterSpacing: '-0.015em',
                            marginBottom: '0.75rem',
                            lineHeight: 1.25,
                        }}>
                            Start Your {sub.title} Project
                        </h3>
                        <p style={{
                            fontFamily: 'var(--font-body)',
                            fontSize: '0.9375rem',
                            color: 'var(--text-secondary)',
                            lineHeight: 1.65,
                            marginBottom: '2rem',
                        }}>
                            Schedule a free discovery call with our architects to map out exactly how we can implement this for your business.
                        </p>
                        <button
                            onClick={openModal}
                            className="btn btn-primary cursor-pointer"
                        >
                            Book Consultation
                        </button>
                    </div>
                </div>

            </div>
        </main>
    );
};

export default ServiceDetail;
