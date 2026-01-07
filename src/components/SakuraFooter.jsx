import { useEffect, useRef } from 'react';

export default function SakuraFooter() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        let W = canvas.width = window.innerWidth;
        let H = canvas.height = 180;

        const petals = [];
        const COUNT = 30;

        for (let i = 0; i < COUNT; i++) {
            petals.push({
                x: Math.random() * W,
                y: Math.random() * H,
                r: Math.random() * 7 + 3,
                vx: Math.random() * 0.6 - 0.3,
                vy: Math.random() * 0.8 + 0.4,
                rot: Math.random() * 360
            });
        }

        let animationId;
        function draw() {
            ctx.clearRect(0, 0, W, H);

            for (let p of petals) {
                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate(p.rot * Math.PI / 180);

                ctx.fillStyle = "rgba(255,150,220,0.85)";
                ctx.beginPath();
                ctx.ellipse(0, 0, p.r, p.r * 1.4, 0, 0, Math.PI * 2);
                ctx.fill();

                ctx.restore();

                p.x += p.vx;
                p.y += p.vy;
                p.rot += 1;

                if (p.y > H + 20) {
                    p.y = -10;
                    p.x = Math.random() * W;
                }
            }
            animationId = requestAnimationFrame(draw);
        }
        draw();

        const handleResize = () => {
            W = canvas.width = window.innerWidth;
            H = canvas.height = 180;
        };
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
            cancelAnimationFrame(animationId);
        };
    }, []);

    return <canvas ref={canvasRef} id="sakura-canvas"></canvas>;
}
