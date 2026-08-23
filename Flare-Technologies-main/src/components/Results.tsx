import React, { useEffect, useRef, useState } from 'react';
import CountUp from './ui/CountUp';
import { GradientCard } from './ui/gradient-card';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';

interface CaseStudy {
  id: number;
  title: string;
  client: string;
  industry: string;
  summary: string;
  challenge: string;
  solution: string;
  results: string;
  metric1_value: string; metric1_label: string;
  metric2_value: string; metric2_label: string;
  metric3_value: string; metric3_label: string;
  tags: string;
  cover_url: string;
  status: string;
}

interface ResultsProps {
    openModal?: () => void;
}

const Results: React.FC<ResultsProps> = ({ openModal }) => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        supabase
            .from('case_studies')
            .select('*')
            .eq('status', 'published')
            .order('created_at', { ascending: false })
            .then(({ data, error }) => {
                console.log('case_studies fetch:', data, error);
                if (data) setCaseStudies(data as CaseStudy[]);
            });
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
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
        <section id="results" className="results-theme" ref={sectionRef} style={{ paddingTop: '6rem', paddingBottom: '6rem', backgroundColor: 'var(--bg-base)' }}>
            <style>
                {`
                .scroll-anim {
                    opacity: 0;
                    transform: translateY(30px);
                    transition: all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
                }
                .scroll-anim.visible {
                    opacity: 1;
                    transform: translateY(0);
                }
                .slide-up.visible {
                    animation: slideUpFade 0.8s forwards;
                }
                @keyframes slideUpFade {
                    from { opacity: 0; transform: translateY(40px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .results-grid-new {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 1.5rem;
                    margin-top: 4rem;
                }
                @media (max-width: 1024px) {
                    .results-grid-new { grid-template-columns: repeat(2, 1fr); gap: 1.5rem; }
                }
                @media (max-width: 640px) {
                    .results-grid-new { grid-template-columns: 1fr; gap: 1.5rem; }
                }
                .result-premium-card {
                    background: var(--theme-surface);
                    border: 1px solid var(--border-subtle);
                    border-radius: 24px;
                    padding: 3rem 2.5rem;
                    position: relative;
                    overflow: hidden;
                    transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
                    display: flex;
                    flex-direction: column;
                }
                .result-premium-card:hover {
                    transform: translateY(-10px);
                    border-color: rgba(255, 255, 255, 0.18);
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5), inset 0 0 20px rgba(255, 255, 255, 0.03);
                }
                .r-pill-tag {
                    display: inline-flex;
                    align-items: center;
                    padding: 0.35rem 1rem;
                    border-radius: 100px;
                    border: 1px solid color-mix(in srgb, var(--theme-primary) 38%, transparent);
                    background: color-mix(in srgb, var(--theme-primary) 12%, transparent);
                    font-size: 0.8rem;
                    font-weight: 700;
                    color: var(--theme-primary);
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    margin-bottom: 2rem;
                    align-self: flex-start;
                }
                .r-metric-display {
                    font-size: 4rem;
                    font-weight: 800;
                    line-height: 1;
                    margin-bottom: 0.5rem;
                    color: var(--theme-primary);
                }
                .highlight-gradient {
                    background: none;
                    -webkit-text-fill-color: initial;
                }
                .r-metric-label {
                    font-size: 1.15rem;
                    font-weight: 700;
                    color: var(--text-primary);
                    margin-bottom: 0.25rem;
                }
                .r-impact-summary {
                    font-size: 1rem;
                    color: var(--theme-text-secondary);
                    font-style: italic;
                    margin-bottom: 2.5rem;
                    line-height: 1.6;
                }
                .r-structure-box {
                    margin-bottom: 2rem;
                    padding-bottom: 2rem;
                    border-bottom: 1px solid var(--border-subtle);
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }
                .r-text-block {
                    font-size: 0.95rem;
                    color: var(--text-secondary);
                    line-height: 1.6;
                }
                .r-text-block strong {
                    color: var(--text-primary);
                    font-weight: 700;
                    margin-right: 0.5rem;
                }
                .r-bullet-list {
                    list-style: none;
                    padding: 0;
                    margin: 0 0 2.5rem 0;
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                    flex-grow: 1;
                }
                .r-bullet-item {
                    display: flex;
                    align-items: flex-start;
                    gap: 0.75rem;
                    font-size: 0.95rem;
                    color: var(--text-primary);
                    font-weight: 500;
                }
                .r-bullet-check {
                    color: var(--theme-accent);
                    font-weight: bold;
                }
                .r-view-link {
                    color: var(--theme-primary);
                    font-weight: 700;
                    font-size: 0.95rem;
                    text-decoration: none;
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    transition: color 0.2s;
                    margin-top: auto;
                }
                .r-view-link:hover {
                    color: var(--theme-accent);
                }
                .global-stats-bar {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 2rem;
                    padding: 3rem 0;
                    margin-bottom: 6rem;
                    border-bottom: 1px solid var(--border-subtle);
                    text-align: center;
                }
                .stat-item h4 {
                    font-size: 3rem;
                    font-weight: 800;
                    color: var(--text-primary);
                    margin-bottom: 0.5rem;
                    line-height: 1;
                }
                .stat-item p {
                    font-size: 1.1rem;
                    color: var(--text-secondary);
                    font-weight: 500;
                }
                `}
            </style>

            <div className="container">
                {/* 8. TOP SUMMARY SECTION (GLOBAL STATS) */}
                <div className="global-stats-bar scroll-anim">
                    <div className="stat-item">
                        <h4 style={{ color: 'var(--theme-primary)' }}><CountUp target={100} suffix="+" /></h4>
                        <p>Hours Saved Weekly</p>
                    </div>
                    <div className="stat-item">
                        <h4 style={{ color: 'var(--theme-primary)' }}><CountUp target={300} suffix="%" /></h4>
                        <p>Avg Growth Increase</p>
                    </div>
                    <div className="stat-item">
                        <h4 style={{ color: 'var(--theme-primary)' }}><CountUp target={0} /></h4>
                        <p>Downtime Deployments</p>
                    </div>
                </div>

                {/* HEADER SECTION */}
                <div className="section-header text-center scroll-anim slide-up">
                    <h2 className="section-badge" style={{ backgroundColor: 'transparent', border: 'none', padding: 0 }}>Outcomes</h2>
                    <h1 className="section-title" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, color: 'var(--theme-text-primary)', marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>
                        Real Results for B2B Companies
                    </h1>
                    {/* 9. TRUST LINE */}
                    <p className="mx-auto" style={{ color: 'var(--theme-text-primary)', fontSize: '1.25rem', fontWeight: 600, maxWidth: '700px', marginBottom: '0.75rem' }}>
                        Real businesses. Measurable outcomes. No guesswork.
                    </p>
                    <p className="section-desc mx-auto" style={{ maxWidth: '600px', color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.6 }}>
                        Here is exactly what happened when businesses partnered with us. We deliver proof, not promises. The numbers speak for themselves.
                    </p>
                </div>

                {/* CARDS SECTION (3 COLUMNS) */}
                <div className="results-grid-new scroll-anim slide-up">
                    
                    {/* CASE STUDY 1: E-COMMERCE */}
                    <GradientCard
                        gradient="cyan"
                        badgeText="E-Commerce"
                        badgeColor="#2563EB"
                        title="300%"
                        description="Revenue Growth in Q1"
                        ctaText="View Full Case Study"
                        ctaHref="#"
                        imageUrl="https://images.unsplash.com/photo-1557821552-17105176677c?q=80&w=1000&auto=format&fit=crop"
                    >
                        <p className="mb-6 opacity-60 text-sm font-medium italic">"Handled 10,000+ concurrent users without crashes"</p>
                        
                        <div className="space-y-4 mb-8 border-y border-white/5 py-6">
                            <div className="text-sm"><strong className="text-[#2563EB] block mb-1 uppercase tracking-widest text-[0.7rem]">The Bottleneck:</strong> Existing infrastructure suffered from critical instability during peak traffic, resulting in massive revenue erosion.</div>
                            <div className="text-sm"><strong className="text-[#2563EB] block mb-1 uppercase tracking-widest text-[0.7rem]">The Breakthrough:</strong> Engineered a high-performance, elastic cloud architecture coupled with an aggressive acquisition engine.</div>
                        </div>

                        <ul className="space-y-3 text-sm font-bold">
                            <li className="flex items-center gap-3"><span className="text-[#10B981]">✔</span> <CountUp target={300} suffix="%" /> increase in conversions</li>
                            <li className="flex items-center gap-3"><span className="text-[#10B981]">✔</span> <CountUp target={2} suffix="x" /> faster load times</li>
                            <li className="flex items-center gap-3"><span className="text-[#10B981]">✔</span> <CountUp target={0} /> downtime peak sales</li>
                        </ul>
                    </GradientCard>

                    {/* CASE STUDY 2: B2B LOGISTICS */}
                    <GradientCard
                        gradient="cyan"
                        badgeText="B2B Logistics"
                        badgeColor="#06B6D4"
                        title="40hrs"
                        description="Saved via Automation"
                        ctaText="View Full Case Study"
                        ctaHref="#"
                        imageUrl="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1000&auto=format&fit=crop"
                    >
                        <p className="mb-6 opacity-60 text-sm font-medium italic">"Reduced manual workload and data entry by 80%"</p>
                        
                        <div className="space-y-4 mb-8 border-y border-white/5 py-6">
                            <div className="text-sm"><strong className="text-[#06B6D4] block mb-1 uppercase tracking-widest text-[0.7rem]">The Friction:</strong> Manual data synchronization across fragmented systems created severe operational lag and critical entry errors.</div>
                            <div className="text-sm"><strong className="text-[#06B6D4] block mb-1 uppercase tracking-widest text-[0.7rem]">The Transformation:</strong> Implemented autonomous data pipelines and predictive modeling to eliminate manual overhead.</div>
                        </div>

                        <ul className="space-y-3 text-sm font-bold">
                            <li className="flex items-center gap-3"><span className="text-[#10B981]">✔</span> <CountUp target={40} suffix="hrs" /> saved per week</li>
                            <li className="flex items-center gap-3"><span className="text-[#10B981]">✔</span> <CountUp target={100} suffix="%" /> elimination of entry errors</li>
                            <li className="flex items-center gap-3"><span className="text-[#10B981]">✔</span> Real-time inventory visibility</li>
                        </ul>
                    </GradientCard>

                    {/* CASE STUDY 3: ENTERPRISE SAAS */}
                    <GradientCard
                        gradient="cyan"
                        badgeText="Enterprise SaaS"
                        badgeColor="#2563EB"
                        title="Zero"
                        description="Downtime Migration"
                        ctaText="View Full Case Study"
                        ctaHref="#"
                        imageUrl="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop"
                    >
                        <p className="mb-6 opacity-60 text-sm font-medium italic">"Executed full system overhaul seamlessly under load"</p>
                        
                        <div className="space-y-4 mb-8 border-y border-white/5 py-6">
                            <div className="text-sm"><strong className="text-[#2563EB] block mb-1 uppercase tracking-widest text-[0.7rem]">The Risk:</strong> Migrating a legacy backend while maintaining 100% uptime for high-traffic enterprise users.</div>
                            <div className="text-sm"><strong className="text-[#2563EB] block mb-1 uppercase tracking-widest text-[0.7rem]">The Execution:</strong> Developed a live shadow-migration protocol, allowing for zero latency or disruption.</div>
                        </div>

                        <ul className="space-y-3 text-sm font-bold">
                            <li className="flex items-center gap-3"><span className="text-[#10B981]">✔</span> <CountUp target={0} /> downtime during migration</li>
                            <li className="flex items-center gap-3"><span className="text-[#10B981]">✔</span> No data loss or disruption</li>
                            <li className="flex items-center gap-3"><span className="text-[#10B981]">✔</span> <CountUp target={50} suffix="%" /> reduction in server costs</li>
                        </ul>
                    </GradientCard>

                </div>

                {/* DYNAMIC CASE STUDIES FROM SUPABASE */}
                {caseStudies.length > 0 && (
                    <div style={{ marginTop: '5rem' }}>
                        <div className="section-header text-center" style={{ marginBottom: '2.5rem' }}>
                            <h2 className="section-badge" style={{ backgroundColor: 'transparent', border: 'none', padding: 0 }}>Case Studies</h2>
                            <h3 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', fontWeight: 800, color: 'var(--theme-text-primary)', letterSpacing: '-0.02em', marginTop: '0.4rem' }}>
                                Client Success Stories
                            </h3>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(min(100%,340px),1fr))', gap: '1.5rem' }}>
                            {caseStudies.map(cs => {
                                const tags = cs.tags ? cs.tags.split(',').map(t => t.trim()).filter(Boolean) : [];
                                const metrics = [
                                    { val: cs.metric1_value, lbl: cs.metric1_label },
                                    { val: cs.metric2_value, lbl: cs.metric2_label },
                                    { val: cs.metric3_value, lbl: cs.metric3_label },
                                ].filter(m => m.val);
                                return (
                                    <div key={cs.id} style={{ background: 'var(--theme-surface)', border: '1px solid var(--border-subtle)', borderRadius: '20px', overflow: 'hidden', transition: 'transform 0.3s ease, box-shadow 0.3s ease', display: 'flex', flexDirection: 'column' }}
                                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-6px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 16px 40px rgba(0,0,0,0.4)'; }}
                                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = ''; }}
                                    >
                                        {/* Cover */}
                                        {cs.cover_url && (
                                            <div style={{ height: 180, overflow: 'hidden', position: 'relative', flexShrink: 0 }}>
                                                <img src={cs.cover_url} alt={cs.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom,transparent 40%,rgba(15,23,42,0.9))' }} />
                                            </div>
                                        )}
                                        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                                            {/* Tags */}
                                            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                                                {cs.industry && <span style={{ background: 'rgba(255,140,0,0.1)', border: '1px solid rgba(255,140,0,0.25)', color: '#FF8C00', fontSize: '0.68rem', fontWeight: 700, padding: '0.12rem 0.5rem', borderRadius: '999px' }}>{cs.industry}</span>}
                                                {tags.slice(0, 2).map(t => <span key={t} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.45)', fontSize: '0.66rem', padding: '0.1rem 0.45rem', borderRadius: '999px' }}>{t}</span>)}
                                            </div>
                                            <h3 style={{ color: 'var(--theme-text-primary)', fontWeight: 800, fontSize: '1.1rem', marginBottom: '0.4rem', letterSpacing: '-0.01em' }}>{cs.title}</h3>
                                            {cs.client && <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', marginBottom: '0.75rem' }}>Client: <strong style={{ color: 'rgba(255,255,255,0.65)' }}>{cs.client}</strong></p>}
                                            {cs.summary && <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.65, marginBottom: '1.25rem' }}>{cs.summary}</p>}

                                            {/* Metrics */}
                                            {metrics.length > 0 && (
                                                <div style={{ display: 'grid', gridTemplateColumns: `repeat(${metrics.length},1fr)`, gap: '0.5rem', marginBottom: '1.25rem' }}>
                                                    {metrics.map((m, i) => (
                                                        <div key={i} style={{ background: 'rgba(255,140,0,0.06)', border: '1px solid rgba(255,140,0,0.15)', borderRadius: '10px', padding: '0.65rem 0.5rem', textAlign: 'center' }}>
                                                            <p style={{ color: '#FF8C00', fontWeight: 900, fontSize: '1.3rem', margin: '0 0 0.15rem', lineHeight: 1 }}>{m.val}</p>
                                                            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.68rem', margin: 0, lineHeight: 1.3 }}>{m.lbl}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Read more → opens new page */}
                                            <button
                                                onClick={() => navigate(`/case-studies/${cs.id}`)}
                                                style={{ marginTop: 'auto', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255,140,0,0.08)', border: '1px solid rgba(255,140,0,0.25)', borderRadius: '8px', padding: '0.5rem 1rem', color: '#FF8C00', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', alignSelf: 'flex-start', transition: 'all 0.15s' }}
                                                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,140,0,0.15)'; }}
                                                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,140,0,0.08)'; }}
                                            >
                                                Read Full Case Study →
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* 10. FINAL CTA SECTION */}
                <div className="scroll-anim slide-up" style={{ marginTop: 'clamp(3rem, 8vw, 8rem)', marginBottom: '2rem' }}>
                    <div style={{
                        textAlign: 'center',
                        background: 'var(--theme-surface)',
                        border: '1px solid var(--theme-border)',
                        borderRadius: '24px',
                        padding: 'clamp(2.5rem, 5vw, 5rem) clamp(1rem, 4vw, 2rem)',
                        position: 'relative',
                        overflow: 'hidden',
                        backdropFilter: 'blur(16px)',
                        maxWidth: '900px',
                        margin: '0 auto'
                    }}>
                        <div style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '80%',
                            height: '100%',
                            background: 'radial-gradient(ellipse at center, color-mix(in srgb, var(--theme-primary) 14%, transparent) 0%, transparent 60%)',
                            zIndex: -1,
                            pointerEvents: 'none'
                        }} />
                        <h3 style={{ fontSize: 'clamp(1.75rem, 5vw, 3rem)', fontWeight: 800, color: 'var(--theme-text-primary)', marginBottom: '3rem', letterSpacing: '-0.02em' }}>
                            Want Results Like These?
                        </h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: '1rem' }}>
                            <button onClick={openModal} className="btn btn-primary btn-large">
                                Book Consultation
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default Results;
