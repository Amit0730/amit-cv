import React from 'react';
import Typewriter from 'typewriter-effect';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Github, Linkedin, FileText, ArrowUpRight } from 'lucide-react';
import ClashingLaserBorder from './ClashingLaserBorder';
import { useBuildEngine } from '../context/BuildEngineContext';
import AgentBuilderFrame from './AgentBuilderFrame';
import './Hero.css';

const Hero = () => {
    const { heroDelivered, buildingStates, typedText = {}, componentStages = {}, agentsActive = true } = useBuildEngine();

    return (
        <section id="home" className="hero-section section">
            {/* Giant Background Word from Video - Stamped by Render Agent */}
            <motion.div
                id="builder-hero-bg"
                className="hero-giant-bg"
                aria-hidden="true"
                initial={{ opacity: 0.15, scale: 1.15 }}
                animate={{
                    opacity: heroDelivered.bg ? 1 : 0.45,
                    scale: heroDelivered.bg ? 1 : 1.15
                }}
                transition={{ type: 'spring', damping: 18, stiffness: 130 }}
            >
                PORTFOLIO
            </motion.div>

            <div className="container hero-container-cinematic">
                {/* 1. Left Column: Multi-Agent Typography, Copy, CTA & Meta */}
                <div className="hero-left-col">
                    {/* A. Name & Greeting - Built by Typography */}
                    <AgentBuilderFrame
                        id="builder-hero-name"
                        agentName="Typography"
                        action="typing"
                        color="#22C55E"
                        label="540×120"
                        isBuilding={buildingStates.hero}
                        isDelivered={heroDelivered.name}
                        className="hero-subframe"
                    >
                        <p className="hero-greeting-sub">Hello, I'm</p>
                        <h1 className="hero-name-giant" style={{ minHeight: '1.15em' }}>
                            {heroDelivered.name || !agentsActive ? (
                                "AMIT KUMAR SINGH."
                            ) : (
                                typedText['builder-hero-name'] !== undefined ? typedText['builder-hero-name'] : ""
                            )}
                            {!heroDelivered.name && agentsActive && <span className="typing-cursor-blink">|</span>}
                        </h1>
                    </AgentBuilderFrame>

                    {/* B. Role Subtitle - Built by Copy */}
                    <AgentBuilderFrame
                        id="builder-hero-role"
                        agentName="Copy"
                        action="typing"
                        color="#06B6D4"
                        label="headline: 420×44"
                        isBuilding={buildingStates.hero}
                        isDelivered={heroDelivered.role}
                        className="hero-subframe"
                    >
                        <h2 className="hero-role-headline" style={{ minHeight: '1.2em' }}>
                            {heroDelivered.role || !agentsActive ? (
                                "SOFTWARE ENGINEER & AI BUILDER"
                            ) : (
                                typedText['builder-hero-role'] !== undefined ? typedText['builder-hero-role'] : ""
                            )}
                            {!heroDelivered.role && agentsActive && <span className="typing-cursor-blink">|</span>}
                        </h2>
                    </AgentBuilderFrame>

                    {/* C. Pitch & Capabilities - Built by Copy */}
                    <AgentBuilderFrame
                        id="builder-hero-pitch"
                        agentName="Copy"
                        action="authoring"
                        color="#06B6D4"
                        label="bio: 520×140"
                        isBuilding={buildingStates.hero}
                        isDelivered={heroDelivered.pitch}
                        className="hero-subframe"
                    >
                        <div className="hero-typewriter-box">
                            <span className="typewriter-prefix">Specializing in: </span>
                            <Typewriter
                                options={{
                                    strings: [
                                        'Autonomous Agent Workflows',
                                        'Full-Stack Machine Learning',
                                        'Scalable Mobile & Web Apps',
                                        'High-Performance Systems'
                                    ],
                                    autoStart: true,
                                    loop: true,
                                    delay: 35,
                                    deleteSpeed: 20,
                                }}
                            />
                        </div>

                        <p className="hero-pitch-text" style={{ minHeight: '3.4em' }}>
                            {heroDelivered.pitch || !agentsActive ? (
                                "I build intelligent systems, mobile applications, and AI-assisted workflows that actually ship. Engineering student at LPU with proven experience building production-ready architectures from brief to live deployment."
                            ) : (
                                typedText['builder-hero-pitch'] !== undefined ? typedText['builder-hero-pitch'] : ""
                            )}
                            {!heroDelivered.pitch && agentsActive && <span className="typing-cursor-blink">|</span>}
                        </p>
                    </AgentBuilderFrame>

                    {/* D. CTA Action Buttons - Placed by Layout */}
                    <AgentBuilderFrame
                        id="builder-hero-cta"
                        agentName="Layout"
                        action="placing"
                        color="#F59E0B"
                        label="cta: 320×48"
                        isBuilding={buildingStates.hero}
                        isDelivered={heroDelivered.cta}
                        className="hero-subframe"
                    >
                        {heroDelivered.cta || !agentsActive || (componentStages['builder-hero-cta'] || 0) >= 1 ? (
                            <div className="hero-cta-group">
                                <a href="#projects" className="btn-hero-red">
                                    <span>VIEW WORK</span>
                                    <ArrowUpRight size={18} />
                                </a>
                                {(heroDelivered.cta || !agentsActive || (componentStages['builder-hero-cta'] || 0) >= 2) && (
                                    <Link to="/cv" className="btn-hero-glass">
                                        <FileText size={17} />
                                        <span>VIEW CV</span>
                                    </Link>
                                )}
                            </div>
                        ) : (
                            <div className="hero-cta-wireframe" style={{ display: 'flex', gap: '1rem', minHeight: '48px', alignItems: 'center' }}>
                                <span className="wireframe-bar" style={{ width: '130px', height: '44px', borderRadius: '8px', display: 'inline-block' }} />
                                <span className="wireframe-bar" style={{ width: '110px', height: '44px', borderRadius: '8px', display: 'inline-block' }} />
                            </div>
                        )}
                    </AgentBuilderFrame>

                    {/* E. Location Badge & Socials - Built by QA */}
                    <AgentBuilderFrame
                        id="builder-hero-location"
                        agentName="QA"
                        action="typing"
                        color="#3B82F6"
                        label="location: 480×32"
                        isBuilding={buildingStates.hero}
                        isDelivered={heroDelivered.location}
                        className="hero-subframe"
                    >
                        <div className="hero-meta-tag">
                            <span className="meta-beacon" />
                            <span>BASED IN PUNJAB / UTTAR PRADESH, INDIA • OPEN TO INTERNSHIPS & ROLES</span>
                        </div>

                        {/* Social links */}
                        <div className="hero-social-strip">
                            <a href="https://github.com/Amit0730" target="_blank" rel="noopener noreferrer" className="social-pill" title="GitHub">
                                <Github size={18} />
                            </a>
                            <a href="https://www.linkedin.com/in/amitkumarsingh12/" target="_blank" rel="noopener noreferrer" className="social-pill" title="LinkedIn">
                                <Linkedin size={18} />
                            </a>
                            <a href="https://x.com/amitKumar1466" target="_blank" rel="noopener noreferrer" className="social-pill" title="X / Twitter">
                                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                </svg>
                            </a>
                            <a href="https://leetcode.com/u/amitkumarsi79007/" target="_blank" rel="noopener noreferrer" className="social-pill" title="LeetCode">
                                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                                    <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.001-1.954l-4.11-4.11a1.272 1.272 0 0 0-1.802 0l-1.049 1.049a1.272 1.272 0 0 0 0 1.802l2.308 2.308a.636.636 0 1 1-.899.901l-2.308-2.308a2.544 2.544 0 0 1 0-3.604l1.049-1.049a2.544 2.544 0 0 1 3.604 0l4.11 4.11c1.62 1.62 1.62 4.256 0 5.876l-2.396 2.392c-3.13 3.129-8.214 3.129-11.344 0l-4.277-4.193a8.55 8.55 0 0 1-1.838-2.628 8.618 8.618 0 0 1-.505-1.464 8.788 8.788 0 0 1-.098-3.766 8.544 8.544 0 0 1 .184-.757 8.554 8.554 0 0 1 1.956-3.398L7.116 3.676l5.406-5.406a1.374 1.374 0 0 0-.961-.438z" />
                                </svg>
                            </a>
                        </div>
                    </AgentBuilderFrame>
                </div>

                {/* 2. Center Column: Built by Resize & Media */}
                <AgentBuilderFrame
                    id="builder-hero-photo"
                    agentName="Resize"
                    action="resizing"
                    color="#84CC16"
                    label="portrait: 340×430"
                    isBuilding={buildingStates.hero}
                    isDelivered={heroDelivered.photo}
                    className="hero-frame-center"
                >
                    <motion.div
                        className="hero-center-col"
                        initial={{ opacity: 0.5, scale: 0.92 }}
                        animate={{
                            opacity: heroDelivered.photo ? 1 : 0.85,
                            scale: heroDelivered.photo ? 1 : 0.95
                        }}
                        transition={{ type: 'spring', damping: 20, stiffness: 120 }}
                    >
                        <div className="hero-portrait-stage">
                            {heroDelivered.photo && <ClashingLaserBorder />}

                            <div className="hero-portrait-wrapper glass-panel">
                                {heroDelivered.photo || !agentsActive ? (
                                    <>
                                        <img
                                            src={`${import.meta.env.BASE_URL}images/profile1.jpg`}
                                            alt="Amit Kumar Singh"
                                            className="hero-portrait-img"
                                        />
                                        <div className="hero-portrait-ambient-glow" />
                                    </>
                                ) : (
                                    <div className="portrait-wireframe-slot" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: '320px', background: 'rgba(255, 255, 255, 0.02)', border: '1px dashed rgba(255, 255, 255, 0.15)', borderRadius: '20px' }}>
                                        <span className="wireframe-pill" style={{ padding: '6px 14px', borderRadius: '999px', background: 'rgba(255, 255, 255, 0.05)', fontSize: '11px', color: '#71717A', fontFamily: 'monospace' }}>
                                            [PORTRAIT ASSET WIREFRAME]
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </AgentBuilderFrame>

                {/* 3. Right Column: Built by Component Agent */}
                <AgentBuilderFrame
                    id="builder-hero-stats"
                    agentName="Component"
                    action="assembling"
                    color="#3B82F6"
                    label="stats: 210×260"
                    isBuilding={buildingStates.hero}
                    isDelivered={heroDelivered.stats}
                    className="hero-frame-right"
                >
                    <motion.div
                        className="hero-right-col"
                        initial={{ opacity: 0.5, scale: 0.92 }}
                        animate={{
                            opacity: heroDelivered.stats ? 1 : 0.85,
                            scale: heroDelivered.stats ? 1 : 0.95
                        }}
                        transition={{ type: 'spring', damping: 20, stiffness: 120 }}
                    >
                        <div className="stats-stack-card">
                            {(heroDelivered.stats || !agentsActive || (componentStages['builder-hero-stats'] || 0) >= 1) ? (
                                <div className="stat-unit">
                                    <div className="stat-number-giant text-gradient">40.</div>
                                    <div className="stat-label-muted">UNIT TESTS SHIPPED</div>
                                </div>
                            ) : (
                                <div className="stat-unit" style={{ minHeight: '52px' }}>
                                    <span className="wireframe-bar" style={{ width: '60px', height: '24px', marginBottom: '6px', display: 'block' }} />
                                    <span className="wireframe-bar" style={{ width: '120px', height: '10px', display: 'block' }} />
                                </div>
                            )}

                            <div className="stat-divider-subtle" />

                            {(heroDelivered.stats || !agentsActive || (componentStages['builder-hero-stats'] || 0) >= 2) ? (
                                <div className="stat-unit">
                                    <div className="stat-number-giant text-gradient">02.</div>
                                    <div className="stat-label-muted">APPS LIVE IN PROD</div>
                                </div>
                            ) : (
                                <div className="stat-unit" style={{ minHeight: '52px' }}>
                                    <span className="wireframe-bar" style={{ width: '60px', height: '24px', marginBottom: '6px', display: 'block' }} />
                                    <span className="wireframe-bar" style={{ width: '110px', height: '10px', display: 'block' }} />
                                </div>
                            )}

                            <div className="stat-divider-subtle" />

                            {(heroDelivered.stats || !agentsActive || (componentStages['builder-hero-stats'] || 0) >= 3) ? (
                                <div className="stat-unit">
                                    <div className="stat-number-giant text-red-accent">'26.</div>
                                    <div className="stat-label-muted">B.TECH CSE (AI) LEAD</div>
                                </div>
                            ) : (
                                <div className="stat-unit" style={{ minHeight: '52px' }}>
                                    <span className="wireframe-bar" style={{ width: '60px', height: '24px', marginBottom: '6px', display: 'block' }} />
                                    <span className="wireframe-bar" style={{ width: '130px', height: '10px', display: 'block' }} />
                                </div>
                            )}
                        </div>
                    </motion.div>
                </AgentBuilderFrame>
            </div>
        </section>
    );
};

export default Hero;
