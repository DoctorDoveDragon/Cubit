import React, { useState, useEffect } from 'react'

const COLOR_PALETTES = [
    { name: 'Violet', accent: '#7c3aed', bg: '#0f172a', surface: '#0b1220', muted: '#94a3b8' },
    { name: 'Blue', accent: '#3b82f6', bg: '#e0f2fe', surface: '#f1f5f9', muted: '#64748b' },
    { name: 'Amber', accent: '#f59e0b', bg: '#fff7ed', surface: '#fef3c7', muted: '#b45309' },
    { name: 'Slate', accent: '#64748b', bg: '#f8fafc', surface: '#e2e8f0', muted: '#334155' },
]

const FONT_FAMILIES = [
    { name: 'Inter', value: 'Inter, ui-sans-serif, system-ui' },
    { name: 'Roboto', value: 'Roboto, ui-sans-serif, system-ui' },
    { name: 'System', value: 'ui-sans-serif, system-ui' },
    { name: 'Serif', value: 'ui-serif, Georgia, serif' },
    { name: 'Monospace', value: 'ui-monospace, SFMono-Regular, monospace' },
]

export default function SettingsPanel() {
    // Initialize from localStorage when available (safe lazy initializer)
    const [palette, setPalette] = useState<number>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('cubit_palette');
            return saved ? Number(saved) : 0;
        }
        return 0;
    });
    const [font, setFont] = useState<number>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('cubit_font');
            return saved ? Number(saved) : 0;
        }
        return 0;
    });

    useEffect(() => {
        const p = COLOR_PALETTES[palette]
        document.documentElement.style.setProperty('--color-accent', p.accent)
        document.documentElement.style.setProperty('--color-bg', p.bg)
        document.documentElement.style.setProperty('--color-surface', p.surface)
        document.documentElement.style.setProperty('--color-muted', p.muted)
        localStorage.setItem('cubit_palette', String(palette))
    }, [palette])

    useEffect(() => {
        const f = FONT_FAMILIES[font]
        document.documentElement.style.setProperty('--font-sans', f.value)
        document.documentElement.style.setProperty('--font-heading', f.value)
        localStorage.setItem('cubit_font', String(font))
    }, [font])

    // No mount effect needed to populate state: lazy initializers read localStorage

    return (
        <div className="space-y-4 p-4">
            <div>
                <label className="block text-sm font-medium mb-1">Color Palette</label>
                <select
                    className="w-full rounded border px-3 py-2 bg-[var(--color-surface)] text-[var(--color-muted)]"
                    value={palette}
                    onChange={e => setPalette(Number(e.target.value))}
                >
                    {COLOR_PALETTES.map((p, i) => (
                        <option value={i} key={p.name}>{p.name}</option>
                    ))}
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Font Family</label>
                <select
                    className="w-full rounded border px-3 py-2 bg-[var(--color-surface)] text-[var(--color-muted)]"
                    value={font}
                    onChange={e => setFont(Number(e.target.value))}
                >
                    {FONT_FAMILIES.map((f, i) => (
                        <option value={i} key={f.name}>{f.name}</option>
                    ))}
                </select>
            </div>
        </div>
    )
}
