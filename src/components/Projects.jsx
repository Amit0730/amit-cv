import { useRef } from 'react';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { Link } from 'react-router-dom';
import { projectsData } from '../data/projects';
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
                    <h3 className="project-title text-gradient">{project.title}</h3>
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

export default Projects;
