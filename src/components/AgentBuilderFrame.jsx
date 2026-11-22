import React, { useRef, useState, useEffect, memo } from 'react';
import { useBuildEngine } from '../context/BuildEngineContext';
import './AgentBuilderFrame.css';

const AgentBuilderFrame = memo(({
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
        activeStyles = {},
        activeMedia = {},
        motionTests = {},
        agentsActive = true
    } = useBuildEngine() || {};

    const liveInspection = activeInspections[id];
    const liveDims = elementDimensions[id];
    const liveSpacing = spacingGuides[id];
    const isReviewed = reviewedElements[id];
    const isTestingHover = interactiveTesting[id];
    const liveStyle = activeStyles[id];
    const liveMedia = activeMedia[id];
    const liveMotionOffset = motionTests[id];

    // Issue H & Performance Fix: Only inspect & measure when actively targeted by an agent
    const hasActiveAgent = Boolean(liveInspection);
    const showActiveSelection = agentsActive && !isDelivered && hasActiveAgent;

    useEffect(() => {
        if (!showActiveSelection || !frameRef.current) return;
        const el = frameRef.current;
        setMeasuredDims({
            w: el.offsetWidth || Math.round(el.getBoundingClientRect().width),
            h: el.offsetHeight || Math.round(el.getBoundingClientRect().height)
        });
    }, [showActiveSelection]);

    // Fast-path: When element is completely delivered, render clean final markup
    if (isDelivered) {
        return (
            <div id={id} ref={frameRef} className={`agent-builder-frame delivered-active ${className}`}>
                <div className="builder-content-slot">
                    {children}
                </div>
            </div>
        );
    }

    const activeColor = liveInspection?.color || color;
    const activeAgentName = liveInspection?.agentName || agentName;
    const activeAction = liveInspection?.action || action;
    const activeWidth = liveDims?.w || measuredDims.w;
    const activeHeight = liveDims?.h || measuredDims.h;

    // Dynamic sizing and motion styles
    const dynamicStyle = {
        '--frame-color': activeColor,
        ...(liveDims?.w ? { width: `${liveDims.w}px`, maxWidth: '100%' } : {}),
        ...(liveDims?.h ? { height: `${liveDims.h}px` } : {}),
        ...(liveMotionOffset !== undefined ? { transform: `translate3d(0, ${liveMotionOffset}px, 0)` } : {})
    };

    return (
        <div
            id={id}
            ref={frameRef}
            className={`agent-builder-frame ${showActiveSelection ? 'blueprint-active' : ''} unbuilt-state ${isTestingHover ? 'agent-testing-hover' : ''} ${liveStyle ? 'agent-style-active' : ''} ${liveMedia ? 'agent-media-active' : ''} ${className}`}
            style={dynamicStyle}
        >
            {/* The Blueprint Wireframe Overlay with Handles (Active ONLY when assigned agent is working on it) */}
            {showActiveSelection && (
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
});

export default AgentBuilderFrame;
