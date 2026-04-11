import { motion } from 'framer-motion';
import './About.css';

const About = () => {
    return (
        <section id="about" className="section about-section">
            <div className="container">
                <motion.div
                    className="section-header"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="section-title">About Me</h2>
                    <div className="title-underline"></div>
                </motion.div>

                <div className="about-grid">
                    <motion.div
                        className="about-image-wrapper glass-panel"
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <img src="/images/profile2.jpg" alt="Amit at LPU" className="about-image" />
                    </motion.div>

                    <motion.div
                        className="about-content"
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                    >
                        <h3 className="about-heading text-gradient">Driven by logic, guided by innovation.</h3>

                        <p className="about-text">
                            I am Amit Kumar Singh, a passionate 19-year-old engineering student at Lovely Professional University (LPU), India. My academic journey is deeply rooted in <strong>Artificial Intelligence and Software Development</strong>. I thrive on the intersection of logical problem solving and creative engineering.
                        </p>

                        <p className="about-text">
                            Beyond pure coding, I also possess strong design and editing capabilities. I have good knowledge and hands-on experience mastering tools like <strong>Adobe Photoshop, Premiere Pro, and Blender</strong> for creative workflows.
                        </p>

                        <p className="about-text">
                            When I'm not glued to a screen building tech or hacking away, you'll find me following my passions for <strong>Motorsports (F1 & MotoGP), bikes, and cars</strong>. I'm also a huge sports enthusiast, closely tracking <strong>MMA, Football, and Basketball</strong>.
                        </p>

                        <motion.div
                            className="skills-container"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.1 }}
                            variants={{
                                visible: {
                                    transition: { staggerChildren: 0.15 }
                                }
                            }}
                        >
                            {[
                                { name: "Artificial Intelligence", level: "90%" },
                                { name: "Software Engineering", level: "85%" },
                                { name: "Video Editing (Premiere Pro)", level: "80%" },
                                { name: "Design & 3D (Photoshop, Blender)", level: "75%" }
                            ].map((skill, index) => (
                                <motion.div
                                    key={index}
                                    className="skill-item"
                                    variants={{
                                        hidden: { opacity: 0, y: 20 },
                                        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
                                    }}
                                >
                                    <span className="skill-name">{skill.name}</span>
                                    <div className="skill-bar">
                                        <motion.div
                                            className="skill-fill"
                                            initial={{ width: 0 }}
                                            whileInView={{ width: skill.level }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
                                        ></motion.div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default About;
