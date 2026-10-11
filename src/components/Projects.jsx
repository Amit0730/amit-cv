import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { Link } from 'react-router-dom';
import { projectsData, allWorkspaceProjects } from '../data/projects';
import { ArrowRight, Layers } from 'lucide-react';
import './Projects.css';

const Projects = () => {
    return (
        <section id="projects" className="section projects-section">
            <div className="container">
                <motion.div
                    className="section-header"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, amount: 0.8 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                >
                    <h2 className="section-title">Featured Projects</h2>
                    <div className="title-underline"></div>
                </motion.div>

                {/* 2-Column Grid: 3 Featured Projects + 1 "More" Card directly beside the 3rd Project */}
                <motion.div
                    className="projects-grid"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                    variants={{
                        visible: {
                            transition: {
                                staggerChildren: 0.2
                            }
                        }
                    }}
                >
                    {projectsData.map((project, index) => (
                        <ProjectCard key={index} project={project} />
                    ))}

                    {/* 4th Card: More Card near 3rd Project (Navigates to dedicated /more page) */}
                    <MoreCard totalCount={allWorkspaceProjects.length} />
                </motion.div>
            </div>
        </section>
    );
};

const ProjectCard = ({ project }) => {
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
                variants={{
                    hidden: { opacity: 0, y: 50 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] } }
                }}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
                style={{ height: '100%', cursor: 'pointer', position: 'relative', overflow: 'hidden' }}
            >
                <motion.div
                    className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
                    style={{
                        background: useMotionTemplate`
                            radial-gradient(
                                350px circle at ${mouseX}px ${mouseY}px,
                                rgba(59, 130, 246, 0.15),
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
                        <h3 className="project-title text-gradient">{project.title}</h3>
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
const MoreCard = ({ totalCount }) => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    function handleMouseMove({ currentTarget, clientX, clientY }) {
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }

    return (
        <Link to="/more" style={{ textDecoration: 'none', display: 'block' }}>
            <motion.div
                className="project-card glass-panel more-trigger-card"
                onMouseMove={handleMouseMove}
                variants={{
                    hidden: { opacity: 0, y: 50 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] } }
                }}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
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
