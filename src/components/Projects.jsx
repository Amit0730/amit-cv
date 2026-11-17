import React from 'react';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { Link } from 'react-router-dom';
import { projectsData, allWorkspaceProjects } from '../data/projects';
import { ArrowRight, Layers } from 'lucide-react';
import { useBuildEngine } from '../context/BuildEngineContext';
import AgentBuilderFrame from './AgentBuilderFrame';
import './Projects.css';

const Projects = () => {
    const { projectsDelivered, buildingStates } = useBuildEngine();

    return (
        <section id="projects" className="section projects-section">
            <div className="container">
                <motion.div
                    className="section-header"
                    initial={{ opacity: 0.7, scale: 0.98 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                >
                    <div className="section-eyebrow-red">SELECTED WORK</div>
                    <h2 className="section-title-impact">WORK THAT SHIPS.</h2>
                    <p className="section-subtitle-muted">
                        Production apps, hackathon projects, and client workflows. Every project went from a brief to something real people open and use.
                    </p>
                </motion.div>

                {/* 2-Column Grid: 3 Featured Projects + 1 "More" Card */}
                <div className="projects-grid">
                    {/* Card 01 - Built by Agent Dev */}
                    {projectsData[0] && (
                        <AgentBuilderFrame
                            id="builder-project-card-0"
                            agentName="Dev"
                            action="placing"
                            color="#A855F7"
                            label="card 01: expensy"
                            isBuilding={buildingStates.projects}
                            isDelivered={projectsDelivered.card1}
                        >
                            <ProjectCard 
                                project={projectsData[0]} 
                                index={0} 
                                isDelivered={projectsDelivered.card1}
                            />
                        </AgentBuilderFrame>
                    )}

                    {/* Card 02 - Built by Agent Scout */}
                    {projectsData[1] && (
                        <AgentBuilderFrame
                            id="builder-project-card-1"
                            agentName="Scout"
                            action="sizing"
                            color="#38BDF8"
                            label="card 02: aesthetic clock"
                            isBuilding={buildingStates.projects}
                            isDelivered={projectsDelivered.card2}
                        >
                            <ProjectCard 
                                project={projectsData[1]} 
                                index={1} 
                                isDelivered={projectsDelivered.card2}
                            />
                        </AgentBuilderFrame>
                    )}

                    {/* Card 03 - Built by Agent Lint */}
                    {projectsData[2] && (
                        <AgentBuilderFrame
                            id="builder-project-card-2"
                            agentName="Lint"
                            action="typing"
                            color="#94A3B8"
                            label="card 03: hospital sys"
                            isBuilding={buildingStates.projects}
                            isDelivered={projectsDelivered.card3}
                        >
                            <ProjectCard 
                                project={projectsData[2]} 
                                index={2} 
                                isDelivered={projectsDelivered.card3}
                            />
                        </AgentBuilderFrame>
                    )}

                    {/* 4th Card: More Card near 3rd Project - Built by Agent Layout */}
                    <AgentBuilderFrame
                        id="builder-project-card-3"
                        agentName="Layout"
                        action="grid"
                        color="#FACC15"
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

const ProjectCard = ({ project, index, isDelivered }) => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    function handleMouseMove({ currentTarget, clientX, clientY }) {
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }

    return (
        <Link to={`/project/${project.id}`} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
            <motion.div
                className="project-card glass-panel"
                onMouseMove={handleMouseMove}
                initial={{ opacity: 0.5, scale: 0.94 }}
                animate={{ 
                    opacity: isDelivered ? 1 : 0.85, 
                    scale: 1
                }}
                transition={{ type: 'spring', damping: 20, stiffness: 120 }}
                whileHover={{ y: -6, transition: { duration: 0.25 } }}
                style={{ height: '100%', cursor: 'pointer', position: 'relative', overflow: 'hidden' }}
            >
                <motion.div
                    className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
                    style={{
                        background: useMotionTemplate`
                            radial-gradient(
                                350px circle at ${mouseX}px ${mouseY}px,
                                rgba(220, 38, 38, 0.15),
                                transparent 80%
                            )
                        `,
                        position: 'absolute',
                        inset: 0,
                        zIndex: 0,
                        pointerEvents: 'none',
                        opacity: 0,
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
                        <span className="condition-pill-badge">
                            <span className="pulse-green-dot-mini"></span>
                            Working
                        </span>
                    </div>
                    <p className="project-desc">{project.description}</p>
                    <div className="project-tags">
                        {project.tags.map((tag, i) => (
                            <span key={i} className="tag">{tag}</span>
                        ))}
                    </div>
                </div>
            </motion.div>
        </Link>
    );
};

/* The 4th card placed beside the 3rd project: opens /more page on click */
const MoreCard = ({ totalCount, isDelivered }) => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

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
                        background: useMotionTemplate`
                            radial-gradient(
                                380px circle at ${mouseX}px ${mouseY}px,
                                rgba(139, 92, 246, 0.25),
                                transparent 80%
                            )
                        `,
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
};

export default Projects;
