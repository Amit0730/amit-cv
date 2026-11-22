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
        setTesting
    } = useBuildEngine();

    const [ripples, setRipples] = useState([]);
    const containerRef = useRef(null);
    const animFrameRef = useRef(null);

    // Initial state for each of the 12 agents from AGENT_ROSTER
    const agentsRef = useRef(
        AGENT_ROSTER.map((cfg, index) => {
            const w = typeof window !== 'undefined' ? window.innerWidth : 1200;
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
                currentTaskId: null,
                taskTime: 0,
                labelExtra: '',
                wanderTimer: 0.2 + index * 0.2,
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
            }
            if (skillsEl && skillsEl.getBoundingClientRect().top <= vh * 0.88) {
                activateSection('skills');
            }
            if (aboutEl && aboutEl.getBoundingClientRect().top <= vh * 0.88) {
                activateSection('about');
            }
            if (footerEl && footerEl.getBoundingClientRect().top <= vh * 0.92) {
                activateSection('footer');
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, [activateSection, agentsActive]);

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
                    return task.dependencies.every(depId => completedTaskMap.has(depId));
                });

                // -------------------------------------------------------------
                // A. Task Assignment to Matching Idle Agents
                // -------------------------------------------------------------
                readyTasks.forEach(task => {
                    // Check if an agent is already handling this task
                    const existingAgent = agentsRef.current.find(a => a.currentTaskId === task.id);
                    if (existingAgent) return;

                    // Find designated agent
                    const agent = agentsRef.current.find(a => a.id === task.agentId && !a.currentTaskId);
                    if (agent) {
                        agent.currentTaskId = task.id;
                        agent.taskTime = 0;
                        agent.isCarrying = true;
                        agent.labelExtra = task.label;

                        updateTaskStatus(task.id, 'running');

                        // Set live selection outline on target element
                        setInspection(task.targetId, {
                            agentName: agent.name,
                            action: task.action,
                            color: agent.color,
                            label: task.label
                        });
                    }
                });

                // -------------------------------------------------------------
                // B. Agent Physics, Movement & Progressive Task Execution
                // -------------------------------------------------------------
                agentsRef.current.forEach((agent) => {
                    if (agent.currentTaskId) {
                        const currentTask = tasks.find(t => t.id === agent.currentTaskId);
                        if (!currentTask) {
                            agent.currentTaskId = null;
                            agent.isCarrying = false;
                            return;
                        }

                        // Target handle coordinates
                        const handle = getHandle(currentTask.targetId, currentTask.corner || 'br');

                        if (handle) {
                            agent.targetX = handle.x;
                            agent.targetY = handle.y;

                            const dx = agent.targetX - agent.x;
                            const dy = agent.targetY - agent.y;
                            const dist = Math.sqrt(dx * dx + dy * dy);

                            // Progress through task
                            agent.taskTime += dt * speedMultiplier;
                            const duration = Math.max(currentTask.duration || 1.2, 0.4);
                            const progress = Math.min(agent.taskTime / duration, 1);

                            // Execute real progressive changes on element
                            if (currentTask.action === 'type' || currentTask.action === 'copy') {
                                if (currentTask.text) {
                                    const charLen = Math.floor(progress * currentTask.text.length);
                                    setElementTypedText(currentTask.targetId, currentTask.text.slice(0, charLen));
                                }
                            } else if (currentTask.action === 'resize') {
                                if (currentTask.startDims && currentTask.targetDims) {
                                    const curW = Math.round(currentTask.startDims.w + (currentTask.targetDims.w - currentTask.startDims.w) * progress);
                                    const curH = Math.round(currentTask.startDims.h + (currentTask.targetDims.h - currentTask.startDims.h) * progress);
                                    setElementDimension(currentTask.targetId, { w: curW, h: curH });
                                }
                            } else if (currentTask.action === 'spacing') {
                                setSpacingGuide(currentTask.targetId, currentTask.spacingLabel);
                            } else if (currentTask.action === 'interact') {
                                setTesting(currentTask.targetId, progress < 0.85);
                            } else if (currentTask.action === 'review') {
                                setReviewed(currentTask.targetId, true);
                            }

                            // TASK COMPLETION MOMENT
                            if (progress >= 1) {
                                addRipple(handle.x, handle.y, agent.color);

                                // Release inspection and finalize element state
                                setInspection(currentTask.targetId, null);
                                if (currentTask.text) {
                                    setElementTypedText(currentTask.targetId, currentTask.text);
                                }
                                if (currentTask.action === 'spacing') {
                                    setTimeout(() => setSpacingGuide(currentTask.targetId, null), 800);
                                }
                                if (currentTask.action === 'interact') {
                                    setTesting(currentTask.targetId, false);
                                }
                                if (currentTask.action === 'resize') {
                                    setElementDimension(currentTask.targetId, null);
                                }

                                updateTaskStatus(currentTask.id, 'completed');

                                agent.labelExtra = `${currentTask.action} ✓`;
                                agent.currentTaskId = null;
                                agent.isCarrying = false;

                                setTimeout(() => {
                                    if (!agent.currentTaskId) {
                                        agent.labelExtra = '';
                                    }
                                }, 900);
                            }
                        }
                    } else {
                        // Autonomous smooth ambient wandering within agent zone
                        agent.wanderTimer -= dt * speedMultiplier;
                        if (agent.wanderTimer <= 0) {
                            const minX = agent.zone.minXRel * w;
                            const maxX = agent.zone.maxXRel * w;
                            agent.targetX = minX + Math.random() * (maxX - minX);
                            agent.targetY = agent.zone.minY + Math.random() * (agent.zone.maxY - agent.zone.minY);
                            agent.wanderTimer = 1.8 + Math.random() * 2.2;
                        }
                    }

                    // Physics motion calculation
                    const dx = agent.targetX - agent.x;
                    const dy = agent.targetY - agent.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    const accel = agent.isCarrying ? 12.0 : 4.5;
                    const maxSpeed = agent.isCarrying ? 800 : 320;
                    const baseSpeed = Math.min(dist * 5.0, maxSpeed) * agent.speedMod * speedMultiplier;

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
        setSpacingGuide, setReviewed, setTesting
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
