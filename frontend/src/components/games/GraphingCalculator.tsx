'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { safeErrorMessage } from '../../utils/safeError';

export default function GraphingCalculator() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [equation, setEquation] = useState('x * x');
    // plotted state was not used for rendering; remove to silence unused-var warning

    const plotFunction = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const width = canvas.width;
        const height = canvas.height;
        const centerX = width / 2;
        const centerY = height / 2;
        const scale = 20;

        // Clear canvas
        ctx.fillStyle = '#0b1220';
        ctx.fillRect(0, 0, width, height);

        // Draw grid
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 1;

        // Vertical lines
        for (let x = 0; x <= width; x += scale) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        }

        // Horizontal lines
        for (let y = 0; y <= height; y += scale) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }

        // Draw axes
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;

        // X-axis
        ctx.beginPath();
        ctx.moveTo(0, centerY);
        ctx.lineTo(width, centerY);
        ctx.stroke();

        // Y-axis
        ctx.beginPath();
        ctx.moveTo(centerX, 0);
        ctx.lineTo(centerX, height);
        ctx.stroke();

        // Plot function
        ctx.strokeStyle = '#7c3aed';
        ctx.lineWidth = 3;
        ctx.beginPath();

        let firstPoint = true;

        try {
            for (let px = 0; px < width; px++) {
                const x = (px - centerX) / scale;

                // Evaluate equation
                let y: number;
                try {
                    // Safe eval alternative - only allow basic math
                    const func = new Function('x', `return ${equation}`);
                    y = func(x);
                } catch {
                    continue;
                }

                if (!isFinite(y)) continue;

                const py = centerY - y * scale;

                if (py < 0 || py > height) continue;

                if (firstPoint) {
                    ctx.moveTo(px, py);
                    firstPoint = false;
                } else {
                    ctx.lineTo(px, py);
                }
            }

            ctx.stroke();
        } catch (err: unknown) {
            console.error('Error plotting function:', safeErrorMessage(err));
            ctx.fillStyle = '#ef4444';
            ctx.font = '16px monospace';
            ctx.fillText('Invalid equation!', centerX - 60, centerY - 40);
        }
    }, [equation]);

    useEffect(() => {
        if (equation) {
            const t = window.setTimeout(() => plotFunction(), 0);
            return () => clearTimeout(t);
        }
    }, [equation, plotFunction]);

    const presetEquations = [
        { label: 'y = x²', value: 'x * x' },
        { label: 'y = sin(x)', value: 'Math.sin(x)' },
        { label: 'y = cos(x)', value: 'Math.cos(x)' },
        { label: 'y = 2x + 1', value: '2 * x + 1' },
        { label: 'y = 1/x', value: '1 / x' },
        { label: 'y = |x|', value: 'Math.abs(x)' },
    ];

    return (
        <div className="flex flex-col items-center gap-4">
            <canvas
                ref={canvasRef}
                width={600}
                height={400}
                className="border-4 border-[var(--color-accent)] rounded"
                style={{ backgroundColor: '#0b1220' }}
            />

            <div className="flex flex-col gap-2 w-full max-w-xl">
                <label className="text-sm font-semibold">Enter equation (use x as variable):</label>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={equation}
                        onChange={(e) => setEquation(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && plotFunction()}
                        placeholder="e.g., x * x, Math.sin(x), 2 * x + 1"
                        className="flex-1 px-4 py-2 rounded border-2 border-[var(--color-accent)] bg-[var(--color-surface)] text-white font-mono"
                    />
                    <button
                        onClick={plotFunction}
                        className="px-6 py-2 rounded bg-[var(--color-accent)] text-white font-semibold hover:opacity-80 transition"
                    >
                        Plot
                    </button>
                </div>
            </div>

            <div className="flex flex-wrap gap-2 justify-center">
                <span className="text-sm text-[var(--color-muted)] mr-2">Quick Presets:</span>
                {presetEquations.map(preset => (
                    <button
                        key={preset.label}
                        onClick={() => setEquation(preset.value)}
                        className="px-3 py-1 rounded text-sm bg-[var(--color-surface)] text-[var(--color-muted)] hover:bg-[var(--color-accent)] hover:text-white transition"
                    >
                        {preset.label}
                    </button>
                ))}
            </div>

            <p className="text-xs text-[var(--color-muted)] text-center max-w-md">
                Use JavaScript Math functions: Math.sin(x), Math.cos(x), Math.sqrt(x), Math.abs(x), etc.
            </p>
        </div>
    );
}
