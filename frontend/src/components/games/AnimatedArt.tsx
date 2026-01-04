'use client'

import React, { useState, useRef, useEffect } from 'react';

interface Shape {
    type: 'circle' | 'square' | 'triangle';
    x: number;
    y: number;
    size: number;
    color: string;
    id: number;
}

export default function AnimatedArt() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [shapes, setShapes] = useState<Shape[]>([]);
    const [selectedColor, setSelectedColor] = useState('#7c3aed');
    const [selectedShape, setSelectedShape] = useState<'circle' | 'square' | 'triangle'>('circle');
    const [shapeSize, setShapeSize] = useState(30);
    const [animate, setAnimate] = useState(false);
    const animationRef = useRef<number | undefined>(undefined);
    const [selectMode, setSelectMode] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [mappings, setMappings] = useState<Record<number, string>>({});
    const [highlightId, setHighlightId] = useState<number | null>(null);
    const seqRef = useRef<number | undefined>(undefined);
    const [sequenceRunning, setSequenceRunning] = useState(false);
    const seqRunningRef = useRef<boolean>(false);

    /* eslint-disable @typescript-eslint/no-unused-vars */
    const [_mode, _setMode] = useState<'manual' | 'code'>('manual');
    const [cubitCode, _setCubitCode] = useState(`# Draw shapes with Cubit code!
# Available commands:
# draw_circle(x, y, size, color)
# draw_square(x, y, size, color)
# draw_triangle(x, y, size, color)
# set_color(color)
# clear()

# Example:
draw_circle(300, 200, 50, "purple")
draw_square(150, 150, 40, "blue")
draw_triangle(450, 300, 60, "red")`);
    const [_executing, _setExecuting] = useState(false);
    const [_output, _setOutput] = useState<string>('');
    /* eslint-enable @typescript-eslint/no-unused-vars */

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear canvas
        ctx.fillStyle = '#0b1220';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw all shapes
        shapes.forEach(shape => {
            ctx.fillStyle = shape.color;
            ctx.strokeStyle = shape.color;
            ctx.lineWidth = 2;

            switch (shape.type) {
                case 'circle':
                    ctx.beginPath();
                    ctx.arc(shape.x, shape.y, shape.size, 0, Math.PI * 2);
                    ctx.fill();
                    break;
                case 'square':
                    ctx.fillRect(shape.x - shape.size, shape.y - shape.size, shape.size * 2, shape.size * 2);
                    break;
                case 'triangle':
                    ctx.beginPath();
                    ctx.moveTo(shape.x, shape.y - shape.size);
                    ctx.lineTo(shape.x - shape.size, shape.y + shape.size);
                    ctx.lineTo(shape.x + shape.size, shape.y + shape.size);
                    ctx.closePath();
                    ctx.fill();
                    break;
            }

            // highlight selection or sequence
            if (shape.id === selectedId) {
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 3;
                ctx.beginPath();
                if (shape.type === 'circle') ctx.arc(shape.x, shape.y, shape.size + 4, 0, Math.PI * 2);
                else if (shape.type === 'square') ctx.strokeRect(shape.x - shape.size - 4, shape.y - shape.size - 4, (shape.size + 4) * 2, (shape.size + 4) * 2);
                else {
                    ctx.moveTo(shape.x, shape.y - shape.size - 4);
                    ctx.lineTo(shape.x - shape.size - 4, shape.y + shape.size + 4);
                    ctx.lineTo(shape.x + shape.size + 4, shape.y + shape.size + 4);
                    ctx.closePath();
                }
                ctx.stroke();
            }

            if (shape.id === highlightId) {
                ctx.strokeStyle = '#ffeb3b';
                ctx.lineWidth = 4;
                ctx.beginPath();
                if (shape.type === 'circle') ctx.arc(shape.x, shape.y, shape.size + 6, 0, Math.PI * 2);
                else if (shape.type === 'square') ctx.strokeRect(shape.x - shape.size - 6, shape.y - shape.size - 6, (shape.size + 6) * 2, (shape.size + 6) * 2);
                else {
                    ctx.moveTo(shape.x, shape.y - shape.size - 6);
                    ctx.lineTo(shape.x - shape.size - 6, shape.y + shape.size + 6);
                    ctx.lineTo(shape.x + shape.size + 6, shape.y + shape.size + 6);
                    ctx.closePath();
                }
                ctx.stroke();
            }
        });
    }, [shapes, selectedId, highlightId]);

    useEffect(() => {
        if (animate) {
            let time = 0;
            const animateShapes = () => {
                time += 0.05;
                setShapes(prev => prev.map(shape => ({
                    ...shape,
                    x: shape.x + Math.sin(time + shape.id) * 2,
                    y: shape.y + Math.cos(time + shape.id) * 2
                })));
                animationRef.current = requestAnimationFrame(animateShapes);
            };
            animateShapes();
        } else {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        }

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [animate]);

    const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (selectMode) {
            // selection: find nearest shape
            const hit = shapes.find(s => Math.hypot(s.x - x, s.y - y) <= Math.max(20, s.size));
            if (hit) {
                setSelectedId(hit.id);
                return;
            }
            setSelectedId(null);
            return;
        }

        setShapes([...shapes, {
            type: selectedShape,
            x,
            y,
            size: shapeSize,
            color: selectedColor,
            id: shapes.length
        }]);
    };

    const clearCanvas = () => {
        setShapes([]);
    };

    const colors = ['#7c3aed', '#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#14b8a6'];

    return (
        <div className="flex flex-col items-center gap-4">
            <canvas
                ref={canvasRef}
                width={600}
                height={400}
                onClick={handleCanvasClick}
                className="border-4 border-[var(--color-accent)] rounded cursor-crosshair"
                style={{ backgroundColor: '#0b1220' }}
            />

            <div className="flex flex-wrap gap-4 items-center justify-center">
                <div className="flex gap-2">
                    {colors.map(color => (
                        <button
                            key={color}
                            onClick={() => setSelectedColor(color)}
                            className="w-10 h-10 rounded-full border-2 hover:scale-110 transition"
                            style={{
                                backgroundColor: color,
                                borderColor: selectedColor === color ? '#fff' : color
                            }}
                        />
                    ))}
                </div>

                <div className="flex gap-2">
                    {(['circle', 'square', 'triangle'] as const).map(shape => (
                        <button
                            key={shape}
                            onClick={() => setSelectedShape(shape)}
                            className={`px-4 py-2 rounded font-semibold ${selectedShape === shape
                                ? 'bg-[var(--color-accent)] text-white'
                                : 'bg-[var(--color-surface)] text-[var(--color-muted)]'
                                }`}
                        >
                            {shape}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-2">
                    <label className="text-sm">Size:</label>
                    <input
                        type="range"
                        min="10"
                        max="60"
                        value={shapeSize}
                        onChange={(e) => setShapeSize(Number(e.target.value))}
                        className="w-32"
                    />
                    <span className="text-sm">{shapeSize}px</span>
                </div>
            </div>

            {selectedId !== null && (
                <div className="w-full max-w-2xl p-4 bg-[var(--color-surface)] rounded border">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-sm font-semibold">Selected Shape #{selectedId}</div>
                            {shapes.find(s => s.id === selectedId) && (
                                <div className="text-xs text-[var(--color-muted)]">
                                    Type: {shapes.find(s => s.id === selectedId)!.type} • Color: {shapes.find(s => s.id === selectedId)!.color}
                                </div>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                placeholder="Assign process / concept (e.g. LOOP, IF)"
                                value={mappings[selectedId] || ''}
                                onChange={(e) => setMappings(prev => ({ ...prev, [selectedId]: e.target.value }))}
                                className="px-2 py-1 rounded bg-[var(--color-surface)] border"
                            />
                            <button
                                onClick={() => setSelectedId(null)}
                                className="px-3 py-1 rounded bg-gray-600 text-white"
                            >
                                Done
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex gap-2">
                <button
                    onClick={() => setAnimate(!animate)}
                    className={`px-6 py-2 rounded font-semibold ${animate
                        ? 'bg-orange-500 text-white'
                        : 'bg-[var(--color-accent)] text-white'
                        }`}
                >
                    {animate ? '⏸️ Stop Animation' : '▶️ Animate'}
                </button>

                <button
                    onClick={clearCanvas}
                    className="px-6 py-2 rounded bg-red-600 text-white font-semibold hover:opacity-80 transition"
                >
                    🗑️ Clear Canvas
                </button>
                <button
                    onClick={() => setSelectMode(!selectMode)}
                    className={`px-4 py-2 rounded font-semibold ${selectMode ? 'bg-[var(--color-accent)] text-white' : 'bg-[var(--color-surface)] text-[var(--color-muted)]'}`}>
                    {selectMode ? 'Selection: ON' : 'Selection: OFF'}
                </button>
                <button
                    onClick={() => {
                        // simple local parser for Cubit draw commands
                        const lines = cubitCode.split('\n').map(l => l.trim()).filter(Boolean);
                        const parsed: Shape[] = [];
                        let idCounter = 0;
                        const parseArgs = (argText: string) => argText.split(',').map(a => a.trim());
                        for (const line of lines) {
                            let m;
                            if ((m = line.match(/draw_circle\s*\(([^)]+)\)/i))) {
                                const args = parseArgs(m[1]);
                                const x = Number(args[0]) || 100;
                                const y = Number(args[1]) || 100;
                                const size = Number(args[2]) || 30;
                                const color = (args[3] || 'purple').replace(/['\"]+/g, '');
                                parsed.push({ type: 'circle', x, y, size, color, id: idCounter++ });
                            } else if ((m = line.match(/draw_square\s*\(([^)]+)\)/i))) {
                                const args = parseArgs(m[1]);
                                const x = Number(args[0]) || 100;
                                const y = Number(args[1]) || 100;
                                const size = Number(args[2]) || 30;
                                const color = (args[3] || 'blue').replace(/['\"]+/g, '');
                                parsed.push({ type: 'square', x, y, size, color, id: idCounter++ });
                            } else if ((m = line.match(/draw_triangle\s*\(([^)]+)\)/i))) {
                                const args = parseArgs(m[1]);
                                const x = Number(args[0]) || 100;
                                const y = Number(args[1]) || 100;
                                const size = Number(args[2]) || 30;
                                const color = (args[3] || 'red').replace(/['\"]+/g, '');
                                parsed.push({ type: 'triangle', x, y, size, color, id: idCounter++ });
                            } else if (line.match(/clear\s*\(\s*\)/i)) {
                                // clear understood
                            }
                        }
                        setShapes(parsed);
                        setSelectedId(null);
                        setMappings({});
                    }}
                    className="px-4 py-2 rounded bg-[var(--color-surface)] text-[var(--color-muted)] font-semibold"
                >
                    Run Code
                </button>
                <button
                    onClick={() => {
                        if (sequenceRunning) {
                            // stop
                            seqRunningRef.current = false;
                            if (seqRef.current) cancelAnimationFrame(seqRef.current);
                            setSequenceRunning(false);
                            setHighlightId(null);
                            return;
                        }
                        // start a simple sequence that highlights each shape in order
                        setSequenceRunning(true);
                        seqRunningRef.current = true;
                        let i = 0;
                        const runStep = () => {
                            if (!seqRunningRef.current) return;
                            if (shapes.length === 0) {
                                seqRunningRef.current = false;
                                setSequenceRunning(false);
                                return;
                            }
                            setHighlightId(shapes[i % shapes.length].id);
                            i += 1;
                            seqRef.current = requestAnimationFrame(() => setTimeout(runStep, 700));
                        };
                        runStep();
                    }}
                    className="px-4 py-2 rounded bg-[var(--color-surface)] text-[var(--color-muted)] font-semibold"
                >
                    {sequenceRunning ? 'Stop Sequence' : 'Run Sequence'}
                </button>
            </div>

            <p className="text-sm text-[var(--color-muted)] text-center max-w-md">
                Click on the canvas to draw shapes. Choose colors, shapes, and sizes. Click &quot;Animate&quot; to make your art come alive!
            </p>
        </div>
    );
}
