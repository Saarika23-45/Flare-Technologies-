import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, ArrowUpRight } from 'lucide-react';

interface FooterProps {
    openModal?: () => void;
}

const Footer: React.FC<FooterProps> = ({ openModal }) => {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer className="relative bg-[#060b17] pt-24 pb-12 overflow-hidden border-t border-white/5">
            {/* Decorative background glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-gradient-to-r from-transparent via-[#00D4FF]/40 to-transparent shadow-[0_0_20px_rgba(0,212,255,0.3)]" />
            
            <div className="container relative z-10 px-6 mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
                    
                    {/* Brand Column */}
                    <div className="flex flex-col gap-6">
                        <div className="flex items-center gap-3">
                            <img 
                                src="/logo.webp" 
                                alt="Flare Technologies Logo" 
                                width="96"
                                height="96"
                                className="h-24 w-auto drop-shadow-[0_0_15px_rgba(0,212,255,0.4)]"
                            />
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
                            Intelligent scaling solutions for the modern business. We bridge the gap between complex technology and seamless operational growth.
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.5rem' }}>
                            <a
                                href="https://www.linkedin.com/company/flaretechnologiespvtltd/"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Flare Technologies on LinkedIn"
                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 38, height: 38, borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)', transition: 'all 0.2s ease', textDecoration: 'none' }}
                                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(10,102,194,0.2)'; (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(10,102,194,0.6)'; (e.currentTarget as HTMLAnchorElement).style.color = '#0a66c2'; }}
                                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.05)'; (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.1)'; (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.5)'; }}
                            >
                                <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
                            </a>
                            <a
                                href="https://www.instagram.com/flare_technologies?igsh=MWdmY24ybmQydWN5dw=="
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Flare Technologies on Instagram"
                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 38, height: 38, borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)', transition: 'all 0.2s ease', textDecoration: 'none' }}
                                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(225,48,108,0.15)'; (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(225,48,108,0.5)'; (e.currentTarget as HTMLAnchorElement).style.color = '#e1306c'; }}
                                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.05)'; (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.1)'; (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.5)'; }}
                            >
                                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                            </a>
                        </div>
                    </div>

                    {/* Ecosystem Links */}
                    <div className="flex flex-col gap-6">
                        <h3 className="text-white font-bold text-lg">Ecosystem</h3>
                        <nav className="flex flex-col gap-4">
                            {[
                                { name: "Home", to: "/" },
                                { name: "Services", to: "/services" },
                                { name: "Methodology", to: "/methodology" },
                                { name: "Admin", to: "/admin" }
                            ].map((link) => (
                                <Link 
                                    key={link.name}
                                    to={link.to} 
                                    className="text-gray-400 hover:text-[#00D4FF] flex items-center gap-2 group transition-colors cursor-pointer"
                                >
                                    <span className="w-1 h-1 rounded-full bg-[#00D4FF] opacity-0 group-hover:opacity-100 transition-opacity" />
                                    {link.name}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {/* Company Links */}
                    <div className="flex flex-col gap-6">
                        <h3 className="text-white font-bold text-lg">Company</h3>
                        <nav className="flex flex-col gap-4">
                            {[
                                { name: "About Us", to: "/about" },
                                { name: "Case Studies", to: "/results" },
                                { name: "Contact Us", to: "/contact" },
                                { name: "Consultation", to: "", action: openModal }
                            ].map((link) => (
                                link.action ? (
                                    <button 
                                        key={link.name}
                                        onClick={link.action} 
                                        className="text-gray-400 hover:text-[#00D4FF] flex items-center gap-2 group transition-colors cursor-pointer w-fit"
                                    >
                                        <span className="w-1 h-1 rounded-full bg-[#00D4FF] opacity-0 group-hover:opacity-100 transition-opacity" />
                                        {link.name}
                                    </button>
                                ) : (
                                    <Link 
                                        key={link.name}
                                        to={link.to || "/"} 
                                        className="text-gray-400 hover:text-[#00D4FF] flex items-center gap-2 group transition-colors cursor-pointer"
                                    >
                                        <span className="w-1 h-1 rounded-full bg-[#00D4FF] opacity-0 group-hover:opacity-100 transition-opacity" />
                                        {link.name}
                                    </Link>
                                )
                            ))}
                        </nav>
                    </div>

                    {/* Contact & Map */}
                    <div className="flex flex-col gap-6">
                        <h3 className="text-white font-bold text-lg">Connect</h3>
                        <div className="flex flex-col gap-4">
                            <a href="tel:+917899104311" className="flex items-start gap-3 group cursor-pointer">
                                <Phone className="w-5 h-5 text-[#00D4FF] mt-0.5" />
                                <div className="flex flex-col">
                                    <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Call Us</span>
                                    <span className="text-white font-medium group-hover:text-[#00D4FF] transition-colors">+91 78991 04311</span>
                                </div>
                            </a>
                            <a href="mailto:marketing@flaretechnologies.in" className="flex items-start gap-3 group cursor-pointer">
                                <Mail className="w-5 h-5 text-[#00D4FF] mt-0.5" />
                                <div className="flex flex-col">
                                    <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Email</span>
                                    <span className="text-white font-medium group-hover:text-[#00D4FF] transition-colors">marketing@flaretechnologies.in</span>
                                </div>
                            </a>
                            <div className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-[#00D4FF] mt-0.5" />
                                <div className="flex flex-col">
                                    <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Location</span>
                                    <span className="text-white text-sm leading-relaxed">
                                        Bangalore, India
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-gray-500 text-sm">
                        &copy; {new Date().getFullYear()} Flare Technologies. Engineered for exponential growth.
                    </p>
                    <div className="flex items-center gap-8">
                        <div className="flex gap-6">
                            <a href="#" className="text-gray-500 hover:text-white text-sm transition-colors cursor-pointer">Privacy Policy</a>
                            <a href="#" className="text-gray-500 hover:text-white text-sm transition-colors cursor-pointer">Terms of Service</a>
                        </div>
                        <button 
                            onClick={scrollToTop}
                            className="bg-white/5 hover:bg-white/10 text-white p-3 rounded-xl transition-all border border-white/5 group cursor-pointer"
                            aria-label="Scroll to top"
                        >
                            <ArrowUpRight className="w-5 h-5 transition-transform group-hover:scale-110 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                        </button>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
