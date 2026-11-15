import React from 'react';
import { motion } from 'framer-motion';
import ClashingLaserBorder from './ClashingLaserBorder';
import { calculateAge } from '../utils/age';
import { useBuildEngine } from '../context/BuildEngineContext';
import './About.css';

const About = () => {
    const { aboutDelivered } = useBuildEngine();

    return (
        <section id="about" className="section about-section">
            <div className="container">
                {/* Section Header: Brought in by Agent Motion */}
                <motion.div
                    className="section-header"
                    initial={{ y: -80, opacity: 0, scale: 0.9 }}
                    animate={{ 
                        y: aboutDelivered.title ? 0 : -80, 
                        opacity: aboutDelivered.title ? 1 : 0, 
                        scale: aboutDelivered.title ? 1 : 0.9 
                    }}
                    transition={{ type: 'spring', damping: 18, stiffness: 120 }}
                >
                    <div className="section-eyebrow-red">ABOUT</div>
                    <h2 className="section-title-impact">
                        NOT JUST CODE.<br />
                        <span style={{ color: '#EF4444' }}>CODE THAT SHIPS.</span>
                    </h2>
                </motion.div>

                <div className="about-grid">
                    {/* 2nd Photo: Brought in by Agent Palette */}
                    <motion.div
                        className="about-image-container"
                        initial={{ x: -260, y: 30, opacity: 0, scale: 0.88, rotate: -3 }}
                        animate={{ 
                            x: aboutDelivered.photo2 ? 0 : -260, 
                            y: aboutDelivered.photo2 ? 0 : 30, 
                            opacity: aboutDelivered.photo2 ? 1 : 0, 
                            scale: aboutDelivered.photo2 ? 1 : 0.88,
                            rotate: aboutDelivered.photo2 ? 0 : -3
                        }}
                        transition={{ type: 'spring', damping: 20, stiffness: 110 }}
                    >
                        {/* 4-Phase Clashing Laser Border on Both Parallel Sides */}
                        <ClashingLaserBorder />

                        <div className="about-image-wrapper glass-panel">
                            <img src={`${import.meta.env.BASE_URL}images/profile2.jpg`} alt="Amit at LPU" className="about-image" />
                        </div>
                    </motion.div>

                    {/* Bio Story: Brought in by Agent Copy */}
                    <motion.div
                        className="about-content"
                        initial={{ x: 260, opacity: 0, scale: 0.92 }}
                        animate={{ 
                            x: aboutDelivered.bio ? 0 : 260, 
                            opacity: aboutDelivered.bio ? 1 : 0, 
                            scale: aboutDelivered.bio ? 1 : 0.92 
                        }}
                        transition={{ type: 'spring', damping: 20, stiffness: 110 }}
                    >
                        <h3 className="about-heading text-gradient">Driven by logic, guided by innovation.</h3>

                        <p className="about-text">
                            I am Amit Kumar Singh, a passionate {calculateAge()}-year-old engineering student at Lovely Professional University (LPU), India. My academic journey is deeply rooted in <strong>Artificial Intelligence and Software Development</strong>. I thrive on the intersection of logical problem solving and creative engineering.
                        </p>

                        <p className="about-text">
                            Beyond pure coding, I also possess strong design and editing capabilities. I have good knowledge and hands-on experience mastering tools like <strong>Android Studio, Adobe Photoshop, Premiere Pro, and Blender</strong> for creative workflows.
                        </p>

                        <p className="about-text">
                            When I'm not glued to a screen building tech or hacking away, you'll find me following my passions for <strong>Motorsports (F1 & MotoGP), bikes, and cars</strong>. I'm also a huge sports enthusiast, closely tracking <strong>MMA, Football, and Basketball</strong>.
                        </p>

                        <div className="about-quote">
                            "Building software is not about typing code, it's about solving real-world friction and shipping architectures that endure."
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default About;
