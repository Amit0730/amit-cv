import React, { useEffect } from 'react';
import { useBuildEngine } from '../context/BuildEngineContext';
import './BootScreen.css';

const AGENT_COLORS = [
    '#22C55E', '#06B6D4', '#94A3B8', '#84CC16',
    '#3B82F6', '#F97316', '#EC4899', '#EAB308',
    '#F43F5E', '#38BDF8', '#F59E0B', '#8B5CF6'
];

export default function BootScreen() {
    const { isBooted, setIsBooted, bootCount, setBootCount } = useBuildEngine();

    useEffect(() => {
        if (isBooted) return;

        let current = 1;
        const interval = setInterval(() => {
            current += 1;
            if (current <= 12) {
                setBootCount(current);
            } else {
                clearInterval(interval);
                setTimeout(() => {
                    setIsBooted(true);
                }, 350);
            }
        }, 120);

        return () => clearInterval(interval);
    }, [isBooted, setIsBooted, setBootCount]);

    if (isBooted) return null;

    return (
        <div className="boot-screen-overlay">
            {/* Center Loading Ring */}
            <div className="boot-center-content">
                <div className="boot-orbit-stage">
                    {/* 12 Multi-Colored Agent Dots Ring */}
                    <div className="boot-dots-ring">
                        {AGENT_COLORS.map((color, i) => {
                            const angle = (i / 12) * 360;
                            const rad = (angle * Math.PI) / 180;
                            const r = 38; // radius in px
                            const x = Math.cos(rad) * r;
                            const y = Math.sin(rad) * r;
                            const isActive = i < bootCount;

                            return (
                                <span
                                    key={i}
                                    className={`boot-agent-dot ${isActive ? 'active' : ''}`}
                                    style={{
                                        transform: `translate(${x}px, ${y}px)`,
                                        backgroundColor: color,
                                        boxShadow: isActive ? `0 0 10px ${color}` : 'none',
                                        opacity: isActive ? 1 : 0.25
                                    }}
                                />
                            );
                        })}
                    </div>

                    {/* Monogram Brand in Center */}
                    <div className="boot-monogram-core">
                        <span>A</span>
                    </div>
                </div>

                {/* Monospace Counter */}
                <div className="boot-status-text">
                    <span>BOOTING AGENTS</span>
                    <span className="boot-counter-highlight">{bootCount}/12</span>
                </div>
            </div>

            {/* Bottom Credits Strip */}
            <div className="boot-footer-strip">
                <div className="boot-footer-left">
                    <span className="boot-pill-icon">A</span>
                    <span>© 2026 AMIT KUMAR SINGH</span>
                </div>
                <div className="boot-footer-right">
                    <span>BUILT BY AN AGENT SWARM • PUNJAB / UTTAR PRADESH, INDIA</span>
                </div>
            </div>
        </div>
    );
}
