'use client'

import React, { useState, useRef, useEffect } from 'react';

interface ComputationalShape {
    type: 'circle' | 'square' | 'triangle' | 'line' | 'arc' | 'matrix' | 'node';
    x: number;
    y: number;
    size: number;
    color: string;
    id: number;
    // For lines and arcs
    x2?: number;
    y2?: number;
    // For matrix
    rows?: number;
    cols?: number;
    // For node (fractal depth)
    fractalDepth?: number;
    // Computational meaning
    concept: string;
}

const SHAPE_CONCEPTS = {
    node: {
        name: 'Node - Spatial Fractal of Root Space',
        description: 'Represents a contemporary spatial fractal of the infinite root space with all geometric properties',
        examples: ['Infinite Set', 'Universe', 'Root Context', 'Meta-Space', 'Platonic Realm', 'Type Universe'],
        codeExample: `# The Node is like a TYPE SYSTEM or ROOT SCOPE
# It contains all possible values and operations

# In Python/Cubit:
# The universe of all integers
all_numbers = {..., -2, -1, 0, 1, 2, ...}

# The type system itself
type Any = Circle | Square | Triangle | ...

# A class that can contain ANY geometry
class Universe:
    def __init__(self):
        self.all_shapes = []  # Can hold ANY shape
        self.all_types = []   # Can hold ANY type
        self.infinite = True  # Boundless potential`
    },
    circle: {
        name: 'Conceptual Container',
        description: 'Represents encapsulation, scope, objects, or data structures',
        examples: ['Variable', 'Function', 'Object', 'Namespace', 'Module'],
        codeExample: `# Circle = Container that HOLDS something

# Variable (holds a value)
let x = 5

# Function (holds code)
function calculate() {
    return 42
}

# Object (holds properties)
user = {
    name: "Alice",
    age: 30
}

# Scope (holds variables)
{
    let inner_var = 10  # Lives inside circle
}`
    },
    square: {
        name: 'Rule Set',
        description: 'Represents constraints, conditionals, logic blocks, or algorithms',
        examples: ['If-Then', 'Loop', 'Function Definition', 'Class', 'Constraint'],
        codeExample: `# Square = RULES that must be followed

# Conditional (if-then rule)
if temperature > 100:
    print("Hot!")

# Loop (repeat rule)
for i in range(10):
    print(i)

# Function definition (execution rules)
def must_be_positive(x):
    if x < 0:
        raise Error
    return x

# Class (structural rules)
class Rectangle:
    width: int
    height: int`
    },
    triangle: {
        name: 'Transfer & Change',
        description: 'Represents transformation, state change, or data flow',
        examples: ['Assignment', 'Mutation', 'Transformation', 'Function Call', 'Event'],
        codeExample: `# Triangle = TRANSFORMATION from one state to another

# Assignment (x changes from 5 to 10)
x = 5  ──▶  x = 10

# Data transformation
input = "hello"  ──▶  output = "HELLO"

# Function call (transforms input to output)
result = double(5)  # 5 ──▶ 10

# State change
player.position = (0,0)  ──▶  player.position = (5,3)

# Event handler (event ──▶ action)
on_click() ──▶ update_ui()`
    },
    line: {
        name: 'Connection',
        description: 'Represents relationships, data flow, or dependencies',
        examples: ['Data Flow', 'Dependency', 'Inheritance', 'Reference', 'Pointer'],
        codeExample: `# Line = CONNECTION between two things

# Data flow (A flows to B)
x = 5  ───▶  y = x + 1

# Function dependency
def b():
    return a()  # b depends on a

# Inheritance (Child connects to Parent)
class Dog extends Animal

# Reference (pointer to data)
list1 = [1, 2, 3]
list2 = list1  # list2 ───▶ list1

# Import (connects modules)
import math  # your code ───▶ math module`
    },
    arc: {
        name: 'Information Area Connector',
        description: 'Represents curved connections between information domains',
        examples: ['Callback', 'Async Flow', 'Event Loop', 'Closure', 'Channel'],
        codeExample: `# Arc = CURVED connection (non-linear flow)

# Callback (returns later)
fetch_data(url, callback)
    # time passes...  ⌒
    # callback gets called

# Async/await (waits then continues)
async function getData():
    data = await api.call()  # ⌒ wait
    return process(data)

# Event loop
while True:
    event = wait_for_event()  # ⌒ loop back
    handle(event)

# Closure (captures outer scope)
def outer():
    x = 5
    def inner():  # ⌒ reaches back to x
        return x + 1
    return inner`
    },
    matrix: {
        name: 'Spatial Field',
        description: 'Represents consistent spatial units, grids, or multidimensional data',
        examples: ['Array', 'Grid', 'Table', 'Matrix', 'Memory Layout', 'State Space'],
        codeExample: `# Matrix = GRID of uniform cells

# 1D Array (list of items)
numbers = [1, 2, 3, 4, 5]

# 2D Array (grid/table)
grid = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
]

# 3D Array (volume)
cube = [[[1,2],[3,4]], [[5,6],[7,8]]]

# Access pattern
value = grid[row][col]

# Game board
board[x][y] = "X"  # Tic-tac-toe

# Image pixels
image[y][x] = color`
    }
};

