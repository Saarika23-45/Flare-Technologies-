import React, { useEffect, useRef } from 'react';
import BorderGlow from './ui/BorderGlow';

const GrowthStack: React.FC = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const cardClass = 'w-full bg-black border border-slate-700';
    const headingClass = 'text-lg font-bold text-white tracking-wide';
    const bodyClass = 'text-sm text-gray-300 leading-relaxed';

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
        <section id="growth-stack" className="stack-section section-padding" ref={sectionRef}>
            <style>{`
                [data-theme="light"] .stack-card-inner { background: rgba(255,255,255,0.95) !important; border-color: rgba(0,0,0,0.08) !important; }
                [data-theme="light"] .stack-card-inner h4 { color: #1e1b4b !important; }
                [data-theme="light"] .stack-card-inner p { color: #374151 !important; }
                [data-theme="light"] .stack-card-inner .w-2\\.5 { box-shadow: none !important; }
            `}</style>
            <style>{`
              [data-theme="light"] .stack-card-inner { background: rgba(255,255,255,0.9) !important; }
              [data-theme="light"] .stack-card-inner h4 { color: #1e1b4b !important; }
              [data-theme="light"] .stack-card-inner p { color: #374151 !important; }
            `}</style>
            <div className="container">
        <div className="stack-layout grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
                    {/* Left column — existing cards */}
                    <div className="stack-content scroll-anim slide-right">
                        <h2 className="section-badge">How It Works Together</h2>
                        <h3 className="section-title" style={{ color: 'var(--theme-primary)', textShadow: '0 0 20px color-mix(in srgb, var(--theme-primary) 35%, transparent)' }}>One Team. Every Layer. Better Results.</h3>
                        
                        <div className="stack-cards flex flex-col gap-6 mt-10">
                            <BorderGlow 
                                glowColor="217 91 60" 
                                colors={['#2563EB', '#1D4ED8', '#06B6D4']} 
                                borderRadius={16}
                                fillOpacity={0.15}
                                className={cardClass}
                            >
                                <div className="p-5 stack-card-inner">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-2.5 h-2.5 rounded-full bg-[#2563EB] shadow-[0_0_10px_#2563EB]" />
                                        <h4 className={headingClass}>Execution and Growth Operations</h4>
                                    </div>
                                    <p className={bodyClass}>
                                        We ensure the right audience sees your business. We create content that builds trust and turns website visitors into paying customers.
                                    </p>
                                </div>
                            </BorderGlow>

                            <BorderGlow 
                                glowColor="196 94 46" 
                                colors={['#06B6D4', '#0EA5E9', '#2563EB']} 
                                borderRadius={16}
                                fillOpacity={0.15}
                                className={cardClass}
                            >
                                <div className="p-5 stack-card-inner">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-2.5 h-2.5 rounded-full bg-[#06B6D4] shadow-[0_0_10px_#06B6D4]" />
                                        <h4 className={headingClass}>Infrastructure and Automation</h4>
                                    </div>
                                    <p className={bodyClass}>
                                        Your technology runs automatically in the background. We set up reliable hosting and automate your workflows. Your systems will handle growth while you focus on the business.
                                    </p>
                                </div>
                            </BorderGlow>

                            <BorderGlow 
                                glowColor="217 91 60" 
                                colors={['#2563EB', '#1E40AF', '#06B6D4']} 
                                borderRadius={16}
                                fillOpacity={0.15}
                                className={cardClass}
                            >
                                <div className="p-5 stack-card-inner">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-2.5 h-2.5 rounded-full bg-[#2563EB] shadow-[0_0_10px_#2563EB]" />
                                        <h4 className={headingClass}>Data and Intelligence</h4>
                                    </div>
                                    <p className={bodyClass}>
                                        We analyze performance and provide clear reporting. Every decision you make will be backed by reliable data instead of guesswork.
                                    </p>
                                </div>
                            </BorderGlow>
                        </div>
                    </div>

                    {/* Right column — new cards */}
                    <div className="stack-content scroll-anim slide-left">
                        <h2 className="section-badge">What We Build</h2>
                        <h3 className="section-title" style={{ color: 'var(--theme-accent)', textShadow: '0 0 20px color-mix(in srgb, var(--theme-accent) 35%, transparent)' }}>Technology That Works For You.</h3>

                        <div className="stack-cards flex flex-col gap-6 mt-10">
                            <BorderGlow
                                glowColor="217 91 60"
                                colors={['#2563EB', '#1D4ED8', '#06B6D4']}
                                borderRadius={16}
                                fillOpacity={0.15}
                                className={cardClass}
                            >
                                <div className="p-5 stack-card-inner">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-2.5 h-2.5 rounded-full bg-[#2563EB] shadow-[0_0_10px_#2563EB]" />
                                        <h4 className={headingClass}>Design and Development</h4>
                                    </div>
                                    <p className={bodyClass}>
                                        Your digital presence starts with a strong foundation. We build fast, modern websites and apps tailored to your business. Every product is crafted to perform well and leave a lasting impression.
                                    </p>
                                </div>
                            </BorderGlow>

                            <BorderGlow
                                glowColor="196 94 46"
                                colors={['#06B6D4', '#0EA5E9', '#38BDF8']}
                                borderRadius={16}
                                fillOpacity={0.15}
                                className={cardClass}
                            >
                                <div className="p-5 stack-card-inner">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-2.5 h-2.5 rounded-full bg-[#06B6D4] shadow-[0_0_10px_#06B6D4]" />
                                        <h4 className={headingClass}>AI and Intelligent Systems</h4>
                                    </div>
                                    <p className={bodyClass}>
                                        We bring AI into your business where it matters most. From chatbots to smart decision tools, we build systems that learn and adapt — without the complexity of managing it yourself.
                                    </p>
                                </div>
                            </BorderGlow>

                            <BorderGlow
                                glowColor="196 94 46"
                                colors={['#0EA5E9', '#06B6D4', '#2563EB']}
                                borderRadius={16}
                                fillOpacity={0.15}
                                className={cardClass}
                            >
                                <div className="p-5 stack-card-inner">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-2.5 h-2.5 rounded-full bg-[#0EA5E9] shadow-[0_0_10px_#0EA5E9]" />
                                        <h4 className={headingClass}>Cloud and Scalability</h4>
                                    </div>
                                    <p className={bodyClass}>
                                        We architect cloud infrastructure that grows with your business. Whether you're handling ten users or ten thousand, your systems stay fast and reliable — no downtime, no bottlenecks.
                                    </p>
                                </div>
                            </BorderGlow>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default GrowthStack;
