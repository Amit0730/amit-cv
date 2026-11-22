import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useBuildEngine } from '../context/BuildEngineContext';
import { AGENT_ROSTER } from '../engine/agentTasks';
import './MultiAgentEngine.css';

export default function MultiAgentEngine() {
    const {
        isBooted,
        isBuilding,
        isPaused, setIsPaused,
        agentsActive, setAgentsActive,
        speedMultiplier, setSpeedMultiplier,
        rebuildAll,

        tasks,
        activeSections,
        activateSection,
        updateTaskStatus,
        completedTaskCount,
        totalTaskCount,

        setInspection,
        setElementTypedText,
        setElementDimension,
        setSpacingGuide,
        setReviewed,
        setTesting,
        setActiveStyle,
        setActiveMedia,
        setMotionTest,
        setComponentStage,
        setNavVerifiedLink,

        preloadedAssets,
        presentationFallbacks,
        setPresentationFallback,
        catchUpSection
    } = useBuildEngine();

    const [ripples, setRipples] = useState([]);
    const containerRef = useRef(null);
    const animFrameRef = useRef(null);

    // Initial state for each of the 12 agents from AGENT_ROSTER
    // Issue F Fix: Each agent has an assigned home station to prevent chaotic wandering
    const agentsRef = useRef(
        AGENT_ROSTER.map((cfg, index) => {
            const w = typeof window !== 'undefined' ? window.innerWidth : 1200;
            const startX = cfg.zone.minXRel * w + ((index % 6) / 5) * (cfg.zone.maxXRel - cfg.zone.minXRel) * w;
            const startY = cfg.zone.minY + ((index % 3) / 2) * (cfg.zone.maxY - cfg.zone.minY);

            return {
                ...cfg,
                homeX: startX,
                homeY: startY,
                homePhase: index * 0.7,
                x: startX,
                y: startY,
                targetX: startX,
                targetY: startY,
                vx: 0,
                vy: 0,
                angle: 0,
                currentTaskId: null,
                state: 'idle', // 'idle' | 'moving' | 'selecting' | 'executing' | 'verifying'
                stateTimer: 0,
                taskTime: 0,
                labelExtra: '',
                speedMod: 0.95 + (index % 4) * 0.08,
                isCarrying: false
            };
        })
    );

    // Generate click / delivery ripple at coordinate
    const addRipple = useCallback((x, y, color = '#38BDF8') => {
        const id = Date.now() + Math.random();
        setRipples(prev => [...prev.slice(-12), { id, x, y, color }]);
        setTimeout(() => {
            setRipples(prev => prev.filter(r => r.id !== id));
        }, 850);
    }, []);

    // Get live handle coordinate for any element by ID
    const getHandle = useCallback((elementId, corner = 'br') => {
        if (typeof document === 'undefined') return null;
        const el = document.getElementById(elementId);
        if (!el) return null;
        const rect = el.getBoundingClientRect();
        if (rect.width === 0 && rect.height === 0) return null;

        if (corner === 'br') return { x: rect.right, y: rect.bottom, width: rect.width, height: rect.height };
        if (corner === 'tr') return { x: rect.right, y: rect.top, width: rect.width, height: rect.height };
        if (corner === 'bl') return { x: rect.left, y: rect.bottom, width: rect.width, height: rect.height };
        if (corner === 'tl') return { x: rect.left, y: rect.top, width: rect.width, height: rect.height };
        if (corner === 'tc') return { x: rect.left + rect.width / 2, y: rect.top, width: rect.width, height: rect.height };
        if (corner === 'center') return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2, width: rect.width, height: rect.height };
        return { x: rect.right, y: rect.bottom, width: rect.width, height: rect.height };
    }, []);

    // =========================================================================
    // 1. SCROLL-AWARE SECTION UNLOCKING
    // =========================================================================
    useEffect(() => {
        const handleScroll = () => {
            if (!agentsActive) return;

            const trackEl = document.getElementById('track-record');
            const projectsEl = document.getElementById('projects');
            const skillsEl = document.getElementById('skills');
            const aboutEl = document.getElementById('about');
            const footerEl = document.getElementById('contact');

            const vh = window.innerHeight;

            if (trackEl && trackEl.getBoundingClientRect().top <= vh * 0.90) {
                activateSection('track');
            }
            if (projectsEl && projectsEl.getBoundingClientRect().top <= vh * 0.88) {
                activateSection('projects');
                if (catchUpSection) catchUpSection('hero');
            }
            if (skillsEl && skillsEl.getBoundingClientRect().top <= vh * 0.88) {
                activateSection('skills');
                if (catchUpSection) catchUpSection('track');
            }
            if (aboutEl && aboutEl.getBoundingClientRect().top <= vh * 0.88) {
                activateSection('about');
                if (catchUpSection) catchUpSection('projects');
            }
            if (footerEl && footerEl.getBoundingClientRect().top <= vh * 0.92) {
                activateSection('footer');
                if (catchUpSection) catchUpSection('skills');
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, [activateSection, agentsActive, catchUpSection]);

    // =========================================================================
    // 2. ORCHESTRATION ENGINE LOOP (60FPS Task Dispatcher & Physics)
    // =========================================================================
    useEffect(() => {
        let lastTime = performance.now();

        const updateSimulation = (currentTime) => {
            const dt = Math.min((currentTime - lastTime) / 1000, 0.08);
            lastTime = currentTime;
            const w = window.innerWidth;

            if (agentsActive && isBuilding && isBooted && !isPaused) {
                // Completed task map for fast dependency check
                const completedTaskMap = new Set();
                tasks.forEach(t => {
                    if (t.status === 'completed') completedTaskMap.add(t.id);
                });

                // Find ready pending tasks
                const readyTasks = tasks.filter(task => {
                    if (task.status !== 'pending') return false;
                    if (!activeSections[task.section]) return false;
                    // Phase 9 Fix: Never deadlock on failed tasks; allow downstream tasks to run
                    return task.dependencies.every(depId => {
                        const dep = tasks.find(t => t.id === depId);
                        return dep && (dep.status === 'completed' || dep.status === 'failed');
                    });
                });

                // -------------------------------------------------------------
                // A. Task Assignment to Matching Idle Agents
                // Section 7 Fix: Concurrency protection (One active agent per target)
                // -------------------------------------------------------------
                readyTasks.forEach(task => {
                    const existingAgent = agentsRef.current.find(a => a.currentTaskId === task.id);
                    if (existingAgent) return;

                    // Concurrency check: Ensure no other agent is already actively manipulating this target
                    const targetBusy = agentsRef.current.some(a => {
                        if (!a.currentTaskId) return false;
                        const activeTask = tasks.find(t => t.id === a.currentTaskId);
                        return activeTask && activeTask.targetId === task.targetId;
                    });
                    if (targetBusy) return;

                    const agent = agentsRef.current.find(a => a.id === task.agentId && !a.currentTaskId);
                    if (agent) {
                        agent.currentTaskId = task.id;
                        agent.state = 'moving';
                        agent.stateTimer = 0;
                        agent.taskTime = 0;
                        agent.isCarrying = true;
                        agent.labelExtra = `-> ${task.label || task.action}`;

                        updateTaskStatus(task.id, 'assigned');
                    }
                });

                // -------------------------------------------------------------
                // B. Deterministic State Machine & Action Execution
                // -------------------------------------------------------------
                agentsRef.current.forEach((agent) => {
                    if (agent.currentTaskId) {
                        const currentTask = tasks.find(t => t.id === agent.currentTaskId);
                        if (!currentTask) {
                            agent.currentTaskId = null;
                            agent.isCarrying = false;
                            agent.state = 'idle';
                            return;
                        }

                        // Target handle coordinates
                        let handle = getHandle(currentTask.targetId, currentTask.corner || 'br');

                        if (handle) {
                            agent.targetX = handle.x;
                            agent.targetY = handle.y;

                            const dx = agent.targetX - agent.x;
                            const dy = agent.targetY - agent.y;
                            const dist = Math.sqrt(dx * dx + dy * dy);

                            // --- STATE 1: MOVING TO TARGET ---
                            // Problem 1 Fix: Task progress does NOT advance while moving.
                            // Only advances after cursor reaches handle (threshold <= 18px).
                            if (agent.state === 'moving') {
                                if (dist <= 18) {
                                    agent.state = 'selecting';
                                    agent.stateTimer = 0;
                                    agent.labelExtra = 'selecting...';

                                    // Latch Figma selection outline (Issue H Fix: only active element has handles)
                                    setInspection(currentTask.targetId, {
                                        agentName: agent.name,
                                        action: currentTask.action,
                                        color: agent.color,
                                        label: currentTask.label
                                    });
                                    updateTaskStatus(currentTask.id, 'selecting');
                                }
                            }
                            // --- STATE 2: SELECTING ELEMENT (Brief inspection pause) ---
                            else if (agent.state === 'selecting') {
                                agent.stateTimer += dt * speedMultiplier;
                                if (agent.stateTimer >= 0.2) {
                                    agent.state = 'executing';
                                    agent.stateTimer = 0;
                                    agent.taskTime = 0;
                                    agent.labelExtra = currentTask.label;
                                    updateTaskStatus(currentTask.id, 'executing');
                                }
                            }
                            // --- STATE 3: EXECUTING CONCRETE ACTION ---
                            // Problem 2 Fix: Full implementation of all 12 agent actions.
                            else if (agent.state === 'executing') {
                                agent.taskTime += dt * speedMultiplier;
                                const duration = Math.max(currentTask.duration || 1.2, 0.4);
                                const progress = Math.min(agent.taskTime / duration, 1);

                                // 1 & 2. Typography & Copy: Progressive text typing
                                if (currentTask.action === 'type' || currentTask.action === 'copy') {
                                    if (currentTask.text) {
                                        const charLen = Math.max(1, Math.floor(progress * currentTask.text.length));
                                        setElementTypedText(currentTask.targetId, currentTask.text.slice(0, charLen));
                                    }
                                    // Issue E Fix: Staged reveal for complex timeline content
                                    if (currentTask.targetId === 'builder-track-timeline') {
                                        const stage = Math.min(Math.floor(progress * 5) + 1, 5);
                                        setComponentStage('builder-track-timeline', stage);
                                        agent.labelExtra = `milestone ${stage}/5`;
                                    }
                                    if (currentTask.targetId === 'builder-skills-principles') {
                                        const stage = Math.min(Math.floor(progress * 4) + 1, 4);
                                        setComponentStage('builder-skills-principles', stage);
                                        agent.labelExtra = `principle ${stage}/4`;
                                    }
                                }
                                // 3. Resize: Drag handle with both width and height
                                // Issue G Fix: Cursor dynamically tracks live handle during drag
                                else if (currentTask.action === 'resize') {
                                    if (currentTask.startDims && currentTask.targetDims) {
                                        const curW = Math.round(currentTask.startDims.w + (currentTask.targetDims.w - currentTask.startDims.w) * progress);
                                        const curH = Math.round(currentTask.startDims.h + (currentTask.targetDims.h - currentTask.startDims.h) * progress);
                                        setElementDimension(currentTask.targetId, { w: curW, h: curH });

                                        // Update handle location so cursor moves with dragging handle
                                        const liveHandle = getHandle(currentTask.targetId, currentTask.corner || 'br');
                                        if (liveHandle) {
                                            agent.targetX = liveHandle.x;
                                            agent.targetY = liveHandle.y;
                                        }
                                    }
                                }
                                // 4. Spacing: Temporary Figma measurement guide
                                else if (currentTask.action === 'spacing') {
                                    setSpacingGuide(currentTask.targetId, currentTask.spacingLabel || 'gap: 24px');
                                }
                                // 5. Interaction: Simulated button hover / click testing
                                else if (currentTask.action === 'interact') {
                                    setTesting(currentTask.targetId, progress < 0.88);
                                }
                                // 6. Style: Glow, shadow and theme coloring
                                else if (currentTask.action === 'style') {
                                    setActiveStyle(currentTask.targetId, { progress, active: true });
                                }
                                // 7. Media: Image mounting & laser burst
                                else if (currentTask.action === 'media') {
                                    setActiveMedia(currentTask.targetId, { progress, mounted: true });
                                }
                                // 8. Motion: Spring physics displacement test
                                else if (currentTask.action === 'motion') {
                                    const motionY = Math.sin(progress * Math.PI * 2) * -6;
                                    setMotionTest(currentTask.targetId, motionY);
                                }
                                // 9. Navigation: Link verification & snapping (Issue B Fix: Real DOM Link Inspection)
                                else if (currentTask.action === 'navigation') {
                                    const navEl = document.getElementById(currentTask.targetId);
                                    if (navEl) {
                                        const links = navEl.querySelectorAll('a[href]');
                                        if (links.length > 0) {
                                            const idx = Math.min(Math.floor(progress * links.length), links.length - 1);
                                            const link = links[idx];
                                            const href = link?.getAttribute('href');
                                            if (href) {
                                                agent.labelExtra = `checking ${href}`;
                                                setNavVerifiedLink(href);
                                                const linkRect = link.getBoundingClientRect();
                                                agent.targetX = linkRect.left + linkRect.width / 2;
                                                agent.targetY = linkRect.bottom;
                                            }
                                        }
                                    }
                                }
                                // 10. Component / Layout: Card & structure assembly (Issue A Fix: Staged Component Assembly)
                                else if (currentTask.action === 'component' || currentTask.action === 'layout') {
                                    const stage = progress < 0.25 ? 1 : progress < 0.50 ? 2 : progress < 0.75 ? 3 : 4;
                                    setComponentStage(currentTask.targetId, stage);
                                    agent.labelExtra = `${currentTask.label} [stage ${stage}/4]`;
                                }
                                // 11. Review: Spec audit pass
                                else if (currentTask.action === 'review') {
                                    agent.labelExtra = `auditing specs...`;
                                }

                                // Transition to Verifying when progress reaches 100%
                                if (progress >= 1) {
                                    agent.state = 'verifying';
                                    agent.stateTimer = 0;
                                    agent.labelExtra = 'verifying...';
                                    updateTaskStatus(currentTask.id, 'verifying');
                                }
                            }
                            // --- STATE 4: VERIFYING (Issue C Fix: Action-Specific DOM & Asset Validation) ---
                            else if (agent.state === 'verifying') {
                                agent.stateTimer += dt * speedMultiplier;

                                // Action-specific validation
                                const el = document.getElementById(currentTask.targetId);
                                const rect = el ? el.getBoundingClientRect() : null;
                                const hasGeometry = Boolean(rect && (rect.width > 0 || rect.height > 0));
                                const depsDone = currentTask.dependencies.every(d => {
                                    const dep = tasks.find(t => t.id === d);
                                    return dep && (dep.status === 'completed' || dep.status === 'failed');
                                });

                                let isVerified = false;
                                if (el && hasGeometry && depsDone) {
                                    if (currentTask.action === 'type' || currentTask.action === 'copy') {
                                        const text = (el.innerText || el.textContent || '').trim();
                                        const expected = (currentTask.text || '').slice(0, 8).trim();
                                        isVerified = !expected || text.includes(expected);
                                    } else if (currentTask.action === 'media') {
                                        // Phase 1 Fix: Verify actual image render or preloaded asset
                                        const img = el.querySelector('img');
                                        const isImgReady = Boolean(img && (img.complete && img.naturalWidth > 0));
                                        const isPreloaded = Boolean(preloadedAssets?.[currentTask.targetId]?.ready);
                                        isVerified = isImgReady || isPreloaded;
                                    } else if (currentTask.action === 'navigation') {
                                        const links = el.querySelectorAll('a[href]');
                                        isVerified = links.length > 0;
                                    } else if (currentTask.action === 'component' || currentTask.action === 'layout') {
                                        isVerified = el.children.length > 0 || (el.innerText || '').trim().length > 0;
                                    } else if (currentTask.action === 'review') {
                                        const otherTasks = tasks.filter(t => t.section === currentTask.section && t.id !== currentTask.id);
                                        isVerified = otherTasks.every(t => t.status === 'completed' || t.status === 'failed');
                                    } else {
                                        isVerified = true;
                                    }
                                }

                                if (agent.stateTimer >= 0.22) {
                                    if (isVerified) {
                                        addRipple(agent.x, agent.y, agent.color);

                                        // Finalize element state
                                        setInspection(currentTask.targetId, null);
                                        if (currentTask.text) {
                                            setElementTypedText(currentTask.targetId, currentTask.text);
                                        }
                                        // Finalize component stage to complete
                                        if (currentTask.action === 'component' || currentTask.action === 'layout') {
                                            setComponentStage(currentTask.targetId, 4);
                                        }
                                        if (currentTask.targetId === 'builder-track-timeline') {
                                            setComponentStage('builder-track-timeline', 5);
                                        }
                                        if (currentTask.targetId === 'builder-skills-principles') {
                                            setComponentStage('builder-skills-principles', 4);
                                        }
                                        // Release temporary inline dimensions so responsive layouts adapt
                                        if (currentTask.action === 'resize') {
                                            setElementDimension(currentTask.targetId, null);
                                        }
                                        if (currentTask.action === 'spacing') {
                                            setTimeout(() => setSpacingGuide(currentTask.targetId, null), 900);
                                        }
                                        if (currentTask.action === 'interact') {
                                            setTesting(currentTask.targetId, false);
                                        }
                                        if (currentTask.action === 'review') {
                                            setReviewed(currentTask.targetId, true);
                                        }
                                        if (currentTask.action === 'motion') {
                                            setMotionTest(currentTask.targetId, 0);
                                        }
                                        if (currentTask.action === 'style') {
                                            setActiveStyle(currentTask.targetId, { active: true, progress: 1 });
                                        }
                                        if (currentTask.action === 'media') {
                                            setActiveMedia(currentTask.targetId, { mounted: true, progress: 1 });
                                        }

                                        updateTaskStatus(currentTask.id, 'completed');

                                        agent.labelExtra = `${currentTask.action} ✓`;
                                        agent.currentTaskId = null;
                                        agent.isCarrying = false;
                                        agent.state = 'idle';

                                        setTimeout(() => {
                                            if (!agent.currentTaskId) {
                                                agent.labelExtra = '';
                                            }
                                        }, 1100);
                                    } else if (agent.stateTimer >= 0.65) {
                                        // Graceful fallback: Never lock down the website if an asset verification misses
                                        agent.labelExtra = 'fallback ✓';
                                        updateTaskStatus(currentTask.id, 'failed');
                                        if (setPresentationFallback) {
                                            setPresentationFallback(currentTask.targetId, true);
                                        }
                                        agent.currentTaskId = null;
                                        agent.isCarrying = false;
                                        agent.state = 'idle';
                                    }
                                }
                            }
                        }
                    } else {
                        // Issue F Fix: Calm standby station micro-floating (No chaotic aimless wandering)
                        const t = currentTime * 0.0018 + agent.homePhase;
                        agent.targetX = agent.homeX + Math.sin(t) * 4;
                        agent.targetY = agent.homeY + Math.cos(t * 1.3) * 3;
                    }

                    // Physics motion calculation (Smooth easing)
                    const dx = agent.targetX - agent.x;
                    const dy = agent.targetY - agent.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    const accel = agent.isCarrying ? 12.0 : 4.0;
                    const maxSpeed = agent.isCarrying ? 820 : 280;
                    const baseSpeed = Math.min(dist * 5.2, maxSpeed) * agent.speedMod * speedMultiplier;

                    if (dist > 1) {
                        agent.vx += ((dx / (dist + 0.1)) * baseSpeed - agent.vx) * accel * dt;
                        agent.vy += ((dy / (dist + 0.1)) * baseSpeed - agent.vy) * accel * dt;
                        agent.x += agent.vx * dt;
                        agent.y += agent.vy * dt;
                        agent.angle = Math.max(-14, Math.min(14, agent.vx / 35));
                    }
                });

                // Update DOM transforms directly for smooth 60fps rendering
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
    }, [
        agentsActive, isBuilding, isBooted, isPaused, speedMultiplier,
        tasks, activeSections, updateTaskStatus, getHandle, addRipple,
        setInspection, setElementTypedText, setElementDimension,
        setSpacingGuide, setReviewed, setTesting,
        setActiveStyle, setActiveMedia, setMotionTest,
        setComponentStage, setNavVerifiedLink
    ]);

    return (
        <>
            {/* Multi-Agent Overlay Canvas (Visible only when agents are active) */}
            {agentsActive && (
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

                    {/* 12 Live Cursor Elements (Pointer arrow + robot badge) */}
                    {AGENT_ROSTER.map(agent => (
                        <div key={agent.id} className="agent-cursor-wrapper">
                            <svg className="agent-pointer-svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <path
                                    d="M3 3L10.07 19.97L12.58 12.58L19.97 10.07L3 3Z"
                                    fill="#FFFFFF"
                                    stroke="#000000"
                                    strokeWidth="1.8"
                                    strokeLinejoin="round"
                                />
                            </svg>

                            <div
                                className="agent-badge-tag"
                                style={{
                                    backgroundColor: agent.color,
                                    color: agent.textColor,
                                    boxShadow: `0 3px 10px rgba(0, 0, 0, 0.5), 0 0 10px ${agent.color}55`
                                }}
                            >
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
            )}

            {/* Bottom Floating Control Dock */}
            <div className="agents-dock-container">
                <div className="agents-dock-pill">
                    {/* Live Agent LED & Status */}
                    <div className="dock-status-group">
                        <span className={`dock-pulse-dot ${agentsActive && !isPaused ? 'online' : 'offline'}`} />
                        <span className="dock-agents-count">
                            {!agentsActive ? 'AGENTS OFF' : isPaused ? 'AGENTS PAUSED' : '12 AGENTS LIVE'}
                        </span>
                    </div>

                    <div className="dock-divider" />

                    {/* Real Task Progress Counter */}
                    <div className="dock-progress-group" title="Verified Construction Tasks Completed">
                        <span className="dock-progress-tag">
                            {completedTaskCount} / {totalTaskCount} TASKS
                        </span>
                    </div>

                    <div className="dock-divider" />

                    {/* Pause / Resume Button */}
                    <button
                        className={`dock-action-btn ${isPaused ? 'active' : ''}`}
                        onClick={() => setIsPaused(!isPaused)}
                        title={isPaused ? 'Resume Agent Construction' : 'Pause Agent Construction'}
                    >
                        {isPaused ? (
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                <polygon points="5 3 19 12 5 21 5 3" />
                            </svg>
                        ) : (
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                <rect x="6" y="4" width="4" height="16" rx="1" />
                                <rect x="14" y="4" width="4" height="16" rx="1" />
                            </svg>
                        )}
                        <span className="dock-btn-label">{isPaused ? 'RESUME' : 'PAUSE'}</span>
                    </button>

                    {/* AGENTS ON / OFF Power Button */}
                    <button
                        className="dock-action-btn"
                        onClick={() => setAgentsActive(!agentsActive)}
                        title={agentsActive ? 'Disable Agent Cursors (Show Full Clean Site)' : 'Enable Agent Cursors'}
                    >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M12 2v10M18.4 6.6a9 9 0 1 1-12.8 0" />
                        </svg>
                        <span className="dock-btn-label">{agentsActive ? 'AGENTS ON' : 'AGENTS OFF'}</span>
                    </button>

                    <div className="dock-divider" />

                    {/* Replay Build Button */}
                    <button
                        className="dock-action-btn"
                        onClick={rebuildAll}
                        title="Replay agents constructing each element from scratch"
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
                        title="Adjust Construction Speed (1x, 1.5x, 2x)"
                    >
                        {speedMultiplier}x
                    </button>

                    {/* Red STOP / START Button */}
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
