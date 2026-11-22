import React, { useEffect, useRef, useCallback, memo } from 'react';
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

    const containerRef = useRef(null);
    const ripplesContainerRef = useRef(null);
    const cursorDomsRef = useRef([]);
    const animFrameRef = useRef(null);

    // Keep active refs for simulation loop to avoid re-binding rAF on every state change
    const tasksRef = useRef(tasks);
    tasksRef.current = tasks;

    const activeSectionsRef = useRef(activeSections);
    activeSectionsRef.current = activeSections;

    const isBuildingRef = useRef(isBuilding);
    isBuildingRef.current = isBuilding;

    const isPausedRef = useRef(isPaused);
    isPausedRef.current = isPaused;

    const agentsActiveRef = useRef(agentsActive);
    agentsActiveRef.current = agentsActive;

    const speedMultiplierRef = useRef(speedMultiplier);
    speedMultiplierRef.current = speedMultiplier;

    const isBootedRef = useRef(isBooted);
    isBootedRef.current = isBooted;

    const preloadedAssetsRef = useRef(preloadedAssets);
    preloadedAssetsRef.current = preloadedAssets;

    const callbacksRef = useRef({
        updateTaskStatus,
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
        setPresentationFallback
    });
    callbacksRef.current = {
        updateTaskStatus,
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
        setPresentationFallback
    };

    // Coordinate cache to prevent forced reflows (getBoundingClientRect layout thrashing)
    const handleCacheRef = useRef(new Map());

    // Initial state for each of the 12 agents from AGENT_ROSTER
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
                isCarrying: false,
                lastTypedLen: 0,
                lastStage: 0,
                dragOrigin: null
            };
        })
    );

    // Direct DOM ripple creation (Zero React re-render overhead)
    const addRipple = useCallback((x, y, color = '#38BDF8') => {
        if (!ripplesContainerRef.current) return;
        const span = document.createElement('span');
        span.className = 'agent-click-ripple';
        span.style.left = `${Math.round(x)}px`;
        span.style.top = `${Math.round(y)}px`;
        span.style.borderColor = color;
        span.style.boxShadow = `0 0 14px ${color}`;
        ripplesContainerRef.current.appendChild(span);
        setTimeout(() => {
            if (span.parentNode) span.remove();
        }, 750);
    }, []);

    // Cached element handle coordinate resolver
    const getHandle = useCallback((elementId, corner = 'br') => {
        if (typeof document === 'undefined') return null;
        const cacheKey = `${elementId}-${corner}`;
        const cached = handleCacheRef.current.get(cacheKey);
        const now = performance.now();
        if (cached && (now - cached.time < 140)) {
            return cached.coords;
        }

        const el = document.getElementById(elementId);
        if (!el) return null;
        const rect = el.getBoundingClientRect();
        if (rect.width === 0 && rect.height === 0) return null;

        let coords;
        if (corner === 'br') coords = { x: rect.right, y: rect.bottom, width: rect.width, height: rect.height, left: rect.left, top: rect.top };
        else if (corner === 'tr') coords = { x: rect.right, y: rect.top, width: rect.width, height: rect.height, left: rect.left, top: rect.top };
        else if (corner === 'bl') coords = { x: rect.left, y: rect.bottom, width: rect.width, height: rect.height, left: rect.left, top: rect.top };
        else if (corner === 'tl') coords = { x: rect.left, y: rect.top, width: rect.width, height: rect.height, left: rect.left, top: rect.top };
        else if (corner === 'tc') coords = { x: rect.left + rect.width / 2, y: rect.top, width: rect.width, height: rect.height, left: rect.left, top: rect.top };
        else if (corner === 'center') coords = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2, width: rect.width, height: rect.height, left: rect.left, top: rect.top };
        else coords = { x: rect.right, y: rect.bottom, width: rect.width, height: rect.height, left: rect.left, top: rect.top };

        handleCacheRef.current.set(cacheKey, { time: now, coords });
        return coords;
    }, []);

    // =========================================================================
    // 1. SCROLL-AWARE SECTION UNLOCKING & CACHE INVALIDATION
    // =========================================================================
    useEffect(() => {
        let scrollTimeout;
        const handleScroll = () => {
            // Invalidate handle cache on scroll so targets stay true
            handleCacheRef.current.clear();

            if (!agentsActiveRef.current) return;

            const vh = window.innerHeight;
            const trackEl = document.getElementById('track-record');
            const projectsEl = document.getElementById('projects');
            const skillsEl = document.getElementById('skills');
            const aboutEl = document.getElementById('about');
            const footerEl = document.getElementById('contact');

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

        const handleResize = () => {
            handleCacheRef.current.clear();
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('resize', handleResize, { passive: true });
        handleScroll();

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleResize);
            if (scrollTimeout) clearTimeout(scrollTimeout);
        };
    }, [activateSection, catchUpSection]);

    // =========================================================================
    // 2. ORCHESTRATION ENGINE LOOP (Single Persistent 60FPS Loop)
    // =========================================================================
    useEffect(() => {
        let lastTime = performance.now();
        let isTabActive = typeof document !== 'undefined' ? !document.hidden : true;
        const prefersReducedMotion = typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false;

        const onVisibilityChange = () => {
            isTabActive = !document.hidden;
            if (isTabActive) {
                lastTime = performance.now();
            }
        };
        document.addEventListener('visibilitychange', onVisibilityChange);

        const updateSimulation = (currentTime) => {
            // Adaptive performance: Pause loop calculations when document tab is hidden
            if (!isTabActive) {
                animFrameRef.current = requestAnimationFrame(updateSimulation);
                return;
            }

            // Delta-time clamped to 50ms for smooth physics without teleportation jumps
            const dt = Math.min((currentTime - lastTime) / 1000, 0.05);
            lastTime = currentTime;

            const isEngActive = agentsActiveRef.current && isBuildingRef.current && isBootedRef.current && !isPausedRef.current;
            const currentTasks = tasksRef.current;
            const currentSections = activeSectionsRef.current;
            const currentSpeed = speedMultiplierRef.current;
            const cb = callbacksRef.current;

            if (isEngActive) {
                // Find ready pending tasks
                const readyTasks = currentTasks.filter(task => {
                    if (task.status !== 'pending') return false;
                    if (!currentSections[task.section]) return false;
                    return task.dependencies.every(depId => {
                        const dep = currentTasks.find(t => t.id === depId);
                        return dep && (dep.status === 'completed' || dep.status === 'failed');
                    });
                });

                // A. Task Assignment to Matching Idle Agents
                readyTasks.forEach(task => {
                    const existingAgent = agentsRef.current.find(a => a.currentTaskId === task.id);
                    if (existingAgent) return;

                    // Concurrency check: Ensure no other agent is already actively manipulating this target
                    const targetBusy = agentsRef.current.some(a => {
                        if (!a.currentTaskId) return false;
                        const activeTask = currentTasks.find(t => t.id === a.currentTaskId);
                        return activeTask && activeTask.targetId === task.targetId;
                    });
                    if (targetBusy) return;

                    const agent = agentsRef.current.find(a => a.id === task.agentId && !a.currentTaskId);
                    if (agent) {
                        agent.currentTaskId = task.id;
                        agent.state = 'moving';
                        agent.stateTimer = 0;
                        agent.taskTime = 0;
                        agent.lastTypedLen = 0;
                        agent.lastStage = 0;
                        agent.dragOrigin = null;
                        agent.isCarrying = true;
                        agent.labelExtra = `-> ${task.label || task.action}`;

                        cb.updateTaskStatus(task.id, 'assigned');
                    }
                });

                // B. Deterministic State Machine & Action Execution
                agentsRef.current.forEach((agent) => {
                    if (agent.currentTaskId) {
                        const currentTask = currentTasks.find(t => t.id === agent.currentTaskId);
                        if (!currentTask) {
                            agent.currentTaskId = null;
                            agent.isCarrying = false;
                            agent.state = 'idle';
                            return;
                        }

                        // Target handle coordinates (cached per task to eliminate forced reflows)
                        if (!agent.cachedHandle || currentTask.action === 'navigation') {
                            agent.cachedHandle = getHandle(currentTask.targetId, currentTask.corner || 'br');
                        }
                        let handle = agent.cachedHandle;

                        if (handle) {
                            if (agent.state === 'executing' && currentTask.action === 'resize' && agent.dragOrigin) {
                                // Mathematical drag tracking: calculate handle position directly from dimensions
                                const progress = Math.min(agent.taskTime / Math.max(currentTask.duration || 1.2, 0.4), 1);
                                const curW = currentTask.startDims.w + (currentTask.targetDims.w - currentTask.startDims.w) * progress;
                                const curH = currentTask.startDims.h + (currentTask.targetDims.h - currentTask.startDims.h) * progress;
                                agent.targetX = agent.dragOrigin.left + curW;
                                agent.targetY = agent.dragOrigin.top + curH;
                            } else {
                                agent.targetX = handle.x;
                                agent.targetY = handle.y;
                            }

                            const dx = agent.targetX - agent.x;
                            const dy = agent.targetY - agent.y;
                            const dist = Math.sqrt(dx * dx + dy * dy);

                            // --- STATE 1: MOVING TO TARGET ---
                            if (agent.state === 'moving') {
                                if (dist <= 18) {
                                    agent.state = 'selecting';
                                    agent.stateTimer = 0;
                                    agent.labelExtra = 'selecting...';

                                    cb.setInspection(currentTask.targetId, {
                                        agentName: agent.name,
                                        action: currentTask.action,
                                        color: agent.color,
                                        label: currentTask.label
                                    });
                                    cb.updateTaskStatus(currentTask.id, 'selecting');
                                }
                            }
                            // --- STATE 2: SELECTING ELEMENT ---
                            else if (agent.state === 'selecting') {
                                agent.stateTimer += dt * currentSpeed;
                                if (agent.stateTimer >= 0.18) {
                                    agent.state = 'executing';
                                    agent.stateTimer = 0;
                                    agent.taskTime = 0;
                                    agent.labelExtra = currentTask.label;
                                    if (currentTask.action === 'resize' && handle) {
                                        agent.dragOrigin = { left: handle.left, top: handle.top };
                                    }
                                    cb.updateTaskStatus(currentTask.id, 'executing');
                                }
                            }
                            // --- STATE 3: EXECUTING CONCRETE ACTION ---
                            else if (agent.state === 'executing') {
                                agent.taskTime += dt * currentSpeed;
                                const duration = Math.max(currentTask.duration || 1.2, 0.4);
                                const progress = Math.min(agent.taskTime / duration, 1);

                                // 1 & 2. Typography & Copy: Progressive text typing (Selective integer updates)
                                if (currentTask.action === 'type' || currentTask.action === 'copy') {
                                    if (currentTask.text) {
                                        const charLen = Math.max(1, Math.floor(progress * currentTask.text.length));
                                        if (charLen !== agent.lastTypedLen) {
                                            agent.lastTypedLen = charLen;
                                            cb.setElementTypedText(currentTask.targetId, currentTask.text.slice(0, charLen));
                                        }
                                    }
                                    if (currentTask.targetId === 'builder-track-timeline') {
                                        const stage = Math.min(Math.floor(progress * 5) + 1, 5);
                                        if (stage !== agent.lastStage) {
                                            agent.lastStage = stage;
                                            cb.setComponentStage('builder-track-timeline', stage);
                                            agent.labelExtra = `milestone ${stage}/5`;
                                        }
                                    }
                                    if (currentTask.targetId === 'builder-skills-principles') {
                                        const stage = Math.min(Math.floor(progress * 4) + 1, 4);
                                        if (stage !== agent.lastStage) {
                                            agent.lastStage = stage;
                                            cb.setComponentStage('builder-skills-principles', stage);
                                            agent.labelExtra = `principle ${stage}/4`;
                                        }
                                    }
                                }
                                // 3. Resize: Smooth interpolated drag
                                else if (currentTask.action === 'resize') {
                                    if (currentTask.startDims && currentTask.targetDims) {
                                        const curW = Math.round(currentTask.startDims.w + (currentTask.targetDims.w - currentTask.startDims.w) * progress);
                                        const curH = Math.round(currentTask.startDims.h + (currentTask.targetDims.h - currentTask.startDims.h) * progress);
                                        cb.setElementDimension(currentTask.targetId, { w: curW, h: curH });
                                    }
                                }
                                // 4. Spacing: Temporary Figma measurement guide
                                else if (currentTask.action === 'spacing') {
                                    if (agent.stateTimer === 0) {
                                        cb.setSpacingGuide(currentTask.targetId, currentTask.spacingLabel || 'gap: 24px');
                                    }
                                }
                                // 5. Interaction: Simulated button hover
                                else if (currentTask.action === 'interact') {
                                    if (agent.lastStage === 0) {
                                        agent.lastStage = 1;
                                        cb.setTesting(currentTask.targetId, true);
                                    }
                                }
                                // 6. Style: Glow & theme coloring (Thresholded state dispatch)
                                else if (currentTask.action === 'style') {
                                    if (agent.lastStage === 0) {
                                        agent.lastStage = 1;
                                        cb.setActiveStyle(currentTask.targetId, { progress: 0.5, active: true });
                                    }
                                }
                                // 7. Media: Image mounting & laser sweep
                                else if (currentTask.action === 'media') {
                                    if (agent.lastStage === 0) {
                                        agent.lastStage = 1;
                                        cb.setActiveMedia(currentTask.targetId, { progress: 0.5, mounted: true });
                                    }
                                }
                                // 8. Motion: Hardware-accelerated direct DOM transform
                                else if (currentTask.action === 'motion') {
                                    const targetEl = document.getElementById(currentTask.targetId);
                                    if (targetEl) {
                                        const motionY = Math.sin(progress * Math.PI * 2) * -6;
                                        targetEl.style.transform = `translate3d(0, ${motionY.toFixed(1)}px, 0)`;
                                    }
                                }
                                // 9. Navigation: Link verification
                                else if (currentTask.action === 'navigation') {
                                    const navEl = document.getElementById(currentTask.targetId);
                                    if (navEl) {
                                        const links = navEl.querySelectorAll('a[href]');
                                        if (links.length > 0) {
                                            const idx = Math.min(Math.floor(progress * links.length), links.length - 1);
                                            const link = links[idx];
                                            const href = link?.getAttribute('href');
                                            if (href && href !== agent.lastHref) {
                                                agent.lastHref = href;
                                                agent.labelExtra = `checking ${href}`;
                                                cb.setNavVerifiedLink(href);
                                                const linkRect = link.getBoundingClientRect();
                                                agent.targetX = linkRect.left + linkRect.width / 2;
                                                agent.targetY = linkRect.bottom;
                                            }
                                        }
                                    }
                                }
                                // 10. Component / Layout: Card assembly (Discrete 4 stages)
                                else if (currentTask.action === 'component' || currentTask.action === 'layout') {
                                    const stage = progress < 0.25 ? 1 : progress < 0.50 ? 2 : progress < 0.75 ? 3 : 4;
                                    if (stage !== agent.lastStage) {
                                        agent.lastStage = stage;
                                        cb.setComponentStage(currentTask.targetId, stage);
                                        agent.labelExtra = `${currentTask.label} [stage ${stage}/4]`;
                                    }
                                }
                                // 11. Review: Spec audit pass
                                else if (currentTask.action === 'review') {
                                    agent.labelExtra = `auditing specs...`;
                                }

                                if (progress >= 1) {
                                    agent.state = 'verifying';
                                    agent.stateTimer = 0;
                                    agent.labelExtra = 'verifying...';
                                    cb.updateTaskStatus(currentTask.id, 'verifying');
                                }
                            }
                            // --- STATE 4: VERIFYING ---
                            else if (agent.state === 'verifying') {
                                agent.stateTimer += dt * currentSpeed;

                                const el = document.getElementById(currentTask.targetId);
                                const hasGeometry = Boolean(el && (el.offsetWidth > 0 || el.offsetHeight > 0 || (agent.cachedHandle && agent.cachedHandle.width > 0)));
                                const depsDone = currentTask.dependencies.every(d => {
                                    const dep = currentTasks.find(t => t.id === d);
                                    return dep && (dep.status === 'completed' || dep.status === 'failed');
                                });

                                let isVerified = false;
                                if (el && hasGeometry && depsDone) {
                                    if (currentTask.action === 'type' || currentTask.action === 'copy') {
                                        const text = (el.innerText || el.textContent || '').trim();
                                        const expected = (currentTask.text || '').slice(0, 8).trim();
                                        isVerified = !expected || text.includes(expected);
                                    } else if (currentTask.action === 'media') {
                                        const img = el.querySelector('img');
                                        const isImgReady = Boolean(img && (img.complete && img.naturalWidth > 0));
                                        const isPreloaded = Boolean(preloadedAssetsRef.current?.[currentTask.targetId]?.ready);
                                        isVerified = isImgReady || isPreloaded;
                                    } else if (currentTask.action === 'navigation') {
                                        const links = el.querySelectorAll('a[href]');
                                        isVerified = links.length > 0;
                                    } else if (currentTask.action === 'component' || currentTask.action === 'layout') {
                                        isVerified = el.children.length > 0 || (el.innerText || '').trim().length > 0;
                                    } else if (currentTask.action === 'review') {
                                        const otherTasks = currentTasks.filter(t => t.section === currentTask.section && t.id !== currentTask.id);
                                        isVerified = otherTasks.every(t => t.status === 'completed' || t.status === 'failed');
                                    } else {
                                        isVerified = true;
                                    }
                                }

                                if (agent.stateTimer >= 0.20) {
                                    if (isVerified) {
                                        addRipple(agent.x, agent.y, agent.color);

                                        cb.setInspection(currentTask.targetId, null);
                                        if (currentTask.text) {
                                            cb.setElementTypedText(currentTask.targetId, currentTask.text);
                                        }
                                        if (currentTask.action === 'component' || currentTask.action === 'layout') {
                                            cb.setComponentStage(currentTask.targetId, 4);
                                        }
                                        if (currentTask.targetId === 'builder-track-timeline') {
                                            cb.setComponentStage('builder-track-timeline', 5);
                                        }
                                        if (currentTask.targetId === 'builder-skills-principles') {
                                            cb.setComponentStage('builder-skills-principles', 4);
                                        }
                                        if (currentTask.action === 'resize') {
                                            cb.setElementDimension(currentTask.targetId, null);
                                            handleCacheRef.current.clear();
                                        }
                                        if (currentTask.action === 'spacing') {
                                            setTimeout(() => cb.setSpacingGuide(currentTask.targetId, null), 800);
                                        }
                                        if (currentTask.action === 'interact') {
                                            cb.setTesting(currentTask.targetId, false);
                                        }
                                        if (currentTask.action === 'review') {
                                            cb.setReviewed(currentTask.targetId, true);
                                        }
                                        if (currentTask.action === 'motion') {
                                            const targetEl = document.getElementById(currentTask.targetId);
                                            if (targetEl) targetEl.style.transform = '';
                                            cb.setMotionTest(currentTask.targetId, 0);
                                        }
                                        if (currentTask.action === 'style') {
                                            cb.setActiveStyle(currentTask.targetId, { active: true, progress: 1 });
                                        }
                                        if (currentTask.action === 'media') {
                                            cb.setActiveMedia(currentTask.targetId, { mounted: true, progress: 1 });
                                        }

                                        cb.updateTaskStatus(currentTask.id, 'completed');

                                        agent.labelExtra = `${currentTask.action} ✓`;
                                        agent.currentTaskId = null;
                                        agent.cachedHandle = null;
                                        agent.isCarrying = false;
                                        agent.dragOrigin = null;
                                        agent.state = 'idle';

                                        setTimeout(() => {
                                            if (!agent.currentTaskId) {
                                                agent.labelExtra = '';
                                            }
                                        }, 900);
                                    } else if (agent.stateTimer >= 0.55) {
                                        agent.labelExtra = 'fallback ✓';
                                        cb.updateTaskStatus(currentTask.id, 'failed');
                                        cb.setPresentationFallback(currentTask.targetId, true);
                                        agent.currentTaskId = null;
                                        agent.cachedHandle = null;
                                        agent.isCarrying = false;
                                        agent.dragOrigin = null;
                                        agent.state = 'idle';
                                    }
                                }
                            }
                        }
                    } else {
                        // Calm standby micro-float
                        const t = currentTime * 0.0016 + agent.homePhase;
                        agent.targetX = agent.homeX + Math.sin(t) * 3;
                        agent.targetY = agent.homeY + Math.cos(t * 1.2) * 2.5;
                    }

                    // Delta-time physics motion with arrival damping (Zero jitter)
                    const dx = agent.targetX - agent.x;
                    const dy = agent.targetY - agent.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist <= 1.5) {
                        agent.vx = 0;
                        agent.vy = 0;
                        agent.x = agent.targetX;
                        agent.y = agent.targetY;
                        agent.angle = 0;
                    } else {
                        const accel = agent.isCarrying ? 14.0 : 4.5;
                        const maxSpeed = agent.isCarrying ? 850 : 300;
                        const baseSpeed = Math.min(dist * 6.0, maxSpeed) * agent.speedMod * currentSpeed;

                        agent.vx += ((dx / (dist + 0.1)) * baseSpeed - agent.vx) * accel * dt;
                        agent.vy += ((dy / (dist + 0.1)) * baseSpeed - agent.vy) * accel * dt;
                        agent.x += agent.vx * dt;
                        agent.y += agent.vy * dt;
                        agent.angle = prefersReducedMotion ? 0 : Math.max(-12, Math.min(12, agent.vx / 42));
                    }
                });

                // Batch write direct DOM transforms (Zero React re-render overhead)
                const doms = cursorDomsRef.current;
                const len = agentsRef.current.length;
                for (let i = 0; i < len; i++) {
                    const dom = doms[i];
                    const agent = agentsRef.current[i];
                    if (dom && agent) {
                        dom.style.transform = `translate3d(${agent.x.toFixed(1)}px, ${agent.y.toFixed(1)}px, 0) rotate(${agent.angle.toFixed(1)}deg)`;
                        const labelEl = dom.lastElementChild?.lastElementChild;
                        if (labelEl) {
                            const fullLabel = `${agent.name}${agent.labelExtra ? ` • ${agent.labelExtra}` : ''}`;
                            if (labelEl.textContent !== fullLabel) {
                                labelEl.textContent = fullLabel;
                            }
                        }
                    }
                }
            }

            animFrameRef.current = requestAnimationFrame(updateSimulation);
        };

        animFrameRef.current = requestAnimationFrame(updateSimulation);

        return () => {
            document.removeEventListener('visibilitychange', onVisibilityChange);
            if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
        };
    }, [addRipple, getHandle]);

    return (
        <>
            {/* Multi-Agent Overlay Canvas */}
            {agentsActive && (
                <div ref={containerRef} className="multi-agent-overlay" aria-hidden="true">
                    {/* Direct DOM Click / Delivery Ripples Container */}
                    <div ref={ripplesContainerRef} className="agent-ripples-layer" />

                    {/* 12 Live Cursor Elements (Pointer arrow + robot badge) */}
                    {AGENT_ROSTER.map((agent, index) => (
                        <div
                            key={agent.id}
                            ref={el => { cursorDomsRef.current[index] = el; }}
                            className="agent-cursor-wrapper"
                        >
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
                                    color: agent.textColor
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
