import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { servicesData } from '@/data/servicesData';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { gsap } from 'gsap';

/* ── Spotlight that follows the cursor across the whole page ── */
const PageSpotlight: React.FC<{ containerRef: React.RefObject<HTMLDivElement | null> }> = ({ containerRef }) => {
    useEffect(() => {
        const spotlight = document.createElement('div');
        spotlight.style.cssText = `
            position: fixed;
            width: 700px;
            height: 700px;
            border-radius: 50%;
            pointer-events: none;
            background: radial-gradient(circle,
                rgba(255,140,0,0.13) 0%,
                rgba(255,140,0,0.07) 20%,
                rgba(255,140,0,0.03) 40%,
                transparent 65%
            );
            z-index: 9999;
            opacity: 0;
            transform: translate(-50%, -50%);
            mix-blend-mode: screen;
            transition: opacity 0.3s ease;
        `;
        document.body.appendChild(spotlight);

        const onMove = (e: MouseEvent) => {
            if (!containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            const inside =
                e.clientX >= rect.left && e.clientX <= rect.right &&
                e.clientY >= rect.top && e.clientY <= rect.bottom;

            spotlight.style.opacity = inside ? '1' : '0';
            gsap.to(spotlight, { left: e.clientX, top: e.clientY, duration: 0.12, ease: 'power2.out' });

            /* per-card border glow */
            containerRef.current?.querySelectorAll<HTMLElement>('.as-card').forEach(card => {
                const cr = card.getBoundingClientRect();
                const cx = cr.left + cr.width / 2;
                const cy = cr.top + cr.height / 2;
                const dist = Math.max(0, Math.hypot(e.clientX - cx, e.clientY - cy) - Math.max(cr.width, cr.height) / 2);
                const proximity = 180;
                const fade = 320;
                const intensity = dist <= proximity ? 1 : dist <= fade ? (fade - dist) / (fade - proximity) : 0;
                const rx = ((e.clientX - cr.left) / cr.width) * 100;
                const ry = ((e.clientY - cr.top) / cr.height) * 100;
                card.style.setProperty('--glow-x', `${rx}%`);
                card.style.setProperty('--glow-y', `${ry}%`);
                card.style.setProperty('--glow-i', intensity.toString());
            });
        };

        const onLeave = () => { spotlight.style.opacity = '0'; };

        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseleave', onLeave);
        return () => {
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseleave', onLeave);
            spotlight.parentNode?.removeChild(spotlight);
        };
    }, [containerRef]);

    return null;
};

const AllServices: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => { window.scrollTo(0, 0); }, []);

    return (
        <main
            ref={containerRef}
            className="min-h-screen relative overflow-hidden"
            style={{ background: 'var(--bg-base)', paddingTop: 'clamp(5.5rem, 12vw, 7rem)', paddingBottom: '5rem' }}
        >
            <PageSpotlight containerRef={containerRef} />

            {/* Ambient glows */}
            <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-[160px] pointer-events-none"
                style={{ background: 'color-mix(in srgb, var(--theme-primary) 18%, transparent)' }} />
            <div className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full blur-[160px] pointer-events-none"
                style={{ background: 'color-mix(in srgb, var(--theme-accent) 16%, transparent)' }} />

            <style>{`
                .as-card {
                    position: relative;
                    background: var(--theme-surface);
                    border: 1px solid var(--theme-border);
                    border-radius: 1rem;
                    padding: 1.75rem;
                    text-decoration: none;
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                    overflow: hidden;
                    transition: transform 0.25s ease, box-shadow 0.25s ease;

                    --glow-x: 50%;
                    --glow-y: 50%;
                    --glow-i: 0;
                }
                .as-card::after {
                    content: '';
                    position: absolute;
                    inset: 0;
                    padding: 1px;
                    border-radius: inherit;
                    background: radial-gradient(
                        400px circle at var(--glow-x) var(--glow-y),
                        color-mix(in srgb, var(--theme-primary) calc(var(--glow-i) * 90%), transparent) 0%,
                        color-mix(in srgb, var(--theme-primary) calc(var(--glow-i) * 40%), transparent) 30%,
                        transparent 60%
                    );
                    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
                    -webkit-mask-composite: xor;
                    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
                    mask-composite: exclude;
                    pointer-events: none;
                    z-index: 1;
                }
                .as-card:hover {
                    box-shadow: 0 8px 32px -8px color-mix(in srgb, var(--theme-primary) 25%, transparent), 0 0 0 1px color-mix(in srgb, var(--theme-primary) 15%, transparent);
                }
                .as-card-title {
                    font-family: var(--font-heading);
                    font-size: 1.0625rem;
                    font-weight: 700;
                    color: var(--theme-text-primary);
                    letter-spacing: -0.01em;
                    margin-bottom: 0.5rem;
                    line-height: 1.35;
                    transition: color 0.2s;
                    position: relative;
                    z-index: 2;
                }
                .as-card:hover .as-card-title { color: var(--theme-primary); }
                .as-card-desc {
                    font-family: var(--font-body);
                    font-size: 0.85rem;
                    color: var(--text-secondary);
                    line-height: 1.65;
                    margin-bottom: 1.25rem;
                    flex-grow: 1;
                    position: relative;
                    z-index: 2;
                }
                .as-card-cta {
                    font-family: var(--font-body);
                    font-size: 0.8125rem;
                    font-weight: 600;
                    color: var(--flare-orange);
                    display: flex;
                    align-items: center;
                    gap: 0.375rem;
                    transition: gap 0.2s;
                    position: relative;
                    z-index: 2;
                }
                .as-card:hover .as-card-cta { gap: 0.625rem; }
            `}</style>

            <div className="container px-4 sm:px-6 mx-auto relative z-10 py-16">

                {/* Back link */}
                <div className="mb-10">
                    <Link to="/services"
                        className="inline-flex items-center gap-2 transition-colors duration-200"
                        style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)', textDecoration: 'none' }}
                        onMouseEnter={e => (e.currentTarget.style.color = 'var(--theme-text-primary)')}
                        onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}>
                        <ArrowLeft className="w-4 h-4" />
                        Back to Services
                    </Link>
                </div>

                {/* Page header */}
                <div className="mb-16 max-w-3xl">
                    <span className="section-badge">Full Directory</span>
                    <h1 style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: 'clamp(2.25rem, 5vw, 3.25rem)',
                        fontWeight: 700,
                        color: 'var(--theme-text-primary)',
                        letterSpacing: '-0.02em',
                        lineHeight: 1.15,
                        marginBottom: '1rem',
                    }}>
                        Explore <span className="highlight-gradient">All Services</span>
                    </h1>
                    <p style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '1.0625rem',
                        color: 'var(--text-secondary)',
                        lineHeight: 1.7,
                        maxWidth: '560px',
                    }}>
                        A complete directory of our specialized technology, automation, and growth solutions designed to scale your business.
                    </p>
                </div>

                {/* Service categories */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5rem', marginTop: '1rem' }}>
                    {servicesData.map((category) => (
                        <div key={category.id}>
                            {/* Category header */}
                            <div style={{ marginBottom: '2rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--theme-border)' }}>
                                <h2 style={{
                                    fontFamily: 'var(--font-heading)',
                                    fontSize: '1.625rem',
                                    fontWeight: 700,
                                    color: 'var(--theme-text-primary)',
                                    letterSpacing: '-0.015em',
                                    marginBottom: '0.5rem',
                                }}>
                                    {category.name}
                                </h2>
                                <p style={{
                                    fontFamily: 'var(--font-body)',
                                    fontSize: '0.9375rem',
                                    color: 'var(--text-secondary)',
                                    lineHeight: 1.65,
                                    maxWidth: '680px',
                                }}>
                                    {category.description}
                                </p>
                            </div>

                            {/* Sub-service cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                {category.subServices.map((sub, idx) => (
                                    <Link
                                        key={idx}
                                        to={`/services/${sub.slug}`}
                                        className="as-card"
                                    >
                                        <h3 className="as-card-title">{sub.title}</h3>
                                        <p className="as-card-desc">{sub.shortDesc}</p>
                                        <div className="as-card-cta">
                                            Explore Details
                                            <ArrowRight className="w-3.5 h-3.5" />
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </main>
    );
};

export default AllServices;
