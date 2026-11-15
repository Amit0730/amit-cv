import React from 'react';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { Link } from 'react-router-dom';
import { projectsData, allWorkspaceProjects } from '../data/projects';
import { ArrowRight, Layers } from 'lucide-react';
import { useBuildEngine } from '../context/BuildEngineContext';
import './Projects.css';

const Projects = () => {
    const { projectsDelivered } = useBuildEngine();

    return (
        <section id="projects" className="section projects-section">
            <div className="container">
                <motion.div
                    className="section-header"
                    initial={{ opacity: 0, scale: 0.95 }}
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
                    {/* Card 01 - Delivered by Agent Dev */}
                    {projectsData[0] && (
                        <ProjectCard 
                            project={projectsData[0]} 
                            index={0} 
                            isDelivered={projectsDelivered.card1}
                            startOffset={{ x: -180, y: -40 }}
                        />
                    )}

                    {/* Card 02 - Delivered by Agent Scout */}
                    {projectsData[1] && (
                        <ProjectCard 
                            project={projectsData[1]} 
                            index={1} 
                            isDelivered={projectsDelivered.card2}
                            startOffset={{ x: 180, y: -40 }}
                        />
                    )}

                    {/* Card 03 - Delivered by Agent Lint */}
                    {projectsData[2] && (
                        <ProjectCard 
                            project={projectsData[2]} 
                            index={2} 
                            isDelivered={projectsDelivered.card3}
                            startOffset={{ x: -180, y: 40 }}
                        />
                    )}

                    {/* 4th Card: More Card near 3rd Project - Delivered by Agent Layout */}
                    <MoreCard 
                        totalCount={allWorkspaceProjects.length} 
                        isDelivered={projectsDelivered.card4} 
                        startOffset={{ x: 180, y: 40 }}
                    />
                </div>
            </div>
        </section>
    );
};

const ProjectCard = ({ project, index, isDelivered, startOffset = { x: -100, y: 0 } }) => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    function handleMouseMove({ currentTarget, clientX, clientY }) {
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }

    return (
        <Link to={`/project/${project.id}`} style={{ textDecoration: 'none', display: 'block' }}>
            <motion.div
                className="project-card glass-panel"
                onMouseMove={handleMouseMove}
                initial={{ 
                    x: startOffset.x, 
                    y: startOffset.y, 
                    opacity: 0, 
                    scale: 0.9 
                }}
                animate={{ 
                    x: isDelivered ? 0 : startOffset.x, 
                    y: isDelivered ? 0 : startOffset.y, 
                    opacity: isDelivered ? 1 : 0, 
                    scale: isDelivered ? 1 : 0.9 
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
                                rgba(220, 38, 38, 0.18),
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
                        <div className="card-title-group">
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
const MoreCard = ({ totalCount, isDelivered, startOffset = { x: 100, y: 0 } }) => {
    return (
        <Link to="/more" style={{ textDecoration: 'none', display: 'block' }}>
            <motion.div
                className="project-card more-card glass-panel"
                initial={{ 
                    x: startOffset.x, 
                    y: startOffset.y, 
                    opacity: 0, 
                    scale: 0.9 
                }}
                animate={{ 
                    x: isDelivered ? 0 : startOffset.x, 
                    y: isDelivered ? 0 : startOffset.y, 
                    opacity: isDelivered ? 1 : 0, 
                    scale: isDelivered ? 1 : 0.9 
                }}
                transition={{ type: 'spring', damping: 20, stiffness: 120 }}
                whileHover={{ y: -6, transition: { duration: 0.25 } }}
                style={{ height: '100%', cursor: 'pointer', position: 'relative', overflow: 'hidden' }}
            >
                <div className="more-card-content">
                    <div className="more-card-icon-halo">
                        <Layers size={32} />
                    </div>
                    <div className="more-card-text-block">
                        <span className="more-card-count-badge">+{totalCount} PROJECTS</span>
                        <h3 className="more-card-heading">Explore All Projects</h3>
                        <p className="more-card-sub">
                            Complete archive of AI architectures, web apps, client projects, and tools.
                        </p>
                    </div>
                    <div className="more-card-cta">
                        <span>OPEN VAULT</span>
                        <ArrowRight size={18} />
                    </div>
                </div>
            </motion.div>
        </Link>
    );
};

export default Projects;
