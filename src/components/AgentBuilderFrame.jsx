import React, { useRef, useState, useEffect } from 'react';
import { useBuildEngine } from '../context/BuildEngineContext';
import './AgentBuilderFrame.css';

const AgentBuilderFrame = ({
    id,
    agentName = 'Agent',
    action = 'placing',
    color = '#38bdf8',
    label = '',
    isBuilding = false,
    isDelivered = false,
    children,
    className = ''
}) => {
    const frameRef = useRef(null);
    const [measuredDims, setMeasuredDims] = useState({ w: 0, h: 0 });

    const {
        activeInspections = {},
        elementDimensions = {},
        spacingGuides = {},
        reviewedElements = {},
        interactiveTesting = {},
        agentsActive = true
    } = useBuildEngine() || {};

    const liveInspection = activeInspections[id];
    const liveDims = elementDimensions[id];
    const liveSpacing = spacingGuides[id];
    const isReviewed = reviewedElements[id];
    const isTestingHover = interactiveTesting[id];

    // Measure live DOM dimensions for tags
    useEffect(() => {
        if (!frameRef.current) return;
        const updateDims = () => {
            if (frameRef.current) {
                const rect = frameRef.current.getBoundingClientRect();
                setMeasuredDims({ w: Math.round(rect.width), h: Math.round(rect.height) });
            }
        };
        updateDims();
        window.addEventListener('resize', updateDims, { passive: true });
        return () => window.removeEventListener('resize', updateDims);
    }, [isBuilding, isDelivered]);

    // Show blueprint when element is actively under inspection or building and not delivered
    const showBlueprint = agentsActive && !isDelivered && (Boolean(liveInspection) || isBuilding);

    const activeColor = liveInspection?.color || color;
    const activeAgentName = liveInspection?.agentName || agentName;
    const activeAction = liveInspection?.action || action;
    const activeWidth = liveDims?.w || measuredDims.w;
    const activeHeight = liveDims?.h || measuredDims.h;

    // Optional dynamic sizing style if actively being resized
    const dynamicStyle = {
        '--frame-color': activeColor,
        ...(liveDims?.w ? { maxWidth: `${liveDims.w}px` } : {})
    };

    return (
        <div
            id={id}
            ref={frameRef}
            className={`agent-builder-frame ${showBlueprint ? 'blueprint-active' : ''} ${isDelivered ? 'delivered-active' : ''} ${isTestingHover ? 'agent-testing-hover' : ''} ${className}`}
            style={dynamicStyle}
        >
            {/* The Blueprint Wireframe Overlay with Handles (Active during assembly) */}
            {showBlueprint && (
                <>
                    <div className="blueprint-outline" />

                    {/* Corner & Midpoint Handles matching Figma / Canvas from the Video */}
                    <span className="builder-handle handle-tl" />
                    <span className="builder-handle handle-tc" />
                    <span className="builder-handle handle-tr" />
                    <span className="builder-handle handle-ml" />
                    <span className="builder-handle handle-mr" />
                    <span className="builder-handle handle-bl" />
                    <span className="builder-handle handle-bc" />
                    <span className="builder-handle handle-br" />

                    {/* Spec Tag at Top Left */}
                    <div className="builder-spec-tag">
                        <span className="spec-agent-tag">{activeAgentName} {activeAction}</span>
                        {activeWidth > 0 && (
                            <span className="spec-dims-tag">
                                {activeWidth} × {activeHeight}
                            </span>
                        )}
                    </div>
                </>
            )}

            {/* Temporary Spacing Measurement Guides (Figma-style) */}
            {agentsActive && liveSpacing && (
                <span className="builder-spacing-guide">
                    {liveSpacing}
                </span>
            )}

            {/* Temporary QA Review Pass Badge */}
            {agentsActive && isReviewed && (
                <span className="builder-review-badge">
                    QA PASS ✓
                </span>
            )}

            {/* Content Slot */}
            <div className="builder-content-slot">
                {children}
            </div>
        </div>
    );
};

export default AgentBuilderFrame;
