import React, { createContext, useContext, useState, useEffect } from 'react';

const BuildEngineContext = createContext(null);

export const FULL_HEADLINE = "AMIT KUMAR SINGH";
export const FULL_ROLE = "SOFTWARE ENGINEER & AI BUILDER";

export const BuildEngineProvider = ({ children }) => {
    // Delivery flags for Hero section elements
    const [heroDelivered, setHeroDelivered] = useState({
        nav: false,
        name: false,
        photo: false,
        stats: false,
        bg: false
    });

    // Delivery flags for About section elements
    const [aboutDelivered, setAboutDelivered] = useState({
        title: false,
        photo2: false,
        bio: false
    });

    // Delivery flags for Projects section cards
    const [projectsDelivered, setProjectsDelivered] = useState({
        card1: false,
        card2: false,
        card3: false,
        card4: false
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
            photo: false,
            stats: false,
            bg: false
        });
        setAboutDelivered({
            title: false,
            photo2: false,
            bio: false
        });
        setProjectsDelivered({
            card1: false,
            card2: false,
            card3: false,
            card4: false
        });

        window.scrollTo({ top: 0, behavior: 'smooth' });

        setTimeout(() => {
            setIsBuilding(true);
        }, 150);
    };

    return (
        <BuildEngineContext.Provider value={{
            heroDelivered, setHeroDelivered,
            aboutDelivered, setAboutDelivered,
            projectsDelivered, setProjectsDelivered,
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
