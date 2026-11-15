import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './ClassicNavigation.css';

const ClassicNavigation = () => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`navigation ${scrolled ? 'scrolled glass-panel' : ''}`}>
            <div className="container nav-container">
                <a href="#home" className="nav-logo text-gradient">Amit Kumar Singh</a>
                <div className="nav-right">
                    <div className="nav-links">
                        <a href="#about">About</a>
                        <a href="#projects">Projects</a>
                        <a href="#contact">Contact</a>
                        {/* Clean link to new website matching original nav style with cyan accent, zero red tone */}
                        <Link to="/new" className="nav-link-new-website" title="Open New AI Multi-Agent Website">
                            New Website
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default ClassicNavigation;
