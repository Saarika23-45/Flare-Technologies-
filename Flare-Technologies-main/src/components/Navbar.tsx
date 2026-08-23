import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface NavbarProps {
    openModal: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ openModal }) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isHideNav, setIsHideNav] = useState(false);
    const [lastScroll, setLastScroll] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScroll = window.pageYOffset;

            setIsScrolled(currentScroll > 50);

            if (currentScroll <= 0) {
                setIsHideNav(false);
            } else if (currentScroll > lastScroll && currentScroll > 150) {
                setIsHideNav(true);
                if (isMobileMenuOpen) {
                    setIsMobileMenuOpen(false);
                    document.body.style.overflow = 'auto';
                }
            } else {
                setIsHideNav(false);
            }
            setLastScroll(currentScroll);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScroll, isMobileMenuOpen]);

    const toggleMobileMenu = () => {
        const newState = !isMobileMenuOpen;
        setIsMobileMenuOpen(newState);
        document.body.style.overflow = newState ? 'hidden' : 'auto';
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
        document.body.style.overflow = 'auto';
    };

    return (
        <header className={`header ${isScrolled ? 'scrolled' : ''} ${isHideNav ? 'hide-nav' : ''}`}>
            <div className="logo flex items-center">
                <Link to="/">
                    <img
                        src="/logo.webp"
                        alt="Flare Technologies Logo"
                        width="96"
                        height="96"
                        className="brand-logo"
                    />
                </Link>
            </div>

            <nav className="nav desktop-nav hidden md:flex">
                <Link to="/">Home</Link>
                <Link to="/about">About</Link>
                <Link to="/services">Services</Link>
                <Link to="/methodology">Methodology</Link>
                <Link to="/results">Case Studies</Link>
                <Link to="/#trusted-by">Clients</Link>
                <Link to="/careers">Careers</Link>
                <Link to="/contact">Contact</Link>
                <button onClick={openModal} className="nav-link cursor-pointer bg-transparent border-none font-medium transition-colors" style={{ color: 'var(--theme-text-primary)' }}>Book Consultation</button>
            </nav>

            <div className="header-actions desktop-nav hidden md:flex">
                {/* Book Consultation now part of Nav */}
            </div>

            <button
                className={`menu-toggle block md:hidden ${isMobileMenuOpen ? 'active' : ''}`}
                aria-label="Toggle menu"
                onClick={toggleMobileMenu}
            >
                <span className="hamburger"></span>
            </button>

            <nav className={`mobile-nav ${isMobileMenuOpen ? 'active' : ''}`}>
                <div className="mobile-links-container">
                    <Link to="/" className="mobile-link" onClick={closeMobileMenu}>Home</Link>
                    <Link to="/about" className="mobile-link" onClick={closeMobileMenu}>About</Link>
                    <Link to="/services" className="mobile-link" onClick={closeMobileMenu}>Services</Link>
                    <Link to="/methodology" className="mobile-link" onClick={closeMobileMenu}>Methodology</Link>
                    <Link to="/results" className="mobile-link" onClick={closeMobileMenu}>Case Studies</Link>
                    <Link to="/#trusted-by" className="mobile-link" onClick={closeMobileMenu}>Clients</Link>
                    <Link to="/careers" className="mobile-link" onClick={closeMobileMenu}>Careers</Link>
                    <Link to="/contact" className="mobile-link" onClick={closeMobileMenu}>Contact</Link>
                </div>
                <div className="mobile-actions">
                    <button
                        onClick={() => {
                            closeMobileMenu();
                            openModal();
                        }}
                        className="btn btn-header-primary btn-full"
                    >
                        Book Consultation
                    </button>
                </div>
            </nav>
        </header>
    );
};

export default Navbar;
