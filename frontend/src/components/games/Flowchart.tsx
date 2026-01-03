"use client"

import React, { useRef, useState, useEffect } from 'react';

type ShapeType = 'circle' | 'square' | 'triangle' | 'diamond' | 'hexagon' | 'parallelogram';

interface Node {
    id: number;
    x: number;
    y: number;
    type: ShapeType;
    label?: string; // pedagogical mapping, e.g., LOOP, IF, ASSIGN
    meta?: { role?: string; group?: string; inputs?: string[]; outputs?: string[] };
}

interface Edge {
    from: number;
    to: number;
    label?: string; // optional edge label (e.g., true/false or condition tag)
}

export default function Flowchart() {
    const [nodes, setNodes] = useState<Node[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);
    const [mode, setMode] = useState<'pointer' | 'add-node' | 'connect'>('pointer');
    const [addingType, setAddingType] = useState<ShapeType>('circle');
    const [nextId, setNextId] = useState(1);
    const svgRef = useRef<SVGSVGElement | null>(null);
    const [dragging, setDragging] = useState<{ id: number; offsetX: number; offsetY: number } | null>(null);
    const [connectFrom, setConnectFrom] = useState<number | null>(null);
    const [connectDragging, setConnectDragging] = useState<boolean>(false);
    const [tempPos, setTempPos] = useState<{ x: number; y: number } | null>(null);
    const [selected, setSelected] = useState<number | null>(null);
    const [selectedEdge, setSelectedEdge] = useState<number | null>(null);
    const [groups, setGroups] = useState<Array<{ id: string; title: string; nodeIds: number[]; bbox?: { x: number; y: number; w: number; h: number } }>>([]);
    // suggestions now include optional type info and a selected flag for confirm UI
    const [suggestions, setSuggestions] = useState<Array<{ id: string; from: number; to: number; name: string; fromType?: string; toType?: string; normalized?: string; selected?: boolean }>>([]);
    const [normalizeNames, setNormalizeNames] = useState<boolean>(true);
    const [strictTypes, setStrictTypes] = useState<boolean>(false);

    // Interpreter state
    const [current, setCurrent] = useState<number | null>(null);
    const [running, setRunning] = useState(false);
    const runRef = useRef<number | null>(null);
    const [contextVars, setContextVars] = useState<string>('{}'); // JSON string for interpreter context
    // We only track hover for side-effects (no render-based reads). Use a ref
    // to avoid unnecessary re-renders and satisfy the linter about unused state.
    const hoverEdgeRef = React.useRef<number | null>(null);

    useEffect(() => {
        return () => { if (runRef.current) window.clearInterval(runRef.current); };
    }, []);

    const addNode = (x: number, y: number) => {
        const id = nextId;
        setNextId(id + 1);
        setNodes(prev => [...prev, { id, x, y, type: addingType, meta: {} }]);
    };

    // Compute wiring suggestions by matching outputs -> inputs by name
    // helper to parse a port spec like "value:int" or "flag" -> { name, type? }
    const parsePort = (spec: string) => {
        const parts = spec.split(':').map(s => s.trim());
        return { name: parts[0] || '', type: parts[1] || undefined };
    };

    const normalize = (s: string) => normalizeNames ? s.toLowerCase().replace(/[^a-z0-9_]/g, '') : s;

    const computeSuggestions = () => {
        const sug: Array<{ id: string; from: number; to: number; name: string; fromType?: string; toType?: string; normalized?: string; selected?: boolean }> = [];
        // build quick map of edges to avoid duplicates
        const existing = new Set(edges.map(e => `${e.from}->${e.to}->${String(e.label)}`));

        nodes.forEach(fromNode => {
            const outs = fromNode.meta?.outputs || [];
            if (!outs || outs.length === 0) return;
            nodes.forEach(toNode => {
                if (toNode.id === fromNode.id) return;
                const ins = toNode.meta?.inputs || [];
                if (!ins || ins.length === 0) return;
                outs.forEach(o => {
                    ins.forEach(i => {
                        if (!o || !i) return;
                        const po = parsePort(o);
                        const pi = parsePort(i);
                        const normO = normalize(po.name);
                        const normI = normalize(pi.name);
                        const key = `${fromNode.id}->${toNode.id}->${po.name}`;
                        if (existing.has(key)) return;
                        if (normO === normI) {
                            // if strictTypes and both have types, require them to match
                            if (strictTypes && po.type && pi.type && po.type !== pi.type) return;
                            const id = `s-${fromNode.id}-${toNode.id}-${po.name}-${Math.random().toString(36).slice(2, 8)}`;
                            if (!sug.find(s => s.from === fromNode.id && s.to === toNode.id && s.name === po.name)) {
                                sug.push({ id, from: fromNode.id, to: toNode.id, name: po.name, fromType: po.type, toType: pi.type, normalized: normO, selected: true });
                            }
                        }
                    });
                });
            });
        });
        setSuggestions(sug);
    };

    const applySuggestions = (which?: 'all' | 'selected') => {
        if (suggestions.length === 0) return;
        const toApply = which === 'selected' ? suggestions.filter(s => s.selected) : suggestions.slice();
        if (toApply.length === 0) return;
        setEdges(prev => {
            const added = toApply.map(s => ({ from: s.from, to: s.to, label: s.name }));
            return [...prev, ...added];
        });
        // remove applied suggestions from list
        const remaining = suggestions.filter(s => !toApply.includes(s));
        setSuggestions(remaining);
    };

    const toggleSuggestion = (id: string) => {
        setSuggestions(prev => prev.map(s => s.id === id ? { ...s, selected: !s.selected } : s));
    };

    const onSvgClick = (e: React.MouseEvent) => {
        const svg = svgRef.current;
        if (!svg) return;
        const pt = svg.createSVGPoint();
        pt.x = e.clientX; pt.y = e.clientY;
        const cursor = pt.matrixTransform(svg.getScreenCTM()!.inverse());
        if (mode === 'add-node') {
            addNode(cursor.x, cursor.y);
            return;
        }
        // clicking empty space clears selection when in pointer mode
        if (mode === 'pointer' && !connectDragging) {
            setSelected(null);
            setSelectedEdge(null);
        }
    };

    const startDrag = (e: React.MouseEvent, id: number) => {
        if (mode !== 'pointer') return;
        const svg = svgRef.current; if (!svg) return;
        const pt = svg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY;
        const cursor = pt.matrixTransform(svg.getScreenCTM()!.inverse());
        const node = nodes.find(n => n.id === id); if (!node) return;
        setDragging({ id, offsetX: cursor.x - node.x, offsetY: cursor.y - node.y });
        setSelected(id);
    };

    const startConnectDrag = (e: React.MouseEvent, id: number) => {
        // begin drag-to-connect from node id
        const svg = svgRef.current; if (!svg) return;
        const pt = svg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY;
        const cursor = pt.matrixTransform(svg.getScreenCTM()!.inverse());
        setConnectFrom(id);
        setConnectDragging(true);
        setTempPos({ x: cursor.x, y: cursor.y });
        // clear any selected edge/node
        setSelectedEdge(null);
        setSelected(null);
    };

    const onMouseMove = (e: React.MouseEvent) => {
        const svg = svgRef.current; if (!svg) return;
        const pt = svg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY;
        const cursor = pt.matrixTransform(svg.getScreenCTM()!.inverse());
        if (dragging) {
            setNodes(prev => prev.map(n => n.id === dragging.id ? { ...n, x: cursor.x - dragging.offsetX, y: cursor.y - dragging.offsetY } : n));
            return;
        }
        if (connectDragging) {
            setTempPos({ x: cursor.x, y: cursor.y });
        }
    };

    const endDrag = () => {
        if (connectDragging) {
            // try to finish connect: find node under cursor
            const svg = svgRef.current; if (!svg) { setConnectDragging(false); setTempPos(null); setConnectFrom(null); return; }
            // use tempPos if available
            const pos = tempPos;
            if (pos && connectFrom !== null) {
                // find node within 28px
                const target = nodes.find(n => Math.hypot(n.x - pos.x, n.y - pos.y) <= 28);
                if (target && target.id !== connectFrom) {
                    setEdges(prev => [...prev, { from: connectFrom!, to: target.id }]);
                }
            }
            setConnectDragging(false);
            setTempPos(null);
            setConnectFrom(null);
            return;
        }
        setDragging(null);
    };

    const beginConnect = (id: number) => {
        setConnectFrom(id);
        setMode('connect');
    };

    // finishConnect was removed because connections are finalized via drag
    // endDrag. Keeping connection finalization single-path avoids an unused
    // helper and reduces ESLint noise.

    const removeSelected = () => {
        if (selected === null) return;
        setNodes(prev => prev.filter(n => n.id !== selected));
        setEdges(prev => prev.filter(e => e.from !== selected && e.to !== selected));
        setSelected(null);
    };

    const setLabel = (id: number, label: string) => {
        setNodes(prev => prev.map(n => n.id === id ? { ...n, label } : n));
    };

    const setMeta = (id: number, metaPatch: Partial<Node['meta']>) => {
        setNodes(prev => prev.map(n => n.id === id ? { ...n, meta: { ...(n.meta || {}), ...metaPatch } } : n));
    };

    // Lightweight contextualizer: cluster nodes by explicit `meta.group`, then by label keywords, then by type.
    const contextualize = (options?: { by?: 'group' | 'label' | 'type' }) => {
        const by = options?.by || 'group';
        const buckets: Record<string, number[]> = {};
        nodes.forEach(n => {
            let key = '';
            if (by === 'group') key = (n.meta && n.meta.group) || '';
            if (!key && by !== 'type') {
                // try label-based heuristics
                const lab = (n.label || '').toLowerCase();
                if (lab.includes('loop')) key = 'loops';
                else if (lab.includes('if') || lab.includes('cond')) key = 'conditionals';
                else if (lab.includes('func') || lab.includes('function')) key = 'functions';
            }
            if (!key && by !== 'label') key = n.type;
            if (!key) key = 'ungrouped';
            buckets[key] = buckets[key] || [];
            buckets[key].push(n.id);
        });

        const newGroups: Array<{ id: string; title: string; nodeIds: number[]; bbox?: { x: number; y: number; w: number; h: number } }> = [];
        Object.keys(buckets).forEach(k => {
            const ids = buckets[k];
            // compute bbox
            const pts = ids.map(id => nodes.find(n => n.id === id)!).filter(Boolean);
            if (pts.length === 0) return;
            const minX = Math.min(...pts.map(p => p.x)) - 48;
            const maxX = Math.max(...pts.map(p => p.x)) + 48;
            const minY = Math.min(...pts.map(p => p.y)) - 48;
            const maxY = Math.max(...pts.map(p => p.y)) + 48;
            newGroups.push({ id: `g-${k}`, title: k, nodeIds: ids, bbox: { x: minX, y: minY, w: maxX - minX, h: maxY - minY } });
        });
        setGroups(newGroups);
    };

    // Interpreter: simple follow-first-edge traversal with step/run
    // A small, self-contained safe evaluator for simple expressions.
    // Supports identifiers (looked up from ctx), numeric/string/boolean literals,
    // parentheses, unary !, binary operators: *,/,%, +,-, <, <=, >, >=, ==, !=, ===, !==, &&, ||
    // This is intentionally limited and avoids running arbitrary JS.
    type Token = { t: string; v?: string };

    // AST node types for the safe evaluator
    type AST =
        | { type: 'const'; value: string | number | boolean }
        | { type: 'ident'; name: string }
        | { type: 'unary'; op: '!'; arg: AST }
        | { type: 'binary'; op: string; left: AST; right: AST };

    const tokenize = (s: string): Token[] => {
        const tokens: Token[] = [];
        const re = /\s*([0-9]+(?:\.[0-9]+)?|==={0,1}|!==|==|!=|<=|>=|&&|\|\||[()!<>+\-*/%]|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|[A-Za-z_][A-Za-z0-9_]*)/g;
        let m: RegExpExecArray | null;
        while ((m = re.exec(s)) !== null) {
            const tok = m[1];
            tokens.push({ t: tok });
        }
        return tokens;
    };

    const parseExpression = (tokens: Token[]) => {
        let i = 0;
        const peek = () => tokens[i] && tokens[i].t;
        const consume = (expect?: string) => {
            const cur = tokens[i++];
            if (expect && cur?.t !== expect) throw new Error(`Expected ${expect}, got ${cur?.t}`);
            return cur;
        };

        const parsePrimary = (): AST => {
            const p = peek();
            if (!p) return { type: 'const', value: false };
            if (p === '(') { consume('('); const expr = parseOr(); consume(')'); return expr; }
            if (p === '!') { consume('!'); return { type: 'unary', op: '!', arg: parsePrimary() }; }
            if (/^[0-9]/.test(p)) { const tok = consume(); return { type: 'const', value: Number(tok.t) }; }
            if (/^['"]/.test(p)) { const tok = consume(); const str = tok.t.slice(1, -1).replace(/\\([\s\S])/g, '$1'); return { type: 'const', value: str }; }
            if (p === 'true' || p === 'false') { const tok = consume(); return { type: 'const', value: tok.t === 'true' }; }
            if (/^[A-Za-z_]/.test(p)) { const tok = consume(); return { type: 'ident', name: tok.t }; }
            throw new Error('Unexpected token ' + p);
        };

        const binaryOp = (nextParser: () => AST, ops: string[]) => {
            let left = nextParser();
            while (ops.includes(peek() || '')) {
                const op = consume()!.t;
                const right = nextParser();
                left = { type: 'binary', op, left, right };
            }
            return left;
        };

        const parseMul = () => binaryOp(parsePrimary, ['*', '/', '%']);
        const parseAdd = () => binaryOp(parseMul, ['+', '-']);
        const parseRel = () => binaryOp(parseAdd, ['<', '<=', '>', '>=']);
        const parseEq = () => binaryOp(parseRel, ['==', '!=', '===', '!==']);
        const parseAnd = () => binaryOp(parseEq, ['&&']);
        const parseOr = () => binaryOp(parseAnd, ['||']);

        const ast = parseOr();
        return ast;
    };

    const evalAst = (ast: AST | undefined, ctx: Record<string, unknown>): unknown => {
        if (!ast) return false;
        const coerceNum = (v: unknown): number => {
            if (typeof v === 'number') return v;
            if (typeof v === 'boolean') return v ? 1 : 0;
            if (typeof v === 'string') {
                const n = Number(v);
                return Number.isFinite(n) ? n : 0;
            }
            return 0;
        };

        switch (ast.type) {
            case 'const': return ast.value;
            case 'ident': return ctx[ast.name];
            case 'unary': {
                const v = evalAst(ast.arg, ctx);
                if (ast.op === '!') return !Boolean(v);
                return v;
            }
            case 'binary': {
                const L = evalAst(ast.left, ctx);
                const R = evalAst(ast.right, ctx);
                switch (ast.op) {
                    case '+': return coerceNum(L) + coerceNum(R);
                    case '-': return coerceNum(L) - coerceNum(R);
                    case '*': return coerceNum(L) * coerceNum(R);
                    case '/': return coerceNum(L) / coerceNum(R);
                    case '%': return coerceNum(L) % coerceNum(R);
                    case '<': return coerceNum(L) < coerceNum(R);
                    case '<=': return coerceNum(L) <= coerceNum(R);
                    case '>': return coerceNum(L) > coerceNum(R);
                    case '>=': return coerceNum(L) >= coerceNum(R);
                    case '==': return String(L) == String(R);
                    case '!=': return String(L) != String(R);
                    case '===': return L === R;
                    case '!==': return L !== R;
                    case '&&': return Boolean(L) && Boolean(R);
                    case '||': return Boolean(L) || Boolean(R);
                }
                return false;
            }
        }
        return false;
    };

    const evalPredicateSafe = (expr: string, ctx: Record<string, unknown>) => {
        try {
            const tokens = tokenize(expr);
            const ast = parseExpression(tokens);
            const v = evalAst(ast, ctx);
            return Boolean(v);
        } catch {
            return false;
        }
    };

    const step = () => {
        if (current === null) {
            // start at first node
            if (nodes.length === 0) return;
            setCurrent(nodes[0].id);
            return;
        }

        // build context
        let ctx: Record<string, unknown> = {};
        try { ctx = JSON.parse(contextVars || '{}') as Record<string, unknown>; } catch { ctx = {}; }

        const node = nodes.find(n => n.id === current);
        const outs = edges.filter(e => e.from === current);
        if (!node || outs.length === 0) {
            setCurrent(null);
            setRunning(false);
            return;
        }

        // If node.label is set, treat it as a predicate/expression.
        const predicate = (node.label || '').trim();
        if (predicate) {
            // evaluate predicate; expect boolean
            const result = evalPredicateSafe(predicate, ctx);
            // choose edge with label matching 'true'/'false' if present, else choose first matching edge with label == String(result)
            const stringResult = result ? 'true' : 'false';
            let chosen = outs.find(e => (e.label || '').toLowerCase() === stringResult);
            if (!chosen) {
                // fallback: choose first edge with no label or first edge overall
                chosen = outs.find(e => !(e.label)) || outs[0];
            }
            if (!chosen) { setCurrent(null); setRunning(false); return; }
            setCurrent(chosen.to);
            return;
        }

        // default: follow first outgoing edge
        const out = outs[0];
        if (!out) { setCurrent(null); setRunning(false); return; }
        setCurrent(out.to);
    };

    const run = () => {
        if (running) {
            setRunning(false);
            if (runRef.current) { clearInterval(runRef.current); runRef.current = null; }
            return;
        }
        setRunning(true);
        // begin at first node if not set
        if (current === null && nodes.length > 0) setCurrent(nodes[0].id);
        runRef.current = window.setInterval(() => {
            setNodes(n => n); // force update for highlight
            setCurrent(c => {
                if (c === null) return null;
                const out = edges.find(e => e.from === c);
                if (!out) { setRunning(false); if (runRef.current) { clearInterval(runRef.current); runRef.current = null; } return null; }
                return out.to;
            });
        }, 700);
    };

    const resetInterpreter = () => {
        setCurrent(null);
        setRunning(false);
        if (runRef.current) { clearInterval(runRef.current); runRef.current = null; }
    };

    // Determine which outgoing edges from the focused node (selected or current)
    // would be taken given the current interpreter context. This returns a Set
    // of edge indices that are candidate edges to highlight.
    // Return a map of candidate edge index -> reason string (why it's a candidate)
    const getCandidateInfo = () => {
        const focus = selected ?? current;
        const map = new Map<number, string>();
        if (focus === null || focus === undefined) return map;

        // parse context
        let ctx: Record<string, unknown> = {};
        try { ctx = JSON.parse(contextVars || '{}') as Record<string, unknown>; } catch { ctx = {}; }

        const node = nodes.find(n => n.id === focus);
        if (!node) return map;

        const outs = edges.map((ed, idx) => ({ ed, idx })).filter(x => x.ed.from === focus);
        if (outs.length === 0) return map;

        const predicate = (node.label || '').trim();
        if (predicate) {
            const result = evalPredicateSafe(predicate, ctx);
            const stringResult = result ? 'true' : 'false';
            // find edges whose label matches the boolean result (case-insensitive)
            const matching = outs.filter(x => ((x.ed.label || '').toLowerCase() === stringResult));
            if (matching.length > 0) {
                matching.forEach(x => map.set(x.idx, `matches ${stringResult}`));
                return map;
            }
            // fallback: highlight unlabeled edges if no labeled match
            const unlabeled = outs.filter(x => !(x.ed.label));
            if (unlabeled.length > 0) {
                unlabeled.forEach(x => map.set(x.idx, 'unlabeled fallback'));
                return map;
            }
            // last resort: highlight the first outgoing edge
            map.set(outs[0].idx, 'default path');
            return map;
        }

        // no predicate: highlight the first outgoing edge as the default path
        map.set(outs[0].idx, 'default path');
        return map;
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex gap-2 items-center">
                <button onClick={() => setMode('pointer')} className={`px-3 py-1 rounded ${mode === 'pointer' ? 'bg-[var(--color-accent)] text-white' : ''}`}>Pointer</button>
                <button onClick={() => setMode('add-node')} className={`px-3 py-1 rounded ${mode === 'add-node' ? 'bg-[var(--color-accent)] text-white' : ''}`}>Add Node</button>
                <select value={addingType} onChange={(e) => setAddingType(e.target.value as ShapeType)} className="px-2 py-1 rounded">
                    <option value="circle">Circle (Loop)</option>
                    <option value="square">Square (Conditional)</option>
                    <option value="triangle">Triangle (Function)</option>
                </select>
                <button onClick={() => { setMode('connect'); setConnectFrom(null); }} className={`px-3 py-1 rounded ${mode === 'connect' ? 'bg-[var(--color-accent)] text-white' : ''}`}>Connect</button>
                <button onClick={() => { if (selected) beginConnect(selected); }} className="px-3 py-1 rounded">Start From Selected</button>
                <button onClick={() => { if (selected) removeSelected(); }} className="px-3 py-1 rounded bg-red-600 text-white">Delete Selected</button>
                <div className="ml-auto flex gap-2">
                    <button onClick={step} className="px-3 py-1 rounded bg-[var(--color-surface)]">Step</button>
                    <button onClick={run} className={`px-3 py-1 rounded ${running ? 'bg-red-600 text-white' : 'bg-[var(--color-accent)] text-white'}`}>{running ? 'Stop' : 'Run'}</button>
                    <button onClick={resetInterpreter} className="px-3 py-1 rounded">Reset</button>
                </div>
                <div className="ml-4 flex items-center gap-2">
                    <select id="ctx-by" defaultValue="group" className="px-2 py-1 rounded" onChange={() => { /* noop - use value when clicked */ }}>
                        <option value="group">Group</option>
                        <option value="label">Label heuristics</option>
                        <option value="type">Type</option>
                    </select>
                    <button onClick={() => {
                        const sel = (document.getElementById('ctx-by') as HTMLSelectElement).value as 'group' | 'label' | 'type';
                        contextualize({ by: sel });
                    }} className="px-3 py-1 rounded bg-[var(--color-accent)] text-white">Contextualize</button>
                    <button onClick={() => setGroups([])} className="px-3 py-1 rounded">Clear Groups</button>
                    <label className="inline-flex items-center gap-2 px-2 py-1 rounded bg-[rgba(255,255,255,0.02)]">
                        <input type="checkbox" checked={normalizeNames} onChange={(e) => setNormalizeNames(e.target.checked)} />
                        <span className="text-xs">Normalize names</span>
                    </label>
                    <label className="inline-flex items-center gap-2 px-2 py-1 rounded bg-[rgba(255,255,255,0.02)]">
                        <input type="checkbox" checked={strictTypes} onChange={(e) => setStrictTypes(e.target.checked)} />
                        <span className="text-xs">Strict type match</span>
                    </label>
                    <button onClick={() => computeSuggestions()} className="px-3 py-1 rounded bg-[var(--color-surface)]">Suggest Wiring</button>
                    <button onClick={() => applySuggestions('all')} className="px-3 py-1 rounded bg-[var(--color-accent)] text-white">Apply All Suggestions</button>
                    <button onClick={() => setSuggestions([])} className="px-3 py-1 rounded">Clear Suggestions</button>
                </div>
            </div>

            <div className="flex gap-4">
                <svg ref={svgRef} onClick={onSvgClick} onMouseMove={onMouseMove} onMouseUp={endDrag} width={800} height={500} style={{ background: '#071019', borderRadius: 8 }}>
                    {/* suggested wiring (dashed) - drawn under concrete edges */}
                    {suggestions.map((s, idx) => {
                        const a = nodes.find(n => n.id === s.from);
                        const b = nodes.find(n => n.id === s.to);
                        if (!a || !b) return null;
                        // compute port offsets
                        const outList = a.meta?.outputs || [];
                        const inList = b.meta?.inputs || [];
                        const outIndex = outList.indexOf(s.name);
                        const inIndex = inList.indexOf(s.name);
                        const outTotal = Math.max(1, outList.length);
                        const inTotal = Math.max(1, inList.length);
                        const outY = a.y + (outIndex - (outTotal - 1) / 2) * 12;
                        const inY = b.y + (inIndex - (inTotal - 1) / 2) * 12;
                        const outX = a.x + 28;
                        const inX = b.x - 28;
                        const midX = (outX + inX) / 2;
                        const midY = (outY + inY) / 2;
                        return (
                            <g key={`sug-${idx}`}>
                                <line x1={outX} y1={outY} x2={inX} y2={inY} stroke="#60a5fa" strokeWidth={2} strokeDasharray="6 4" opacity={0.9} />
                                <text x={midX} y={midY - 6} fontSize={11} fill="#bfdbfe" textAnchor="middle">{s.name}</text>
                                <circle cx={outX} cy={outY} r={4} fill="#60a5fa" />
                                <circle cx={inX} cy={inY} r={4} fill="#60a5fa" />
                            </g>
                        );
                    })}

                    {/* edges */}
                    {(() => {
                        const candidateInfo = getCandidateInfo();
                        const candidateSet = new Set<number>(Array.from(candidateInfo.keys()));
                        return edges.map((e, i) => {
                            const a = nodes.find(n => n.id === e.from);
                            const b = nodes.find(n => n.id === e.to);
                            if (!a || !b) return null;
                            const dx = b.x - a.x; const dy = b.y - a.y; const len = Math.hypot(dx, dy) || 1;
                            const ux = dx / len; const uy = dy / len;
                            const startX = a.x + ux * 24; const startY = a.y + uy * 24;
                            const endX = b.x - ux * 24; const endY = b.y - uy * 24;
                            const midX = (startX + endX) / 2; const midY = (startY + endY) / 2;
                            const isSelected = selectedEdge === i;
                            const isCandidate = candidateSet.has(i);
                            const reason = candidateInfo.get(i);
                            // visual priority: selected edge style > candidate highlight > normal
                            const strokeColor = isSelected ? '#ffd54f' : (isCandidate ? '#60a5fa' : '#9aa4b2');
                            const strokeWidth = isSelected ? 4 : (isCandidate ? 4 : 2);
                            const textColor = isSelected ? '#ffd54f' : (isCandidate ? '#bfdbfe' : '#cbd5e1');
                            const angleDeg = Math.atan2(dy, dx) * 180 / Math.PI;
                            const edgeClass = isSelected ? 'edge-selected' : (isCandidate ? 'edge-candidate' : '');
                            return (
                                <g key={i} className={edgeClass} onMouseEnter={() => { hoverEdgeRef.current = i }} onMouseLeave={() => { hoverEdgeRef.current = null }}>
                                    <title>{reason || (isCandidate ? 'candidate' : 'edge')}</title>
                                    <line onClick={(ev) => { ev.stopPropagation(); setSelectedEdge(i); setSelected(null); }} x1={startX} y1={startY} x2={endX} y2={endY} stroke={strokeColor} strokeWidth={strokeWidth} />
                                    {/* inline arrowhead so we can animate it per-edge */}
                                    <g transform={`translate(${endX}, ${endY}) rotate(${angleDeg})`}>
                                        <path className="arrow-head" d="M0,0 L-12,-6 L-12,6 Z" fill={strokeColor} />
                                    </g>
                                    {e.label && <text x={midX} y={midY - 6} fontSize={12} fill={textColor} textAnchor="middle">{e.label}</text>}
                                </g>
                            );
                        });
                    })()}

                    {/* temp connecting line while dragging */}
                    {connectDragging && connectFrom !== null && tempPos && (() => {
                        const fromNode = nodes.find(n => n.id === connectFrom);
                        if (!fromNode) return null;
                        const dx = tempPos.x - fromNode.x; const dy = tempPos.y - fromNode.y; const len = Math.hypot(dx, dy) || 1;
                        const ux = dx / len; const uy = dy / len;
                        const startX = fromNode.x + ux * 24; const startY = fromNode.y + uy * 24;
                        return <line x1={startX} y1={startY} x2={tempPos.x} y2={tempPos.y} stroke="#ffd54f" strokeWidth={2} strokeDasharray="4 4" />;
                    })()}

                    <defs>
                        <style>{`
                            .arrow-head { transform-origin: center; }
                            @keyframes pulse {
                                0% { transform: scale(1); opacity: 1; }
                                50% { transform: scale(1.35); opacity: 0.85; }
                                100% { transform: scale(1); opacity: 1; }
                            }
                            .edge-candidate .arrow-head { animation: pulse 900ms ease-in-out infinite; }
                            .edge-selected .arrow-head { animation: pulse 600ms ease-in-out infinite; }
                        `}</style>
                    </defs>

                    {/* groups (drawn behind nodes) */}
                    {groups.map(g => g.bbox ? (
                        <g key={g.id}>
                            <rect x={g.bbox.x} y={g.bbox.y} width={g.bbox.w} height={g.bbox.h} rx={12} ry={12} fill="rgba(255,255,255,0.03)" stroke="rgba(160,160,160,0.08)" />
                            <text x={g.bbox.x + 12} y={g.bbox.y + 18} fontSize={12} fill="#9aa4b2">{g.title}</text>
                        </g>
                    ) : null)}

                    {/* nodes */}
                    {nodes.map(n => {
                        const isCurrent = current === n.id;
                        return (
                            <g key={n.id} transform={`translate(${n.x}, ${n.y})`} onMouseDown={(e) => { if (mode === 'connect') startConnectDrag(e, n.id); else startDrag(e, n.id); }} onDoubleClick={() => { setSelected(n.id); }}>
                                {n.type === 'circle' && <circle r={20} cx={0} cy={0} fill={isCurrent ? '#ffd54f' : '#1f6feb'} stroke="#fff" strokeWidth={isCurrent ? 3 : 1} />}
                                {n.type === 'square' && <rect x={-20} y={-20} width={40} height={40} fill={isCurrent ? '#ffd54f' : '#10b981'} stroke="#fff" strokeWidth={isCurrent ? 3 : 1} />}
                                {n.type === 'triangle' && <path d="M0 -24 L-22 12 L22 12 Z" fill={isCurrent ? '#ffd54f' : '#ef4444'} stroke="#fff" strokeWidth={isCurrent ? 3 : 1} />}
                                {n.type === 'diamond' && <path d="M0 -22 L22 0 L0 22 L-22 0 Z" fill={isCurrent ? '#ffd54f' : '#8b5cf6'} stroke="#fff" strokeWidth={isCurrent ? 3 : 1} />}
                                {n.type === 'hexagon' && <path d="M-18,-6 L-18,6 L0,18 L18,6 L18,-6 L0,-18 Z" fill={isCurrent ? '#ffd54f' : '#f59e0b'} stroke="#fff" strokeWidth={isCurrent ? 3 : 1} />}
                                {n.type === 'parallelogram' && <path d="M-18,-16 L10,-16 L18,16 L-10,16 Z" fill={isCurrent ? '#ffd54f' : '#06b6d4'} stroke="#fff" strokeWidth={isCurrent ? 3 : 1} />}
                                <text x={0} y={36} fontSize={12} fill="#fff" textAnchor="middle">{n.label || n.type}</text>

                                {(() => {
                                    const ins = n.meta?.inputs || [];
                                    const outs = n.meta?.outputs || [];
                                    const inTotal = Math.max(1, ins.length);
                                    const outTotal = Math.max(1, outs.length);
                                    return (
                                        <g>
                                            {ins.map((name, idx) => {
                                                const y = (idx - (inTotal - 1) / 2) * 12 - 6;
                                                return (
                                                    <g key={`in-${n.id}-${idx}`}>
                                                        <circle cx={-28} cy={y} r={4} fill="#9aa4b2" />
                                                        <text x={-36} y={y + 4} fontSize={10} fill="#cbd5e1" textAnchor="end">{name}</text>
                                                    </g>
                                                );
                                            })}
                                            {outs.map((name, idx) => {
                                                const y = (idx - (outTotal - 1) / 2) * 12 - 6;
                                                return (
                                                    <g key={`out-${n.id}-${idx}`}>
                                                        <circle cx={28} cy={y} r={4} fill="#60a5fa" />
                                                        <text x={36} y={y + 4} fontSize={10} fill="#bfdbfe" textAnchor="start">{name}</text>
                                                    </g>
                                                );
                                            })}
                                        </g>
                                    );
                                })()}
                            </g>
                        );
                    })}
                </svg>

                <div style={{ width: 300 }} className="p-2 bg-[var(--color-surface)] rounded">
                    <h3 className="font-semibold">Flowchart Inspector</h3>
                    <div className="text-xs text-[var(--color-muted)] mb-2">Select a node (double-click) to edit.</div>
                    {selected ? (
                        (() => {
                            const node = nodes.find(n => n.id === selected)!;
                            return (
                                <div>
                                    <div>Node #{selected}</div>
                                    <div className="mt-2">
                                        <label className="text-xs">Type</label>
                                        <select className="w-full p-1 rounded mt-1" value={node.type} onChange={(e) => setNodes(prev => prev.map(n => n.id === selected ? { ...n, type: e.target.value as ShapeType } : n))}>
                                            <option value="circle">Circle</option>
                                            <option value="square">Square</option>
                                            <option value="triangle">Triangle</option>
                                            <option value="diamond">Diamond</option>
                                            <option value="hexagon">Hexagon</option>
                                            <option value="parallelogram">Parallelogram</option>
                                        </select>
                                    </div>
                                    <div className="mt-2">
                                        <label className="text-xs">Label</label>
                                        <input className="w-full p-1 rounded mt-1" value={node.label || ''} onChange={(e) => setLabel(selected, e.target.value)} />
                                    </div>
                                    <div className="mt-2">
                                        <label className="text-xs">Role</label>
                                        <input className="w-full p-1 rounded mt-1" value={node.meta?.role || ''} onChange={(e) => setMeta(selected, { role: e.target.value })} />
                                    </div>
                                    <div className="mt-2">
                                        <label className="text-xs">Group</label>
                                        <input className="w-full p-1 rounded mt-1" value={node.meta?.group || ''} onChange={(e) => setMeta(selected, { group: e.target.value })} />
                                    </div>
                                    <div className="mt-2">
                                        <label className="text-xs">Inputs (comma separated)</label>
                                        <input className="w-full p-1 rounded mt-1" value={(node.meta?.inputs || []).join(',')} onChange={(e) => setMeta(selected, { inputs: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} />
                                    </div>
                                    <div className="mt-2">
                                        <label className="text-xs">Outputs (comma separated)</label>
                                        <input className="w-full p-1 rounded mt-1" value={(node.meta?.outputs || []).join(',')} onChange={(e) => setMeta(selected, { outputs: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} />
                                    </div>
                                    <div className="mt-2 text-xs text-[var(--color-muted)]">Outgoing edges:</div>
                                    <ul className="text-sm">
                                        {edges.filter(er => er.from === selected).map((er, i) => <li key={i}>→ Node {er.to}</li>)}
                                    </ul>
                                </div>
                            );
                        })()
                    ) : (
                        <div className="text-sm">No node selected</div>
                    )}

                    {/* Suggestions confirm UI */}
                    {suggestions.length > 0 && (
                        <div className="mt-3 p-2 border rounded bg-[rgba(0,0,0,0.04)]">
                            <div className="flex items-center justify-between">
                                <div className="text-sm font-semibold">Wiring Suggestions</div>
                                <div className="text-xs text-[var(--color-muted)]">{suggestions.length} suggested</div>
                            </div>
                            <div className="max-h-40 overflow-auto mt-2 text-sm">
                                {suggestions.map((s) => (
                                    <label key={s.id} className="flex items-center gap-2 py-1">
                                        <input type="checkbox" checked={s.selected} onChange={() => toggleSuggestion(s.id)} />
                                        <span>{`Node ${s.from} → Node ${s.to}`}</span>
                                        <span className="ml-auto text-xs text-[var(--color-muted)]">{s.name}{s.fromType ? ` : ${s.fromType}` : ''}{s.toType ? ` → ${s.toType}` : ''}</span>
                                    </label>
                                ))}
                            </div>
                            <div className="mt-2 flex gap-2">
                                <button onClick={() => applySuggestions('selected')} className="px-3 py-1 rounded bg-[var(--color-accent)] text-white">Apply Selected</button>
                                <button onClick={() => applySuggestions('all')} className="px-3 py-1 rounded">Apply All</button>
                                <button onClick={() => setSuggestions([])} className="px-3 py-1 rounded bg-red-600 text-white">Clear</button>
                            </div>
                        </div>
                    )}

                    {selectedEdge !== null && (
                        <div className="mt-3 p-2 border rounded bg-[rgba(0,0,0,0.04)]">
                            <div className="text-sm font-semibold">Selected Edge</div>
                            <div className="text-xs">{`From Node ${edges[selectedEdge].from} → To Node ${edges[selectedEdge].to}`}</div>
                            <div className="mt-2">
                                <label className="text-xs">Edge label (e.g. true/false)</label>
                                <input value={edges[selectedEdge].label || ''} onChange={(e) => setEdges(prev => prev.map((ed, idx) => idx === selectedEdge ? { ...ed, label: e.target.value } : ed))} className="w-full p-1 rounded mt-1" />
                            </div>
                            <div className="mt-2">
                                <button onClick={() => { setEdges(prev => prev.filter((_, idx) => idx !== selectedEdge)); setSelectedEdge(null); }} className="px-3 py-1 rounded bg-red-600 text-white">Delete Edge</button>
                            </div>
                        </div>
                    )}

                    <hr className="my-2" />
                    <div className="text-xs">Interpreter context (JSON):</div>
                    <textarea value={contextVars} onChange={(e) => setContextVars(e.target.value)} className="w-full h-20 p-2 rounded mt-1 bg-black text-white text-sm" />
                    <div className="text-xs mt-2">Pedagogical mapping suggestions:</div>
                    <ul className="text-sm mt-1">
                        <li>Circle → LOOP</li>
                        <li>Square → IF / Conditional (set node label to e.g. <code>x &gt; 0</code>)</li>
                        <li>Triangle → Function / Subroutine</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
