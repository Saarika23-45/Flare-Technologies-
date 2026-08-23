import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface ContactProps {
    onOpenModal?: () => void;
}

const words = ['READY', 'GROW', 'FLARE', 'SUCCESS', 'FUTURE'];
const colors = ['#7DD3FC', '#FF8C00', '#00D4FF', '#A855F7', '#10B981'];

const Contact: React.FC<ContactProps> = ({ onOpenModal }) => {
    const navigate = useNavigate();
    const sectionRef = useRef<HTMLDivElement>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [animating, setAnimating] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setAnimating(true);
            setTimeout(() => {
                setCurrentIndex(i => (i + 1) % words.length);
                setAnimating(false);
            }, 300);
        }, 1800);
        return () => clearInterval(interval);
    }, []);

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

    const handleAction = () => {
        if (onOpenModal) onOpenModal();
        else navigate('/contact');
    };

    return (
        <section id="contact" className="cta-section section-padding" ref={sectionRef}>
            <style>{`
                .slot-word {
                    display: inline-block;
                    transition: transform 0.28s cubic-bezier(0.4,0,0.2,1), opacity 0.28s ease;
                }
                .slot-word.exit {
                    transform: translateY(-60px) rotateX(45deg);
                    opacity: 0;
                }
                .slot-word.enter {
                    transform: translateY(0) rotateX(0deg);
                    opacity: 1;
                }
                .slot-machine-box {
                    perspective: 600px;
                    overflow: hidden;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 20px;
                    padding: 0.3em 0.6em;
                    border: 2px solid rgba(255,255,255,0.1);
                    background: rgba(255,255,255,0.04);
                    backdrop-filter: blur(8px);
                    min-width: 360px;
                    min-height: 110px;
                }
                @media (max-width: 640px) {
                    .slot-machine-box { min-width: 240px; min-height: 80px; }
                }
            `}</style>
            <div className="container scroll-anim scale-up">
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    gap: '1.5rem',
                    padding: '2rem 0',
                }}>
                    {/* Static label */}
                    <p style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.875rem',
                        fontWeight: 700,
                        color: 'rgba(255,255,255,0.4)',
                        letterSpacing: '0.15em',
                        textTransform: 'uppercase',
                        margin: 0,
                    }}>
                        Ready to
                    </p>

                    {/* Slot machine word */}
                    <div className="slot-machine-box" style={{ borderColor: `${colors[currentIndex]}30` }}>
                        <span
                            className={`slot-word ${animating ? 'exit' : 'enter'}`}
                            style={{
                                fontFamily: 'var(--font-heading)',
                                fontSize: 'clamp(2.5rem, 8vw, 5rem)',
                                fontWeight: 900,
                                letterSpacing: '-0.03em',
                                lineHeight: 1,
                                color: colors[currentIndex],
                                textShadow: `0 0 40px ${colors[currentIndex]}60`,
                            }}
                        >
                            {words[currentIndex]}
                        </span>
                    </div>

                    {/* Dots indicator */}
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        {words.map((_, i) => (
                            <div key={i} style={{
                                width: i === currentIndex ? '20px' : '6px',
                                height: '6px',
                                borderRadius: '99px',
                                background: i === currentIndex ? colors[currentIndex] : 'rgba(255,255,255,0.15)',
                                transition: 'all 0.3s ease',
                            }} />
                        ))}
                    </div>

                    <button onClick={handleAction} className="btn btn-primary btn-large">
                        Book a Free Call
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Contact;
