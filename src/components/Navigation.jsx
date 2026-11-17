import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, RotateCcw } from 'lucide-react';
import { useBuildEngine } from '../context/BuildEngineContext';
import AgentBuilderFrame from './AgentBuilderFrame';
import './Navigation.css';

const Navigation = () => {
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();
    const { heroDelivered, buildingStates } = useBuildEngine();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 40);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className="nav-fixed-wrapper">
            <AgentBuilderFrame
                id="builder-hero-nav"
                agentName="Layout"
                action="snapping"
                color="#FACC15"
                label="nav: 460×48"
                isBuilding={buildingStates.hero}
                isDelivered={heroDelivered.nav}
            >
                <motion.nav 
                    className={`nav-pill-bar ${scrolled ? 'scrolled-glass' : ''}`}
                    initial={{ opacity: 0.3, y: -20, scale: 0.95 }}
                    animate={{ 
                        opacity: heroDelivered.nav ? 1 : 0.85, 
                        y: 0,
                        scale: 1
                    }}
                    transition={{ type: 'spring', damping: 18, stiffness: 130 }}
                    style={{ pointerEvents: heroDelivered.nav ? 'auto' : 'none' }}
                >
                    {/* Monogram Brand Avatar */}
                    <Link to="/new" className="nav-monogram-circle" title="Amit Kumar Singh (AI Agent V2)">
                        <span>A</span>
                    </Link>

                    <div className="nav-pill-links">
                        <a href="#home" className="nav-item">Home</a>
                        <a href="#projects" className="nav-item">Work</a>
                        <a href="#about" className="nav-item">About</a>
                        <a href="#contact" className="nav-item">Contact</a>

                        <Link to="/cv" className="nav-item nav-item-cv" title="View Full CV">
                            <FileText size={14} />
                            <span>CV</span>
                        </Link>

                        {/* Old Website option requested by user right near CV */}
                        <Link to="/" className="nav-item nav-item-old-website" title="Return to Old / Classic Website">
                            <RotateCcw size={13} />
                            <span>Old Website</span>
                        </Link>
                    </div>
                </motion.nav>
            </AgentBuilderFrame>
        </header>
    );
};

export default Navigation;
