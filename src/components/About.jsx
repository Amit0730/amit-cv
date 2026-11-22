import React from 'react';
import { motion } from 'framer-motion';
import ClashingLaserBorder from './ClashingLaserBorder';
import { calculateAge } from '../utils/age';
import { useBuildEngine } from '../context/BuildEngineContext';
import AgentBuilderFrame from './AgentBuilderFrame';
import './About.css';

const About = () => {
    const {
        aboutDelivered = { title: true, photo2: true, bio: true },
        buildingStates = {},
        typedText = {},
        agentsActive = true
    } = useBuildEngine() || {};

    return (
        <section id="about" className="section about-section">
            <div className="container">
                {/* 1. Section Header: Built by Typography */}
                <AgentBuilderFrame
                    id="builder-about-title"
                    agentName="Typography"
                    action="typing"
                    color="#22C55E"
                    label="headline: 640×120"
                    isBuilding={buildingStates?.about}
                    isDelivered={aboutDelivered?.title}
                >
                    <motion.div
                        className="section-header"
                        initial={{ opacity: 0.5, scale: 0.95 }}
                        animate={{ 
                            opacity: aboutDelivered?.title ? 1 : 0.85, 
                            scale: 1
                        }}
                        transition={{ type: 'spring', damping: 18, stiffness: 120 }}
                    >
                        <div className="section-eyebrow-red">ABOUT</div>
                        <h2 className="section-title-impact" style={{ minHeight: '1.8em' }}>
                            {aboutDelivered?.title || !agentsActive ? (
                                <>NOT JUST CODE.<br /><span style={{ color: '#EF4444' }}>CODE THAT SHIPS.</span></>
                            ) : (
                                typedText['builder-about-title'] !== undefined ? typedText['builder-about-title'] : ""
                            )}
                            {!aboutDelivered?.title && agentsActive && <span className="typing-cursor-blink">|</span>}
                        </h2>
                    </motion.div>
                </AgentBuilderFrame>

                <div className="about-grid">
                    {/* 2. Photo 2: Built by Media Agent */}
                    <AgentBuilderFrame
                        id="builder-about-photo"
                        agentName="Media"
                        action="mounting"
                        color="#F97316"
                        label="photo: 340×430"
                        isBuilding={buildingStates?.about}
                        isDelivered={aboutDelivered?.photo2}
                    >
                        <motion.div
                            className="about-image-container"
                            initial={{ opacity: 0.5, scale: 0.92 }}
                            animate={{ 
                                opacity: aboutDelivered?.photo2 ? 1 : 0.85, 
                                scale: 1
                            }}
                            transition={{ type: 'spring', damping: 20, stiffness: 110 }}
                        >
                            {aboutDelivered?.photo2 && <ClashingLaserBorder />}

                            <div className="about-image-wrapper glass-panel">
                                {aboutDelivered?.photo2 || !agentsActive ? (
                                    <img src={`${import.meta.env.BASE_URL}images/profile2.jpg`} alt="Amit at LPU" className="about-image" />
                                ) : (
                                    <div className="portrait-wireframe-slot" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: '340px', background: 'rgba(255, 255, 255, 0.02)', border: '1px dashed rgba(255, 255, 255, 0.12)', borderRadius: '16px' }}>
                                        <span className="wireframe-pill" style={{ padding: '6px 14px', borderRadius: '999px', background: 'rgba(255, 255, 255, 0.05)', fontSize: '11px', color: '#71717A', fontFamily: 'monospace' }}>
                                            [LPU CAMPUS PORTRAIT WIREFRAME]
                                        </span>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </AgentBuilderFrame>

                    {/* 3. Bio Story: Built by Copy Agent */}
                    <AgentBuilderFrame
                        id="builder-about-bio"
                        agentName="Copy"
                        action="authoring"
                        color="#06B6D4"
                        label="editorial: 580×420"
                        isBuilding={buildingStates?.about}
                        isDelivered={aboutDelivered?.bio}
                    >
                        <motion.div
                            className="about-content"
                            initial={{ opacity: 0.5, scale: 0.95 }}
                            animate={{ 
                                opacity: aboutDelivered?.bio ? 1 : 0.85, 
                                scale: 1
                            }}
                            transition={{ type: 'spring', damping: 20, stiffness: 110 }}
                        >
                            <h3 className="about-heading text-gradient">Driven by logic, guided by innovation.</h3>

                            {aboutDelivered?.bio || !agentsActive ? (
                                <>
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
                                </>
                            ) : typedText['builder-about-bio'] !== undefined ? (
                                <p className="about-text">
                                    {typedText['builder-about-bio']}
                                    <span className="typing-cursor-blink">|</span>
                                </p>
                            ) : (
                                <div className="about-wireframe-stack" style={{ display: 'flex', flexDirection: 'column', gap: '12px', margin: '18px 0' }}>
                                    <span className="wireframe-bar" style={{ width: '95%', height: '14px' }} />
                                    <span className="wireframe-bar" style={{ width: '88%', height: '14px' }} />
                                    <span className="wireframe-bar" style={{ width: '70%', height: '14px' }} />
                                </div>
                            )}
                        </motion.div>
                    </AgentBuilderFrame>
                </div>
            </div>
        </section>
    );
};

export default About;
