import React, { useEffect, useRef } from 'react';

const features = [
    {
        title: 'Agile Delivery Model',
        desc: 'You never have to wait six months to see progress. We move fast, keep you informed, and deliver working solutions in a matter of weeks.',
        img: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&q=60&auto=format&fit=crop',
    },
    {
        title: 'Senior-Led Execution',
        desc: 'Your project is handled entirely by experienced professionals. The same engineers who plan your system are the ones who build it.',
        img: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&q=60&auto=format&fit=crop',
    },
    {
        title: 'Security-First Architecture',
        desc: 'Your data is safe and your systems remain stable. We build things properly the first time so you never pay to fix avoidable problems later.',
        img: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&q=60&auto=format&fit=crop',
    },
    {
        title: 'Automated Systems',
        desc: 'Imagine a team member who works constantly, never forgets a task, and handles your repetitive work automatically.',
        img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=60&auto=format&fit=crop',
    },
];

const WhyFlare: React.FC = () => {
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        if (sectionRef.current) {
            sectionRef.current.querySelectorAll('.scroll-anim').forEach(el => observer.observe(el));
        }
        return () => observer.disconnect();
    }, []);

    // Double the features for seamless looping
    const displayFeatures = [...features, ...features];

    return (
        <section id="why-flare" className="why-us-section section-padding border-top-gradient" ref={sectionRef}>
            <div className="section-header text-center scroll-anim slide-up">
                <h2 className="section-badge">Why Flare</h2>
                <h3 className="section-title" style={{ color: 'var(--theme-primary)', textShadow: '0 0 20px color-mix(in srgb, var(--theme-primary) 30%, transparent)' }}>Why Businesses Choose Flare</h3>
            </div>

            <div className="marquee-outer">
                <div className="marquee-inner">
                    {displayFeatures.map((feature, index) => (
                        <div
                            key={`${feature.title}-${index}`}
                            className="why-feature-card"
                        >
                            {/* Background image */}
                            <div style={{ position: 'absolute', inset: 0, borderRadius: '16px', overflow: 'hidden', zIndex: 0 }}>
                                <img src={feature.img} alt="" loading="lazy"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.12 }} />
                            </div>
                            <div className="card-back-glow" />
                            <div className="card-accent" />
                            <h4 className="card-title" style={{ position: 'relative', zIndex: 1 }}>{feature.title}</h4>
                            <p className="card-desc" style={{ position: 'relative', zIndex: 1 }}>{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            <style>{`
                .marquee-outer {
                    width: 100vw;
                    margin-left: calc(-50vw + 50%);
                    margin-right: calc(-50vw + 50%);
                    overflow: hidden;
                    position: relative;
                    padding: 2rem 0;
                }

                .marquee-inner {
                    display: flex;
                    width: max-content;
                    gap: 2rem;
                    animation: infiniteScroll 40s linear infinite;
                    padding: 0 1rem;
                }

                .marquee-outer:hover .marquee-inner {
                    animation-play-state: paused;
                }

                @keyframes infiniteScroll {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(calc(-50% - 1rem)); }
                }

                .why-feature-card {
                    width: 320px;
                    flex-shrink: 0;
                    background: var(--theme-surface);
                    backdrop-filter: blur(12px);
                    border: 1px solid var(--theme-border);
                    border-radius: 16px;
                    padding: 2rem;
                    position: relative;
                    transition: all 0.3s ease;
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }
                .card-back-glow {
                    position: absolute;
                    inset: 0;
                    border-radius: 16px;
                    background: radial-gradient(circle at 85% 15%, color-mix(in srgb, var(--theme-accent) 14%, transparent), transparent 55%);
                    z-index: 0;
                    pointer-events: none;
                }

                .why-feature-card:hover {
                    border-color: color-mix(in srgb, var(--theme-primary) 45%, var(--theme-border));
                    transform: translateY(-5px);
                }

                .card-accent {
                    position: absolute;
                    top: 0;
                    left: 2rem;
                    right: 2rem;
                    height: 2px;
                    background: linear-gradient(90deg, transparent, var(--theme-primary), transparent);
                    opacity: 0.5;
                }

                .card-title {
                    color: var(--theme-text-primary);
                    font-size: 1.15rem;
                    font-weight: 700;
                    letter-spacing: -0.01em;
                }

                .card-desc {
                    color: var(--theme-text-secondary);
                    font-size: 0.9rem;
                    line-height: 1.6;
                }

                @media (max-width: 768px) {
                    .why-feature-card {
                        width: 280px;
                        padding: 1.5rem;
                    }
                }
            `}</style>
        </section>
    );
};

export default WhyFlare;
