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
    const { heroDelivered, buildingStates } = useBuildEngine();

    return (
        <section id="home" className="hero-section section">
            {/* Giant Background Word from Video - Brought in by Render Agent */}
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
                {/* 1. Left Column: Built by Agent Typeset */}
                <AgentBuilderFrame
                    id="builder-hero-name"
                    agentName="Typeset"
                    color="#22C55E"
                    label="headline: 540×380"
                    isBuilding={buildingStates.hero}
                    isDelivered={heroDelivered.name}
                    className="hero-frame-left"
                >
                    <motion.div
                        className="hero-left-col"
                        initial={{ opacity: 0.5, scale: 0.94 }}
                        animate={{
                            opacity: heroDelivered.name ? 1 : 0.85,
                            scale: heroDelivered.name ? 1 : 0.96
                        }}
                        transition={{ type: 'spring', damping: 20, stiffness: 120 }}
                    >
                        <p className="hero-greeting-sub">Hello, I'm</p>

                        <h1 className="hero-name-giant">AMIT KUMAR SINGH</h1>

                        <h2 className="hero-role-headline">SOFTWARE ENGINEER & AI BUILDER</h2>

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

                        <p className="hero-pitch-text">
                            I build intelligent systems, mobile applications, and AI-assisted workflows that actually ship.
                            Engineering student at LPU with proven experience building production-ready architectures from brief to live deployment.
                        </p>

                        <div className="hero-cta-group">
                            <a href="#projects" className="btn-hero-red">
                                <span>VIEW WORK</span>
                                <ArrowUpRight size={18} />
                            </a>
                            <Link to="/cv" className="btn-hero-glass">
                                <FileText size={17} />
                                <span>VIEW CV</span>
                            </Link>
                        </div>

                        <div className="hero-meta-tag">
                            <span className="meta-beacon" />
                            <span>BASED IN PUNJAB / INDORE, INDIA • OPEN TO INTERNSHIPS & ROLES</span>
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
                    </motion.div>
                </AgentBuilderFrame>

                {/* 2. Center Column: Built by Agent Deploy */}
                <AgentBuilderFrame
                    id="builder-hero-photo"
                    agentName="Deploy"
                    color="#F97316"
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
                            <ClashingLaserBorder />

                            <div className="hero-portrait-wrapper glass-panel">
                                <img
                                    src={`${import.meta.env.BASE_URL}images/profile1.jpg`}
                                    alt="Amit Kumar Singh"
                                    className="hero-portrait-img"
                                />
                                <div className="hero-portrait-ambient-glow" />
                            </div>
                        </div>
                    </motion.div>
                </AgentBuilderFrame>

                {/* 3. Right Column: Built by Agent Code */}
                <AgentBuilderFrame
                    id="builder-hero-stats"
                    agentName="Code"
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
                            <div className="stat-unit">
                                <div className="stat-number-giant text-gradient">15+</div>
                                <div className="stat-label-muted">PROJECTS BUILT</div>
                            </div>

                            <div className="stat-divider-subtle" />

                            <div className="stat-unit">
                                <div className="stat-number-giant text-gradient">04</div>
                                <div className="stat-label-muted">APPS LIVE ON VERCEL & GH</div>
                            </div>

                            <div className="stat-divider-subtle" />

                            <div className="stat-unit">
                                <div className="stat-number-giant text-red-accent">'26</div>
                                <div className="stat-label-muted">BATCH / B.TECH CSE (AI)</div>
                            </div>
                        </div>
                    </motion.div>
                </AgentBuilderFrame>
            </div>
        </section>
    );
};

export default Hero;
