import { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { projectsData } from '../data/projects';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import './ProjectDetail.css';

const ProjectDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Find the specific project based on the URL parameter
    const project = projectsData.find(p => p.id === id);

    // Scroll to top when page loads
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    // If project not found, return to home
    if (!project) {
        return (
            <div className="app-container">
                <Navigation />
                <div className="section" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ textAlign: 'center' }}>
                        <h2>Project Not Found</h2>
                        <button onClick={() => navigate('/')} className="btn btn-primary" style={{ marginTop: '1rem' }}>Return Home</button>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="app-container">
            <Navigation />

            <main>
                <section className="section project-detail-section">
                    <div className="container">

                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Link to="/" className="back-link">
                                <span className="back-arrow">←</span> Back to Portfolio
                            </Link>
                        </motion.div>

                        <motion.div
                            className="detail-header"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.2 }}
                        >
                            <h1 className="detail-title text-gradient">{project.title}</h1>
                            <div className="detail-tags">
                                {project.tags.map((tag, i) => (
                                    <span key={i} className="detail-tag">{tag}</span>
                                ))}
                            </div>
                        </motion.div>

                        <div className="detail-content">
                            <motion.div
                                className="detail-info"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.7, delay: 0.4 }}
                            >
                                <h3>About the Project</h3>
                                <p className="detail-text">{project.description}</p>

                                {project.link !== '#' && (
                                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                                        View Live Project
                                    </a>
                                )}
                            </motion.div>

                            <motion.div
                                className="detail-gallery"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.7, delay: 0.6 }}
                            >
                                <h3>Gallery & Previews</h3>
                                <div className="gallery-grid">
                                    {project.gallery && project.gallery.length > 0 ? (
                                        project.gallery.map((imgUrl, i) => (
                                            <div key={i} className="gallery-item glass-panel">
                                                <img src={imgUrl} alt={`${project.title} screenshot ${i + 1}`} />
                                            </div>
                                        ))
                                    ) : (
                                        <>
                                            <div className="gallery-item glass-panel">
                                                <span className="gallery-placeholder">Screenshot 1 (Pending)</span>
                                            </div>
                                            <div className="gallery-item glass-panel">
                                                <span className="gallery-placeholder">Screenshot 2 (Pending)</span>
                                            </div>
                                        </>
                                    )}
                                </div>

                                <div className="detail-download" style={{ marginTop: '3rem', textAlign: 'center' }}>
                                    <h3 style={{ marginBottom: '1.5rem' }}>Download Application</h3>
                                    <a href={project.apkLink || '#'} download className="btn btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                            <polyline points="7 10 12 15 17 10"></polyline>
                                            <line x1="12" y1="15" x2="12" y2="3"></line>
                                        </svg>
                                        Download APK
                                    </a>
                                </div>
                            </motion.div>
                        </div>

                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default ProjectDetail;
