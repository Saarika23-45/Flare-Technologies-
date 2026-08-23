import React, { useEffect, useRef } from 'react';

const Philosophy: React.FC = () => {
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

    return (
        <section id="philosophy" className="philosophy-section section-padding" ref={sectionRef}>
            <div className="container text-center scroll-anim slide-up">
                <h2 className="section-badge">The Flare System</h2>
                <h3 className="section-title">One System. Not Five Separate Vendors.</h3>
                {/* Desktop view */}
                <p className="hidden md:block section-desc mx-auto" style={{ maxWidth: '800px' }}>
                    Most companies hire separate agencies for web, marketing, automation, and hosting. The problem is they never talk to each other. You end up managing everyone, fixing gaps yourself, and paying for disconnected services. Flare is different. We built a single system covering your website, automation, marketing, and infrastructure. Everything is designed from the start to work together. This approach delivers real results without the chaos.
                </p>

                {/* Mobile view - Cards */}
                <div className="md:hidden grid gap-4 mt-8 text-left">
                    <div className="p-4 rounded-xl bg-white/5 backdrop-blur border border-white/10">
                        <h3 className="text-base font-semibold text-white mb-2">The Problem</h3>
                        <p className="text-sm text-gray-300 leading-relaxed">
                            Most companies hire separate agencies for web, marketing, automation, and hosting. They rarely talk to each other.
                        </p>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5 backdrop-blur border border-white/10">
                        <h3 className="text-base font-semibold text-white mb-2">The Chaos</h3>
                        <p className="text-sm text-gray-300 leading-relaxed">
                            You manage everyone, fix the gaps yourself, and pay for generic services that fail to connect.
                        </p>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5 backdrop-blur border border-white/10">
                        <h3 className="text-base font-semibold text-white mb-2">The Flare Solution</h3>
                        <p className="text-sm text-gray-300 leading-relaxed">
                            We built a single platform covering your website, automation, marketing, and infrastructure. Everything is designed to work together.
                        </p>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5 backdrop-blur border border-white/10">
                        <h3 className="text-base font-semibold text-white mb-2">The Result</h3>
                        <p className="text-sm text-gray-300 leading-relaxed">
                            You get a system that drives growth without the headache.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Philosophy;
