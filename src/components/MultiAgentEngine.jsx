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
        zone: { minXRel: 0.08, maxXRel: 0.45, minY: 160, maxY: 380 },
        vocab: ['typeset: 700', 'kerning: -1px', 'line-height: 1.1', 'font: Space', 'tracking', 'baseline']
    },
    {
        id: 'agent-3',
        name: 'Deploy',
        color: '#F97316',
        textColor: '#FFFFFF',
        role: 'deploy',
        zone: { minXRel: 0.38, maxXRel: 0.62, minY: 140, maxY: 500 },
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
        isBuilding, setIsBuilding,
        agentsActive, setAgentsActive,
        speedMultiplier, setSpeedMultiplier,
        rebuildAll
    } = useBuildEngine();

    const [ripples, setRipples] = useState([]);
    const containerRef = useRef(null);
    const animFrameRef = useRef(null);
    const buildTimerRef = useRef(0);

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
                speedMod: 0.85 + (index % 4) * 0.12,
                jitterFreqX: 1.8 + (index % 3) * 0.5,
                jitterFreqY: 2.1 + ((index + 1) % 3) * 0.5,
                seed: index * 17.13,
                isCarrying: false,
            };
        })
    );

    // Click Ripple Generator
    const addRipple = (x, y, color = '#38BDF8') => {
        const id = Date.now() + Math.random();
        setRipples(prev => [...prev.slice(-6), { id, x, y, color }]);
        setTimeout(() => {
            setRipples(prev => prev.filter(r => r.id !== id));
        }, 800);
    };

    // Master Hero Choreography: Each agent brings its specific element into place
    useEffect(() => {
        if (!isBuilding) return;

        buildTimerRef.current = 0;

        const choreoInterval = setInterval(() => {
            if (!agentsActive) return;

            buildTimerRef.current += 0.05 * speedMultiplier;
            const t = buildTimerRef.current;
            const w = window.innerWidth;
            const h = window.innerHeight;
            const isDesktop = w > 900;

            const navW = Math.min(460, w * 0.88);
            const navH = 48;
            const navX = (w - navW) / 2;
            const navY = 22;

            const headX = isDesktop ? w * 0.10 : 20;
            const headY = isDesktop ? h * 0.22 : 110;

            const photoW = 340;
            const photoH = 430;
            const photoX = isDesktop ? (w - photoW) / 2 : 20;
            const photoY = isDesktop ? h * 0.20 : 420;

            const statsW = 210;
            const statsH = 260;
            const statsX = isDesktop ? w * 0.74 : 20;
            const statsY = isDesktop ? h * 0.24 : 860;

            const bgW = Math.min(w * 0.88, 920);
            const bgH = 160;
            const bgX = (w - bgW) / 2;
            const bgY = h * 0.26;

            // -----------------------------------------------------------------
            // 1. Agent Layout (0) BRINGS THE NAVBAR (0.2s - 1.2s)
            // -----------------------------------------------------------------
            if (t > 0.2 && t <= 1.2) {
                agentsRef.current[0].isCarrying = true;
                agentsRef.current[0].targetX = navX + navW / 2;
                agentsRef.current[0].targetY = navY + navH / 2;
                agentsRef.current[0].labelExtra = 'bringing navbar 🧭';

                if (t >= 1.0 && !heroDelivered.nav) {
                    addRipple(navX + navW / 2, navY + navH / 2, '#FACC15');
                    setHeroDelivered(prev => ({ ...prev, nav: true }));
                    agentsRef.current[0].labelExtra = 'navbar placed ✓';
                }
            } else if (t > 1.2 && agentsRef.current[0].isCarrying) {
                agentsRef.current[0].isCarrying = false;
                agentsRef.current[0].wanderTimer = 2.0;
            }

            // -----------------------------------------------------------------
            // 2. Agent Typeset (1) BRINGS THE NAME & HEADLINE (0.8s - 2.0s)
            // -----------------------------------------------------------------
            if (t > 0.8 && t <= 2.0) {
                agentsRef.current[1].isCarrying = true;
                agentsRef.current[1].targetX = headX + 120;
                agentsRef.current[1].targetY = headY + 40;
                agentsRef.current[1].labelExtra = 'bringing name 📦';

                if (t >= 1.7 && !heroDelivered.name) {
                    addRipple(headX + 120, headY + 40, '#22C55E');
                    setHeroDelivered(prev => ({ ...prev, name: true }));
                    agentsRef.current[1].labelExtra = 'name placed ✓';
                }
            } else if (t > 2.0 && agentsRef.current[1].isCarrying) {
                agentsRef.current[1].isCarrying = false;
                agentsRef.current[1].wanderTimer = 2.0;
            }

            // -----------------------------------------------------------------
            // 3. Agent Deploy (2) BRINGS THE 1ST PHOTO (1.4s - 2.7s)
            // -----------------------------------------------------------------
            if (t > 1.4 && t <= 2.7) {
                agentsRef.current[2].isCarrying = true;
                agentsRef.current[2].targetX = photoX + photoW / 2;
                agentsRef.current[2].targetY = photoY + photoH / 2;
                agentsRef.current[2].labelExtra = 'bringing photo 🖼️';

                if (t >= 2.3 && !heroDelivered.photo) {
                    addRipple(photoX + photoW / 2, photoY + photoH / 2, '#F97316');
                    setHeroDelivered(prev => ({ ...prev, photo: true }));
                    agentsRef.current[2].labelExtra = 'photo mounted ✓';
                }
            } else if (t > 2.7 && agentsRef.current[2].isCarrying) {
                agentsRef.current[2].isCarrying = false;
                agentsRef.current[2].wanderTimer = 2.0;
            }

            // -----------------------------------------------------------------
            // 4. Agent Code (7) BRINGS THE STATS STACK (2.0s - 3.3s)
            // -----------------------------------------------------------------
            if (t > 2.0 && t <= 3.3) {
                agentsRef.current[7].isCarrying = true;
                agentsRef.current[7].targetX = statsX + statsW / 2;
                agentsRef.current[7].targetY = statsY + statsH / 2;
                agentsRef.current[7].labelExtra = 'bringing stats 📊';

                if (t >= 2.9 && !heroDelivered.stats) {
                    addRipple(statsX + statsW / 2, statsY + statsH / 2, '#3B82F6');
                    setHeroDelivered(prev => ({ ...prev, stats: true }));
                    agentsRef.current[7].labelExtra = 'stats placed ✓';
                }
            } else if (t > 3.3 && agentsRef.current[7].isCarrying) {
                agentsRef.current[7].isCarrying = false;
                agentsRef.current[7].wanderTimer = 2.0;
            }

            // -----------------------------------------------------------------
            // 5. Agent Render (11) STAMPS THE GIANT PORTFOLIO (2.6s - 3.8s)
            // -----------------------------------------------------------------
            if (t > 2.6 && t <= 3.8) {
                agentsRef.current[11].isCarrying = true;
                agentsRef.current[11].targetX = bgX + bgW / 2;
                agentsRef.current[11].targetY = bgY + bgH / 2;
                agentsRef.current[11].labelExtra = 'stamping PORTFOLIO 💥';

                if (t >= 3.4 && !heroDelivered.bg) {
                    addRipple(bgX + bgW / 2, bgY + bgH / 2, '#8B5CF6');
                    setHeroDelivered(prev => ({ ...prev, bg: true }));
                    agentsRef.current[11].labelExtra = 'stamped ✓';
                }
            } else if (t > 3.8 && agentsRef.current[11].isCarrying) {
                agentsRef.current[11].isCarrying = false;
                agentsRef.current[11].wanderTimer = 2.0;
            }
        }, 50);

        return () => clearInterval(choreoInterval);
    }, [isBuilding, speedMultiplier, heroDelivered, agentsActive]);

    // Downstream Scroll Handler: Brings in About & Projects sections
    useEffect(() => {
        const handleScroll = () => {
            const aboutEl = document.getElementById('about');
            const projectsEl = document.getElementById('projects');

            // -----------------------------------------------------------------
            // SCROLL INTO ABOUT: Agent Motion brings Title, Palette brings 2nd Pic, Copy brings Bio
            // -----------------------------------------------------------------
            if (aboutEl) {
                const rect = aboutEl.getBoundingClientRect();
                if (rect.top <= window.innerHeight * 0.75 && !aboutDelivered.title) {
                    // Agent Motion (3) brings Title
                    agentsRef.current[3].isCarrying = true;
                    agentsRef.current[3].targetX = rect.left + rect.width / 2;
                    agentsRef.current[3].targetY = rect.top + 80;
                    agentsRef.current[3].labelExtra = 'bringing title ✍️';

                    // Agent Palette (5) brings 2nd Pic
                    agentsRef.current[5].isCarrying = true;
                    agentsRef.current[5].targetX = rect.left + 160;
                    agentsRef.current[5].targetY = rect.top + 320;
                    agentsRef.current[5].labelExtra = 'bringing 2nd pic 📸';

                    // Agent Copy (4) brings Bio Story
                    agentsRef.current[4].isCarrying = true;
                    agentsRef.current[4].targetX = rect.left + rect.width * 0.65;
                    agentsRef.current[4].targetY = rect.top + 280;
                    agentsRef.current[4].labelExtra = 'bringing bio 📄';

                    // Trigger drop after travel delay
                    setTimeout(() => {
                        addRipple(rect.left + rect.width / 2, rect.top + 80, '#EC4899');
                        addRipple(rect.left + 160, rect.top + 320, '#EAB308');
                        addRipple(rect.left + rect.width * 0.65, rect.top + 280, '#06B6D4');

                        setAboutDelivered({
                            title: true,
                            photo2: true,
                            bio: true
                        });

                        agentsRef.current[3].labelExtra = 'title placed ✓';
                        agentsRef.current[5].labelExtra = '2nd pic placed ✓';
                        agentsRef.current[4].labelExtra = 'bio placed ✓';

                        setTimeout(() => {
                            agentsRef.current[3].isCarrying = false;
                            agentsRef.current[5].isCarrying = false;
                            agentsRef.current[4].isCarrying = false;
                        }, 1000);
                    }, 650);
                }
            }

            // -----------------------------------------------------------------
            // SCROLL INTO PROJECTS: Agents Dev, Scout, Lint, Layout bring the 4 Project Cards
            // -----------------------------------------------------------------
            if (projectsEl) {
                const rect = projectsEl.getBoundingClientRect();
                if (rect.top <= window.innerHeight * 0.75 && !projectsDelivered.card1) {
                    // Agent Dev (9) brings Card 01
                    agentsRef.current[9].isCarrying = true;
                    agentsRef.current[9].targetX = rect.left + 180;
                    agentsRef.current[9].targetY = rect.top + 200;
                    agentsRef.current[9].labelExtra = 'bringing Card 01 🚀';

                    // Agent Scout (8) brings Card 02
                    agentsRef.current[8].isCarrying = true;
                    agentsRef.current[8].targetX = rect.left + rect.width * 0.65;
                    agentsRef.current[8].targetY = rect.top + 200;
                    agentsRef.current[8].labelExtra = 'bringing Card 02 ⚡';

                    // Agent Lint (6) brings Card 03
                    agentsRef.current[6].isCarrying = true;
                    agentsRef.current[6].targetX = rect.left + 180;
                    agentsRef.current[6].targetY = rect.top + 460;
                    agentsRef.current[6].labelExtra = 'bringing Card 03 🛠️';

                    // Agent Layout (0) brings Card 04
                    agentsRef.current[0].isCarrying = true;
                    agentsRef.current[0].targetX = rect.left + rect.width * 0.65;
                    agentsRef.current[0].targetY = rect.top + 460;
                    agentsRef.current[0].labelExtra = 'bringing Card 04 🌐';

                    setTimeout(() => {
                        addRipple(rect.left + 180, rect.top + 200, '#A855F7');
                        addRipple(rect.left + rect.width * 0.65, rect.top + 200, '#38BDF8');
                        addRipple(rect.left + 180, rect.top + 460, '#94A3B8');
                        addRipple(rect.left + rect.width * 0.65, rect.top + 460, '#FACC15');

                        setProjectsDelivered({
                            card1: true,
                            card2: true,
                            card3: true,
                            card4: true
                        });

                        agentsRef.current[9].labelExtra = 'Card 01 placed ✓';
                        agentsRef.current[8].labelExtra = 'Card 02 placed ✓';
                        agentsRef.current[6].labelExtra = 'Card 03 placed ✓';
                        agentsRef.current[0].labelExtra = 'Card 04 placed ✓';

                        setTimeout(() => {
                            agentsRef.current[9].isCarrying = false;
                            agentsRef.current[8].isCarrying = false;
                            agentsRef.current[6].isCarrying = false;
                            agentsRef.current[0].isCarrying = false;
                        }, 1000);
                    }, 700);
                }
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [aboutDelivered, projectsDelivered]);

    // High Performance 60fps Animation Loop: Autonomous Roaming + Physics
    useEffect(() => {
        let lastTime = performance.now();

        const updateSimulation = (currentTime) => {
            const dt = Math.min((currentTime - lastTime) / 1000, 0.08);
            lastTime = currentTime;
            const now = currentTime / 1000;
            const w = window.innerWidth;

            if (agentsActive) {
                agentsRef.current.forEach((agent) => {
                    // If not carrying an item, autonomously wander inside its own territory!
                    if (!agent.isCarrying) {
                        agent.wanderTimer -= dt * speedMultiplier;

                        if (agent.wanderTimer <= 0) {
                            const minX = agent.zone.minXRel * w;
                            const maxX = agent.zone.maxXRel * w;
                            const minY = agent.zone.minY;
                            const maxY = agent.zone.maxY;

                            agent.targetX = minX + Math.random() * (maxX - minX);
                            agent.targetY = minY + Math.random() * (maxY - minY);
                            agent.wanderTimer = 1.6 + Math.random() * 2.8;

                            const randomVocab = agent.vocab[Math.floor(Math.random() * agent.vocab.length)];
                            agent.labelExtra = randomVocab;

                            if (Math.random() < 0.16) {
                                addRipple(agent.targetX, agent.targetY, agent.color);
                            }
                        }
                    }

                    // Human hand micro-jitter
                    const jitterX = Math.sin(now * agent.jitterFreqX + agent.seed) * 2.0;
                    const jitterY = Math.cos(now * agent.jitterFreqY + agent.seed) * 2.0;

                    const effectiveTargetX = agent.targetX + jitterX;
                    const effectiveTargetY = agent.targetY + jitterY;

                    const dx = effectiveTargetX - agent.x;
                    const dy = effectiveTargetY - agent.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    // Speed adjusts based on distance and carrying status
                    const baseSpeed = (agent.isCarrying ? (dist > 300 ? 650 : 420) : (dist > 300 ? 520 : dist > 100 ? 300 : 150)) * agent.speedMod * speedMultiplier;
                    const accel = agent.isCarrying ? 8.5 : 6.0;

                    if (dist > 2) {
                        agent.vx += (dx / (dist + 0.1) * baseSpeed - agent.vx) * accel * dt;
                        agent.vy += (dy / (dist + 0.1) * baseSpeed - agent.vy) * accel * dt;
                        agent.x += agent.vx * dt;
                        agent.y += agent.vy * dt;
                        agent.angle = Math.max(-18, Math.min(18, agent.vx / 30));
                    }
                });

                // Update DOM positions directly for silky smooth 60fps
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
