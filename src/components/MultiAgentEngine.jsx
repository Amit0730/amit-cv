import React, { useState, useEffect, useRef } from 'react';
import { useBuildEngine } from '../context/BuildEngineContext';
import './MultiAgentEngine.css';

// 12 Distinct Autonomous Agents matching the showcase video
const AGENT_CONFIGS = [
    {
        id: 'agent-1',
        name: 'Layout',
        color: '#FACC15',
        textColor: '#000000',
        role: 'layout',
        zone: { minXRel: 0.05, maxXRel: 0.95, minY: 15, maxY: 90 },
        vocab: ['align: 16px', 'nav: 460px', 'gutter check', '12-col grid', 'snap: (0,0)', 'padding: 24px']
    },
    {
        id: 'agent-2',
        name: 'Typeset',
        color: '#22C55E',
        textColor: '#FFFFFF',
        role: 'typeset',
        zone: { minXRel: 0.08, maxXRel: 0.45, minY: 160, maxY: 420 },
        vocab: ['typeset: 700', 'kerning: -1px', 'line-height: 1.1', 'font: Space', 'tracking', 'baseline']
    },
    {
        id: 'agent-3',
        name: 'Deploy',
        color: '#F97316',
        textColor: '#FFFFFF',
        role: 'deploy',
        zone: { minXRel: 0.38, maxXRel: 0.62, minY: 160, maxY: 520 },
        vocab: ['frame: 340×430', 'asset: webp', 'mount container', 'aspect: 4:5', 'mount 100%', 'cache: ok']
    },
    {
        id: 'agent-4',
        name: 'Motion',
        color: '#EC4899',
        textColor: '#FFFFFF',
        role: 'motion',
        zone: { minXRel: 0.08, maxXRel: 0.38, minY: 360, maxY: 560 },
        vocab: ['hover test', 'spring: 0.3s', 'easeOut', 'click ripple', 'transform: -4px', 'bezier']
    },
    {
        id: 'agent-5',
        name: 'Copy',
        color: '#06B6D4',
        textColor: '#FFFFFF',
        role: 'copy',
        zone: { minXRel: 0.08, maxXRel: 0.46, minY: 260, maxY: 440 },
        vocab: ['copy edit', 'tone check', 'proofread', 'bio review', 'grammar: ok', 'editorial']
    },
    {
        id: 'agent-6',
        name: 'Palette',
        color: '#EAB308',
        textColor: '#000000',
        role: 'palette',
        zone: { minXRel: 0.35, maxXRel: 0.65, minY: 180, maxY: 520 },
        vocab: ['laser: red', 'contrast: 14:1', 'radial glow', 'palette ok', 'stroke: 1.5px', 'hsl(0,100%)']
    },
    {
        id: 'agent-7',
        name: 'Lint',
        color: '#94A3B8',
        textColor: '#FFFFFF',
        role: 'lint',
        zone: { minXRel: 0.58, maxXRel: 0.92, minY: 25, maxY: 180 },
        vocab: ['lint: clean', 'dom audit', 'aria-label', 'semantic tag', 'vdom sync', '0 errors']
    },
    {
        id: 'agent-8',
        name: 'Code',
        color: '#3B82F6',
        textColor: '#FFFFFF',
        role: 'code',
        zone: { minXRel: 0.68, maxXRel: 0.94, minY: 200, maxY: 480 },
        vocab: ['calc: 15+', 'count: 04', 'batch: 2026', 'metrics: ok', 'runtime check', 'state ready']
    },
    {
        id: 'agent-9',
        name: 'Scout',
        color: '#38BDF8',
        textColor: '#000000',
        role: 'scout',
        zone: { minXRel: 0.05, maxXRel: 0.95, minY: 420, maxY: 750 },
        vocab: ['scouting viewport', 'check scroll', 'probe #projects', 'inspect block', 'scan: 100vw', 'ping']
    },
    {
        id: 'agent-10',
        name: 'Dev',
        color: '#A855F7',
        textColor: '#FFFFFF',
        role: 'dev',
        zone: { minXRel: 0.28, maxXRel: 0.72, minY: 20, maxY: 160 },
        vocab: ['mount: root', 'flex: row', 'box-sizing', 'z-index: 100', 'render node', 'props: ok']
    },
    {
        id: 'agent-11',
        name: 'Audit',
        color: '#F43F5E',
        textColor: '#FFFFFF',
        role: 'audit',
        zone: { minXRel: 0.75, maxXRel: 0.96, minY: 20, maxY: 240 },
        vocab: ['perf: 99', 'fcp: 0.3s', 'cls: 0.00', 'a11y: pass', 'seo: 100%', 'audit ok']
    },
    {
        id: 'agent-12',
        name: 'Render',
        color: '#8B5CF6',
        textColor: '#FFFFFF',
        role: 'render',
        zone: { minXRel: 0.15, maxXRel: 0.85, minY: 160, maxY: 380 },
        vocab: ['stamp: PORTFOLIO', 'gpu paint', 'shadow: 80px', 'draw pass', 'fps: 60', 'canvas ok']
    },
];

