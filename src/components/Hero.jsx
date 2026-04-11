import Typewriter from 'typewriter-effect';
import { motion } from 'framer-motion';
import { Github, Linkedin, Instagram } from 'lucide-react';
import './Hero.css';

const Hero = () => {
    return (
        <section id="home" className="hero-section section">
            <div className="container hero-container">
                <motion.div
                    className="hero-content"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <p className="hero-greeting text-gradient">Hi, I'm</p>
                    <h1 className="hero-title">Amit Kumar Singh</h1>
                    <h2 className="hero-subtitle">
                        <Typewriter
                            options={{
                                strings: ['Software Engineer', 'AI/ML Engineer', 'Video Editor', 'Designer'],
                                autoStart: true,
                                loop: true,
                                delay: 40,
                                deleteSpeed: 20,
                            }}
                        />
                    </h2>
                    <p className="hero-description">
                        19-year-old engineering student at LPU, building intelligent systems and scalable technological innovations with a strong foundation in Artificial Intelligence and Software Development.
                    </p>

                    <motion.div
                        className="hero-actions delay-200"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.6, ease: "easeOut" }}
                    >
                        <a href="#projects" className="btn btn-primary">View Projects</a>
                        <a href="#contact" className="btn btn-secondary">Contact Me</a>
                    </motion.div>

                    <motion.div 
                        className="hero-socials delay-300"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.8, ease: "easeOut" }}
                    >
                        <a href="https://github.com/Amit0730" target="_blank" rel="noopener noreferrer" className="social-icon">
                            <Github size={24} />
                        </a>
                        <a href="https://www.linkedin.com/in/amitkumarsingh12/" target="_blank" rel="noopener noreferrer" className="social-icon">
                            <Linkedin size={24} />
                        </a>
                        <a href="https://x.com/amitKumar1466" target="_blank" rel="noopener noreferrer" className="social-icon">
                            <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                            </svg>
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                            <Instagram size={24} />
                        </a>
                        <a href="https://leetcode.com/u/amitkumarsi79007/" target="_blank" rel="noopener noreferrer" className="social-icon">
                            <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                                <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.001-1.954l-4.11-4.11a1.272 1.272 0 0 0-1.802 0l-1.049 1.049a1.272 1.272 0 0 0 0 1.802l2.308 2.308a.636.636 0 1 1-.899.901l-2.308-2.308a2.544 2.544 0 0 1 0-3.604l1.049-1.049a2.544 2.544 0 0 1 3.604 0l4.11 4.11c1.62 1.62 1.62 4.256 0 5.876l-2.396 2.392c-3.13 3.129-8.214 3.129-11.344 0l-4.277-4.193a8.55 8.55 0 0 1-1.838-2.628 8.618 8.618 0 0 1-.505-1.464 8.788 8.788 0 0 1-.098-3.766 8.544 8.544 0 0 1 .184-.757 8.554 8.554 0 0 1 1.956-3.398L7.116 3.676l5.406-5.406a1.374 1.374 0 0 0-.961-.438z"/>
                            </svg>
                        </a>
                    </motion.div>
                </motion.div>

                <motion.div
                    className="hero-image-container delay-300"
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                >
                    <div className="image-wrapper glass-panel">
                        <img src={`${import.meta.env.BASE_URL}images/profile1.jpg`} alt="Amit Kumar Singh" className="hero-image" />
                        <div className="image-overlay text-gradient"></div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
