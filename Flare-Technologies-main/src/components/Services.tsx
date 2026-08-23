import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { mainServicesData } from '@/data/mainServicesData';

interface ServicesProps {
    openModal: () => void;
}

const services: { label: string; description: string; color: string; icon: React.ReactNode; lottie?: string }[] = [
    {
        label: 'Automated Systems',
        description: 'We help businesses streamline operations by automating repetitive tasks and improving efficiency through intelligent systems.',
        color: '#2563EB',
        lottie: 'https://lottie.host/c3ffd7ec-cbda-4a9e-89b6-a827c7c7adb7/jZSfNoBLQN.lottie',
        icon: null,
    },
    {
        label: 'Engineering & Development',
        description: 'We design and build reliable, scalable digital products and infrastructure tailored to your business needs.',
        color: '#06B6D4',
        lottie: 'https://lottie.host/54c8569b-1e95-44ef-ad98-d1368deb3cf0/odCpq66Q4o.lottie',
        icon: null,
    },
    {
        label: 'Growth & Marketing',
        description: 'We support businesses in expanding their reach, improving visibility, and increasing conversions through strategic marketing solutions.',
        color: '#2563EB',
        lottie: 'https://lottie.host/3149fe3f-dadf-4bb4-a793-1344dc5fcd19/SVOekm8NSZ.lottie',
        icon: null,
    },
    {
        label: 'Consulting & Strategy',
        description: 'We provide expert guidance to help businesses implement the right systems and strategies for long-term growth.',
        color: '#06B6D4',
        lottie: 'https://lottie.host/d4f2368e-094f-4759-a657-afe61d78a5be/zaoapfzyul.lottie',
        icon: null,
    },
    {
        label: 'Cloud Infrastructure',
        description: 'We build and manage secure, high-performance cloud environments that scale effortlessly with your business demands.',
        color: '#2563EB',
        lottie: 'https://lottie.host/3fe297d7-547b-46ff-a0d2-cf829b3221d3/YOjIrGP0zb.lottie',
        icon: null,
    },
    {
        label: 'AI Solutions',
        description: 'We integrate cutting-edge AI technologies into your business to enhance decision-making and automate complex tasks.',
        color: '#06B6D4',
        lottie: 'https://lottie.host/05074b74-8fc4-434e-8b5e-5aff128e9a90/rdaHpl74Jc.lottie',
        icon: null,
    },
    {
        label: 'B2B Partnerships',
        description: 'More than a vendor — a long-term growth partner. We work with businesses that need a reliable technology and growth partner built around their goals, scale, and timeline.',
        color: '#FF8C00',
        lottie: 'https://lottie.host/3fe297d7-547b-46ff-a0d2-cf829b3221d3/YOjIrGP0zb.lottie',
        icon: null,
    },
];

