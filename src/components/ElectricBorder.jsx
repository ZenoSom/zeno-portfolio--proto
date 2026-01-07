import { useEffect, useState, useRef } from 'react';

export default function ElectricBorder() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Dynamic import logic or simple class definition adapted from CodePen/electric.js
        // Since we have the logic, I will inline the class here to ensure it works within the React component scope easily
        // and doesn't pollute global scope.

        class ElectricBorderAnim {
            constructor(canvas, options = {}) {
                this.canvas = canvas;
                this.ctx = this.canvas.getContext("2d");

                // Configuration
                this.width = options.width || 354;
                this.height = options.height || 504;
                this.octaves = options.octaves || 10;
                this.lacunarity = options.lacunarity || 1.6;
                this.gain = options.gain || 0.6;
                this.amplitude = options.amplitude || 0.2;
                this.frequency = options.frequency || 5;
                this.baseFlatness = options.baseFlatness || 0.2;
                this.displacement = options.displacement || 60;
                this.speed = options.speed || 1;
                this.borderOffset = options.borderOffset || 60;
                this.borderRadius = options.borderRadius || 40;
                this.lineWidth = options.lineWidth || 1;
                this.color = options.color || "#DD8448";

                this.animationId = null;
                this.time = 0;
                this.lastFrameTime = 0;

                this.canvas.width = this.width;
                this.canvas.height = this.height;

                this.start();
            }

            random(x) {
                return (Math.sin(x * 12.9898) * 43758.5453) % 1;
            }

            noise2D(x, y) {
                const i = Math.floor(x);
                const j = Math.floor(y);
                const fx = x - i;
                const fy = y - j;
                const a = this.random(i + j * 57);
                const b = this.random(i + 1 + j * 57);
                const c = this.random(i + (j + 1) * 57);
                const d = this.random(i + 1 + (j + 1) * 57);
                const ux = fx * fx * (3.0 - 2.0 * fx);
                const uy = fy * fy * (3.0 - 2.0 * fy);
                return (
                    a * (1 - ux) * (1 - uy) +
                    b * ux * (1 - uy) +
                    c * (1 - ux) * uy +
                    d * ux * uy
                );
            }

            octavedNoise(x, octaves, lacunarity, gain, baseAmplitude, baseFrequency, time = 0, seed = 0, baseFlatness = 1.0) {
                let y = 0;
                let amplitude = baseAmplitude;
                let frequency = baseFrequency;
                for (let i = 0; i < octaves; i++) {
                    let octaveAmplitude = amplitude;
                    if (i === 0) octaveAmplitude *= baseFlatness;
                    y += octaveAmplitude * this.noise2D(frequency * x + seed * 100, time * frequency * 0.3);
                    frequency *= lacunarity;
                    amplitude *= gain;
                }
                return y;
            }

            getRoundedRectPoint(t, left, top, width, height, radius) {
                const straightWidth = width - 2 * radius;
                const straightHeight = height - 2 * radius;
                const cornerArc = (Math.PI * radius) / 2;
                const totalPerimeter = 2 * straightWidth + 2 * straightHeight + 4 * cornerArc;
                const distance = t * totalPerimeter;
                let accumulated = 0;

                if (distance <= accumulated + straightWidth) return { x: left + radius + (distance - accumulated), y: top };
                accumulated += straightWidth;

                if (distance <= accumulated + cornerArc) return this.getCornerPoint(left + width - radius, top + radius, radius, -Math.PI / 2, Math.PI / 2, (distance - accumulated) / cornerArc);
                accumulated += cornerArc;

                if (distance <= accumulated + straightHeight) return { x: left + width, y: top + radius + (distance - accumulated) };
                accumulated += straightHeight;

                if (distance <= accumulated + cornerArc) return this.getCornerPoint(left + width - radius, top + height - radius, radius, 0, Math.PI / 2, (distance - accumulated) / cornerArc);
                accumulated += cornerArc;

                if (distance <= accumulated + straightWidth) return { x: left + width - radius - (distance - accumulated), y: top + height };
                accumulated += straightWidth;

                if (distance <= accumulated + cornerArc) return this.getCornerPoint(left + radius, top + height - radius, radius, Math.PI / 2, Math.PI / 2, (distance - accumulated) / cornerArc);
                accumulated += cornerArc;

                if (distance <= accumulated + straightHeight) return { x: left, y: top + height - radius - (distance - accumulated) };
                accumulated += straightHeight;

                return this.getCornerPoint(left + radius, top + radius, radius, Math.PI, Math.PI / 2, (distance - accumulated) / cornerArc);
            }

            getCornerPoint(centerX, centerY, radius, startAngle, arcLength, progress) {
                const angle = startAngle + progress * arcLength;
                return { x: centerX + radius * Math.cos(angle), y: centerY + radius * Math.sin(angle) };
            }

            drawElectricBorder(currentTime = 0) {
                if (!this.canvas || !this.ctx) return;
                const deltaTime = (currentTime - this.lastFrameTime) / 1000;
                this.time += deltaTime * this.speed;
                this.lastFrameTime = currentTime;
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                this.ctx.strokeStyle = this.color;
                this.ctx.lineWidth = this.lineWidth;
                this.ctx.lineCap = "round";
                this.ctx.lineJoin = "round";
                const scale = this.displacement;
                const left = this.borderOffset;
                const top = this.borderOffset;
                const borderWidth = this.canvas.width - 2 * this.borderOffset;
                const borderHeight = this.canvas.height - 2 * this.borderOffset;
                const maxRadius = Math.min(borderWidth, borderHeight) / 2;
                const radius = Math.min(this.borderRadius, maxRadius);
                const approximatePerimeter = 2 * (borderWidth + borderHeight) + 2 * Math.PI * radius;
                const sampleCount = Math.floor(approximatePerimeter / 2);
                this.ctx.beginPath();

                for (let i = 0; i <= sampleCount; i++) {
                    const progress = i / sampleCount;
                    const point = this.getRoundedRectPoint(progress, left, top, borderWidth, borderHeight, radius);
                    const xNoise = this.octavedNoise(progress * 8, this.octaves, this.lacunarity, this.gain, this.amplitude, this.frequency, this.time, 0, this.baseFlatness);
                    const yNoise = this.octavedNoise(progress * 8, this.octaves, this.lacunarity, this.gain, this.amplitude, this.frequency, this.time, 1, this.baseFlatness);
                    const displacedX = point.x + xNoise * scale;
                    const displacedY = point.y + yNoise * scale;
                    if (i === 0) this.ctx.moveTo(displacedX, displacedY);
                    else this.ctx.lineTo(displacedX, displacedY);
                }
                this.ctx.closePath();
                this.ctx.stroke();
                this.animationId = requestAnimationFrame((time) => this.drawElectricBorder(time));
            }

            start() { this.animationId = requestAnimationFrame((time) => this.drawElectricBorder(time)); }
            stop() { if (this.animationId) { cancelAnimationFrame(this.animationId); this.animationId = null; } }
        }

        const anim = new ElectricBorderAnim(canvas, {
            width: 475,
            height: 900,
            octaves: 10,
            lacunarity: 1.6,
            gain: 0.7,
            amplitude: 0.075,
            frequency: 10,
            baseFlatness: 0,
            displacement: 60,
            speed: 1.5,
            borderOffset: 60,
            borderRadius: 24,
            lineWidth: 1,
            color: "#00ff88"
        });

        return () => anim.stop();

    }, []);

    return <canvas ref={canvasRef} id="electric-border-canvas" className="electric-border-canvas" width="475" height="900"></canvas>;
}
