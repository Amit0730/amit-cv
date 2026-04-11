import Typewriter from 'typewriter-effect';
import { motion } from 'framer-motion';
import { Github, Linkedin, Twitter, Instagram } from 'lucide-react';
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
                        <a href="https://github.com/Amit-coder24" target="_blank" rel="noopener noreferrer" className="social-icon">
                            <Github size={24} />
                        </a>
                        <a href="https://linkedin.com/in/amit-kumar-singh-082260288/" target="_blank" rel="noopener noreferrer" className="social-icon">
                            <Linkedin size={24} />
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                            <Twitter size={24} />
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                            <Instagram size={24} />
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