export default function ComputationalGeometry() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [shapes, setShapes] = useState<ComputationalShape[]>([]);
    const [selectedType, setSelectedType] = useState<'circle' | 'square' | 'triangle' | 'line' | 'arc' | 'matrix' | 'node'>('node');
    const [selectedColor, setSelectedColor] = useState('#7c3aed');
    const [shapeSize, setShapeSize] = useState(40);
    const [drawingLine, setDrawingLine] = useState<{ x: number, y: number } | null>(null);
    const [showConcepts, setShowConcepts] = useState(true);
    const [hoveredShape, setHoveredShape] = useState<ComputationalShape | null>(null);
    const [exportCaption, setExportCaption] = useState('Computational Geometry — Shapes & Mappings');
    const [exportScale, setExportScale] = useState<number>(1);
    const [exportFigureNumber, setExportFigureNumber] = useState<number | ''>('');
    const [exportIncludeMeta, setExportIncludeMeta] = useState<boolean>(true);
    const [exportCaptionFontSize, setExportCaptionFontSize] = useState<number>(14);
    const [exportCaptionColor, setExportCaptionColor] = useState<string>('#000000');
    const [exportInventorName, setExportInventorName] = useState<string>('');

    // Draw canvas
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear canvas
        ctx.fillStyle = '#0b1220';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw grid for reference
        ctx.strokeStyle = '#1a1a2e';
        ctx.lineWidth = 1;
        for (let x = 0; x < canvas.width; x += 50) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }
        for (let y = 0; y < canvas.height; y += 50) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }

        // Draw all shapes
        shapes.forEach(shape => {
            ctx.fillStyle = shape.color;
            ctx.strokeStyle = shape.color;
            ctx.lineWidth = 3;

            switch (shape.type) {
                case 'circle':
                    // Conceptual Container
                    ctx.beginPath();
                    ctx.arc(shape.x, shape.y, shape.size, 0, Math.PI * 2);
                    ctx.stroke();
                    if (showConcepts) {
                        ctx.fillStyle = shape.color + '33';
                        ctx.fill();
                    }
                    break;

                case 'square':
                    // Rule Set
                    ctx.strokeRect(shape.x - shape.size, shape.y - shape.size, shape.size * 2, shape.size * 2);
                    if (showConcepts) {
                        ctx.fillStyle = shape.color + '33';
                        ctx.fillRect(shape.x - shape.size, shape.y - shape.size, shape.size * 2, shape.size * 2);
                    }
                    break;

                case 'triangle':
                    // Transfer & Change
                    ctx.beginPath();
                    ctx.moveTo(shape.x, shape.y - shape.size);
                    ctx.lineTo(shape.x - shape.size, shape.y + shape.size);
                    ctx.lineTo(shape.x + shape.size, shape.y + shape.size);
                    ctx.closePath();
                    ctx.stroke();
                    if (showConcepts) {
                        ctx.fillStyle = shape.color + '33';
                        ctx.fill();
                    }
                    break;

                case 'line':
                    // Connection
                    ctx.beginPath();
                    ctx.moveTo(shape.x, shape.y);
                    ctx.lineTo(shape.x2 || shape.x + 100, shape.y2 || shape.y);
                    ctx.stroke();
                    // Arrow head
                    const angle = Math.atan2((shape.y2 || shape.y) - shape.y, (shape.x2 || shape.x + 100) - shape.x);
                    const headLength = 15;
                    ctx.beginPath();
                    ctx.moveTo(shape.x2 || shape.x + 100, shape.y2 || shape.y);
                    ctx.lineTo(
                        (shape.x2 || shape.x + 100) - headLength * Math.cos(angle - Math.PI / 6),
                        (shape.y2 || shape.y) - headLength * Math.sin(angle - Math.PI / 6)
                    );
                    ctx.moveTo(shape.x2 || shape.x + 100, shape.y2 || shape.y);
                    ctx.lineTo(
                        (shape.x2 || shape.x + 100) - headLength * Math.cos(angle + Math.PI / 6),
                        (shape.y2 || shape.y) - headLength * Math.sin(angle + Math.PI / 6)
                    );
                    ctx.stroke();
                    break;

                case 'arc':
                    // Information Area Connector
                    ctx.beginPath();
                    ctx.arc(
                        (shape.x + (shape.x2 || shape.x + 100)) / 2,
                        (shape.y + (shape.y2 || shape.y)) / 2 - 30,
                        50,
                        0,
                        Math.PI
                    );
                    ctx.stroke();
                    break;

                case 'matrix':
                    // Spatial Field
                    const rows = shape.rows || 3;
                    const cols = shape.cols || 3;
                    const cellSize = shape.size / Math.max(rows, cols);
                    const startX = shape.x - (cols * cellSize) / 2;
                    const startY = shape.y - (rows * cellSize) / 2;

                    ctx.strokeStyle = shape.color;
                    for (let r = 0; r <= rows; r++) {
                        ctx.beginPath();
                        ctx.moveTo(startX, startY + r * cellSize);
                        ctx.lineTo(startX + cols * cellSize, startY + r * cellSize);
                        ctx.stroke();
                    }
                    for (let c = 0; c <= cols; c++) {
                        ctx.beginPath();
                        ctx.moveTo(startX + c * cellSize, startY);
                        ctx.lineTo(startX + c * cellSize, startY + rows * cellSize);
                        ctx.stroke();
                    }
                    if (showConcepts) {
                        ctx.fillStyle = shape.color + '22';
                        ctx.fillRect(startX, startY, cols * cellSize, rows * cellSize);
                    }
                    break;

                case 'node':
                    // Node - Spatial Fractal of Root Space (Infinite Set with All Geometric Properties)
                    const depth = shape.fractalDepth || 3;

                    // Draw fractal node with nested geometric properties
                    // Outer circle representing the infinite set
                    ctx.strokeStyle = shape.color;
                    ctx.lineWidth = 3;
                    ctx.beginPath();
                    ctx.arc(shape.x, shape.y, shape.size, 0, Math.PI * 2);
                    ctx.stroke();

                    // Inner fractals showing recursive self-similar structure
                    for (let d = 1; d <= depth; d++) {
                        const currentSize = shape.size * (1 - d * 0.2);

                        // Circle (container)
                        ctx.globalAlpha = 0.7;
                        ctx.strokeStyle = shape.color;
                        ctx.lineWidth = 2;
                        ctx.beginPath();
                        ctx.arc(shape.x, shape.y, currentSize, 0, Math.PI * 2);
                        ctx.stroke();

                        // Square (rules) inscribed
                        const squareSize = currentSize * 0.7;
                        ctx.strokeRect(
                            shape.x - squareSize,
                            shape.y - squareSize,
                            squareSize * 2,
                            squareSize * 2
                        );

                        // Triangle (transformation) inscribed
                        const triSize = currentSize * 0.5;
                        ctx.beginPath();
                        ctx.moveTo(shape.x, shape.y - triSize);
                        ctx.lineTo(shape.x - triSize, shape.y + triSize * 0.5);
                        ctx.lineTo(shape.x + triSize, shape.y + triSize * 0.5);
                        ctx.closePath();
                        ctx.stroke();
                    }
                    ctx.globalAlpha = 1.0;

                    // Central point representing the infinite potential
                    ctx.fillStyle = shape.color;
                    ctx.beginPath();
                    ctx.arc(shape.x, shape.y, 4, 0, Math.PI * 2);
                    ctx.fill();

                    // Radial lines representing all possible geometric properties
                    const rays = 8;
                    ctx.strokeStyle = shape.color + '66';
                    ctx.lineWidth = 1;
                    for (let i = 0; i < rays; i++) {
                        const angle = (i / rays) * Math.PI * 2;
                        ctx.beginPath();
                        ctx.moveTo(shape.x, shape.y);
                        ctx.lineTo(
                            shape.x + Math.cos(angle) * shape.size,
                            shape.y + Math.sin(angle) * shape.size
                        );
                        ctx.stroke();
                    }

                    if (showConcepts) {
                        // Gradient fill showing infinite depth
                        const gradient = ctx.createRadialGradient(
                            shape.x, shape.y, 0,
                            shape.x, shape.y, shape.size
                        );
                        gradient.addColorStop(0, shape.color + 'aa');
                        gradient.addColorStop(0.5, shape.color + '44');
                        gradient.addColorStop(1, shape.color + '11');
                        ctx.fillStyle = gradient;
                        ctx.beginPath();
                        ctx.arc(shape.x, shape.y, shape.size, 0, Math.PI * 2);
                        ctx.fill();
                    }
                    break;
            }

            // Highlight hovered shape
            if (hoveredShape?.id === shape.id) {
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 2;
                ctx.setLineDash([5, 5]);
                ctx.strokeRect(shape.x - shape.size - 5, shape.y - shape.size - 5, shape.size * 2 + 10, shape.size * 2 + 10);
                ctx.setLineDash([]);
            }
        });

        // Draw line being created
        if (drawingLine && (selectedType === 'line' || selectedType === 'arc')) {
            ctx.strokeStyle = selectedColor;
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            ctx.moveTo(drawingLine.x, drawingLine.y);
            ctx.lineTo(drawingLine.x + 50, drawingLine.y + 50);
            ctx.stroke();
            ctx.setLineDash([]);
        }
    }, [shapes, drawingLine, selectedType, selectedColor, showConcepts, hoveredShape]);

    const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (selectedType === 'line' || selectedType === 'arc') {
            if (!drawingLine) {
                setDrawingLine({ x, y });
            } else {
                setShapes([...shapes, {
                    type: selectedType,
                    x: drawingLine.x,
                    y: drawingLine.y,
                    x2: x,
                    y2: y,
                    size: shapeSize,
                    color: selectedColor,
                    id: shapes.length,
                    concept: SHAPE_CONCEPTS[selectedType].name
                }]);
                setDrawingLine(null);
            }
        } else {
            setShapes([...shapes, {
                type: selectedType,
                x,
                y,
                size: shapeSize,
                color: selectedColor,
                id: shapes.length,
                concept: SHAPE_CONCEPTS[selectedType].name,
                ...(selectedType === 'matrix' ? { rows: 3, cols: 3 } : {}),
                ...(selectedType === 'node' ? { fractalDepth: 3 } : {})
            }]);
        }
    };

    const handleCanvasHover = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Find shape under cursor
        const shape = shapes.find(s => {
            const dx = x - s.x;
            const dy = y - s.y;
            return Math.sqrt(dx * dx + dy * dy) < s.size + 10;
        });

        setHoveredShape(shape || null);
    };

    const clearCanvas = () => {
        setShapes([]);
        setDrawingLine(null);
    };

    // Export current shapes as an SVG string (vector export)
    const exportSVG = () => {
        const baseWidth = 700;
        const baseHeight = 500;
        // The user requested an 8-inch display width for final output. We'll set the SVG width to 8in
        // and compute a proportional height so the viewBox coordinates remain in the original base units.
        const widthInInches = 8;
        const heightInInches = (baseHeight / baseWidth) * widthInInches; // ~5.7142857in

        const svgParts: string[] = [];
        // Set width/height in inches so viewers/printers render at the requested physical size
        svgParts.push(`<svg xmlns="http://www.w3.org/2000/svg" width="${widthInInches}in" height="${heightInInches}in" viewBox="0 0 ${baseWidth} ${baseHeight}">`);

        // white background for patent-style drawings
        svgParts.push(`<rect width="100%" height="100%" fill="#ffffff"/>`);

        // grid (black lines)
        svgParts.push(`<g stroke="#000000" stroke-width="1">`);
        for (let x = 0; x < baseWidth; x += 50) {
            svgParts.push(`<line x1="${x}" y1="0" x2="${x}" y2="${baseHeight}" />`);
        }
        for (let y = 0; y < baseHeight; y += 50) {
            svgParts.push(`<line x1="0" y1="${y}" x2="${baseWidth}" y2="${y}" />`);
        }
        svgParts.push(`</g>`);

        // defs for arrow marker (black)
        svgParts.push(`<defs><marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#000000"/></marker></defs>`);

        shapes.forEach(shape => {
            // For patent-style exports we use black strokes and no colored fills
            switch (shape.type) {
                case 'circle':
                    svgParts.push(`<circle cx="${shape.x}" cy="${shape.y}" r="${shape.size}" stroke="#000000" fill="none" stroke-width="3" />`);
                    break;
                case 'square':
                    svgParts.push(`<rect x="${shape.x - shape.size}" y="${shape.y - shape.size}" width="${shape.size * 2}" height="${shape.size * 2}" stroke="#000000" fill="none" stroke-width="3" />`);
                    break;
                case 'triangle':
                    const p1 = `${shape.x},${shape.y - shape.size}`;
                    const p2 = `${shape.x - shape.size},${shape.y + shape.size}`;
                    const p3 = `${shape.x + shape.size},${shape.y + shape.size}`;
                    svgParts.push(`<polygon points="${p1} ${p2} ${p3}" stroke="#000000" fill="none" stroke-width="3" />`);
                    break;
                case 'line':
                    const x2 = shape.x2 ?? (shape.x + 100);
                    const y2 = shape.y2 ?? shape.y;
                    svgParts.push(`<line x1="${shape.x}" y1="${shape.y}" x2="${x2}" y2="${y2}" stroke="#000000" stroke-width="3" marker-end="url(#arrow)" />`);
                    break;
                case 'arc':
                    const ax1 = shape.x;
                    const ay1 = shape.y;
                    const ax2 = shape.x2 ?? (shape.x + 100);
                    const ay2 = shape.y2 ?? shape.y;
                    const r = 50;
                    svgParts.push(`<path d="M ${ax1} ${ay1} A ${r} ${r} 0 0 1 ${ax2} ${ay2}" stroke="#000000" fill="none" stroke-width="3" />`);
                    break;
                case 'matrix':
                    const rows = shape.rows || 3;
                    const cols = shape.cols || 3;
                    const cellSize = shape.size / Math.max(rows, cols);
                    const startX = shape.x - (cols * cellSize) / 2;
                    const startY = shape.y - (rows * cellSize) / 2;
                    svgParts.push(`<g stroke="#000000" fill="none">`);
                    for (let r = 0; r < rows; r++) {
                        for (let c = 0; c < cols; c++) {
                            svgParts.push(`<rect x="${startX + c * cellSize}" y="${startY + r * cellSize}" width="${cellSize}" height="${cellSize}" />`);
                        }
                    }
                    svgParts.push(`</g>`);
                    break;
                case 'node':
                    const depth = shape.fractalDepth || 3;
                    svgParts.push(`<g stroke="#000000" fill="none">`);
                    svgParts.push(`<circle cx="${shape.x}" cy="${shape.y}" r="${shape.size}" stroke-width="3" />`);
                    for (let d = 1; d <= depth; d++) {
                        const currentSize = shape.size * (1 - d * 0.2);
                        svgParts.push(`<circle cx="${shape.x}" cy="${shape.y}" r="${currentSize}" stroke-width="2" opacity="0.7" />`);
                        const squareSize = currentSize * 0.7;
                        svgParts.push(`<rect x="${shape.x - squareSize}" y="${shape.y - squareSize}" width="${squareSize * 2}" height="${squareSize * 2}" stroke-width="1" />`);
                        const triSize = currentSize * 0.5;
                        svgParts.push(`<polygon points="${shape.x},${shape.y - triSize} ${shape.x - triSize},${shape.y + triSize * 0.5} ${shape.x + triSize},${shape.y + triSize * 0.5}" stroke-width="1" />`);
                    }
                    // central point filled black
                    svgParts.push(`<circle cx="${shape.x}" cy="${shape.y}" r="4" fill="#000000" />`);
                    svgParts.push(`</g>`);
                    break;
            }
        });

        // helper to escape XML
        const escapeXml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');

        // caption area and optional inventor line (black text)
        if (exportCaption) {
            const captionFontSize = exportCaptionFontSize || 14;
            svgParts.push(`<g id="caption" transform="translate(0, ${baseHeight - 40})"><text x="${baseWidth / 2}" y="${20}" text-anchor="middle" fill="#000000" font-size="${captionFontSize}" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial">${escapeXml(exportCaption)}</text>`);
            if (exportInventorName) {
                svgParts.push(`<text x="${baseWidth / 2}" y="${20 + Math.round(captionFontSize * 1.4)}" text-anchor="middle" fill="#000000" font-size="${Math.max(10, Math.round(captionFontSize * 0.9))}" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial">${escapeXml(exportInventorName)}</text>`);
            }
            svgParts.push(`</g>`);
        }

        // optional metadata comment
        if (exportIncludeMeta) {
            const meta = `Generated from Cubit repository on ${new Date().toISOString()}`;
            svgParts.unshift(`<!-- ${meta} -->`);
        }

        svgParts.push(`</svg>`);
        const svg = svgParts.join('\n');

        // expose on window for automation and also trigger a download
        try {
            // The following code is browser-only: expose last export for automation
            if (typeof window !== 'undefined') {
                // attach to window under a namespaced type to avoid casting to `any`
                (window as unknown as { __lastExportSVG?: string }).__lastExportSVG = svg;
                const blob = new Blob([svg], { type: 'image/svg+xml' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                const figPart = exportFigureNumber ? `Figure_${String(exportFigureNumber).padStart(2, '0')}_` : '';
                a.download = `${figPart}ComputationalGeometry_Export.svg`;
                document.body.appendChild(a);
                a.click();
                a.remove();
                URL.revokeObjectURL(url);
            }
        } catch {
            // noop in non-browser environments
        }

        return svg;
    };

    const colors = ['#7c3aed', '#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#14b8a6'];

    return (
        <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2">
                    <canvas
                        ref={canvasRef}
                        width={700}
                        height={500}
                        onClick={handleCanvasClick}
                        onMouseMove={handleCanvasHover}
                        className="border-4 border-[var(--color-accent)] rounded cursor-crosshair w-full"
                        style={{ backgroundColor: '#0b1220' }}
                    />
                </div>

                <div className="bg-[var(--color-bg)] p-4 rounded border-2 border-[var(--color-accent)] overflow-y-auto max-h-[500px]">
                    <h3 className="text-lg font-bold mb-4">Computational Concepts</h3>
                    {Object.entries(SHAPE_CONCEPTS).map(([key, concept]) => (
                        <div key={key} className="mb-4 pb-4 border-b border-gray-700">
                            <h4 className="font-semibold text-[var(--color-accent)]">{concept.name}</h4>
                            <p className="text-xs text-[var(--color-muted)] mb-2">{concept.description}</p>
                            <div className="text-xs mb-2">
                                <strong>Examples:</strong>
                                <ul className="list-disc list-inside">
                                    {concept.examples.map((ex, i) => (
                                        <li key={i}>{ex}</li>
                                    ))}
                                </ul>
                            </div>
                            <details className="text-xs">
                                <summary className="cursor-pointer text-[var(--color-accent)] hover:underline font-semibold">
                                    💻 Show Code Examples
                                </summary>
                                <pre className="bg-[var(--color-surface)] p-2 rounded mt-2 overflow-x-auto text-[10px] leading-relaxed">
                                    <code>{concept.codeExample}</code>
                                </pre>
                            </details>
                        </div>
                    ))}
                </div>
            </div>

            {hoveredShape && (
                <div className="bg-[var(--color-accent)] text-white p-3 rounded-lg">
                    <strong>{hoveredShape.concept}:</strong> {SHAPE_CONCEPTS[hoveredShape.type].description}
                </div>
            )}

            <div className="flex flex-wrap gap-4 items-center justify-center">
                <div className="flex gap-2 flex-wrap">
                    {(['node', 'circle', 'square', 'triangle', 'line', 'arc', 'matrix'] as const).map(shape => (
                        <button
                            key={shape}
                            onClick={() => {
                                setSelectedType(shape);
                                setDrawingLine(null);
                            }}
                            className={`px-3 py-2 rounded font-semibold text-sm ${selectedType === shape
                                ? 'bg-[var(--color-accent)] text-white'
                                : 'bg-[var(--color-surface)] text-[var(--color-muted)]'
                                }`}
                        >
                            {SHAPE_CONCEPTS[shape].name.split(' - ')[0]}
                        </button>
                    ))}
                </div>

                <div className="flex gap-2">
                    {colors.map(color => (
                        <button
                            key={color}
                            onClick={() => setSelectedColor(color)}
                            className="w-8 h-8 rounded-full border-2 hover:scale-110 transition"
                            style={{
                                backgroundColor: color,
                                borderColor: selectedColor === color ? '#fff' : color
                            }}
                        />
                    ))}
                </div>

                <div className="flex items-center gap-2">
                    <label className="text-sm">Size:</label>
                    <input
                        type="range"
                        min="20"
                        max="80"
                        value={shapeSize}
                        onChange={(e) => setShapeSize(Number(e.target.value))}
                        className="w-32"
                    />
                    <span className="text-sm">{shapeSize}px</span>
                </div>
            </div>

            <div className="flex gap-2 justify-center">
                <button
                    onClick={() => setShowConcepts(!showConcepts)}
                    className={`px-4 py-2 rounded font-semibold ${showConcepts
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-600 text-white'
                        }`}
                >
                    {showConcepts ? '✓ Show Fills' : 'Hide Fills'}
                </button>
                <button
                    onClick={clearCanvas}
                    className="px-6 py-2 rounded bg-red-600 text-white font-semibold hover:opacity-80 transition"
                >
                    🗑️ Clear Canvas
                </button>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => {
                            const svg = exportSVG();
                            // also log to console for automated extraction
                            if (typeof window !== 'undefined') console.log('ExportedSVGLength', svg.length);
                        }}
                        className="px-6 py-2 rounded bg-blue-600 text-white font-semibold hover:opacity-80 transition"
                    >
                        📐 Export SVG
                    </button>

                    <input
                        type="text"
                        value={exportCaption}
                        onChange={(e) => setExportCaption(e.target.value)}
                        className="px-3 py-2 rounded bg-[var(--color-surface)] text-sm w-64"
                        placeholder="Caption for exported SVG"
                    />

                    <label className="flex items-center gap-2 text-sm">
                        <span className="text-xs">Scale:</span>
                        <input
                            type="number"
                            min={1}
                            max={30}
                            step={1}
                            value={exportScale}
                            onChange={(e) => setExportScale(Number(e.target.value) || 1)}
                            className="w-20 px-2 py-1 rounded bg-[var(--color-surface)] text-sm"
                        />
                    </label>

                    <input
                        type="number"
                        min={1}
                        max={99}
                        placeholder="Fig #"
                        value={exportFigureNumber === '' ? '' : exportFigureNumber}
                        onChange={(e) => setExportFigureNumber(e.target.value ? Number(e.target.value) : '')}
                        className="w-16 px-2 py-1 rounded bg-[var(--color-surface)] text-sm"
                    />

                    <label className="flex items-center gap-1 text-xs">
                        <input type="checkbox" checked={exportIncludeMeta} onChange={(e) => setExportIncludeMeta(e.target.checked)} />
                        Include meta
                    </label>

                    <input
                        type="number"
                        min={8}
                        max={72}
                        value={exportCaptionFontSize}
                        onChange={(e) => setExportCaptionFontSize(Number(e.target.value) || 14)}
                        className="w-20 px-2 py-1 rounded bg-[var(--color-surface)] text-sm"
                        title="Caption font size"
                    />

                    <input
                        type="color"
                        value={exportCaptionColor}
                        onChange={(e) => setExportCaptionColor(e.target.value)}
                        className="w-10 h-8 p-0 border-0 bg-transparent"
                        title="Caption color"
                    />

                    <input
                        type="text"
                        value={exportInventorName}
                        onChange={(e) => setExportInventorName(e.target.value)}
                        className="px-3 py-2 rounded bg-[var(--color-surface)] text-sm w-48"
                        placeholder="Inventor name (optional)"
                    />
                </div>
            </div>

            <div className="bg-[var(--color-surface)] p-4 rounded">
                <h3 className="font-bold mb-2">How Geometry Relates to Coding:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-[var(--color-muted)] mb-4">
                    <div className="border border-[var(--color-accent)] p-3 rounded">
                        <h4 className="font-semibold text-white mb-2">📦 Simple Variable</h4>
                        <p className="text-xs mb-2">Circle (container) holding a value</p>
                        <code className="text-xs bg-[var(--color-bg)] p-1 rounded block">
                            ⭕ let x = 5
                        </code>
                    </div>
                    <div className="border border-[var(--color-accent)] p-3 rounded">
                        <h4 className="font-semibold text-white mb-2">🔄 If Statement</h4>
                        <p className="text-xs mb-2">Square (rules) with Triangle (change)</p>
                        <code className="text-xs bg-[var(--color-bg)] p-1 rounded block">
                            ⬛ if x {'>'} 0:<br />
                            &nbsp;&nbsp;🔺 x = x * 2
                        </code>
                    </div>
                    <div className="border border-[var(--color-accent)] p-3 rounded">
                        <h4 className="font-semibold text-white mb-2">➡️ Data Flow</h4>
                        <p className="text-xs mb-2">Circles connected by Lines</p>
                        <code className="text-xs bg-[var(--color-bg)] p-1 rounded block">
                            ⭕ a = 5 → ⭕ b = a + 1
                        </code>
                    </div>
                    <div className="border border-[var(--color-accent)] p-3 rounded">
                        <h4 className="font-semibold text-white mb-2">🌐 Array/List</h4>
                        <p className="text-xs mb-2">Matrix (spatial field)</p>
                        <code className="text-xs bg-[var(--color-bg)] p-1 rounded block">
                            ▦ grid[0][1] = value
                        </code>
                    </div>
                </div>
                <h3 className="font-bold mb-2">How to Use:</h3>
                <ul className="text-sm text-[var(--color-muted)] space-y-1 list-disc list-inside">
                    <li><strong>Node:</strong> The root space containing all computational possibilities</li>
                    <li><strong>Circle:</strong> Draw containers for data (variables, objects)</li>
                    <li><strong>Square:</strong> Draw rule boxes (if/while/for statements)</li>
                    <li><strong>Triangle:</strong> Draw transformations (assignments, function calls)</li>
                    <li><strong>Line:</strong> Connect two elements to show data flow</li>
                    <li><strong>Arc:</strong> Connect with curved lines for callbacks/async</li>
                    <li><strong>Matrix:</strong> Click to create spatial fields (arrays, grids)</li>
                    <li>Hover over shapes to see their computational meaning</li>
                </ul>
            </div>
        </div>
    );
}
