import React, { useEffect, useRef } from 'react';
import ExpandOnHover from './ui/expand-cards';
import { gsap } from 'gsap';
interface MethodologyProps {
    openModal?: () => void;
}

const Methodology: React.FC<MethodologyProps> = ({ openModal }) => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const timelineRef = useRef<HTMLDivElement>(null);

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

    /* ── Spotlight effect for timeline cards ── */
    useEffect(() => {
        const spotlight = document.createElement('div');
        spotlight.style.cssText = `
            position: fixed;
            width: 600px; height: 600px;
            border-radius: 50%;
            pointer-events: none;
            background: radial-gradient(circle,
                rgba(255,140,0,0.13) 0%,
                rgba(255,140,0,0.06) 25%,
                rgba(255,140,0,0.02) 45%,
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
            if (!timelineRef.current) return;
            const rect = timelineRef.current.getBoundingClientRect();
            const inside =
                e.clientX >= rect.left && e.clientX <= rect.right &&
                e.clientY >= rect.top && e.clientY <= rect.bottom;

            spotlight.style.opacity = inside ? '1' : '0';
            gsap.to(spotlight, { left: e.clientX, top: e.clientY, duration: 0.12, ease: 'power2.out' });

            timelineRef.current?.querySelectorAll<HTMLElement>('.timeline-node').forEach(card => {
                const cr = card.getBoundingClientRect();
                const cx = cr.left + cr.width / 2;
                const cy = cr.top + cr.height / 2;
                const dist = Math.max(0, Math.hypot(e.clientX - cx, e.clientY - cy) - Math.max(cr.width, cr.height) / 2);
                const proximity = 160, fade = 300;
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
    }, []);

    return (
        <section id="methodology" className="process-section section-padding methodology-locked" ref={sectionRef}>
                <div className="container px-4 md:px-16" style={{ maxWidth: '100%' }}>
                    {/* Hero with background image */}
                    <div className="scroll-anim slide-up" style={{
                        position: 'relative',
                        borderRadius: '24px',
                        overflow: 'hidden',
                        marginBottom: '3rem',
                        minHeight: '280px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        padding: 'clamp(2.5rem, 5vw, 4rem) clamp(1.5rem, 4vw, 3rem)',
                    }}>
                        <style>{`
                          .meth-hero .hero-img-dark { display: block; }
                          .meth-hero .hero-img-light { display: none; }
                          .meth-hero .hero-overlay-dark { display: block; }
                          .meth-hero .hero-overlay-light { display: none; }
                          [data-theme="light"] .meth-hero .hero-img-dark { display: none; }
                          [data-theme="light"] .meth-hero .hero-img-light { display: block; }
                          [data-theme="light"] .meth-hero .hero-overlay-dark { display: none; }
                          [data-theme="light"] .meth-hero .hero-overlay-light { display: block; }
                        `}</style>
                        <div className="meth-hero" style={{ position: 'absolute', inset: 0 }}>
                          <img src="/methodology-dark.jpg" alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} className="hero-img-dark" />
                          <img src="/methodology-light.jpg" alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} className="hero-img-light" />
                          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(4,8,18,0.95) 55%, rgba(4,8,18,0.45) 100%)' }} className="hero-overlay-dark" />
                          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(235,240,255,0.92) 55%, rgba(235,240,255,0.4) 100%)' }} className="hero-overlay-light" />
                        </div>
                        <div style={{ position: 'relative', zIndex: 1, maxWidth: '520px' }}>
                            <h2 className="section-badge" style={{ backgroundColor: 'transparent', border: 'none', padding: 0 }}>Methodology</h2>
                            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--theme-text-primary)', marginBottom: '0.875rem', marginTop: '0.5rem', lineHeight: 1.2 }}>
                                How We Deliver B2B Marketing Results
                            </h1>
                            <p style={{ maxWidth: '480px', color: 'var(--theme-text-secondary)', fontSize: '1rem', lineHeight: 1.65, fontWeight: 500, margin: 0 }}>
                                We eliminate guesswork. A structured, predictable system designed to turn your concept into a scalable digital asset.
                            </p>
                        </div>
                    </div>

                <div className="horizontal-timeline scroll-anim slide-up" ref={timelineRef}>
                    <style>{`
                        .methodology-locked .timeline-node {
                            --glow-x: 50%;
                            --glow-y: 50%;
                            --glow-i: 0;
                            background: #120f17 !important;
                            border: 1px solid rgba(255,255,255,0.1) !important;
                        }
                        .methodology-locked .timeline-node::after {
                            content: '';
                            position: absolute;
                            inset: 0;
                            padding: 1px;
                            border-radius: 16px;
                            background: radial-gradient(
                                350px circle at var(--glow-x) var(--glow-y),
                                rgba(255,140,0, calc(var(--glow-i) * 0.9)) 0%,
                                rgba(255,140,0, calc(var(--glow-i) * 0.4)) 30%,
                                transparent 60%
                            );
                            -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
                            -webkit-mask-composite: xor;
                            mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
                            mask-composite: exclude;
                            pointer-events: none;
                            z-index: 1;
                        }
                    `}</style>

                    <div className="timeline-node">
                        <div className="timeline-icon-box gradient-1-border">
                            <svg className="timeline-icon" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8"></circle>
                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                            </svg>
                        </div>
                        <div className="timeline-content">
                            <span className="step-label">Step 01</span>
                            <h4>Strategy & Assessment</h4>
                            <p style={{ lineHeight: 1.6, marginTop: '0.25rem' }}>Understand your business, identify inefficiencies, and define clear goals before execution.</p>
                        </div>
                    </div>
                    
                    <div className="timeline-node">
                        <div className="timeline-icon-box gradient-2-border">
                            <svg className="timeline-icon" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                                <polyline points="2 17 12 22 22 17"></polyline>
                                <polyline points="2 12 12 17 22 12"></polyline>
                            </svg>
                        </div>
                        <div className="timeline-content">
                            <span className="step-label">Step 02</span>
                            <h4>Architecture & Planning</h4>
                            <p style={{ lineHeight: 1.6, marginTop: '0.25rem' }}>Map out the technical architecture, project scope, and system requirements for a scalable foundation.</p>
                        </div>
                    </div>
                    
                    <div className="timeline-node">
                        <div className="timeline-icon-box gradient-3-border">
                            <svg className="timeline-icon" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="16 18 22 12 16 6"></polyline>
                                <polyline points="8 6 2 12 8 18"></polyline>
                            </svg>
                        </div>
                        <div className="timeline-content">
                            <span className="step-label">Step 03</span>
                            <h4>Development & Execution</h4>
                            <p style={{ lineHeight: 1.6, marginTop: '0.25rem' }}>Agile build process with transparent updates, integrating features while ensuring high performance.</p>
                        </div>
                    </div>
                    
                    <div className="timeline-node">
                        <div className="timeline-icon-box gradient-4-border">
                            <svg className="timeline-icon" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                <polyline points="22 4 12 14.01 9 11.01"></polyline>
                            </svg>
                        </div>
                        <div className="timeline-content">
                            <span className="step-label">Step 04</span>
                            <h4>Optimization & Scale</h4>
                            <p style={{ lineHeight: 1.6, marginTop: '0.25rem' }}>Continuous monitoring, scaling operations, and refining the product to drive long-term workflow value.</p>
                        </div>
                    </div>
                </div>

                {/* 1. DETAILED PROCESS BREAKDOWN */}
                <div className="scroll-anim slide-up" style={{ marginTop: 'clamp(3rem, 8vw, 8rem)', marginBottom: 'clamp(3rem, 8vw, 8rem)' }}>
                    <div className="section-header text-center" style={{ marginBottom: '5rem' }}>
                        <h3 className="section-title" style={{ fontSize: '2.5rem', fontWeight: 800, color: '#10b981' }}>Inside Our Process</h3>
                    </div>

                    <style>
                        {`
                        .process-flow-container, .horizontal-timeline {
                            display: grid;
                            grid-template-columns: repeat(4, 1fr);
                            gap: 2rem;
                            perspective: 2000px;
                            z-index: 1;
                            width: 100%;
                        }
                        @media (max-width: 1024px) {
                            .process-flow-container, .horizontal-timeline { grid-template-columns: repeat(2, 1fr); gap: 2rem; }
                        }
                        @media (max-width: 640px) {
                            .process-flow-container, .horizontal-timeline { grid-template-columns: 1fr; }
                        }

                        .methodology-locked .process-node {
                            background: rgba(255, 255, 255, 0.03);
                            backdrop-filter: blur(20px);
                            border: 1px solid rgba(255, 255, 255, 0.1);
                            border-radius: 40px;
                            padding: 3rem 2rem;
                            position: relative;
                            transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
                            transform-style: preserve-3d;
                            height: 100%;
                            min-width: 0;
                            cursor: pointer;
                        }

                        .methodology-locked .process-node:hover {
                            transform: scale(1.05) translateY(-20px) rotateX(10deg) rotateY(-5deg);
                            background: rgba(255, 255, 255, 0.07);
                            border-color: var(--accent-color, #10b981);
                            box-shadow: 
                                0 45px 100px -20px rgba(0, 0, 0, 0.5),
                                0 0 40px -10px var(--accent-color, rgba(16, 185, 129, 0.3));
                        }

                        .p-node-number {
                            position: absolute;
                            top: -10px;
                            right: -10px;
                            font-size: 11rem;
                            font-weight: 900;
                            color: var(--accent-color, #fff);
                            opacity: 0.03;
                            line-height: 1;
                            pointer-events: none;
                            transition: all 0.6s ease;
                            transform: translateZ(20px);
                            z-index: -1;
                        }

                        .process-node:hover .p-node-number {
                            opacity: 0.08;
                            transform: translateZ(80px) scale(1.2);
                        }

                        .methodology-locked .p-node-title {
                            font-size: 1.8rem;
                            font-weight: 900;
                            color: #fff;
                            margin-bottom: 2.5rem;
                            line-height: 1.1;
                            transition: all 0.4s ease;
                            transform: translateZ(40px);
                        }

                        .process-node:hover .p-node-title {
                            transform: translateZ(100px);
                            text-shadow: 0 10px 20px rgba(0,0,0,0.3);
                        }

                        .p-node-list {
                            list-style: none;
                            padding: 0;
                            margin: 0;
                            transform: translateZ(30px);
                            transition: all 0.5s ease;
                        }

                        .process-node:hover .p-node-list {
                            transform: translateZ(60px);
                        }

                        .methodology-locked .p-node-item {
                            display: flex;
                            align-items: flex-start;
                            gap: 1rem;
                            margin-bottom: 1.5rem;
                            font-size: 1rem;
                            color: #cbd5e1;
                            line-height: 1.5;
                        }

                        .p-node-icon {
                            color: var(--accent-color, #10b981);
                            margin-top: 4px;
                            filter: drop-shadow(0 0 5px var(--accent-color));
                        }

                        .process-node::after {
                            content: '';
                            position: absolute;
                            inset: -2px;
                            border-radius: 40px;
                            background: linear-gradient(45deg, transparent, var(--accent-color, #10b981), transparent);
                            z-index: -1;
                            opacity: 0;
                            transition: opacity 0.4s ease;
                        }

                        .process-node:hover::after {
                            opacity: 0.4;
                        }

                        .methodology-locked .process-node:nth-child(2) { --accent-color: #ef4444; }
                        .methodology-locked .process-node:nth-child(3) { --accent-color: #f59e0b; }
                        .methodology-locked .process-node:nth-child(4) { --accent-color: #0ea5e9; }
                        .methodology-locked .process-node:nth-child(5) { --accent-color: #a855f7; }
                        .methodology-locked .timeline-content h4,
                        .methodology-locked .timeline-content p,
                        .methodology-locked .timeline-content .step-label,
                        .methodology-locked .p-node-title,
                        .methodology-locked .p-node-item {
                            color: #f8fafc !important;
                        }
                        .methodology-locked .process-node {
                            border: 1px solid #334155 !important;
                            background: #000000 !important;
                        }
                        [data-theme="light"] .methodology-locked .process-node {
                            background: #ffffff !important;
                            border: 1px solid rgba(0,0,0,0.1) !important;
                            box-shadow: 0 4px 20px rgba(0,0,0,0.08) !important;
                        }
                        [data-theme="light"] .methodology-locked .process-node:hover {
                            background: #f8faff !important;
                            border-color: rgba(37,99,235,0.2) !important;
                            box-shadow: 0 8px 32px rgba(0,0,0,0.12) !important;
                        }
                        [data-theme="light"] .methodology-locked .p-node-number {
                            color: #e2e8f0 !important;
                        }
                        [data-theme="light"] .methodology-locked .p-node-title {
                            color: #0f172a !important;
                        }
                        [data-theme="light"] .methodology-locked .p-node-item {
                            color: #334155 !important;
                        }
                        [data-theme="light"] .methodology-locked .p-node-icon {
                            filter: none !important;
                        }
                        [data-theme="light"] .methodology-locked .timeline-content p,
                        [data-theme="light"] .methodology-locked .timeline-content .step-label {
                            color: #334155 !important;
                        }
                        [data-theme="light"] .methodology-locked .timeline-content h4 {
                            color: #0f172a !important;
                        }                        .methodology-locked .timeline-node {
                            border: 1px solid #334155 !important;
                            background: #000000 !important;
                        }
                        html[data-theme="light"] .methodology-locked .timeline-node,
                        html[data-theme="light"] .methodology-locked .timeline-node:hover {
                            background: #ffffff !important;
                            border: 1px solid rgba(0,0,0,0.1) !important;
                            box-shadow: 0 4px 16px rgba(0,0,0,0.08) !important;
                        }
                        html[data-theme="light"] .methodology-locked .timeline-content h4,
                        html[data-theme="light"] .methodology-locked .step-label {
                            color: #0f172a !important;
                        }
                        html[data-theme="light"] .methodology-locked .timeline-content p {
                            color: #334155 !important;
                        }
                        
                        .value-grid-container {
                            display: grid;
                            grid-template-columns: repeat(4, 1fr);
                            gap: 2rem;
                            margin-bottom: 8rem;
                        }
                        @media (max-width: 1200px) {
                            .value-grid-container { grid-template-columns: repeat(2, 1fr); }
                        }
                        @media (max-width: 640px) {
                            .value-grid-container { grid-template-columns: 1fr; }
                        }
                        html[data-theme='light'] .methodology-locked .methodology-final-cta {
                            background: #ffffff !important;
                            border: 1px solid rgba(15,23,42,0.18) !important;
                        }
                        html[data-theme='light'] .methodology-locked .methodology-final-cta h3 {
                            -webkit-text-fill-color: initial !important;
                            background: none !important;
                            color: #0f172a !important;
                        }
                        html[data-theme='light'] .methodology-locked .methodology-final-cta .methodology-final-glow {
                            background: radial-gradient(ellipse at center, rgba(37,99,235,0.08) 0%, transparent 60%) !important;
                        }
                        @media (max-width: 640px) {
                          .hero-img-dark, .hero-img-light { object-position: center center !important; }
                          .hero-overlay-dark, .hero-overlay-light { background: linear-gradient(to bottom, rgba(6,11,23,0.85) 0%, rgba(6,11,23,0.5) 100%) !important; }
                        }
                        `}
                    </style>

                    <div className="process-flow-container">
                        
                        {/* NODE 01 */}
                        <div className="process-node">
                            <span className="p-node-number">01</span>
                            <h4 className="p-node-title">Strategy & Assessment</h4>
                            <ul className="p-node-list">
                                <li className="p-node-item">
                                    <svg className="p-node-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                    Understand your business context
                                </li>
                                <li className="p-node-item">
                                    <svg className="p-node-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                    Identify current inefficiencies
                                </li>
                                <li className="p-node-item">
                                    <svg className="p-node-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                    Define clear, measurable goals
                                </li>
                            </ul>
                        </div>

                        {/* NODE 02 */}
                        <div className="process-node">
                            <span className="p-node-number">02</span>
                            <h4 className="p-node-title">Architecture & Planning</h4>
                            <ul className="p-node-list">
                                <li className="p-node-item">
                                    <svg className="p-node-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                    Design robust system structure
                                </li>
                                <li className="p-node-item">
                                    <svg className="p-node-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                    Select optimal technologies
                                </li>
                                <li className="p-node-item">
                                    <svg className="p-node-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                    Create exact execution roadmap
                                </li>
                            </ul>
                        </div>

                        {/* NODE 03 */}
                        <div className="process-node">
                            <span className="p-node-number">03</span>
                            <h4 className="p-node-title">Development & Execution</h4>
                            <ul className="p-node-list">
                                <li className="p-node-item">
                                    <svg className="p-node-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                    Build scalable infrastructure
                                </li>
                                <li className="p-node-item">
                                    <svg className="p-node-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                    Integrate core system features
                                </li>
                                <li className="p-node-item">
                                    <svg className="p-node-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                    Ensure uncompromised speed
                                </li>
                            </ul>
                        </div>

                        {/* NODE 04 */}
                        <div className="process-node">
                            <span className="p-node-number">04</span>
                            <h4 className="p-node-title">Optimization & Scale</h4>
                            <ul className="p-node-list">
                                <li className="p-node-item">
                                    <svg className="p-node-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                    Monitor system performance
                                </li>
                                <li className="p-node-item">
                                    <svg className="p-node-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                    Iterate and improve workflows
                                </li>
                                <li className="p-node-item">
                                    <svg className="p-node-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                    Scale operations securely
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* 2. THE VALUE DASHBOARD (Interactive Expand On Hover) */}
                <div className="scroll-anim slide-up" style={{ marginTop: 'clamp(2rem, 5vw, 5rem)', paddingBottom: 'clamp(3rem, 8vw, 8rem)' }}>
                    <div className="section-header text-center" style={{ marginBottom: '3rem' }}>
                        <h2 className="section-badge" style={{ backgroundColor: 'transparent', border: 'none', padding: 0, color: 'var(--theme-primary)' }}>Transparency & ROI</h2>
                        <h3 className="section-title" style={{ fontSize: '3rem', fontWeight: 900, color: '#10b981' }}>The Flare Commitment</h3>
                    </div>

                    <ExpandOnHover />
                </div>




                {/* 6. Final CTA Section */}
                <div className="scroll-anim slide-up methodology-final-cta" style={{
                    marginTop: '0',
                    textAlign: 'center',
                    background: 'rgba(11, 15, 25, 0.5)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    borderRadius: '24px',
                    padding: '4rem 2rem',
                    position: 'relative',
                    overflow: 'hidden',
                    backdropFilter: 'blur(16px)'
                }}>
                    <div className="methodology-final-glow" style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '80%',
                        height: '100%',
                        background: 'radial-gradient(ellipse at center, rgba(255, 140, 0, 0.08) 0%, transparent 60%)',
                        zIndex: -1,
                        pointerEvents: 'none'
                    }} />
                    <h3 style={{ 
                        fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', 
                        fontWeight: 800, 
                        background: 'linear-gradient(to right, #10b981, #06b6d4)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        marginBottom: '2.5rem', 
                        letterSpacing: '-0.02em' 
                    }}>
                        Ready to Build a System That Works?
                    </h3>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <button onClick={openModal} className="btn btn-primary btn-large">
                            Book Consultation
                        </button>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default Methodology;
