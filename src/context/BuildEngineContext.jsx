import React, { createContext, useContext, useState, useEffect } from 'react';

const BuildEngineContext = createContext(null);

export const FULL_HEADLINE = "AMIT KUMAR SINGH";
export const FULL_ROLE = "SOFTWARE ENGINEER & AI BUILDER";

export const BuildEngineProvider = ({ children }) => {
    // Boot sequence state
    const [isBooted, setIsBooted] = useState(false);
    const [bootCount, setBootCount] = useState(1);

    // Delivery flags for Hero section elements
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

    // Delivery flags for Projects section cards
    const [projectsDelivered, setProjectsDelivered] = useState({
        header: false,
        card1: false,
        card2: false,
        card3: false,
        card4: false
    });

    // Delivery flags for Track Record section
    const [trackDelivered, setTrackDelivered] = useState({
        title: false,
        stat40: false,
        timeline: false
    });

    // Delivery flags for Skills & Principles section
    const [skillsDelivered, setSkillsDelivered] = useState({
        skills: false,
        principles: false,
        manifesto: false
    });

    // Active blueprint building states per section
    const [buildingStates, setBuildingStates] = useState({
        hero: true,
        projects: false,
        track: false,
        skills: false
    });

    const [isBuilding, setIsBuilding] = useState(true);
    const [agentsActive, setAgentsActive] = useState(true);
    const [speedMultiplier, setSpeedMultiplier] = useState(1);

    // Replay / Rebuild All from scratch
    const rebuildAll = () => {
        setIsBuilding(false);
        setHeroDelivered({
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
        setProjectsDelivered({
            header: false,
            card1: false,
            card2: false,
            card3: false,
            card4: false
        });
        setTrackDelivered({
            title: false,
            stat40: false,
            timeline: false
        });
        setSkillsDelivered({
            skills: false,
            principles: false,
            manifesto: false
        });
        setBuildingStates({
            hero: true,
            projects: false,
            track: false,
            skills: false
        });

        window.scrollTo({ top: 0, behavior: 'smooth' });

        setTimeout(() => {
            setIsBuilding(true);
        }, 200);
    };

    return (
        <BuildEngineContext.Provider value={{
            isBooted, setIsBooted,
            bootCount, setBootCount,
            heroDelivered, setHeroDelivered,
            projectsDelivered, setProjectsDelivered,
            trackDelivered, setTrackDelivered,
            skillsDelivered, setSkillsDelivered,
            buildingStates, setBuildingStates,
            isBuilding, setIsBuilding,
            agentsActive, setAgentsActive,
            speedMultiplier, setSpeedMultiplier,
            rebuildAll
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