const Services: React.FC<ServicesProps> = ({ openModal: _openModal }) => {
    return (
        <section className="relative overflow-hidden" style={{ background: 'var(--bg-base)', paddingTop: '7rem', paddingBottom: '5rem' }}>
            {/* Ambient glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(ellipse at center, color-mix(in srgb, var(--theme-primary) 14%, transparent) 0%, transparent 70%)' }} />

            <div className="container px-4 sm:px-6 mx-auto relative z-10 py-16">

                {/* ── Page Header ── */}
                <div className="text-center mb-14 max-w-4xl mx-auto">
                    <span className="section-badge">Our Services</span>
                    <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.75rem, 5vw, 2.75rem)', fontWeight: 700, color: 'var(--theme-text-primary)', letterSpacing: '-0.02em', lineHeight: 1.15, marginBottom: '1rem' }}>
                        B2B Technical Marketing Services
                    </h1>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '1.0625rem', color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: '560px', margin: '0 auto' }}>
                        Intelligent systems, robust infrastructure, and aggressive growth strategies — all under one roof.
                    </p>
                </div>

                {/* ── Service Cards ── */}
                <style>{`
                    .svc-grid {
                        display: grid;
                        grid-template-columns: repeat(3, 1fr);
                        gap: 1.25rem;
                        max-width: 960px;
                        margin: 0 auto 3.5rem;
                    }
                    @media (max-width: 768px) {
                        .svc-grid { grid-template-columns: repeat(2, 1fr); }
                    }
                    @media (max-width: 480px) {
                        .svc-grid { grid-template-columns: 1fr; }
                    }                    .svc-card {
                        position: relative;
                        border-radius: 20px;
                        padding: 2rem 1.75rem 1.75rem;
                        border: 1px solid var(--theme-border);
                        background: var(--theme-surface);
                        overflow: hidden;
                        cursor: default;
                        transition: border-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;
                        min-height: 160px;
                        display: flex;
                        flex-direction: column;
                        gap: 0.75rem;
                    }
                    .svc-card:hover {
                        transform: translateY(-5px);
                        box-shadow: 0 16px 48px -8px rgba(0,0,0,0.6);
                    }
                    .svc-card-top-bar {
                        position: absolute;
                        top: 0; left: 0; right: 0;
                        height: 2px;
                        border-radius: 20px 20px 0 0;
                        opacity: 0;
                        transition: opacity 0.3s ease;
                    }
                    .svc-card:hover .svc-card-top-bar {
                        opacity: 1;
                    }
                    .svc-card-icon {
                        width: 44px;
                        height: 44px;
                        border-radius: 12px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        background: rgba(255,255,255,0.05);
                        border: 1px solid rgba(255,255,255,0.08);
                        flex-shrink: 0;
                        transition: background 0.3s ease, border-color 0.3s ease;
                    }
                    .svc-card-label {
                        font-size: 1rem;
                        font-weight: 700;
                        color: var(--theme-text-primary);
                        line-height: 1.3;
                        transition: color 0.25s ease;
                    }
                    .svc-card-desc {
                        font-size: 0.875rem;
                        color: transparent;
                        line-height: 1.65;
                        max-height: 0;
                        overflow: hidden;
                        transition: color 0.3s ease, max-height 0.35s ease;
                    }
                    .svc-card:hover .svc-explore {
                        opacity: 1 !important;
                    }
                    .svc-card:hover .svc-card-desc {
                        color: var(--theme-text-secondary);
                        max-height: 100px;
                    }
                    .svc-card-bg-glow {
                        position: absolute;
                        bottom: -40px;
                        right: -40px;
                        width: 120px;
                        height: 120px;
                        border-radius: 50%;
                        filter: blur(50px);
                        opacity: 0;
                        transition: opacity 0.4s ease;
                        pointer-events: none;
                    }
                    .svc-card:hover .svc-card-bg-glow {
                        opacity: 0.15;
                    }
                `}</style>

                <div className="svc-grid">
                    {services.map((svc, i) => {
                        const detailSlug = mainServicesData[i]?.slug;
                        return (
                        <Link
                            key={i}
                            to={detailSlug ? `/main-services/${detailSlug}` : '#'}
                            className="svc-card"
                            style={{ '--svc-color': svc.color, textDecoration: 'none' } as React.CSSProperties}
                            onMouseEnter={e => {
                                e.currentTarget.style.borderColor = `${svc.color}40`;
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';
                            }}
                        >
                            <div className="svc-card-top-bar" style={{ background: svc.color }} />
                            <div className="svc-card-bg-glow" style={{ background: svc.color }} />

                            {svc.lottie ? (
                                <div style={{ width: '110px', height: '110px', pointerEvents: 'none', zIndex: 3, marginBottom: '0.25rem' }}>
                                    <DotLottieReact src={svc.lottie} loop autoplay />
                                </div>
                            ) : (
                                <div className="svc-card-icon" style={{ color: svc.color }}>
                                    {svc.icon}
                                </div>
                            )}
                            <p className="svc-card-label">{svc.label}</p>
                            <p className="svc-card-desc">{svc.description}</p>

                            {/* Explore link */}
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: '0.35rem',
                                fontSize: '0.8125rem', fontWeight: 600, color: svc.color,
                                marginTop: 'auto', paddingTop: '0.5rem',
                                opacity: 0, transition: 'opacity 0.25s ease',
                            }}
                                className="svc-explore"
                            >
                                Explore <ArrowRight style={{ width: '13px', height: '13px' }} />
                            </div>
                        </Link>
                        );
                    })}
                </div>

            </div>
        </section>
    );
};

export default Services;
