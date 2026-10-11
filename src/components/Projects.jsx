import { useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence, useMotionTemplate, useMotionValue } from 'framer-motion';
import { Link } from 'react-router-dom';
import { projectsData, allWorkspaceProjects } from '../data/projects';
import { 
    ExternalLink, 
    Search, 
    Sparkles, 
    ChevronDown, 
    ChevronUp, 
    FolderGit2, 
    CheckCircle2, 
    ArrowRight,
    Layers,
    Cpu,
    Smartphone,
    Globe,
    Terminal,
    X
} from 'lucide-react';
import './Projects.css';

const Projects = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const directoryRef = useRef(null);

    const toggleExpanded = () => {
        const nextState = !isExpanded;
        setIsExpanded(nextState);
        if (nextState) {
            setTimeout(() => {
                directoryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        }
    };

    const categories = ['All', 'AI & Machine Learning', 'Mobile & Native', 'Web & Cloud', 'Tools & Extensions'];

    const filteredProjects = useMemo(() => {
        return allWorkspaceProjects.filter(project => {
            const matchesSearch = 
                project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                project.folder.toLowerCase().includes(searchQuery.toLowerCase()) ||
                project.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

            if (!matchesSearch) return false;

            if (activeCategory === 'All') return true;
            if (activeCategory === 'AI & Machine Learning') {
                return project.category.includes('AI') || project.category.includes('Machine Learning') || project.category.includes('Computer Vision') || project.category.includes('Automation');
            }
            if (activeCategory === 'Mobile & Native') {
                return project.category.includes('Mobile') || project.category.includes('FinTech') || project.category.includes('Android');
            }
            if (activeCategory === 'Web & Cloud') {
                return project.category.includes('Web') || project.category.includes('Games') || project.category.includes('Profile');
            }
            if (activeCategory === 'Tools & Extensions') {
                return project.category.includes('Tools') || project.category.includes('Networking') || project.category.includes('Extensions') || project.category.includes('UI');
            }
            return true;
        });
    }, [searchQuery, activeCategory]);

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

                {/* 2-Column Grid: 3 Featured Projects + 1 "More Options" Card directly beside the 3rd Project */}
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

                    {/* 4th Card: More Options Card near 3rd Project */}
                    <MoreOptionsCard 
                        isExpanded={isExpanded} 
                        onToggle={toggleExpanded}
                        totalCount={allWorkspaceProjects.length} 
                    />
                </motion.div>

                {/* Expanded All Projects Directory Section */}
                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            ref={directoryRef}
                            className="all-projects-directory-wrapper glass-panel"
                            initial={{ opacity: 0, y: 40, height: 0 }}
                            animate={{ opacity: 1, y: 0, height: 'auto' }}
                            exit={{ opacity: 0, y: 20, height: 0 }}
                            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                        >
                            <div className="directory-header-section">
                                <div className="directory-title-block">
                                    <div className="directory-badge">
                                        <Sparkles size={16} />
                                        <span>Workspace Project Directory</span>
                                    </div>
                                    <h3 className="directory-main-title text-gradient">
                                        All Projects From Project Folder
                                    </h3>
                                    <p className="directory-subtitle">
                                        Complete directory of all {allWorkspaceProjects.length} active engineering projects across AI, machine learning, mobile, web, and extensions.
                                    </p>
                                </div>

                                {/* Prominent Condition Working Status Banner */}
                                <div className="condition-status-banner">
                                    <div className="status-indicator-box">
                                        <span className="pulse-green-dot"></span>
                                        <span className="status-text-bold">Condition: Working</span>
                                    </div>
                                    <span className="status-subtext">
                                        ✓ All {allWorkspaceProjects.length} projects tested & operational in local repository
                                    </span>
                                </div>
                            </div>

                            {/* Search & Category Filter Controls */}
                            <div className="directory-controls-bar">
                                <div className="search-input-wrapper">
                                    <Search className="search-icon" size={18} />
                                    <input
                                        type="text"
                                        className="directory-search-input"
                                        placeholder="Search by project name, tech tag, or folder..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                    {searchQuery && (
                                        <button 
                                            className="clear-search-btn"
                                            onClick={() => setSearchQuery('')}
                                            aria-label="Clear search"
                                        >
                                            <X size={16} />
                                        </button>
                                    )}
                                </div>

                                <div className="category-tabs-row">
                                    {categories.map((cat) => (
                                        <button
                                            key={cat}
                                            className={`category-tab-btn ${activeCategory === cat ? 'active' : ''}`}
                                            onClick={() => setActiveCategory(cat)}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Count info */}
                            <div className="results-count-bar">
                                <span>Showing <strong>{filteredProjects.length}</strong> of <strong>{allWorkspaceProjects.length}</strong> projects</span>
                                <span className="verified-tag">
                                    <CheckCircle2 size={14} /> Condition: Working
                                </span>
                            </div>

                            {/* Projects Directory Grid */}
                            <div className="directory-projects-grid">
                                {filteredProjects.map((proj) => (
                                    <DirectoryProjectItem key={proj.id} project={proj} />
                                ))}
                            </div>

                            {/* Bottom Collapse Bar */}
                            <div className="directory-bottom-action">
                                <button 
                                    className="btn btn-secondary collapse-btn"
                                    onClick={() => {
                                        setIsExpanded(false);
                                        window.scrollTo({ top: document.getElementById('projects')?.offsetTop || 0, behavior: 'smooth' });
                                    }}
                                >
                                    <ChevronUp size={18} />
                                    <span>Collapse Directory</span>
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
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

/* The 4th card placed beside the 3rd project */
const MoreOptionsCard = ({ isExpanded, onToggle, totalCount }) => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    function handleMouseMove({ currentTarget, clientX, clientY }) {
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }

    return (
        <motion.div
            className={`project-card glass-panel more-options-trigger-card ${isExpanded ? 'active-expanded' : ''}`}
            onMouseMove={handleMouseMove}
            onClick={onToggle}
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

            <div className="project-content more-options-content" style={{ position: 'relative', zIndex: 1 }}>
                <div className="more-options-top-meta">
                    <span className="more-badge-pill">
                        <Layers size={13} />
                        <span>+{totalCount} Workspace Projects</span>
                    </span>
                    <span className="condition-pill-badge glowing">
                        <span className="pulse-green-dot-mini"></span>
                        Condition: Working
                    </span>
                </div>

                <h3 className="project-title more-options-title text-gradient">
                    More Options
                </h3>
                
                <p className="project-desc more-options-desc">
                    Click here to reveal <strong>all {totalCount} projects</strong> from the project folder. Browse AI/ML models, native mobile apps, extensions, and web tools with verified live working condition.
                </p>

                <div className="project-tags more-options-tags">
                    <span className="tag highlight-tag">All Projects Folder</span>
                    <span className="tag highlight-tag">Condition: Working</span>
                    <span className="tag highlight-tag">Live Filter</span>
                    <span className="tag highlight-tag">Direct Links</span>
                </div>

                <div className="more-options-action-row">
                    <button 
                        className={`more-options-btn ${isExpanded ? 'active' : ''}`}
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggle();
                        }}
                    >
                        <span>{isExpanded ? '✕ Close Options' : '✦ More Options (Show All Projects)'}</span>
                        {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

/* Individual item in the expanded directory */
const DirectoryProjectItem = ({ project }) => {
    return (
        <motion.div 
            className="directory-item-card glass-panel"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
        >
            <div className="directory-item-header">
                <span className="directory-item-cat">{project.category}</span>
                <span className="directory-condition-badge">
                    <span className="pulse-green-dot-mini"></span>
                    Condition: {project.condition}
                </span>
            </div>

            <h4 className="directory-item-title">{project.title}</h4>

            <div className="directory-item-folder">
                <FolderGit2 size={13} className="folder-icon" />
                <span>{project.folder}</span>
            </div>

            <p className="directory-item-desc">{project.description}</p>

            <div className="directory-item-tags">
                {project.tags.map((tag, i) => (
                    <span key={i} className="tag mini-tag">{tag}</span>
                ))}
            </div>

            <div className="directory-item-footer">
                {project.isInternalRoute ? (
                    <Link to={project.link} className="dir-action-link primary">
                        <span>View Details</span>
                        <ArrowRight size={14} />
                    </Link>
                ) : project.link && project.link !== '#' ? (
                    <a 
                        href={project.link} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="dir-action-link primary"
                    >
                        <span>Live Demo</span>
                        <ExternalLink size={14} />
                    </a>
                ) : (
                    <span className="dir-action-status">
                        <CheckCircle2 size={14} className="status-check-icon" />
                        <span>Working in Workspace</span>
                    </span>
                )}

                {project.github && (
                    <a 
                        href={project.github} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="dir-action-link secondary"
                    >
                        <span>GitHub</span>
                        <ExternalLink size={14} />
                    </a>
                )}
            </div>
        </motion.div>
    );
};

export default Projects;
