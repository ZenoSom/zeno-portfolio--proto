import { useEffect, useRef } from 'react';

export default function Snow() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        let W = canvas.width = window.innerWidth;
        let H = canvas.height = window.innerHeight;

        const handleResize = () => {
            W = canvas.width = window.innerWidth;
            H = canvas.height = window.innerHeight;
        };
        window.addEventListener("resize", handleResize);

        const snowflakeChars = ['❄', '❅', '❆', '✻', '✼'];

        const flakes = [];
        // Dense population, reduced on mobile for performance
        const isMobile = window.innerWidth < 768;
        const baseDensity = Math.max(50, Math.round((W * H) / 35000));
        const density = isMobile ? Math.min(baseDensity, 60) : baseDensity;

        for (let i = 0; i < density; i++) {
            flakes.push({
                x: Math.random() * W,
                y: Math.random() * H,
                size: Math.random() * 20 + 10, // 10px to 30px (Varied sizes)
                char: snowflakeChars[Math.floor(Math.random() * snowflakeChars.length)],
                dx: (Math.random() - 0.5) * 0.8,
                dy: Math.random() * 1.5 + 0.5,
                alpha: Math.random() * 0.5 + 0.4,
                rotation: Math.random() * 360,
                rotationSpeed: (Math.random() - 0.5) * 0.02,
                glow: Math.random() > 0.85 // 15% chance to have White Glow
            });
        }

        let animationId;
        function frame() {
            ctx.clearRect(0, 0, W, H);

            for (const f of flakes) {
                ctx.save();
                ctx.globalAlpha = f.alpha;
                ctx.font = `${f.size}px Arial`;
                ctx.fillStyle = "#ffffff";

                // Rotation
                const centerX = f.x + f.size / 2;
                const centerY = f.y + f.size / 2;
                ctx.translate(centerX, centerY);
                f.rotation += f.rotationSpeed;
                ctx.rotate(f.rotation);
                ctx.translate(-centerX, -centerY);

                // GLOW EFFECT (White)
                if (f.glow) {
                    ctx.shadowBlur = 15;
                    ctx.shadowColor = "rgba(255, 255, 255, 0.9)";
                } else {
                    ctx.shadowBlur = 0;
                }

                ctx.fillText(f.char, f.x, f.y);
                ctx.restore();

                // Movement
                f.x += f.dx + Math.sin(f.y * 0.01) * 0.3;
                f.y += f.dy;

                // Loop
                if (f.y > H + 30) {
                    f.y = -30;
                    f.x = Math.random() * W;
                }
                if (f.x > W + 30) f.x = -30;
                if (f.x < -30) f.x = W + 30;
            }
            animationId = requestAnimationFrame(frame);
        }
        frame();

        return () => {
            window.removeEventListener("resize", handleResize);
            cancelAnimationFrame(animationId);
        };
    }, []);

    return <canvas ref={canvasRef} id="snow-canvas"></canvas>;
}
