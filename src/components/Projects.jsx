import React, { memo } from 'react';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { Link } from 'react-router-dom';
import { projectsData, allWorkspaceProjects } from '../data/projects';
import { ArrowRight, Layers } from 'lucide-react';
import { useBuildEngine } from '../context/BuildEngineContext';
import AgentBuilderFrame from './AgentBuilderFrame';
import './Projects.css';

const Projects = () => {
    const {
        projectsDelivered,
        buildingStates,
        typedText = {},
        presentationFallbacks = {},
        agentsActive = true
    } = useBuildEngine();

    return (
        <section id="projects" className="section projects-section">
            <div className="container">
                <AgentBuilderFrame
                    id="builder-projects-header"
                    agentName="Typography"
                    action="typing"
                    color="#22C55E"
                    label="headline"
                    isBuilding={buildingStates.projects}
                    isDelivered={projectsDelivered.header}
                >
                    <motion.div
                        className="section-header"
                        initial={{ opacity: 0.7, scale: 0.98 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                    >
                        <div className="section-eyebrow-red">SELECTED WORK</div>
                        <h2 className="section-title-impact" style={{ minHeight: '1.2em' }}>
                            {projectsDelivered.header || !agentsActive ? (
                                "WORK THAT SHIPS."
                            ) : (
                                typedText['builder-projects-header'] !== undefined ? typedText['builder-projects-header'] : ""
                            )}
                            {!projectsDelivered.header && agentsActive && <span className="typing-cursor-blink">|</span>}
                        </h2>
                        <p className="section-subtitle-muted">
                            Production apps, hackathon projects, and client workflows. Every project went from a brief to something real people open and use.
                        </p>
                    </motion.div>
                </AgentBuilderFrame>

                {/* 2-Column Grid: 3 Featured Projects + 1 "More" Card */}
                <div className="projects-grid">
                    {/* Card 01 - Built by Resize Agent */}
                    {projectsData[0] && (
                        <AgentBuilderFrame
                            id="builder-project-card-0"
                            agentName="Resize"
                            action="resizing"
                            color="#84CC16"
                            label="card 01: expensy"
                            isBuilding={buildingStates.projects}
                            isDelivered={projectsDelivered.card1}
                        >
                            <ProjectCard 
                                frameId="builder-project-card-0"
                                project={projectsData[0]} 
                                index={0} 
                                isDelivered={projectsDelivered.card1}
                            />
                        </AgentBuilderFrame>
                    )}

                    {/* Card 02 - Built by Component Agent */}
                    {projectsData[1] && (
                        <AgentBuilderFrame
                            id="builder-project-card-1"
                            agentName="Component"
                            action="mounting"
                            color="#3B82F6"
                            label="card 02: aesthetic clock"
                            isBuilding={buildingStates.projects}
                            isDelivered={projectsDelivered.card2}
                        >
                            <ProjectCard 
                                frameId="builder-project-card-1"
                                project={projectsData[1]} 
                                index={1} 
                                isDelivered={projectsDelivered.card2}
                            />
                        </AgentBuilderFrame>
                    )}

                    {/* Card 03 - Built by Component Agent */}
                    {projectsData[2] && (
                        <AgentBuilderFrame
                            id="builder-project-card-2"
                            agentName="Component"
                            action="mounting"
                            color="#3B82F6"
                            label="card 03: hospital sys"
                            isBuilding={buildingStates.projects}
                            isDelivered={projectsDelivered.card3}
                        >
                            <ProjectCard 
                                frameId="builder-project-card-2"
                                project={projectsData[2]} 
                                index={2} 
                                isDelivered={projectsDelivered.card3}
                            />
                        </AgentBuilderFrame>
                    )}

                    {/* 4th Card: More Card near 3rd Project - Built by Style Agent */}
                    <AgentBuilderFrame
                        id="builder-project-card-3"
                        agentName="Style"
                        action="styling"
                        color="#EAB308"
                        label="card 04: more vault"
                        isBuilding={buildingStates.projects}
                        isDelivered={projectsDelivered.card4}
                    >
                        <MoreCard 
                            totalCount={allWorkspaceProjects.length} 
                            isDelivered={projectsDelivered.card4} 
                        />
                    </AgentBuilderFrame>
                </div>
            </div>
        </section>
    );
};

const ProjectCard = memo(({ frameId, project, index, isDelivered }) => {
    const { componentStages = {}, presentationFallbacks = {}, agentsActive = true } = useBuildEngine();
    const stage = isDelivered || !agentsActive || presentationFallbacks[frameId] || presentationFallbacks['projects'] ? 4 : (componentStages[frameId] || 0);

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const cardGradient = useMotionTemplate`radial-gradient(350px circle at ${mouseX}px ${mouseY}px, rgba(220, 38, 38, 0.15), transparent 80%)`;

    function handleMouseMove({ currentTarget, clientX, clientY }) {
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }

    // Stage 0: Clean unfinished wireframe container (matching reference video wireframe)
    if (stage === 0) {
        return (
            <div className="project-card project-card-wireframe" style={{ height: '100%', minHeight: '260px' }}>
                <div className="wireframe-card-header">
                    <span className="wireframe-pill wireframe-index-pill">{String(index + 1).padStart(2, '0')}</span>
                    <span className="wireframe-bar wireframe-title-bar" />
                </div>
                <div className="wireframe-desc-stack">
                    <span className="wireframe-bar" style={{ width: '90%' }} />
                    <span className="wireframe-bar" style={{ width: '75%' }} />
                </div>
                <div className="wireframe-tags-row">
                    <span className="wireframe-tag-slot" />
                    <span className="wireframe-tag-slot" />
                    <span className="wireframe-tag-slot" />
                </div>
            </div>
        );
    }

    return (
        <Link to={`/project/${project.id}`} style={{ textDecoration: 'none', display: 'block', height: '100%', pointerEvents: stage >= 4 ? 'auto' : 'none' }}>
            <motion.div
                className={`project-card glass-panel ${stage < 4 ? 'card-assembling' : ''}`}
                onMouseMove={handleMouseMove}
                initial={{ opacity: 0.6, scale: 0.95 }}
                animate={{ 
                    opacity: 1, 
                    scale: 1
                }}
                transition={{ type: 'spring', damping: 20, stiffness: 120 }}
                whileHover={stage >= 4 ? { y: -6, transition: { duration: 0.25 } } : {}}
                style={{ height: '100%', cursor: stage >= 4 ? 'pointer' : 'default', position: 'relative', overflow: 'hidden' }}
            >
                <motion.div
                    className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
                    style={{
                        background: cardGradient,
                        position: 'absolute',
                        inset: 0,
                        zIndex: 0,
                        pointerEvents: 'none',
                        opacity: stage >= 4 ? undefined : 0,
                        transition: 'opacity 0.3s'
                    }}
                    whileHover={{ opacity: 1 }}
                />

                <div className="project-content" style={{ position: 'relative', zIndex: 1 }}>
                    <div className="card-top-header">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                            <span className="card-index-num">{String(index + 1).padStart(2, '0')}</span>
                            <h3 className="project-title text-gradient">{project.title}</h3>
                        </div>
                        {stage >= 4 && (
                            <span className="condition-pill-badge">
                                <span className="pulse-green-dot-mini"></span>
                                Working
                            </span>
                        )}
                    </div>
                    {stage >= 2 ? (
                        <p className="project-desc">{project.description}</p>
                    ) : (
                        <div className="wireframe-desc-stack" style={{ margin: '14px 0' }}>
                            <span className="wireframe-bar" style={{ width: '85%' }} />
                            <span className="wireframe-bar" style={{ width: '60%' }} />
                        </div>
                    )}
                    <div className="project-tags">
                        {stage >= 3 ? (
                            project.tags.map((tag, i) => (
                                <span key={i} className="tag">{tag}</span>
                            ))
                        ) : (
                            <div className="wireframe-tags-row">
                                <span className="wireframe-tag-slot" />
                                <span className="wireframe-tag-slot" />
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </Link>
    );
});

/* The 4th card placed beside the 3rd project: opens /more page on click */
const MoreCard = memo(({ totalCount, isDelivered }) => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const moreGradient = useMotionTemplate`radial-gradient(380px circle at ${mouseX}px ${mouseY}px, rgba(139, 92, 246, 0.25), transparent 80%)`;

    function handleMouseMove({ currentTarget, clientX, clientY }) {
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }

    return (
        <Link to="/more" style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
            <motion.div
                className="project-card more-trigger-card glass-panel"
                onMouseMove={handleMouseMove}
                initial={{ opacity: 0.5, scale: 0.94 }}
                animate={{ 
                    opacity: isDelivered ? 1 : 0.85, 
                    scale: 1
                }}
                transition={{ type: 'spring', damping: 20, stiffness: 120 }}
                whileHover={{ y: -8, transition: { duration: 0.25 } }}
                style={{ height: '100%', cursor: 'pointer', position: 'relative', overflow: 'hidden' }}
            >
                <motion.div
                    className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300"
                    style={{
                        background: moreGradient,
                        position: 'absolute',
                        inset: 0,
                        zIndex: 0,
                        pointerEvents: 'none',
                        opacity: 0,
                        transition: 'opacity 0.3s'
                    }}
                    whileHover={{ opacity: 1 }}
                />

                <div className="project-content more-card-content" style={{ position: 'relative', zIndex: 1 }}>
                    <div className="more-top-meta">
                        <span className="more-badge-pill">
                            <Layers size={13} />
                            <span>+{totalCount} Workspace Projects</span>
                        </span>
                        <span className="condition-pill-badge glowing">
                            <span className="pulse-green-dot-mini"></span>
                            Condition: Working
                        </span>
                    </div>

                    <h3 className="project-title more-title text-gradient">
                        More
                    </h3>
                    
                    <p className="project-desc more-desc">
                        Explore all <strong>{totalCount} active projects</strong> from your project folder on a dedicated page. Browse AI/ML models, native mobile apps, extensions, and web tools with verified live working condition.
                    </p>

                    <div className="project-tags more-tags">
                        <span className="tag highlight-tag">All Projects Folder</span>
                        <span className="tag highlight-tag">Condition: Working</span>
                        <span className="tag highlight-tag">Dedicated Page</span>
                        <span className="tag highlight-tag">Direct Links</span>
                    </div>

                    <div className="more-action-row">
                        <span className="more-btn">
                            <span>More</span>
                            <ArrowRight size={18} />
                        </span>
                    </div>
                </div>
            </motion.div>
        </Link>
    );
});

export default Projects;
