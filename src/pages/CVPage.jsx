import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Download, ArrowLeft, ExternalLink } from 'lucide-react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import './CVPage.css';

const CVPage = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const cvFilePath = `${import.meta.env.BASE_URL}files/Amit_Kumar_Singh_CV.docx`;

    return (
        <div className="app-container">
            <Navigation />

            <main>
                <section className="section cv-page-section">
                    <div className="container">
                        
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

                        <motion.div
                            className="cv-header"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.2 }}
                        >
                            <h1 className="cv-title text-gradient">Curriculum Vitae</h1>
                            <p className="cv-subtitle">Amit Kumar Singh &mdash; AI & Software Engineering Student</p>
                        </motion.div>

                        <motion.div
                            className="cv-viewer-container glass-panel"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.4 }}
                        >
                            <div className="cv-toolbar">
                                <div className="cv-doc-info">
                                    <FileText className="cv-doc-icon" size={24} />
                                    <div>
                                        <h3 className="cv-doc-name">Amit_Kumar_Singh_CV.docx</h3>
                                        <span className="cv-doc-type">Word Document</span>
                                    </div>
                                </div>

                                <div className="cv-actions">
                                    <a
                                        href={cvFilePath}
                                        download="Amit_Kumar_Singh_CV.docx"
                                        className="btn btn-primary cv-action-btn"
                                    >
                                        <Download size={18} />
                                        <span>Download Document</span>
                                    </a>
                                </div>
                            </div>

                            <div className="cv-content-card">
                                <div className="cv-placeholder-preview">
                                    <div className="preview-icon-badge">
                                        <FileText size={48} />
                                    </div>
                                    <h2>Curriculum Vitae Ready</h2>
                                    <p>
                                        Your Word document file (<code>Amit_Kumar_Singh_CV.docx</code>) is attached and ready to be viewed or downloaded.
                                    </p>
                                    <div className="preview-meta-tags">
                                        <span className="meta-tag">19-Year-Old Engineering Student at LPU</span>
                                        <span className="meta-tag">AI & Machine Learning</span>
                                        <span className="meta-tag">Full Stack Development</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default CVPage;
