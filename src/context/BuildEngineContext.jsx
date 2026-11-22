import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { INITIAL_TASKS, AGENT_ROSTER } from '../engine/agentTasks';

const BuildEngineContext = createContext(null);

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

    // Power toggle: AGENTS ON / AGENTS OFF
    const setAgentsActive = useCallback((active) => {
        setAgentsActiveState(active);
        if (!active) {
            // Instantly mark everything complete so user has a 100% usable website
            setTasks(prev => prev.map(t => ({ ...t, status: 'completed' })));
            setActiveInspections({});
            setSpacingGuides({});
            setReviewedElements({});
            setInteractiveTesting({});
            setHeroDelivered({
                nav: true, name: true, role: true, pitch: true, cta: true, location: true, photo: true, stats: true, bg: true
            });
            setTrackDelivered({ title: true, stat40: true, timeline: true });
            setProjectsDelivered({ header: true, card1: true, card2: true, card3: true, card4: true });
            setSkillsDelivered({ skills: true, principles: true, manifesto: true });
            setAboutDelivered({ title: true, photo2: true, bio: true });
            setBuildingStates({ hero: false, track: false, projects: false, skills: false, about: false });
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

            // Section delivery states
            heroDelivered, setHeroDelivered,
            trackDelivered, setTrackDelivered,
            projectsDelivered, setProjectsDelivered,
            skillsDelivered, setSkillsDelivered,
            aboutDelivered, setAboutDelivered,
            buildingStates, setBuildingStates
        }}>
            {children}
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
