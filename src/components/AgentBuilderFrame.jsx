import React, { useRef, useState, useEffect } from 'react';
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
    const [dimensions, setDimensions] = useState({ w: 0, h: 0 });

    useEffect(() => {
        if (!frameRef.current) return;
        const updateDims = () => {
            if (frameRef.current) {
                const rect = frameRef.current.getBoundingClientRect();
                setDimensions({ w: Math.round(rect.width), h: Math.round(rect.height) });
            }
        };
        updateDims();
        window.addEventListener('resize', updateDims, { passive: true });
        return () => window.removeEventListener('resize', updateDims);
    }, [isBuilding, isDelivered]);

    const showBlueprint = isBuilding && !isDelivered;

    return (
        <div
            id={id}
            ref={frameRef}
            className={`agent-builder-frame ${showBlueprint ? 'blueprint-active' : ''} ${isDelivered ? 'delivered-active' : ''} ${className}`}
            style={{ '--frame-color': color }}
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

                    {/* Blue / Agent Spec Tag at Top Left (Exact match to video crop) */}
                    <div className="builder-spec-tag">
                        <span className="spec-agent-tag">{agentName} {action}</span>
                        {dimensions.w > 0 && (
                            <span className="spec-dims-tag">
                                {dimensions.w} × {dimensions.h}
                            </span>
                        )}
                    </div>
                </>
            )}

            {/* Content Slot */}
            <div className="builder-content-slot">
                {children}
            </div>
        </div>
    );
};

export default AgentBuilderFrame;
