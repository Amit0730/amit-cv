import React, { useRef, useState, useEffect } from 'react';
import './AgentBuilderFrame.css';

const AgentBuilderFrame = ({
    id,
    agentName = 'Agent',
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
            {/* The Blueprint Wireframe Overlay (Active during assembly) */}
            {showBlueprint && (
                <>
                    <div className="blueprint-outline" />

                    {/* 4 Corner Resize Handles */}
                    <span className="builder-handle handle-tl" />
                    <span className="builder-handle handle-tr" />
                    <span className="builder-handle handle-bl" />
                    <span className="builder-handle handle-br" />

                    {/* Floating Element Spec Tag */}
                    <div className="builder-spec-tag">
                        <span className="spec-agent-dot" style={{ backgroundColor: color }} />
                        <span className="spec-agent-name">{agentName}</span>
                        <span className="spec-divider">•</span>
                        <span className="spec-dims">
                            {dimensions.w > 0 ? `${dimensions.w}×${dimensions.h}px` : label || 'sizing...'}
                        </span>
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