export default function MultiAgentEngine() {
    const {
        heroDelivered, setHeroDelivered,
        aboutDelivered, setAboutDelivered,
        projectsDelivered, setProjectsDelivered,
        buildingStates, setBuildingStates,
        isBuilding,
        agentsActive, setAgentsActive,
        speedMultiplier, setSpeedMultiplier,
        rebuildAll
    } = useBuildEngine();

    const [ripples, setRipples] = useState([]);
    const containerRef = useRef(null);
    const animFrameRef = useRef(null);

    // Track state of building in progress to prevent duplicate triggers
    const heroTimerRef = useRef(0);
    const aboutBuildingRef = useRef(false);
    const projectsBuildingRef = useRef(false);

    // Initial autonomous states of all 12 agents
    const agentsRef = useRef(
        AGENT_CONFIGS.map((cfg, index) => {
            const w = typeof window !== 'undefined' ? window.innerWidth : 1200;
            const h = typeof window !== 'undefined' ? window.innerHeight : 800;

            const startX = cfg.zone.minXRel * w + Math.random() * (cfg.zone.maxXRel - cfg.zone.minXRel) * w;
            const startY = cfg.zone.minY + Math.random() * (cfg.zone.maxY - cfg.zone.minY);

            return {
                ...cfg,
                x: startX,
                y: startY,
                targetX: startX,
                targetY: startY,
                vx: 0,
                vy: 0,
                angle: 0,
                labelExtra: cfg.vocab[0],
                wanderTimer: 0.4 + index * 0.3,
                speedMod: 0.9 + (index % 4) * 0.1,
                jitterFreqX: 1.8 + (index % 3) * 0.5,
                jitterFreqY: 2.1 + ((index + 1) % 3) * 0.5,
                seed: index * 17.13,
                isCarrying: false,
            };
        })
    );

    // Click / Delivery Ripple Generator
    const addRipple = (x, y, color = '#38BDF8') => {
        const id = Date.now() + Math.random();
        setRipples(prev => [...prev.slice(-8), { id, x, y, color }]);
        setTimeout(() => {
            setRipples(prev => prev.filter(r => r.id !== id));
        }, 850);
    };

    // Helper: Safely get handle / boundary coordinates of any element by ID
    const getHandle = (elementId, corner = 'br') => {
        if (typeof document === 'undefined') return null;
        const el = document.getElementById(elementId);
        if (!el) return null;
        const rect = el.getBoundingClientRect();
        if (rect.width === 0 && rect.height === 0) return null;

        if (corner === 'br') return { x: rect.right, y: rect.bottom, width: rect.width, height: rect.height };
        if (corner === 'tr') return { x: rect.right, y: rect.top, width: rect.width, height: rect.height };
        if (corner === 'bl') return { x: rect.left, y: rect.bottom, width: rect.width, height: rect.height };
        if (corner === 'tl') return { x: rect.left, y: rect.top, width: rect.width, height: rect.height };
        if (corner === 'center') return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2, width: rect.width, height: rect.height };
        return { x: rect.right, y: rect.bottom, width: rect.width, height: rect.height };
    };

    // =========================================================================
    // 1. INSTANT SIMULTANEOUS HERO ASSEMBLY (ON LOAD / OPEN)
    // 3 Random/Specific Mice Build the 3 Top Contents TOGETHER!
    // =========================================================================
    useEffect(() => {
        if (!isBuilding) return;

        heroTimerRef.current = 0;
        aboutBuildingRef.current = false;
        projectsBuildingRef.current = false;

        const heroInterval = setInterval(() => {
            if (!agentsActive) return;

            heroTimerRef.current += 0.05 * speedMultiplier;
            const t = heroTimerRef.current;

            // Target elements
            const nameH = getHandle('builder-hero-name', 'br');
            const photoH = getHandle('builder-hero-photo', 'br');
            const statsH = getHandle('builder-hero-stats', 'tr');
            const navH = getHandle('builder-hero-nav', 'tr');
            const bgH = getHandle('builder-hero-bg', 'center');

            // While building Hero (t from 0s to 1.35s): ALL 3 CONTENTS ARE BUILT TOGETHER!
            if (t <= 1.35 && !heroDelivered.name) {
                // 1. Mouse Typeset (Index 1) -> Left Column (Name/Headline/CTA)
                if (nameH) {
                    agentsRef.current[1].isCarrying = true;
                    agentsRef.current[1].targetX = nameH.x;
                    agentsRef.current[1].targetY = nameH.y;
                    agentsRef.current[1].labelExtra = 'assembling headline ✍️';
                }

                // 2. Mouse Deploy (Index 2) -> Center Column (Photo Stage)
                if (photoH) {
                    agentsRef.current[2].isCarrying = true;
                    agentsRef.current[2].targetX = photoH.x;
                    agentsRef.current[2].targetY = photoH.y;
                    agentsRef.current[2].labelExtra = 'framing portrait 🖼️';
                }

                // 3. Mouse Code (Index 7) -> Right Column (Stats Stack)
                if (statsH) {
                    agentsRef.current[7].isCarrying = true;
                    agentsRef.current[7].targetX = statsH.x;
                    agentsRef.current[7].targetY = statsH.y;
                    agentsRef.current[7].labelExtra = 'compiling stats 📊';
                }

                // 4. Mouse Layout (Index 0) -> Top Navbar
                if (navH) {
                    agentsRef.current[0].isCarrying = true;
                    agentsRef.current[0].targetX = navH.x;
                    agentsRef.current[0].targetY = navH.y;
                    agentsRef.current[0].labelExtra = 'snapping grid 🧭';
                }

                // 5. Mouse Render (Index 11) -> Background PORTFOLIO
                if (bgH) {
                    agentsRef.current[11].isCarrying = true;
                    agentsRef.current[11].targetX = bgH.x;
                    agentsRef.current[11].targetY = bgH.y;
                    agentsRef.current[11].labelExtra = 'stamping PORTFOLIO 💥';
                }

                // Supporting agents actively buzz in orbit around the stage
                agentsRef.current[5].labelExtra = 'optimizing contrast';
                agentsRef.current[3].labelExtra = 'checking spring';
                agentsRef.current[6].labelExtra = '0 errors';
                agentsRef.current[8].labelExtra = 'scouting viewport';
                agentsRef.current[9].labelExtra = 'mounting root';
                agentsRef.current[10].labelExtra = 'fcp: 0.2s';
            }

            // SIMULTANEOUS HERO DELIVERY MOMENT (at t >= 1.35s)
            if (t >= 1.35 && !heroDelivered.name) {
                // Fire delivery ripples at all 3 content blocks simultaneously!
                if (nameH) addRipple(nameH.x, nameH.y, '#22C55E');
                if (photoH) addRipple(photoH.x, photoH.y, '#F97316');
                if (statsH) addRipple(statsH.x, statsH.y, '#3B82F6');
                if (navH) addRipple(navH.x, navH.y, '#FACC15');
                if (bgH) addRipple(bgH.x, bgH.y, '#8B5CF6');

                // Deliver all 3 top contents together!
                setHeroDelivered({
                    nav: true,
                    name: true,
                    photo: true,
                    stats: true,
                    bg: true
                });

                setBuildingStates(prev => ({ ...prev, hero: false }));

                agentsRef.current[1].labelExtra = 'typeset: 700 ✓';
                agentsRef.current[2].labelExtra = 'mounted 100% ✓';
                agentsRef.current[7].labelExtra = 'stats ready ✓';
                agentsRef.current[0].labelExtra = 'align: 16px ✓';
                agentsRef.current[11].labelExtra = 'stamped ✓';

                setTimeout(() => {
                    agentsRef.current[1].isCarrying = false;
                    agentsRef.current[2].isCarrying = false;
                    agentsRef.current[7].isCarrying = false;
                    agentsRef.current[0].isCarrying = false;
                    agentsRef.current[11].isCarrying = false;
                }, 700);

                clearInterval(heroInterval);
            }
        }, 40);

        return () => clearInterval(heroInterval);
    }, [isBuilding, speedMultiplier, heroDelivered.name, agentsActive]);

    // =========================================================================
    // 2. SCROLL DOWN BUILDING ENGINE (ABOUT & PROJECTS SECTIONS)
    // As user scrolls down, other random/assigned mice build those contents!
    // =========================================================================
    useEffect(() => {
        const handleScroll = () => {
            if (!agentsActive) return;

            const aboutEl = document.getElementById('about');
            const projectsEl = document.getElementById('projects');

            // -----------------------------------------------------------------
            // A. SCROLL INTO ABOUT: 3 Mice (Motion, Palette, Copy) build 3 About contents!
            // -----------------------------------------------------------------
            if (aboutEl && !aboutDelivered.title && !aboutBuildingRef.current) {
                const rect = aboutEl.getBoundingClientRect();
                if (rect.top <= window.innerHeight * 0.82) {
                    aboutBuildingRef.current = true;
                    setBuildingStates(prev => ({ ...prev, about: true }));

                    let aboutTimer = 0;
                    const aboutInterval = setInterval(() => {
                        aboutTimer += 0.05 * speedMultiplier;

                        const titleH = getHandle('builder-about-title', 'br');
                        const photo2H = getHandle('builder-about-photo', 'br');
                        const bioH = getHandle('builder-about-bio', 'tr');

                        // 3 Mice Build the 3 About contents simultaneously!
                        if (titleH) {
                            agentsRef.current[3].isCarrying = true;
                            agentsRef.current[3].targetX = titleH.x;
                            agentsRef.current[3].targetY = titleH.y;
                            agentsRef.current[3].labelExtra = 'drawing headline ✍️';
                        }
                        if (photo2H) {
                            agentsRef.current[5].isCarrying = true;
                            agentsRef.current[5].targetX = photo2H.x;
                            agentsRef.current[5].targetY = photo2H.y;
                            agentsRef.current[5].labelExtra = 'framing 2nd pic 📸';
                        }
                        if (bioH) {
                            agentsRef.current[4].isCarrying = true;
                            agentsRef.current[4].targetX = bioH.x;
                            agentsRef.current[4].targetY = bioH.y;
                            agentsRef.current[4].labelExtra = 'authoring bio 📄';
                        }

                        // Complete About assembly after ~1.1 seconds
                        if (aboutTimer >= 1.1) {
                            if (titleH) addRipple(titleH.x, titleH.y, '#EC4899');
                            if (photo2H) addRipple(photo2H.x, photo2H.y, '#EAB308');
                            if (bioH) addRipple(bioH.x, bioH.y, '#06B6D4');

                            setAboutDelivered({
                                title: true,
                                photo2: true,
                                bio: true
                            });

                            setBuildingStates(prev => ({ ...prev, about: false }));

                            agentsRef.current[3].labelExtra = 'headline placed ✓';
                            agentsRef.current[5].labelExtra = 'photo placed ✓';
                            agentsRef.current[4].labelExtra = 'bio placed ✓';

                            setTimeout(() => {
                                agentsRef.current[3].isCarrying = false;
                                agentsRef.current[5].isCarrying = false;
                                agentsRef.current[4].isCarrying = false;
                            }, 700);

                            clearInterval(aboutInterval);
                        }
                    }, 40);
                }
            }

            // -----------------------------------------------------------------
            // B. SCROLL INTO PROJECTS: 4 Mice (Dev, Scout, Lint, Layout) build 4 Project Cards!
            // -----------------------------------------------------------------
            if (projectsEl && !projectsDelivered.card1 && !projectsBuildingRef.current) {
                const rect = projectsEl.getBoundingClientRect();
                if (rect.top <= window.innerHeight * 0.82) {
                    projectsBuildingRef.current = true;
                    setBuildingStates(prev => ({ ...prev, projects: true }));

                    let projTimer = 0;
                    const projInterval = setInterval(() => {
                        projTimer += 0.05 * speedMultiplier;

                        const card0H = getHandle('builder-project-card-0', 'br');
                        const card1H = getHandle('builder-project-card-1', 'br');
                        const card2H = getHandle('builder-project-card-2', 'br');
                        const card3H = getHandle('builder-project-card-3', 'br');

                        // 4 Mice build the 4 Project Cards simultaneously!
                        if (card0H) {
                            agentsRef.current[9].isCarrying = true;
                            agentsRef.current[9].targetX = card0H.x;
                            agentsRef.current[9].targetY = card0H.y;
                            agentsRef.current[9].labelExtra = 'sizing Card 01 🚀';
                        }
                        if (card1H) {
                            agentsRef.current[8].isCarrying = true;
                            agentsRef.current[8].targetX = card1H.x;
                            agentsRef.current[8].targetY = card1H.y;
                            agentsRef.current[8].labelExtra = 'sizing Card 02 ⚡';
                        }
                        if (card2H) {
                            agentsRef.current[6].isCarrying = true;
                            agentsRef.current[6].targetX = card2H.x;
                            agentsRef.current[6].targetY = card2H.y;
                            agentsRef.current[6].labelExtra = 'sizing Card 03 🛠️';
                        }
                        if (card3H) {
                            agentsRef.current[0].isCarrying = true;
                            agentsRef.current[0].targetX = card3H.x;
                            agentsRef.current[0].targetY = card3H.y;
                            agentsRef.current[0].labelExtra = 'sizing Card 04 🌐';
                        }

                        // Complete Projects assembly after ~1.2 seconds
                        if (projTimer >= 1.2) {
                            if (card0H) addRipple(card0H.x, card0H.y, '#A855F7');
                            if (card1H) addRipple(card1H.x, card1H.y, '#38BDF8');
                            if (card2H) addRipple(card2H.x, card2H.y, '#94A3B8');
                            if (card3H) addRipple(card3H.x, card3H.y, '#FACC15');

                            setProjectsDelivered({
                                card1: true,
                                card2: true,
                                card3: true,
                                card4: true
                            });

                            setBuildingStates(prev => ({ ...prev, projects: false }));

                            agentsRef.current[9].labelExtra = 'Card 01 placed ✓';
                            agentsRef.current[8].labelExtra = 'Card 02 placed ✓';
                            agentsRef.current[6].labelExtra = 'Card 03 placed ✓';
                            agentsRef.current[0].labelExtra = 'Card 04 placed ✓';

                            setTimeout(() => {
                                agentsRef.current[9].isCarrying = false;
                                agentsRef.current[8].isCarrying = false;
                                agentsRef.current[6].isCarrying = false;
                                agentsRef.current[0].isCarrying = false;
                            }, 700);

                            clearInterval(projInterval);
                        }
                    }, 40);
                }
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Trigger immediate check on mount
        return () => window.removeEventListener('scroll', handleScroll);
    }, [aboutDelivered.title, projectsDelivered.card1, agentsActive, speedMultiplier]);

    // =========================================================================
    // 3. 60FPS SIMULATION LOOP: AUTONOMOUS PHYSICS & DIRECT DOM TRANSFORMS
    // =========================================================================
    useEffect(() => {
        let lastTime = performance.now();

        const updateSimulation = (currentTime) => {
            const dt = Math.min((currentTime - lastTime) / 1000, 0.08);
            lastTime = currentTime;
            const now = currentTime / 1000;
            const w = window.innerWidth;
            const h = window.innerHeight;

            if (agentsActive) {
                agentsRef.current.forEach((agent) => {
                    // Autonomous wandering when not actively building / carrying
                    if (!agent.isCarrying) {
                        agent.wanderTimer -= dt * speedMultiplier;

                        if (agent.wanderTimer <= 0) {
                            const minX = agent.zone.minXRel * w;
                            const maxX = agent.zone.maxXRel * w;
                            const minY = Math.max(10, agent.zone.minY);
                            const maxY = Math.min(h - 80, agent.zone.maxY);

                            agent.targetX = minX + Math.random() * (maxX - minX);
                            agent.targetY = minY + Math.random() * (maxY - minY);
                            agent.wanderTimer = 1.6 + Math.random() * 2.8;

                            const randomVocab = agent.vocab[Math.floor(Math.random() * agent.vocab.length)];
                            agent.labelExtra = randomVocab;

                            if (Math.random() < 0.12) {
                                addRipple(agent.targetX, agent.targetY, agent.color);
                            }
                        }
                    }

                    // Human hand natural micro-jitter
                    const jitterX = Math.sin(now * agent.jitterFreqX + agent.seed) * 1.5;
                    const jitterY = Math.cos(now * agent.jitterFreqY + agent.seed) * 1.5;

                    const effectiveTargetX = agent.targetX + jitterX;
                    const effectiveTargetY = agent.targetY + jitterY;

                    const dx = effectiveTargetX - agent.x;
                    const dy = effectiveTargetY - agent.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    // High-accuracy spring lock when carrying a handle
                    const accel = agent.isCarrying ? 14.0 : 6.0;
                    const maxSpeed = agent.isCarrying ? 850 : 380;
                    const baseSpeed = Math.min(dist * 6.0, maxSpeed) * agent.speedMod * speedMultiplier;

                    if (dist > 1) {
                        agent.vx += ((dx / (dist + 0.1)) * baseSpeed - agent.vx) * accel * dt;
                        agent.vy += ((dy / (dist + 0.1)) * baseSpeed - agent.vy) * accel * dt;
                        agent.x += agent.vx * dt;
                        agent.y += agent.vy * dt;
                        agent.angle = Math.max(-16, Math.min(16, agent.vx / 32));
                    }
                });

                // Update DOM cursors directly for 60fps
                if (containerRef.current) {
                    const cursorDoms = containerRef.current.querySelectorAll('.agent-cursor-wrapper');
                    cursorDoms.forEach((dom, i) => {
                        const agent = agentsRef.current[i];
                        if (agent) {
                            dom.style.transform = `translate3d(${agent.x}px, ${agent.y}px, 0) rotate(${agent.angle}deg)`;
                            const labelEl = dom.querySelector('.agent-badge-name');
                            if (labelEl) {
                                const fullLabel = `${agent.name} ${agent.labelExtra ? `• ${agent.labelExtra}` : ''}`;
                                if (labelEl.textContent !== fullLabel) {
                                    labelEl.textContent = fullLabel;
                                }
                            }
                        }
                    });
                }
            }

            animFrameRef.current = requestAnimationFrame(updateSimulation);
        };

        animFrameRef.current = requestAnimationFrame(updateSimulation);
        return () => {
            if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
        };
    }, [agentsActive, speedMultiplier]);

    return (
        <>
            {/* Multi-Agent Overlay Canvas */}
            <div ref={containerRef} className="multi-agent-overlay" aria-hidden="true">
                {/* Click / Delivery Ripples */}
                {ripples.map(r => (
                    <span
                        key={r.id}
                        className="agent-click-ripple"
                        style={{
                            left: `${r.x}px`,
                            top: `${r.y}px`,
                            borderColor: r.color,
                            boxShadow: `0 0 16px ${r.color}`
                        }}
                    />
                ))}

                {/* 12 Live Cursors */}
                {AGENT_CONFIGS.map(agent => (
                    <div key={agent.id} className="agent-cursor-wrapper">
                        {/* Custom Pointer SVG */}
                        <svg className="agent-pointer-svg" width="22" height="22" viewBox="0 0 24 24" fill="none">
                            <path
                                d="M3 3L10.07 19.97L12.58 12.58L19.97 10.07L3 3Z"
                                fill={agent.color}
                                stroke="#000000"
                                strokeWidth="2"
                                strokeLinejoin="round"
                            />
                        </svg>

                        {/* Agent Role Badge */}
                        <div
                            className="agent-badge-tag"
                            style={{
                                backgroundColor: agent.color,
                                color: agent.textColor,
                                boxShadow: `0 3px 10px rgba(0, 0, 0, 0.5), 0 0 10px ${agent.color}66`
                            }}
                        >
                            <span className="agent-badge-dot" style={{ background: agent.textColor }} />
                            <span className="agent-badge-name">
                                {agent.name}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Bottom Floating Control Dock */}
            <div className="agents-dock-container">
                <div className="agents-dock-pill">
                    <div className="dock-status-group">
                        <span className={`dock-pulse-dot ${agentsActive ? 'online' : 'offline'}`} />
                        <span className="dock-agents-count">
                            {agentsActive ? '12 AI AGENTS COLLABORATING' : 'AGENTS PAUSED'}
                        </span>
                    </div>

                    <div className="dock-divider" />

                    {/* Play/Pause Button */}
                    <button
                        className={`dock-action-btn ${agentsActive ? 'active' : ''}`}
                        onClick={() => setAgentsActive(!agentsActive)}
                        title={agentsActive ? 'Pause Agents' : 'Resume Agents'}
                    >
                        {agentsActive ? (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                <rect x="6" y="4" width="4" height="16" rx="1" />
                                <rect x="14" y="4" width="4" height="16" rx="1" />
                            </svg>
                        ) : (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                <polygon points="5 3 19 12 5 21 5 3" />
                            </svg>
                        )}
                        <span className="dock-btn-label">{agentsActive ? 'PAUSE' : 'RESUME'}</span>
                    </button>

                    {/* Replay Build Button */}
                    <button
                        className="dock-action-btn"
                        onClick={rebuildAll}
                        title="Replay agents delivering each element onto the page"
                    >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                            <path d="M21 3v5h-5" />
                            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                            <path d="M8 16H3v5" />
                        </svg>
                        <span className="dock-btn-label">REPLAY BUILD</span>
                    </button>

                    {/* Speed Multiplier */}
                    <button
                        className="dock-speed-btn"
                        onClick={() => setSpeedMultiplier(prev => prev === 1 ? 1.5 : prev === 1.5 ? 2 : 1)}
                        title="Adjust Agent Movement Speed"
                    >
                        {speedMultiplier}x
                    </button>

                    {/* Stop / Start Button */}
                    <button
                        className={`dock-stop-btn ${!agentsActive ? 'stopped' : ''}`}
                        onClick={() => setAgentsActive(!agentsActive)}
                    >
                        {agentsActive ? 'STOP' : 'START'}
                    </button>
                </div>
            </div>
        </>
    );
}
