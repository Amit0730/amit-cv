import React, { useState, useEffect, useRef } from 'react';
import { useBuildEngine } from '../context/BuildEngineContext';
import './MultiAgentEngine.css';

// 12 Distinct Autonomous Agents exactly matching the showcase video
const AGENT_CONFIGS = [
    {
        id: 'agent-1',
        name: 'Layout',
        color: '#F59E0B',
        textColor: '#000000',
        role: 'layout',
        zone: { minXRel: 0.05, maxXRel: 0.95, minY: 15, maxY: 100 },
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
        vocab: ['calc: 40 tests', 'count: 04', 'batch: 2026', 'metrics: ok', 'runtime check', 'state ready']
    },
    {
        id: 'agent-9',
        name: 'Index',
        color: '#84CC16',
        textColor: '#000000',
        role: 'index',
        zone: { minXRel: 0.08, maxXRel: 0.36, minY: 400, maxY: 540 },
        vocab: ['index: cta', 'btn link', 'route: /cv', 'mount click', 'hover: active']
    },
    {
        id: 'agent-10',
        name: 'QA',
        color: '#2563EB',
        textColor: '#FFFFFF',
        role: 'qa',
        zone: { minXRel: 0.08, maxXRel: 0.55, minY: 460, maxY: 600 },
        vocab: ['unit test: pass', 'qa: 100%', 'validating', 'e2e check', 'test pass ✓']
    },
    {
        id: 'agent-11',
        name: 'Review',
        color: '#F43F5E',
        textColor: '#FFFFFF',
        role: 'review',
        zone: { minXRel: 0.65, maxXRel: 0.95, minY: 100, maxY: 400 },
        vocab: ['review: approved', 'code sign-off', 'audit passed', 'pr: merged', 'ship: ready']
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
        isBooted,
        heroDelivered, setHeroDelivered,
        aboutDelivered, setAboutDelivered,
        projectsDelivered, setProjectsDelivered,
        trackDelivered, setTrackDelivered,
        skillsDelivered, setSkillsDelivered,
        buildingStates, setBuildingStates,
        isBuilding,
        agentsActive, setAgentsActive,
        speedMultiplier, setSpeedMultiplier,
        rebuildAll
    } = useBuildEngine();

    const [ripples, setRipples] = useState([]);
    const containerRef = useRef(null);
    const animFrameRef = useRef(null);

    // Track states of section building
    const heroTimerRef = useRef(0);
    const aboutBuildingRef = useRef(false);
    const projectsBuildingRef = useRef(false);
    const trackBuildingRef = useRef(false);
    const skillsBuildingRef = useRef(false);

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
                labelExtra: '',
                wanderTimer: 0.3 + index * 0.25,
                speedMod: 0.95 + (index % 4) * 0.1,
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
        setRipples(prev => [...prev.slice(-10), { id, x, y, color }]);
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
    // 1. SIMULTANEOUS HERO ASSEMBLY (ON LOAD / BOOT)
    // All 12 Agents actively build their respective components in unison!
    // =========================================================================
    useEffect(() => {
        if (!isBuilding || !isBooted) return;

        heroTimerRef.current = 0;
        aboutBuildingRef.current = false;
        projectsBuildingRef.current = false;
        trackBuildingRef.current = false;
        skillsBuildingRef.current = false;

        const heroInterval = setInterval(() => {
            if (!agentsActive) return;

            heroTimerRef.current += 0.05 * speedMultiplier;
            const t = heroTimerRef.current;

            // Target elements
            const nameH = getHandle('builder-hero-name', 'br');
            const roleH = getHandle('builder-hero-role', 'br');
            const pitchH = getHandle('builder-hero-pitch', 'br');
            const ctaH = getHandle('builder-hero-cta', 'br');
            const locH = getHandle('builder-hero-location', 'br');
            const photoH = getHandle('builder-hero-photo', 'br');
            const statsH = getHandle('builder-hero-stats', 'tr');
            const navH = getHandle('builder-hero-nav', 'tr');
            const bgH = getHandle('builder-hero-bg', 'center');

            // While building Hero (t from 0s to 1.4s): Agents actively type, frame & place!
            if (t <= 1.4 && !heroDelivered.name) {
                // 1. Typeset -> Headline
                if (nameH) {
                    agentsRef.current[1].isCarrying = true;
                    agentsRef.current[1].targetX = nameH.x;
                    agentsRef.current[1].targetY = nameH.y;
                    agentsRef.current[1].labelExtra = 'composing ✍️';
                }

                // 2. Copy -> Subtitle Role
                if (roleH) {
                    agentsRef.current[4].isCarrying = true;
                    agentsRef.current[4].targetX = roleH.x;
                    agentsRef.current[4].targetY = roleH.y;
                    agentsRef.current[4].labelExtra = 'typing ✍️';
                }

                // 3. Lint -> Pitch Text
                if (pitchH) {
                    agentsRef.current[6].isCarrying = true;
                    agentsRef.current[6].targetX = pitchH.x;
                    agentsRef.current[6].targetY = pitchH.y;
                    agentsRef.current[6].labelExtra = 'typing 📄';
                }

                // 4. Index -> CTA Buttons
                if (ctaH) {
                    agentsRef.current[8].isCarrying = true;
                    agentsRef.current[8].targetX = ctaH.x;
                    agentsRef.current[8].targetY = ctaH.y;
                    agentsRef.current[8].labelExtra = 'placing 🔘';
                }

                // 5. QA -> Location Badge
                if (locH) {
                    agentsRef.current[9].isCarrying = true;
                    agentsRef.current[9].targetX = locH.x;
                    agentsRef.current[9].targetY = locH.y;
                    agentsRef.current[9].labelExtra = 'validating 📍';
                }

                // 6. Deploy -> Framing Portrait
                if (photoH) {
                    agentsRef.current[2].isCarrying = true;
                    agentsRef.current[2].targetX = photoH.x;
                    agentsRef.current[2].targetY = photoH.y;
                    agentsRef.current[2].labelExtra = 'framing 🖼️';
                }

                // 7. Code -> Compiling Stats
                if (statsH) {
                    agentsRef.current[7].isCarrying = true;
                    agentsRef.current[7].targetX = statsH.x;
                    agentsRef.current[7].targetY = statsH.y;
                    agentsRef.current[7].labelExtra = 'compiling 📊';
                }

                // 8. Layout -> Top Navbar
                if (navH) {
                    agentsRef.current[0].isCarrying = true;
                    agentsRef.current[0].targetX = navH.x;
                    agentsRef.current[0].targetY = navH.y;
                    agentsRef.current[0].labelExtra = 'snapping 🧭';
                }

                // 9. Render -> Background PORTFOLIO
                if (bgH) {
                    agentsRef.current[11].isCarrying = true;
                    agentsRef.current[11].targetX = bgH.x;
                    agentsRef.current[11].targetY = bgH.y;
                    agentsRef.current[11].labelExtra = 'stamping 💥';
                }

                // Supporting agents active
                agentsRef.current[3].labelExtra = 'easing spring';
                agentsRef.current[5].labelExtra = 'lighting lasers';
                agentsRef.current[10].labelExtra = 'auditing pass';
            }

            // SIMULTANEOUS HERO DELIVERY MOMENT (at t >= 1.4s)
            if (t >= 1.4 && !heroDelivered.name) {
                // Fire ripples
                if (nameH) addRipple(nameH.x, nameH.y, '#22C55E');
                if (roleH) addRipple(roleH.x, roleH.y, '#06B6D4');
                if (pitchH) addRipple(pitchH.x, pitchH.y, '#94A3B8');
                if (ctaH) addRipple(ctaH.x, ctaH.y, '#84CC16');
                if (locH) addRipple(locH.x, locH.y, '#2563EB');
                if (photoH) addRipple(photoH.x, photoH.y, '#F97316');
                if (statsH) addRipple(statsH.x, statsH.y, '#3B82F6');
                if (navH) addRipple(navH.x, navH.y, '#F59E0B');
                if (bgH) addRipple(bgH.x, bgH.y, '#8B5CF6');

                setHeroDelivered({
                    nav: true,
                    name: true,
                    role: true,
                    pitch: true,
                    cta: true,
                    location: true,
                    photo: true,
                    stats: true,
                    bg: true
                });

                setBuildingStates(prev => ({ ...prev, hero: false }));

                agentsRef.current[1].labelExtra = 'typeset ✓';
                agentsRef.current[4].labelExtra = 'copy ✓';
                agentsRef.current[6].labelExtra = 'clean ✓';
                agentsRef.current[8].labelExtra = 'placed ✓';
                agentsRef.current[9].labelExtra = 'verified ✓';
                agentsRef.current[2].labelExtra = 'mounted ✓';
                agentsRef.current[7].labelExtra = 'compiled ✓';
                agentsRef.current[0].labelExtra = 'snapped ✓';
                agentsRef.current[11].labelExtra = 'stamped ✓';

                setTimeout(() => {
                    for (let i = 0; i < 12; i++) {
                        agentsRef.current[i].isCarrying = false;
                        agentsRef.current[i].labelExtra = '';
                    }
                }, 750);

                clearInterval(heroInterval);
            }
        }, 40);

        return () => clearInterval(heroInterval);
    }, [isBuilding, isBooted, speedMultiplier, heroDelivered.name, agentsActive]);

    // =========================================================================
    // 2. SCROLL-DRIVEN BUILDING ENGINE (PROJECTS, TRACK RECORD, SKILLS)
    // As the user scrolls through the page, agents build each section!
    // =========================================================================
    useEffect(() => {
        const handleScroll = () => {
            if (!agentsActive) return;

            const projectsEl = document.getElementById('projects');
            const trackEl = document.getElementById('track-record');
            const skillsEl = document.getElementById('skills');

            // -----------------------------------------------------------------
            // A. SCROLL INTO PROJECTS: Dev, Scout, Lint, Layout build Cards!
            // -----------------------------------------------------------------
            if (projectsEl && !projectsDelivered.card1 && !projectsBuildingRef.current) {
                const rect = projectsEl.getBoundingClientRect();
                if (rect.top <= window.innerHeight * 0.85) {
                    projectsBuildingRef.current = true;
                    setBuildingStates(prev => ({ ...prev, projects: true }));

                    let projTimer = 0;
                    const projInterval = setInterval(() => {
                        projTimer += 0.05 * speedMultiplier;

                        const card0H = getHandle('builder-project-card-0', 'br');
                        const card1H = getHandle('builder-project-card-1', 'br');
                        const card2H = getHandle('builder-project-card-2', 'br');
                        const card3H = getHandle('builder-project-card-3', 'br');

                        if (card0H) {
                            agentsRef.current[9].isCarrying = true;
                            agentsRef.current[9].targetX = card0H.x;
                            agentsRef.current[9].targetY = card0H.y;
                            agentsRef.current[9].labelExtra = 'placing Card 01 🚀';
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
                            agentsRef.current[6].labelExtra = 'typing Card 03 🛠️';
                        }
                        if (card3H) {
                            agentsRef.current[0].isCarrying = true;
                            agentsRef.current[0].targetX = card3H.x;
                            agentsRef.current[0].targetY = card3H.y;
                            agentsRef.current[0].labelExtra = 'grid Card 04 🌐';
                        }

                        if (projTimer >= 1.25) {
                            if (card0H) addRipple(card0H.x, card0H.y, '#A855F7');
                            if (card1H) addRipple(card1H.x, card1H.y, '#38BDF8');
                            if (card2H) addRipple(card2H.x, card2H.y, '#94A3B8');
                            if (card3H) addRipple(card3H.x, card3H.y, '#F59E0B');

                            setProjectsDelivered({
                                header: true,
                                card1: true,
                                card2: true,
                                card3: true,
                                card4: true
                            });

                            setBuildingStates(prev => ({ ...prev, projects: false }));

                            agentsRef.current[9].labelExtra = 'Card 01 ready ✓';
                            agentsRef.current[8].labelExtra = 'Card 02 ready ✓';
                            agentsRef.current[6].labelExtra = 'Card 03 ready ✓';
                            agentsRef.current[0].labelExtra = 'Card 04 ready ✓';

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

            // -----------------------------------------------------------------
            // B. SCROLL INTO TRACK RECORD: QA, Typeset & Review assemble!
            // -----------------------------------------------------------------
            if (trackEl && !trackDelivered.title && !trackBuildingRef.current) {
                const rect = trackEl.getBoundingClientRect();
                if (rect.top <= window.innerHeight * 0.85) {
                    trackBuildingRef.current = true;
                    setBuildingStates(prev => ({ ...prev, track: true }));

                    let trackTimer = 0;
                    const trackInterval = setInterval(() => {
                        trackTimer += 0.05 * speedMultiplier;

                        const titleH = getHandle('builder-track-title', 'br');
                        const statH = getHandle('builder-track-stat', 'br');
                        const timelineH = getHandle('builder-track-timeline', 'tr');

                        if (titleH) {
                            agentsRef.current[1].isCarrying = true;
                            agentsRef.current[1].targetX = titleH.x;
                            agentsRef.current[1].targetY = titleH.y;
                            agentsRef.current[1].labelExtra = 'typesetting ✍️';
                        }
                        if (statH) {
                            agentsRef.current[9].isCarrying = true;
                            agentsRef.current[9].targetX = statH.x;
                            agentsRef.current[9].targetY = statH.y;
                            agentsRef.current[9].labelExtra = 'typing 40 tests 🧪';
                        }
                        if (timelineH) {
                            agentsRef.current[10].isCarrying = true;
                            agentsRef.current[10].targetX = timelineH.x;
                            agentsRef.current[10].targetY = timelineH.y;
                            agentsRef.current[10].labelExtra = 'auditing timeline 📋';
                        }

                        if (trackTimer >= 1.15) {
                            if (titleH) addRipple(titleH.x, titleH.y, '#22C55E');
                            if (statH) addRipple(statH.x, statH.y, '#2563EB');
                            if (timelineH) addRipple(timelineH.x, timelineH.y, '#F43F5E');

                            setTrackDelivered({
                                title: true,
                                stat40: true,
                                timeline: true
                            });

                            setBuildingStates(prev => ({ ...prev, track: false }));

                            agentsRef.current[1].labelExtra = 'typeset ✓';
                            agentsRef.current[9].labelExtra = 'tested ✓';
                            agentsRef.current[10].labelExtra = 'audited ✓';

                            setTimeout(() => {
                                agentsRef.current[1].isCarrying = false;
                                agentsRef.current[9].isCarrying = false;
                                agentsRef.current[10].isCarrying = false;
                            }, 700);

                            clearInterval(trackInterval);
                        }
                    }, 40);
                }
            }

            // -----------------------------------------------------------------
            // C. SCROLL INTO SKILLS & MANIFESTO: Lint, Copy & Palette build!
            // -----------------------------------------------------------------
            if (skillsEl && !skillsDelivered.skills && !skillsBuildingRef.current) {
                const rect = skillsEl.getBoundingClientRect();
                if (rect.top <= window.innerHeight * 0.85) {
                    skillsBuildingRef.current = true;
                    setBuildingStates(prev => ({ ...prev, skills: true }));

                    let skillsTimer = 0;
                    const skillsInterval = setInterval(() => {
                        skillsTimer += 0.05 * speedMultiplier;

                        const eduH = getHandle('builder-skills-edu', 'br');
                        const princH = getHandle('builder-skills-principles', 'br');
                        const manH = getHandle('builder-skills-manifesto', 'tr');

                        if (eduH) {
                            agentsRef.current[6].isCarrying = true;
                            agentsRef.current[6].targetX = eduH.x;
                            agentsRef.current[6].targetY = eduH.y;
                            agentsRef.current[6].labelExtra = 'typing skills 💻';
                        }
                        if (princH) {
                            agentsRef.current[4].isCarrying = true;
                            agentsRef.current[4].targetX = princH.x;
                            agentsRef.current[4].targetY = princH.y;
                            agentsRef.current[4].labelExtra = 'authoring principles 📜';
                        }
                        if (manH) {
                            agentsRef.current[5].isCarrying = true;
                            agentsRef.current[5].targetX = manH.x;
                            agentsRef.current[5].targetY = manH.y;
                            agentsRef.current[5].labelExtra = 'coloring manifesto 🎨';
                        }

                        if (skillsTimer >= 1.15) {
                            if (eduH) addRipple(eduH.x, eduH.y, '#94A3B8');
                            if (princH) addRipple(princH.x, princH.y, '#06B6D4');
                            if (manH) addRipple(manH.x, manH.y, '#EAB308');

                            setSkillsDelivered({
                                skills: true,
                                principles: true,
                                manifesto: true
                            });

                            setBuildingStates(prev => ({ ...prev, skills: false }));

                            agentsRef.current[6].labelExtra = 'skills placed ✓';
                            agentsRef.current[4].labelExtra = 'principles placed ✓';
                            agentsRef.current[5].labelExtra = 'manifesto live ✓';

                            setTimeout(() => {
                                agentsRef.current[6].isCarrying = false;
                                agentsRef.current[4].isCarrying = false;
                                agentsRef.current[5].isCarrying = false;
                            }, 700);

                            clearInterval(skillsInterval);
                        }
                    }, 40);
                }
            }

            // -----------------------------------------------------------------
            // D. SCROLL INTO ABOUT: Motion, Palette & Copy assemble!
            // -----------------------------------------------------------------
            const aboutEl = document.getElementById('about');
            if (aboutEl && !aboutDelivered?.title && !aboutBuildingRef.current) {
                const rect = aboutEl.getBoundingClientRect();
                if (rect.top <= window.innerHeight * 0.85) {
                    aboutBuildingRef.current = true;
                    setBuildingStates(prev => ({ ...prev, about: true }));

                    let aboutTimer = 0;
                    const aboutInterval = setInterval(() => {
                        aboutTimer += 0.05 * speedMultiplier;

                        const titleH = getHandle('builder-about-title', 'br');
                        const photo2H = getHandle('builder-about-photo', 'br');
                        const bioH = getHandle('builder-about-bio', 'tr');

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
                            agentsRef.current[5].labelExtra = 'lighting photo 🎨';
                        }
                        if (bioH) {
                            agentsRef.current[4].isCarrying = true;
                            agentsRef.current[4].targetX = bioH.x;
                            agentsRef.current[4].targetY = bioH.y;
                            agentsRef.current[4].labelExtra = 'authoring bio 📄';
                        }

                        if (aboutTimer >= 1.15) {
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
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, [projectsDelivered.card1, trackDelivered.title, skillsDelivered.skills, aboutDelivered?.title, agentsActive, speedMultiplier]);

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

                            if (Math.random() < 0.1) {
                                addRipple(agent.targetX, agent.targetY, agent.color);
                            }
                        }
                    }

                    // Natural micro-jitter
                    const jitterX = Math.sin(now * agent.jitterFreqX + agent.seed) * 1.5;
                    const jitterY = Math.cos(now * agent.jitterFreqY + agent.seed) * 1.5;

                    const effectiveTargetX = agent.targetX + jitterX;
                    const effectiveTargetY = agent.targetY + jitterY;

                    const dx = effectiveTargetX - agent.x;
                    const dy = effectiveTargetY - agent.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    // Spring lock
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
                                const fullLabel = `${agent.name}${agent.labelExtra ? ` • ${agent.labelExtra}` : ''}`;
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

                {/* 12 Live Cursors matching Video (sharp arrow + cute robot icon badge) */}
                {AGENT_CONFIGS.map(agent => (
                    <div key={agent.id} className="agent-cursor-wrapper">
                        {/* Custom Pointer Arrow SVG */}
                        <svg className="agent-pointer-svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path
                                d="M3 3L10.07 19.97L12.58 12.58L19.97 10.07L3 3Z"
                                fill="#FFFFFF"
                                stroke="#000000"
                                strokeWidth="1.8"
                                strokeLinejoin="round"
                            />
                        </svg>

                        {/* Agent Role Badge with Robot Face Icon */}
                        <div
                            className="agent-badge-tag"
                            style={{
                                backgroundColor: agent.color,
                                color: agent.textColor,
                                boxShadow: `0 3px 10px rgba(0, 0, 0, 0.5), 0 0 10px ${agent.color}55`
                            }}
                        >
                            {/* Cute Robot Face Icon matching Video */}
                            <span className="agent-bot-icon">
                                <svg width="10" height="10" viewBox="0 0 16 16" fill="currentColor">
                                    <path d="M4 4h8a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
                                    <circle cx="5.5" cy="8.5" r="1.3" fill="#000000" />
                                    <circle cx="10.5" cy="8.5" r="1.3" fill="#000000" />
                                    <line x1="8" y1="1" x2="8" y2="4" stroke="currentColor" strokeWidth="1.5" />
                                    <circle cx="8" cy="1" r="1" fill="currentColor" />
                                </svg>
                            </span>
                            <span className="agent-badge-name">
                                {agent.name}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Bottom Floating Control Dock (Exact replica of video dock) */}
            <div className="agents-dock-container">
                <div className="agents-dock-pill">
                    {/* 12 AGENTS LIVE with pulsing green LED */}
                    <div className="dock-status-group">
                        <span className={`dock-pulse-dot ${agentsActive ? 'online' : 'offline'}`} />
                        <span className="dock-agents-count">
                            {agentsActive ? '12 AGENTS LIVE' : 'AGENTS PAUSED'}
                        </span>
                    </div>

                    <div className="dock-divider" />

                    {/* Pause / Resume Button */}
                    <button
                        className={`dock-action-btn ${agentsActive ? 'active' : ''}`}
                        onClick={() => setAgentsActive(!agentsActive)}
                        title={agentsActive ? 'Pause Agents' : 'Resume Agents'}
                    >
                        {agentsActive ? (
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                <rect x="6" y="4" width="4" height="16" rx="1" />
                                <rect x="14" y="4" width="4" height="16" rx="1" />
                            </svg>
                        ) : (
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                <polygon points="5 3 19 12 5 21 5 3" />
                            </svg>
                        )}
                        <span className="dock-btn-label">{agentsActive ? 'PAUSE' : 'RESUME'}</span>
                    </button>

                    {/* AGENTS ON / Power State */}
                    <div className="dock-power-status">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M12 2v10M18.4 6.6a9 9 0 1 1-12.8 0" />
                        </svg>
                        <span>{agentsActive ? 'AGENTS ON' : 'AGENTS OFF'}</span>
                    </div>

                    <div className="dock-divider" />

                    {/* Replay Build Button */}
                    <button
                        className="dock-action-btn"
                        onClick={rebuildAll}
                        title="Replay agents delivering each element onto the page"
                    >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                            <path d="M21 3v5h-5" />
                            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                            <path d="M8 16H3v5" />
                        </svg>
                        <span className="dock-btn-label">REPLAY BUILD</span>
                    </button>

                    {/* Speed Multiplier Toggle */}
                    <button
                        className="dock-speed-btn"
                        onClick={() => setSpeedMultiplier(prev => prev === 1 ? 1.5 : prev === 1.5 ? 2 : 1)}
                        title="Adjust Agent Movement Speed"
                    >
                        {speedMultiplier}x
                    </button>

                    {/* Red STOP / START Button (Matches video red pill) */}
                    <button
                        className={`dock-stop-pill-btn ${!agentsActive ? 'stopped' : ''}`}
                        onClick={() => setAgentsActive(!agentsActive)}
                    >
                        <span className="dock-stop-icon" />
                        <span>{agentsActive ? 'STOP' : 'START'}</span>
                    </button>
                </div>
            </div>
        </>
    );
}
