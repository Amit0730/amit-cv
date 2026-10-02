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

    const cvDocxPath = `${import.meta.env.BASE_URL}files/Amit_Kumar_Singh_CV.docx`;
    const cvPdfPath = `${import.meta.env.BASE_URL}files/Amit_Kumar_Singh_CV.pdf`;

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
                                        <h3 className="cv-doc-name">Amit_Kumar_Singh_CV.pdf</h3>
                                        <span className="cv-doc-type">Official Curriculum Vitae</span>
                                    </div>
                                </div>

                                <div className="cv-actions">
                                    <a
                                        href={cvPdfPath}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-secondary cv-action-btn"
                                    >
                                        <ExternalLink size={18} />
                                        <span>Open Fullscreen</span>
                                    </a>
                                    <a
                                        href={cvPdfPath}
                                        download="Amit_Kumar_Singh_CV.pdf"
                                        className="btn btn-primary cv-action-btn"
                                    >
                                        <Download size={18} />
                                        <span>Download PDF</span>
                                    </a>
                                    <a
                                        href={cvDocxPath}
                                        download="Amit_Kumar_Singh_CV.docx"
                                        className="btn btn-secondary cv-action-btn"
                                    >
                                        <Download size={18} />
                                        <span>Download .docx</span>
                                    </a>
                                </div>
                            </div>

                            <div className="cv-content-card cv-pdf-viewer-card">
                                <iframe
                                    src={`${cvPdfPath}#toolbar=1&view=FitH`}
                                    title="Amit Kumar Singh Curriculum Vitae"
                                    className="cv-pdf-frame"
                                />
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
