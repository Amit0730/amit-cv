import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
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
                        {/* New Website option near Contact requested by user */}
                        <Link to="/new" className="nav-new-website-btn" title="Open New AI Multi-Agent Website">
                            <Sparkles size={14} className="sparkle-icon" />
                            <span>New Website</span>
                            <span className="badge-new-pill">AI V2</span>
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default ClassicNavigation;
