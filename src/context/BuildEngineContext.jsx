import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { INITIAL_TASKS, AGENT_ROSTER } from '../engine/agentTasks';

const BuildEngineContext = createContext(null);

class AgentErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }
    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }
    componentDidCatch(error, errorInfo) {
        console.error("[AgentEngine ErrorBoundary caught]", error, errorInfo);
    }
    render() {
        if (this.state.hasError) {
            return this.props.fallback || null;
        }
        return this.props.children;
    }
}

export const FULL_HEADLINE = "AMIT KUMAR SINGH.";
export const FULL_ROLE = "SOFTWARE ENGINEER & AI BUILDER";

export const BuildEngineProvider = ({ children }) => {
    // Boot sequence state
    const [isBooted, setIsBooted] = useState(false);
    const [bootCount, setBootCount] = useState(1);

    // Global simulation controls
    const [isBuilding, setIsBuilding] = useState(true);
    const [isPaused, setIsPaused] = useState(false);
    const [agentsActive, setAgentsActiveState] = useState(true);
    const [speedMultiplier, setSpeedMultiplier] = useState(1);

    // Task queue system
    const [tasks, setTasks] = useState(() => INITIAL_TASKS.map(t => ({ ...t, status: 'pending' })));

    // Asset preloading & Presentation Fallbacks (Phase 1 & Phase 2 Fixes)
    const [preloadedAssets, setPreloadedAssets] = useState({
        'builder-hero-photo': false,
        'builder-about-photo': false
    });
    const [presentationFallbacks, setPresentationFallbacks] = useState({});
    const [taskDiagnostics, setTaskDiagnostics] = useState({});

    // Preload critical assets immediately on mount
    useEffect(() => {
        const heroImg = new Image();
        heroImg.src = `${import.meta.env.BASE_URL}images/profile1.jpg`;
        heroImg.onload = () => {
            setPreloadedAssets(prev => ({
                ...prev,
                'builder-hero-photo': { ready: true, naturalWidth: heroImg.naturalWidth, naturalHeight: heroImg.naturalHeight }
            }));
        };
        heroImg.onerror = () => {
            console.warn('[BuildEngine] Hero portrait load error, fallback ready');
            setPreloadedAssets(prev => ({ ...prev, 'builder-hero-photo': { ready: false, error: true } }));
            setPresentationFallbacks(prev => ({ ...prev, 'builder-hero-photo': true }));
        };

        const aboutImg = new Image();
        aboutImg.src = `${import.meta.env.BASE_URL}images/profile2.jpg`;
        aboutImg.onload = () => {
            setPreloadedAssets(prev => ({
                ...prev,
                'builder-about-photo': { ready: true, naturalWidth: aboutImg.naturalWidth, naturalHeight: aboutImg.naturalHeight }
            }));
        };
        aboutImg.onerror = () => {
            console.warn('[BuildEngine] About portrait load error, fallback ready');
            setPreloadedAssets(prev => ({ ...prev, 'builder-about-photo': { ready: false, error: true } }));
            setPresentationFallbacks(prev => ({ ...prev, 'builder-about-photo': true }));
        };
    }, []);

    // Active sections (unlocked on boot or as visitor scrolls into view)
    const [activeSections, setActiveSections] = useState({
        hero: true,
        track: false,
        projects: false,
        skills: false,
        about: false,
        footer: false
    });

    // Real-time inspected element states (for Figma-like outlines & spec tags)
    // Key: targetId => { agentName, action, color, label, dims }
    const [activeInspections, setActiveInspections] = useState({});

    // Live element progressive changes
    const [typedText, setTypedText] = useState({});
    const [elementDimensions, setElementDimensions] = useState({});
    const [spacingGuides, setSpacingGuides] = useState({});
    const [reviewedElements, setReviewedElements] = useState({});
    const [interactiveTesting, setInteractiveTesting] = useState({});
    const [activeStyles, setActiveStyles] = useState({});
    const [activeMedia, setActiveMedia] = useState({});
    const [motionTests, setMotionTests] = useState({});
    const [componentStages, setComponentStages] = useState({});
    const [navVerifiedLinks, setNavVerifiedLinks] = useState({});

    // Section delivery flags (for final resting states & fallback)
    const [heroDelivered, setHeroDelivered] = useState({
        nav: false,
        name: false,
        role: false,
        pitch: false,
        cta: false,
        location: false,
        photo: false,
        stats: false,
        bg: false
    });

    const [trackDelivered, setTrackDelivered] = useState({
        title: false,
        stat40: false,
        timeline: false
    });

    const [projectsDelivered, setProjectsDelivered] = useState({
        header: false,
        card1: false,
        card2: false,
        card3: false,
        card4: false
    });

    const [skillsDelivered, setSkillsDelivered] = useState({
        skills: false,
        principles: false,
        manifesto: false
    });

    const [aboutDelivered, setAboutDelivered] = useState({
        title: false,
        photo2: false,
        bio: false
    });

    const [buildingStates, setBuildingStates] = useState({
        hero: true,
        track: false,
        projects: false,
        skills: false,
        about: false
    });

    // Unlock a section when scrolled into view
    const activateSection = useCallback((sectionName) => {
        setActiveSections(prev => {
            if (prev[sectionName]) return prev;
            return { ...prev, [sectionName]: true };
        });
        setBuildingStates(prev => {
            if (prev[sectionName]) return prev;
            return { ...prev, [sectionName]: true };
        });
    }, []);

    // Mark task running or completed
    const updateTaskStatus = useCallback((taskId, status) => {
        setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status } : t));

        if (status === 'completed') {
            // Synchronize corresponding element delivery flags
            if (taskId === 'task-hero-nav') setHeroDelivered(h => ({ ...h, nav: true }));
            if (taskId === 'task-hero-bg') setHeroDelivered(h => ({ ...h, bg: true }));
            if (taskId === 'task-hero-name') setHeroDelivered(h => ({ ...h, name: true }));
            if (taskId === 'task-hero-role') setHeroDelivered(h => ({ ...h, role: true }));
            if (taskId === 'task-hero-pitch') setHeroDelivered(h => ({ ...h, pitch: true }));
            if (taskId === 'task-hero-photo-media') setHeroDelivered(h => ({ ...h, photo: true }));
            if (taskId === 'task-hero-stats') setHeroDelivered(h => ({ ...h, stats: true }));
            if (taskId === 'task-hero-cta') setHeroDelivered(h => ({ ...h, cta: true, location: true }));
            if (taskId === 'task-hero-review') setBuildingStates(b => ({ ...b, hero: false }));

            if (taskId === 'task-track-title') setTrackDelivered(t => ({ ...t, title: true }));
            if (taskId === 'task-track-stat') setTrackDelivered(t => ({ ...t, stat40: true }));
            if (taskId === 'task-track-timeline') setTrackDelivered(t => ({ ...t, timeline: true }));
            if (taskId === 'task-track-review') setBuildingStates(b => ({ ...b, track: false }));

            if (taskId === 'task-projects-header') setProjectsDelivered(p => ({ ...p, header: true }));
            if (taskId === 'task-project-card-0-comp') setProjectsDelivered(p => ({ ...p, card1: true }));
            if (taskId === 'task-project-card-1-comp') setProjectsDelivered(p => ({ ...p, card2: true }));
            if (taskId === 'task-project-card-2-comp') setProjectsDelivered(p => ({ ...p, card3: true }));
            if (taskId === 'task-project-card-3-style') setProjectsDelivered(p => ({ ...p, card4: true }));
            if (taskId === 'task-projects-review') setBuildingStates(b => ({ ...b, projects: false }));

            if (taskId === 'task-skills-edu') setSkillsDelivered(s => ({ ...s, skills: true }));
            if (taskId === 'task-skills-principles') setSkillsDelivered(s => ({ ...s, principles: true }));
            if (taskId === 'task-skills-manifesto') setSkillsDelivered(s => ({ ...s, manifesto: true }));
            if (taskId === 'task-skills-review') setBuildingStates(b => ({ ...b, skills: false }));

            if (taskId === 'task-about-title') setAboutDelivered(a => ({ ...a, title: true }));
            if (taskId === 'task-about-photo') setAboutDelivered(a => ({ ...a, photo2: true }));
            if (taskId === 'task-about-bio') setAboutDelivered(a => ({ ...a, bio: true }));
            if (taskId === 'task-about-review') setBuildingStates(b => ({ ...b, about: false }));
        } else if (status === 'failed') {
            const task = tasks.find(t => t.id === taskId);
            if (task) {
                setTaskDiagnostics(prev => ({
                    ...prev,
                    [taskId]: {
                        agentId: task.agentId,
                        targetId: task.targetId,
                        timestamp: Date.now(),
                        reason: 'Verification condition unmet'
                    }
                }));
                // Phase 2 Fix: Presentation fallback ensures website never remains permanently broken
                setPresentationFallbacks(prev => ({ ...prev, [task.targetId]: true }));
                console.warn(`[BuildEngine] Task ${taskId} failed verification - presentation fallback enabled for ${task.targetId}`);
            }
        }
    }, [tasks]);

    const setPresentationFallback = useCallback((targetId, value = true) => {
        setPresentationFallbacks(prev => ({ ...prev, [targetId]: value }));
    }, []);

    // Phase 6 Fix: Graceful catch-up for sections when scrolled past
    const catchUpSection = useCallback((sectionName) => {
        setPresentationFallbacks(prev => ({ ...prev, [sectionName]: true }));
        if (sectionName === 'hero') {
            setHeroDelivered({
                nav: true, name: true, role: true, pitch: true, cta: true, location: true, photo: true, stats: true, bg: true
            });
            setBuildingStates(b => ({ ...b, hero: false }));
        } else if (sectionName === 'track') {
            setTrackDelivered({ title: true, stat40: true, timeline: true });
            setBuildingStates(b => ({ ...b, track: false }));
        } else if (sectionName === 'projects') {
            setProjectsDelivered({ header: true, card1: true, card2: true, card3: true, card4: true });
            setBuildingStates(b => ({ ...b, projects: false }));
        } else if (sectionName === 'skills') {
            setSkillsDelivered({ skills: true, principles: true, manifesto: true });
            setBuildingStates(b => ({ ...b, skills: false }));
        } else if (sectionName === 'about') {
            setAboutDelivered({ title: true, photo2: true, bio: true });
            setBuildingStates(b => ({ ...b, about: false }));
        }
    }, []);

    // Set inspection state on an element
    const setInspection = useCallback((targetId, inspectionData) => {
        setActiveInspections(prev => {
            if (!inspectionData) {
                const next = { ...prev };
                delete next[targetId];
                return next;
            }
            return { ...prev, [targetId]: inspectionData };
        });
    }, []);

    // Set typed text for a target
    const setElementTypedText = useCallback((targetId, text) => {
        setTypedText(prev => ({ ...prev, [targetId]: text }));
    }, []);

    // Set dimension for a target
    const setElementDimension = useCallback((targetId, dims) => {
        setElementDimensions(prev => ({ ...prev, [targetId]: dims }));
    }, []);

    // Set spacing guide for a target
    const setSpacingGuide = useCallback((targetId, label) => {
        setSpacingGuides(prev => {
            if (!label) {
                const next = { ...prev };
                delete next[targetId];
                return next;
            }
            return { ...prev, [targetId]: label };
        });
    }, []);

    // Set review verified badge for a target
    const setReviewed = useCallback((targetId, isPassed) => {
        setReviewedElements(prev => {
            if (!isPassed) {
                const next = { ...prev };
                delete next[targetId];
                return next;
            }
            return { ...prev, [targetId]: true };
        });
    }, []);

    // Set interactive testing highlight for a target
    const setTesting = useCallback((targetId, isTesting) => {
        setInteractiveTesting(prev => {
            if (!isTesting) {
                const next = { ...prev };
                delete next[targetId];
                return next;
            }
            return { ...prev, [targetId]: true };
        });
    }, []);

    // Set dynamic style effect for a target
    const setActiveStyle = useCallback((targetId, styleData) => {
        setActiveStyles(prev => {
            if (!styleData) {
                const next = { ...prev };
                delete next[targetId];
                return next;
            }
            return { ...prev, [targetId]: styleData };
        });
    }, []);

    // Set dynamic media mounting effect for a target
    const setActiveMediaState = useCallback((targetId, mediaData) => {
        setActiveMedia(prev => {
            if (!mediaData) {
                const next = { ...prev };
                delete next[targetId];
                return next;
            }
            return { ...prev, [targetId]: mediaData };
        });
    }, []);

    // Set dynamic motion spring test displacement for a target
    const setMotionTest = useCallback((targetId, offsetY) => {
        setMotionTests(prev => {
            if (offsetY === 0 || offsetY === null || offsetY === undefined) {
                const next = { ...prev };
                delete next[targetId];
                return next;
            }
            return { ...prev, [targetId]: offsetY };
        });
    }, []);

    // Set dynamic staged component assembly progress (0 to 4)
    const setComponentStage = useCallback((targetId, stage) => {
        setComponentStages(prev => ({ ...prev, [targetId]: stage }));
    }, []);

    // Set navigation link verified highlight
    const setNavVerifiedLink = useCallback((href, isVerified = true) => {
        setNavVerifiedLinks(prev => {
            if (!isVerified) {
                const next = { ...prev };
                delete next[href];
                return next;
            }
            return { ...prev, [href]: true };
        });
    }, []);

    // Power toggle: AGENTS ON / AGENTS OFF
    // Problem 3 Fix: When AGENTS OFF, presentation renders cleanly without faking task completions!
    const setAgentsActive = useCallback((active) => {
        setAgentsActiveState(active);
        if (!active) {
            // Clear temporary guides and overlays for clean browsing, without falsifying task status
            setActiveInspections({});
            setSpacingGuides({});
            setInteractiveTesting({});
            setActiveStyles({});
            setActiveMedia({});
            setMotionTests({});
            setNavVerifiedLinks({});
        }
    }, []);

    // Replay simulation from scratch
    const rebuildAll = useCallback(() => {
        setIsBuilding(false);
        setIsPaused(false);
        setTasks(INITIAL_TASKS.map(t => ({ ...t, status: 'pending' })));
        setActiveSections({
            hero: true,
            track: false,
            projects: false,
            skills: false,
            about: false,
            footer: false
        });
        setActiveInspections({});
        setTypedText({});
        setElementDimensions({});
        setSpacingGuides({});
        setReviewedElements({});
        setInteractiveTesting({});
        setActiveStyles({});
        setActiveMedia({});
        setMotionTests({});
        setComponentStages({});
        setNavVerifiedLinks({});
        setPresentationFallbacks({});
        setTaskDiagnostics({});

        setHeroDelivered({
            nav: false, name: false, role: false, pitch: false, cta: false, location: false, photo: false, stats: false, bg: false
        });
        setTrackDelivered({ title: false, stat40: false, timeline: false });
        setProjectsDelivered({ header: false, card1: false, card2: false, card3: false, card4: false });
        setSkillsDelivered({ skills: false, principles: false, manifesto: false });
        setAboutDelivered({ title: false, photo2: false, bio: false });
        setBuildingStates({ hero: true, track: false, projects: false, skills: false, about: false });

        window.scrollTo({ top: 0, behavior: 'smooth' });

        setTimeout(() => {
            setIsBuilding(true);
        }, 200);
    }, []);

    const completedTaskCount = useMemo(() => tasks.filter(t => t.status === 'completed').length, [tasks]);
    const totalTaskCount = INITIAL_TASKS.length;

    return (
        <BuildEngineContext.Provider value={{
            // Boot sequence
            isBooted, setIsBooted,
            bootCount, setBootCount,

            // Engine controls
            isBuilding, setIsBuilding,
            isPaused, setIsPaused,
            agentsActive, setAgentsActive,
            speedMultiplier, setSpeedMultiplier,
            rebuildAll,

            // Task execution states
            tasks,
            activeSections,
            activateSection,
            updateTaskStatus,
            completedTaskCount,
            totalTaskCount,

            // Real-time element inspection & styling
            activeInspections, setInspection,
            typedText, setElementTypedText,
            elementDimensions, setElementDimension,
            spacingGuides, setSpacingGuide,
            reviewedElements, setReviewed,
            interactiveTesting, setTesting,
            activeStyles, setActiveStyle,
            activeMedia, setActiveMedia: setActiveMediaState,
            motionTests, setMotionTest,
            componentStages, setComponentStage,
            navVerifiedLinks, setNavVerifiedLink,

            // Section delivery states
            heroDelivered, setHeroDelivered,
            trackDelivered, setTrackDelivered,
            projectsDelivered, setProjectsDelivered,
            skillsDelivered, setSkillsDelivered,
            aboutDelivered, setAboutDelivered,
            buildingStates, setBuildingStates,

            // Decoupled presentation & asset readiness (Phases 1, 2, 6)
            preloadedAssets,
            presentationFallbacks,
            setPresentationFallback,
            catchUpSection,
            taskDiagnostics
        }}>
            <AgentErrorBoundary>
                {children}
            </AgentErrorBoundary>
        </BuildEngineContext.Provider>
    );
};

export const useBuildEngine = () => {
    const context = useContext(BuildEngineContext);
    if (!context) {
        throw new Error('useBuildEngine must be used within a BuildEngineProvider');
    }
    return context;
};
