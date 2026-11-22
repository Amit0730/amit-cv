import React from 'react';
import { motion } from 'framer-motion';
import { useBuildEngine } from '../context/BuildEngineContext';
import AgentBuilderFrame from './AgentBuilderFrame';
import './TrackRecord.css';

const TRACK_RECORDS = [
    {
        role: "Software Engineer",
        org: "Eveneez / Startup systems",
        desc: "5-6 person startup building production mobile applications & AI services",
        year: "2026",
        agent: "Lint"
    },
    {
        role: "Team Lead",
        org: "Smart India Hackathon",
        desc: "National hackathon team lead architecting scalable full-stack portals",
        year: "2025",
        agent: "Typeset"
    },
    {
        role: "Two sites in production",
        org: "Live on Vercel & GitHub",
        desc: "Expensy, Aesthetic Clock, MediCore with active users & real metrics",
        year: "LIVE",
        agent: "Review"
    },
    {
        role: "B.Tech CSE",
        org: "Lovely Professional University",
        desc: "Computer Science & Engineering • AI & Machine Learning focus",
        year: "'26",
        agent: "Palette"
    },
    {
        role: "Creator & AI Engineer",
        org: "Tech & Agent Workflows",
        desc: "Autonomous multi-agent architectures, mobile systems & video engineering",
        year: "NOW",
        agent: "Motion"
    }
];

export default function TrackRecord() {
    const { trackDelivered, buildingStates, typedText = {}, agentsActive = true } = useBuildEngine();

    return (
        <section id="track-record" className="section track-section">
            <div className="container">
                <div className="track-layout-grid">
                    {/* Left Column: Giant Stat & Headline */}
                    <div className="track-left-col">
                        <AgentBuilderFrame
                            id="builder-track-title"
                            agentName="Typography"
                            action="typing"
                            color="#22C55E"
                            label="headline"
                            isBuilding={buildingStates.track}
                            isDelivered={trackDelivered.title}
                        >
                            <div className="track-header-box">
                                <span className="track-eyebrow">TRACK RECORD</span>
                                <h2 className="track-headline-impact" style={{ minHeight: '1.8em' }}>
                                    {trackDelivered.title || !agentsActive ? (
                                        <>BUILT FAST.<br /><span className="text-red-accent">SHIPPED REAL.</span></>
                                    ) : (
                                        typedText['builder-track-title'] !== undefined ? typedText['builder-track-title'] : ""
                                    )}
                                    {!trackDelivered.title && agentsActive && <span className="typing-cursor-blink">|</span>}
                                </h2>
                            </div>
                        </AgentBuilderFrame>

                        <AgentBuilderFrame
                            id="builder-track-stat"
                            agentName="Component"
                            action="mounting"
                            color="#3B82F6"
                            label="unit tests note"
                            isBuilding={buildingStates.track}
                            isDelivered={trackDelivered.stat40}
                        >
                            <div className="track-giant-stat-wrapper">
                                <div className="track-giant-number">40.</div>
                                <p className="track-stat-caption">
                                    unit tests, features, and production architectures shipped across apps and systems with zero regression.
                                </p>
                            </div>
                        </AgentBuilderFrame>
                    </div>

                    {/* Right Column: Experience Timeline List */}
                    <div className="track-right-col">
                        <AgentBuilderFrame
                            id="builder-track-timeline"
                            agentName="Review"
                            action="placing"
                            color="#F43F5E"
                            label="experience timeline"
                            isBuilding={buildingStates.track}
                            isDelivered={trackDelivered.timeline}
                        >
                            <div className="track-timeline-list">
                                {TRACK_RECORDS.map((item, idx) => (
                                    <motion.div
                                        key={idx}
                                        id={`track-item-${idx}`}
                                        className="track-timeline-item"
                                        initial={{ opacity: 0.6, y: 10 }}
                                        animate={{
                                            opacity: trackDelivered.timeline ? 1 : 0.85,
                                            y: 0
                                        }}
                                        transition={{ duration: 0.35, delay: idx * 0.08 }}
                                    >
                                        <div className="track-item-content">
                                            <div className="track-item-header">
                                                <h3 className="track-item-role">{item.role}</h3>
                                                <span className="track-item-org">{item.org}</span>
                                            </div>
                                            <p className="track-item-desc">{item.desc}</p>
                                        </div>
                                        <div className="track-item-year-badge">
                                            <span>{item.year}</span>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </AgentBuilderFrame>
                    </div>
                </div>
            </div>
        </section>
    );
}
