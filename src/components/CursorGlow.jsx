import { useEffect, useRef } from 'react';
import './CursorGlow.css';

const CursorGlow = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let lastX = -1;
        let lastY = -1;
        
        const maxParticles = 24;
        let particles = [];

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize, { passive: true });

        // Pure vivid colors: Red, Blue, Purple
        const colors = [
            '#ff0055', // Pure Neon Red
            '#0066ff', // Pure Cobalt Blue
            '#a855f7', // Pure Neon Purple
            '#ff2a6d', // Electric Red
            '#00d2ff'  // Electric Cyan-Blue
        ];

        const handleMouseMove = (e) => {
            const x = e.clientX;
            const y = e.clientY;

            if (lastX !== -1) {
                const dx = x - lastX;
                const dy = y - lastY;
                const dist = Math.sqrt(dx * dx + dy * dy);

                // Spawn kinetic spark particles directly along mouse movement
                if (dist > 2) {
                    const count = Math.min(Math.floor(dist / 3) + 1, 3);
                    for (let i = 0; i < count; i++) {
                        if (particles.length >= maxParticles) break;

                        const color = colors[Math.floor(Math.random() * colors.length)];
                        const angle = Math.random() * Math.PI * 2;
                        const speed = Math.random() * 4 + 1.5;

                        particles.push({
                            x: x + (Math.random() - 0.5) * 4,
                            y: y + (Math.random() - 0.5) * 4,
                            vx: Math.cos(angle) * speed + dx * 0.1,
                            vy: Math.sin(angle) * speed + dy * 0.1,
                            size: Math.random() * 2.8 + 1.6,
                            alpha: 1,
                            decay: 0.08, // Quick, smooth dissipation
                            color
                        });
                    }
                }
            }

            lastX = x;
            lastY = y;
        };

        const handleMouseLeave = () => {
            lastX = -1;
            lastY = -1;
        };

        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];
                p.x += p.vx;
                p.y += p.vy;
                p.vx *= 0.90;
                p.vy *= 0.90;
                p.alpha -= p.decay;
                p.size *= 0.93;

                if (p.alpha <= 0 || p.size <= 0.4) {
                    particles.splice(i, 1);
                    continue;
                }

                ctx.save();
                ctx.globalAlpha = p.alpha;
                ctx.fillStyle = p.color;
                ctx.shadowBlur = 8;
                ctx.shadowColor = p.color;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }

            animationFrameId = requestAnimationFrame(render);
        };

        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        window.addEventListener('mouseleave', handleMouseLeave, { passive: true });
        render();

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseleave', handleMouseLeave);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div className="spark-trail-wrapper">
            <canvas ref={canvasRef} className="spark-trail-canvas" />
        </div>
    );
};

export default CursorGlow;
