import { useEffect, useRef } from 'react';
import { CircularGallery } from '@/components/ui/circular-gallery-2';
import { CardStack } from '@/components/ui/card-stack';
import MagicBento from '@/components/ui/MagicBento';
import SEO from '@/components/SEO';

interface AboutProps {
    openModal: () => void;
}

export default function About({ openModal }: AboutProps) {
    const sectionRef = useRef<HTMLElement>(null);

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

    return (
        <main className="about-theme" ref={sectionRef} style={{ paddingTop: 'clamp(5.5rem, 12vw, 7rem)', paddingBottom: '3rem', backgroundColor: 'var(--bg-base)' }}>
            <SEO
                title="About Us | Flare Technologies — B2B Technical Marketing"
                description="Learn how Flare Technologies was built to serve B2B companies with senior-led technical marketing execution."
                canonical="https://www.flaretechnologies.in/about"
            />

            <style>{`
                .hero-img-dark { display: block; }
                .hero-img-light { display: none; }
                .hero-overlay-dark { display: block; }
                .hero-overlay-light { display: none; }
                [data-theme="light"] .hero-img-dark { display: none; }
                [data-theme="light"] .hero-img-light { display: block; }
                [data-theme="light"] .hero-overlay-dark { display: none; }
                [data-theme="light"] .hero-overlay-light { display: block; }
                @media (max-width: 640px) {
                  .hero-img-dark, .hero-img-light { object-position: center center !important; }
                  .hero-overlay-dark, .hero-overlay-light { background: linear-gradient(to bottom, rgba(6,11,23,0.85) 0%, rgba(6,11,23,0.5) 100%) !important; }
                }
            `}</style>

            {/* 1. HERO */}
            <section className="container" style={{ marginBottom: '3rem' }}>
                <div style={{
                    borderRadius: '24px',
                    overflow: 'hidden',
                    position: 'relative',
                    minHeight: '300px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    padding: 'clamp(2.5rem, 5vw, 4rem) clamp(1.5rem, 4vw, 3rem)',
                }}
                    className="scroll-anim slide-up">
                    {/* Dark theme image */}
                    <img src="/about-dark.jpg" alt="" className="hero-img-dark" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center right' }} />
                    {/* Light theme image */}
                    <img src="/about-light.jpg" alt="" className="hero-img-light" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center right' }} />
                    {/* Overlay � left side darker for text readability */}
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(6,11,23,0.85) 40%, rgba(6,11,23,0.2) 100%)' }} className="hero-overlay-dark" />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(240,245,255,0.88) 40%, rgba(240,245,255,0.15) 100%)' }} className="hero-overlay-light" />
                    {/* Text � left aligned */}
                    <div style={{ position: 'relative', zIndex: 1, maxWidth: '520px' }}>
                        <h2 className="section-badge" style={{ backgroundColor: 'transparent', border: 'none', padding: 0 }}>About Us</h2>
                        <h1 style={{ fontSize: 'clamp(1.75rem, 5vw, 2.75rem)', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--theme-text-primary)', margin: '0.5rem 0 1rem', lineHeight: 1.2 }}>
                            We Build Marketing Systems, Not Just Campaigns
                        </h1>
                        <p style={{ maxWidth: '480px', color: 'var(--theme-text-secondary)', fontSize: 'clamp(0.9rem, 2vw, 1rem)', lineHeight: 1.65 }}>
                            We build simple, powerful systems that save you time, reduce manual work, and keep your business running smoothly. No jargon — just technology that works for you.
                        </p>
                    </div>
                </div>
            </section>

            {/* 2. WHAT WE DO */}
            <section style={{ padding: '2.5rem 0', backgroundColor: 'var(--bg-secondary)' }}>
                <div className="container">
                    <div className="text-center scroll-anim slide-up" style={{ marginBottom: '1.5rem' }}>
                        <h2 className="section-badge" style={{ backgroundColor: 'transparent', border: 'none', padding: 0 }}>What We Do</h2>
                        <h3 style={{ fontSize: 'clamp(1.25rem, 3vw, 1.75rem)', fontWeight: 800, color: 'var(--theme-text-primary)', margin: '0.4rem 0 0.75rem' }}>We Simplify The Complex</h3>
                        <p style={{ maxWidth: '560px', margin: '0 auto', color: 'var(--text-secondary)', fontSize: '0.9375rem', lineHeight: 1.6 }}>
                            We take the complicated tools your business uses and turn them into one smooth operation.
                        </p>
                    </div>
                    <div className="scroll-anim slide-up" style={{ height: 'clamp(240px, 40vw, 380px)', width: '100%', marginTop: '1.5rem' }}>
                        <CircularGallery
                            items={[
                                { text: 'We Save You Time', description: 'Stop wasting hours on repetitive tasks. We automate the boring stuff so you can focus on growth.', cardColor: '#F9A8D4' },
                                { text: 'Reduce Work', description: 'We eliminate the need for manual data entry and spreadsheets. Let systems handle the heavy lifting.', cardColor: '#B794F4' },
                                { text: 'Connect Systems', description: 'If you use different tools, we connect them so they talk to each other seamlessly.', cardColor: '#7DD3FC' },
                                { text: 'Ensure Scalability', description: 'As your business grows, your systems handle the increased load effortlessly.', cardColor: '#86EFAC' },
                                { text: 'One Central System', description: 'Your website, emails, messages, and payments all live under one roof. No more tab jumping.', cardColor: '#FDE68A' },
                                { text: 'We Handle The Tech', description: 'No IT degree needed. We handle the coding, hosting, and security so you can focus on customers.', cardColor: '#A5F3FC' },
                                { text: 'Simplified Operations', description: 'From the first visit to the final payment, we create a smooth, guided path that happens automatically.', cardColor: '#DDD6FE' },
                                { text: 'Uninterrupted Growth', description: 'Reliable infrastructure ensures your systems never become a bottleneck. Sleep easy while tech runs.', cardColor: '#FECACA' }
                            ]}
                            bend={3}
                            borderRadius={0.08}
                            scrollEase={0.03}
                        />
                    </div>
                </div>
            </section>

            {/* 3. THE PROBLEM */}
            <section style={{ padding: '2.5rem 0' }} className="container">
                <div className="scroll-anim slide-up text-center" style={{ marginBottom: '2rem' }}>
                    <h2 className="section-badge" style={{ backgroundColor: 'transparent', border: 'none', padding: 0 }}>The Problem</h2>
                    <h3 style={{ fontSize: 'clamp(1.25rem, 3.5vw, 2rem)', fontWeight: 800, color: 'var(--theme-text-primary)', margin: '0.4rem auto 0.75rem', maxWidth: '700px', lineHeight: 1.2 }}>
                        Most businesses struggle because things are <span style={{ color: 'var(--theme-accent)' }}>disconnected</span>.
                    </h3>
                    <p style={{ color: 'var(--theme-text-secondary)', fontSize: '0.9375rem', lineHeight: 1.65, maxWidth: '620px', margin: '0 auto' }}>
                        You're paying for a website, an email tool, a CRM, and an agency � but they don't talk to each other, so you end up managing everything yourself.
                    </p>
                </div>
                <div className="scroll-anim slide-up flex justify-center">
                    <CardStack
                        items={[
                            { title: "Too Many Tools", description: "Managing passwords, payments, and settings across five different platforms is exhausting and kills focus.", color: "#FCA5A5" },
                            { title: "Manual Work Wasting Time", description: "Copy-pasting customer details from emails into your sales tracker takes away hours from your week.", color: "#FDBA74" },
                            { title: "Hiring Multiple Vendors", description: "Graphic designers, web developers, and marketing agencies rarely talk to each other, causing massive delays.", color: "#C4B5FD" }
                        ]}
                    />
                </div>
            </section>

            {/* 4. HOW WE WORK */}
            <section style={{ padding: '2.5rem 0' }} className="container">
                <div className="text-center scroll-anim slide-up" style={{ marginBottom: '1.5rem' }}>
                    <h2 className="section-badge" style={{ backgroundColor: 'transparent', border: 'none', padding: 0 }}>The Workflow</h2>
                    <h3 style={{ fontSize: 'clamp(1.25rem, 3vw, 1.75rem)', fontWeight: 800, color: 'var(--theme-text-primary)', margin: '0.4rem 0 0.5rem' }}>How We Work</h3>
                    <p style={{ maxWidth: '500px', margin: '0 auto', color: 'var(--theme-text-secondary)', fontSize: '0.9rem' }}>
                        A systematic approach to transforming your digital architecture from messy to managed.
                    </p>
                </div>
                <div className="scroll-anim slide-up">
                    <MagicBento
                        textAutoHide={false}
                        enableStars={true}
                        enableSpotlight={true}
                        enableBorderGlow={true}
                        enableTilt={true}
                        enableMagnetism={true}
                        clickEffect={true}
                        spotlightRadius={400}
                        particleCount={20}
                        glowColor="37, 99, 235"
                    />
                </div>
            </section>

            {/* 6. QUOTE */}
            <section style={{ padding: '1.5rem 0' }} className="container">
                <div className="scroll-anim slide-up" style={{ maxWidth: '680px', margin: '0 auto' }}>
                    <div style={{
                        background: '#0f172a',
                        border: '1px solid #1e293b',
                        borderRadius: '16px',
                        padding: '1.5rem 1.75rem',
                        textAlign: 'center',
                        position: 'relative',
                        overflow: 'hidden',
                    }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#e2e8f0', marginBottom: '0.75rem', letterSpacing: '-0.01em' }}>Our Honest Belief</h3>
                        <p style={{ color: '#93c5fd', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '0.625rem', fontWeight: 600 }}>
                            "We built Flare because we saw too many hardworking business owners struggling just to keep their systems afloat."
                        </p>
                        <p style={{ color: '#cbd5e1', fontSize: '0.85rem', lineHeight: 1.65, maxWidth: '560px', margin: '0 auto 1rem' }}>
                            "Technology should work for you, not the other way around. Our mission is to lift the burden of digital management off your shoulders."
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.625rem' }}>
                            <div style={{ width: '24px', height: '1px', background: '#334155' }} />
                            <span style={{ color: '#60a5fa', fontWeight: 800, fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Flare Technologies Core Values</span>
                            <div style={{ width: '24px', height: '1px', background: '#334155' }} />
                        </div>
                    </div>
                </div>
            </section>

            {/* 6. CTA */}
            <section style={{ padding: '2rem 0' }} className="container">
                <div className="scroll-anim slide-up" style={{
                    textAlign: 'center',
                    background: 'var(--theme-surface)',
                    border: '1px solid var(--theme-border)',
                    borderRadius: '20px',
                    padding: 'clamp(2rem, 4vw, 3rem) 2rem',
                    position: 'relative',
                    overflow: 'hidden',
                    backdropFilter: 'blur(16px)',
                }}>
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '80%', height: '100%', background: 'radial-gradient(ellipse at center, color-mix(in srgb, var(--theme-primary) 14%, transparent) 0%, transparent 60%)', zIndex: -1, pointerEvents: 'none' }} />
                    <h3 style={{ fontSize: 'clamp(1.25rem, 3vw, 1.875rem)', fontWeight: 800, color: 'var(--theme-primary)', marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>
                        Let's Simplify Your Business
                    </h3>
                    <p style={{ color: 'var(--theme-text-secondary)', fontSize: '0.9375rem', maxWidth: '480px', margin: '0 auto 1.75rem' }}>
                        Stop fighting with your technology. Chat with us to find out exactly how we can make your day-to-day operations easier.
                    </p>
                    <button onClick={openModal} className="btn btn-primary" style={{ backgroundColor: 'var(--theme-primary)', color: '#f8fafc', fontWeight: 800, border: 'none' }}>
                        Book Consultation
                    </button>
                </div>
            </section>
        </main>
    );
}
