import React, { useEffect, useRef } from 'react';

const clients = [
    { name: 'Navaro', img: '/client-navaro.jpeg' },
    { name: 'AI Launchpad', img: '/client-ai-launchpad.jpeg' },
    { name: 'CSG Advisory', img: '/client-csg-advisory.jpeg' },
    { name: 'Funds Mama', img: '/client-funds-mama.jpeg' },
];

const TrustedBy: React.FC = () => {
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

    // Double the list for a seamless looping marquee
    const displayClients = [...clients, ...clients];

    return (
        <section id="trusted-by" className="trusted-by-section section-padding" ref={sectionRef}>
            <div className="section-header text-center scroll-anim slide-up">
                <h2 className="section-badge">Trusted by businesses</h2>
            </div>

            <div className="trusted-marquee-outer">
                <div className="trusted-marquee-inner">
                    {displayClients.map((client, index) => (
                        <div
                            key={`${client.name}-${index}`}
                            className="trusted-logo-card"
                        >
                            <img
                                src={client.img}
                                alt={client.name}
                                loading="lazy"
                                style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                            />
                        </div>
                    ))}
                </div>
            </div>

            <style>{`
                .trusted-marquee-outer {
                    width: 100vw;
                    margin-left: calc(-50vw + 50%);
                    margin-right: calc(-50vw + 50%);
                    overflow: hidden;
                    position: relative;
                    padding: 2rem 0;
                }

                .trusted-marquee-inner {
                    display: flex;
                    align-items: center;
                    width: max-content;
                    gap: 2rem;
                    animation: trustedInfiniteScroll 30s linear infinite;
                    padding: 0 1rem;
                }

                .trusted-marquee-outer:hover .trusted-marquee-inner {
                    animation-play-state: paused;
                }

                @keyframes trustedInfiniteScroll {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(calc(-50% - 1rem)); }
                }

                .trusted-logo-card {
                    width: 220px;
                    height: 110px;
                    flex-shrink: 0;
                    background: #ffffff;
                    border: 1px solid var(--theme-border);
                    border-radius: 16px;
                    padding: 1.5rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s ease;
                }

                .trusted-logo-card:hover {
                    border-color: color-mix(in srgb, var(--theme-primary) 45%, var(--theme-border));
                    transform: translateY(-5px);
                    box-shadow: 0 12px 30px color-mix(in srgb, var(--theme-primary) 18%, transparent);
                }

                @media (max-width: 768px) {
                    .trusted-logo-card {
                        width: 170px;
                        height: 90px;
                        padding: 1rem;
                    }
                }
            `}</style>
        </section>
    );
};

export default TrustedBy;
