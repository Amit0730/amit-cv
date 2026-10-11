import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
    ArrowLeft, 
    ExternalLink, 
    ArrowRight, 
    Search, 
    X, 
    CheckCircle2, 
    Sparkles 
} from 'lucide-react';
import { allWorkspaceProjects } from '../data/projects';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import './MoreProjectsPage.css';

const MoreProjectsPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const categories = ['All', 'AI & Machine Learning', 'Mobile & Native', 'Web & Cloud', 'Tools & Extensions'];

    const filteredProjects = useMemo(() => {
        return allWorkspaceProjects.filter(project => {
            const matchesSearch = 
                project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
        <div className="app-container">
            <Navigation />

            <main>
                <section className="section more-page-section">
                    <div className="container">

                        {/* Back to Portfolio Link */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Link to="/" className="back-link">
                                <ArrowLeft size={18} />
                                <span>Back to Portfolio</span>
                            </Link>
                        </motion.div>

                        {/* Page Header */}
                        <motion.div
                            className="more-page-header"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                        >
                            <div className="more-page-title-block">
                                <div className="more-page-badge">
                                    <Sparkles size={16} />
                                    <span>All Workspace Projects</span>
                                </div>
                                <h1 className="more-page-title text-gradient">All Projects</h1>
                                <p className="more-page-subtitle">
                                    Directory of all {allWorkspaceProjects.length} engineering projects across AI systems, native mobile apps, extensions, and web tools.
                                </p>
                            </div>

                            {/* Condition Status Banner */}
                            <div className="more-condition-banner">
                                <div className="more-status-indicator">
                                    <span className="pulse-green-dot"></span>
                                    <span className="more-status-bold">Condition: Working</span>
                                </div>
                                <span className="more-status-sub">
                                    ✓ All {allWorkspaceProjects.length} projects tested & operational
                                </span>
                            </div>
                        </motion.div>

                        {/* Search & Category Filter Controls */}
                        <motion.div
                            className="more-controls-wrapper"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <div className="more-search-row">
                                <Search className="more-search-icon" size={20} />
                                <input
                                    type="text"
                                    className="more-search-input"
                                    placeholder="Search by project name or technology tag..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                {searchQuery && (
                                    <button
                                        className="more-clear-btn"
                                        onClick={() => setSearchQuery('')}
                                        aria-label="Clear search"
                                    >
                                        <X size={18} />
                                    </button>
                                )}
                            </div>

                            <div className="more-categories-row">
                                {categories.map(cat => (
                                    <button
                                        key={cat}
                                        className={`more-cat-btn ${activeCategory === cat ? 'active' : ''}`}
                                        onClick={() => setActiveCategory(cat)}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </motion.div>

                        {/* Count Bar */}
                        <div className="more-count-bar">
                            <span>Showing <strong>{filteredProjects.length}</strong> of <strong>{allWorkspaceProjects.length}</strong> projects</span>
                            <span className="more-verified-tag">
                                <CheckCircle2 size={16} /> Condition: Working
                            </span>
                        </div>

                        {/* Projects Grid */}
                        <motion.div
                            className="more-projects-grid"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                        >
                            {filteredProjects.map((project) => (
                                <motion.div
                                    key={project.id}
                                    className="more-project-card glass-panel"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4 }}
                                >
                                    <div className="more-card-header">
                                        <span className="more-card-cat">{project.category}</span>
                                        <span className="more-condition-badge">
                                            <span className="pulse-green-dot-mini"></span>
                                            Condition: {project.condition}
                                        </span>
                                    </div>

                                    <h3 className="more-card-title">{project.title}</h3>

                                    <div className="more-card-tags">
                                        {project.tags.map((tag, i) => (
                                            <span key={i} className="tag mini-tag">{tag}</span>
                                        ))}
                                    </div>

                                    <div className="more-card-footer">
                                        {project.isInternalRoute ? (
                                            <Link to={project.link} className="more-action-link primary">
                                                <span>View Details</span>
                                                <ArrowRight size={14} />
                                            </Link>
                                        ) : project.link && project.link !== '#' ? (
                                            <a
                                                href={project.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="more-action-link primary"
                                            >
                                                <span>Live Demo</span>
                                                <ExternalLink size={14} />
                                            </a>
                                        ) : (
                                            <span className="more-status-verified">
                                                <CheckCircle2 size={14} className="verified-icon" />
                                                <span>Working</span>
                                            </span>
                                        )}

                                        {project.github && (
                                            <a
                                                href={project.github}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="more-action-link secondary"
                                            >
                                                <span>GitHub</span>
                                                <ExternalLink size={14} />
                                            </a>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>

                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default MoreProjectsPage;
