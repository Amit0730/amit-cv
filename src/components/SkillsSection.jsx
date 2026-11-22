import React from 'react';
import { motion } from 'framer-motion';
import { useBuildEngine } from '../context/BuildEngineContext';
import AgentBuilderFrame from './AgentBuilderFrame';
import './SkillsSection.css';

const SKILLS_DATA = [
    { label: "LANGUAGES", items: "C++, Java, Python, JavaScript, TypeScript" },
    { label: "MOBILE", items: "React Native, Expo, Android Studio, Reanimated" },
    { label: "BACKEND", items: "Node.js, Express, MongoDB, RESTful APIs, Firebase" },
    { label: "WEB", items: "React, Next.js, Tailwind CSS, Vite, HTML5/CSS3" },
    { label: "AI & ML", items: "Claude, ChatGPT, Gemini API, PyTorch, MediaPipe" },
    { label: "DEV TOOLS", items: "Git, GitHub, Postman, Vercel, Docker, Blender" }
];

const PRINCIPLES = [
    {
        num: "01",
        title: "Test what can silently break",
        desc: "Pricing, validation, booking state. 40 unit tests written where there were none."
    },
    {
        num: "02",
        title: "AI in the loop",
        desc: "LLMs and autonomous agents make me faster. Engineering judgment decides what ships."
    },
    {
        num: "03",
        title: "Ship, then polish",
        desc: "Get it live on production first, observe real metrics, then iterate and refine."
    },
    {
        num: "04",
        title: "Keep practicing",
        desc: "Data structures, algorithms, and low-level engineering in C++ on LeetCode."
    }
];

export default function SkillsSection() {
    const { skillsDelivered, buildingStates, componentStages, activeStyles, agentsActive } = useBuildEngine();

    const eduStage = skillsDelivered.skills || !agentsActive ? 4 : (componentStages['builder-skills-edu'] || 0);
    const principlesStage = skillsDelivered.principles || !agentsActive ? 4 : (componentStages['builder-skills-principles'] || 0);
    const manifestoStyled = skillsDelivered.manifesto || !agentsActive || Boolean(activeStyles['builder-skills-manifesto']?.active);

    return (
        <section id="skills" className="section skills-section">
            <div className="container">
                <div className="skills-three-column-grid">
                    {/* Column 1: Education & Categorized Skills */}
                    <div className="skills-col-edu">
                        <AgentBuilderFrame
                            id="builder-skills-edu"
                            agentName="Layout"
                            action="placing"
                            color="#F59E0B"
                            label="education & skills"
                            isBuilding={buildingStates.skills}
                            isDelivered={skillsDelivered.skills}
                        >
                            <div className="skills-edu-card">
                                <span className="skills-eyebrow">EDUCATION & SKILLS</span>
                                
                                {eduStage === 0 ? (
                                    <div className="skills-edu-wireframe">
                                        <div className="skills-wireframe-bar" style={{ width: '70%', height: '22px', marginBottom: '8px' }} />
                                        <div className="skills-wireframe-bar" style={{ width: '45%', height: '14px', marginBottom: '24px' }} />
                                        {[1, 2, 3, 4, 5, 6].map((k) => (
                                            <div key={k} className="skill-cat-row" style={{ marginBottom: '14px' }}>
                                                <div className="skills-wireframe-bar" style={{ width: '25%', height: '10px', marginBottom: '4px' }} />
                                                <div className="skills-wireframe-bar" style={{ width: '85%', height: '14px' }} />
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <>
                                        <div className="skills-degree-box">
                                            <h3 className="skills-degree-title">B.Tech • Computer Science</h3>
                                            <p className="skills-degree-loc">Lovely Professional University • expected 2026</p>
                                        </div>

                                        <div className="skills-categories-stack">
                                            {SKILLS_DATA.map((cat, i) => {
                                                const visible = eduStage >= 3 || (eduStage === 2 && i < 4) || (eduStage === 1 && i < 2);
                                                return (
                                                    <div key={i} className="skill-cat-row" style={{ opacity: visible ? 1 : 0.25 }}>
                                                        <span className="skill-cat-label">{cat.label}</span>
                                                        <span className="skill-cat-items">
                                                            {visible ? cat.items : '········································'}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </>
                                )}
                            </div>
                        </AgentBuilderFrame>
                    </div>

                    {/* Column 2: How I Work (4 Principles) */}
                    <div className="skills-col-principles">
                        <AgentBuilderFrame
                            id="builder-skills-principles"
                            agentName="Copy"
                            action="typing"
                            color="#06B6D4"
                            label="engineering principles"
                            isBuilding={buildingStates.skills}
                            isDelivered={skillsDelivered.principles}
                        >
                            <div className="principles-card">
                                <span className="skills-eyebrow">HOW I WORK</span>
                                <div className="principles-stack">
                                    {PRINCIPLES.map((p, i) => {
                                        const isRevealed = principlesStage > i;
                                        return (
                                            <div key={i} className="principle-item">
                                                {isRevealed ? (
                                                    <>
                                                        <div className="principle-num-title">
                                                            <span className="principle-num">{p.num}</span>
                                                            <h4 className="principle-title">{p.title}</h4>
                                                        </div>
                                                        <p className="principle-desc">{p.desc}</p>
                                                    </>
                                                ) : (
                                                    <div className="principle-wireframe-placeholder">
                                                        <div className="principle-num-title">
                                                            <span className="principle-num" style={{ opacity: 0.3 }}>{p.num}</span>
                                                            <div className="skills-wireframe-bar" style={{ width: '60%', height: '18px' }} />
                                                        </div>
                                                        <div className="skills-wireframe-bar" style={{ width: '85%', height: '12px', marginTop: '6px', marginLeft: '1.6rem' }} />
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </AgentBuilderFrame>
                    </div>

                    {/* Column 3: The Orange-Red Manifesto Card */}
                    <div className="skills-col-manifesto">
                        <AgentBuilderFrame
                            id="builder-skills-manifesto"
                            agentName="Style"
                            action="coloring"
                            color="#EAB308"
                            label="manifesto card"
                            isBuilding={buildingStates.skills}
                            isDelivered={skillsDelivered.manifesto}
                        >
                            <motion.div
                                className={manifestoStyled ? "manifesto-card-accent" : "manifesto-card-wireframe"}
                                initial={{ opacity: 0.7, scale: 0.95 }}
                                animate={{
                                    opacity: manifestoStyled ? 1 : 0.6,
                                    scale: 1
                                }}
                                transition={{ type: 'spring', damping: 20, stiffness: 120 }}
                            >
                                <blockquote className="manifesto-quote-text">
                                    SHIP THE FEATURE. THEN WRITE THE TEST THAT PROVES IT CAN'T SILENTLY BREAK.
                                </blockquote>
                                <div className="manifesto-author">— Amit</div>
                            </motion.div>
                        </AgentBuilderFrame>
                    </div>
                </div>
            </div>
        </section>
    );
}
