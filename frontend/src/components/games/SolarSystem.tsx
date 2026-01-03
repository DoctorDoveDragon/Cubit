'use client'

import React, { useRef, useEffect, useState } from 'react';

interface Planet {
    name: string;
    distance: number;
    size: number;
    color: string;
    speed: number;
    angle: number;
}

export default function SolarSystem() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isAnimating, setIsAnimating] = useState(true);
    const [speed, setSpeed] = useState(1);
    const animationRef = useRef<number | undefined>(undefined);

    const planetsInitial: Planet[] = [
        { name: 'Mercury', distance: 50, size: 4, color: '#8c7853', speed: 4.74, angle: 0 },
        { name: 'Venus', distance: 70, size: 9, color: '#ffc649', speed: 3.50, angle: 0 },
        { name: 'Earth', distance: 95, size: 10, color: '#4a9eff', speed: 2.98, angle: 0 },
        { name: 'Mars', distance: 120, size: 6, color: '#ff6347', speed: 2.41, angle: 0 },
        { name: 'Jupiter', distance: 170, size: 20, color: '#f4a460', speed: 1.31, angle: 0 },
        { name: 'Saturn', distance: 210, size: 18, color: '#daa520', speed: 0.97, angle: 0 },
    ];

    // Keep the animated angles in a ref to avoid re-rendering every frame.
    const planetsRef = useRef<Planet[]>(planetsInitial.map(p => ({ ...p })));
    const [planetStates, setPlanetStates] = useState<Planet[]>(planetsInitial);
    // Precompute star field so it doesn't flicker each frame
    const starsRef = useRef<{ x: number; y: number }[] | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        const ensureStars = () => {
            if (!starsRef.current) {
                const stars: { x: number; y: number }[] = [];
                for (let i = 0; i < 100; i++) {
                    stars.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height });
                }
                starsRef.current = stars;
            }
        };

        const drawFrame = (deltaFactor = 1) => {
            // Clear canvas
            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw stars (precomputed)
            ensureStars();
            ctx.fillStyle = '#fff';
            starsRef.current!.forEach(s => ctx.fillRect(s.x, s.y, 1, 1));

            // Draw Sun
            const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 25);
            gradient.addColorStop(0, '#ffff00');
            gradient.addColorStop(1, '#ff8800');
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(centerX, centerY, 25, 0, Math.PI * 2);
            ctx.fill();

            // Draw orbits and planets using planetsRef
            planetsRef.current.forEach(planet => {
                // Draw orbit
                ctx.strokeStyle = '#333';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.arc(centerX, centerY, planet.distance, 0, Math.PI * 2);
                ctx.stroke();

                // Update angle in place
                planet.angle += planet.speed * 0.001 * speed * deltaFactor;

                // Calculate position
                const x = centerX + Math.cos(planet.angle) * planet.distance;
                const y = centerY + Math.sin(planet.angle) * planet.distance;

                // Draw planet
                ctx.fillStyle = planet.color;
                ctx.beginPath();
                ctx.arc(x, y, planet.size, 0, Math.PI * 2);
                ctx.fill();

                // Draw planet name
                ctx.fillStyle = '#fff';
                ctx.font = '10px sans-serif';
                ctx.fillText(planet.name, x - 15, y - planet.size - 5);
            });
        };

        const animate = () => {
            drawFrame();
            if (isAnimating) {
                animationRef.current = requestAnimationFrame(animate);
            }
        };

        if (isAnimating) {
            animate();
        }

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [isAnimating, speed]);

    return (
        <div className="flex flex-col items-center gap-4">
            <canvas
                ref={canvasRef}
                width={500}
                height={500}
                className="border-4 border-[var(--color-accent)] rounded"
                style={{ backgroundColor: '#000' }}
            />

            <div className="flex gap-4 items-center">
                <button
                    onClick={() => setIsAnimating(!isAnimating)}
                    className={`px-6 py-2 rounded font-semibold ${isAnimating
                        ? 'bg-orange-500 text-white'
                        : 'bg-[var(--color-accent)] text-white'
                        }`}
                >
                    {isAnimating ? '⏸️ Pause' : '▶️ Play'}
                </button>
                <button
                    onClick={() => {
                        // Step one frame when paused
                        if (!isAnimating) {
                            const canvas = canvasRef.current;
                            if (!canvas) return;
                            const ctx = canvas.getContext('2d');
                            if (!ctx) return;
                            // draw one small step
                            const centerX = canvas.width / 2;
                            const centerY = canvas.height / 2;
                            // clear and redraw (simple)
                            ctx.fillStyle = '#000';
                            ctx.fillRect(0, 0, canvas.width, canvas.height);
                            // draw stars
                            for (let i = 0; i < 100; i++) {
                                const x = Math.random() * canvas.width;
                                const y = Math.random() * canvas.height;
                                ctx.fillStyle = '#fff';
                                ctx.fillRect(x, y, 1, 1);
                            }
                            // draw sun
                            const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 25);
                            gradient.addColorStop(0, '#ffff00');
                            gradient.addColorStop(1, '#ff8800');
                            ctx.fillStyle = gradient;
                            ctx.beginPath();
                            ctx.arc(centerX, centerY, 25, 0, Math.PI * 2);
                            ctx.fill();
                            // advance each planet a single small step and draw
                            planetsRef.current.forEach(planet => {
                                planet.angle += planet.speed * 0.001 * speed;
                                const x = centerX + Math.cos(planet.angle) * planet.distance;
                                const y = centerY + Math.sin(planet.angle) * planet.distance;
                                ctx.fillStyle = planet.color;
                                ctx.beginPath();
                                ctx.arc(x, y, planet.size, 0, Math.PI * 2);
                                ctx.fill();
                                ctx.fillStyle = '#fff';
                                ctx.font = '10px sans-serif';
                                ctx.fillText(planet.name, x - 15, y - planet.size - 5);
                            });
                            // reflect positions in legend by updating state
                            setPlanetStates(planetsRef.current.map(p => ({ ...p })));
                        }
                    }}
                    className="px-4 py-2 rounded bg-[var(--color-surface)] text-[var(--color-muted)] font-semibold"
                >
                    Step ▶
                </button>
                <div className="flex items-center gap-2">
                    <label className="text-sm">Speed:</label>
                    <input
                        type="range"
                        min="0.1"
                        max="5"
                        step="0.1"
                        value={speed}
                        onChange={(e) => setSpeed(Number(e.target.value))}
                        className="w-32"
                    />
                    <span className="text-sm">{speed.toFixed(1)}x</span>
                </div>

                <button
                    onClick={() => {
                        // reset angles and state
                        planetsRef.current = planetsInitial.map(p => ({ ...p }));
                        setPlanetStates(planetsInitial.map(p => ({ ...p })));
                    }}
                    className="px-6 py-2 rounded bg-gray-600 text-white font-semibold hover:opacity-80 transition"
                >
                    Reset
                </button>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs">
                {planetStates.map(planet => (
                    <div key={planet.name} className="flex items-center gap-2">
                        <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: planet.color }}
                        />
                        <span>{planet.name}</span>
                    </div>
                ))}
            </div>

            <p className="text-sm text-[var(--color-muted)] text-center max-w-md">
                Watch the planets orbit the Sun! Relative orbital speeds are based on real solar system data.
            </p>
        </div>
    );
}
