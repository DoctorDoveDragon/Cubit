import React, { useState } from 'react';

interface Props {
    onCode: (code: string) => void;
}

export default function NaturalLanguageInput({ onCode }: Props) {
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Call backend API for AI code generation
    const generateCode = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch('/api/generate-cubit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: input })
            });
            if (!res.ok) throw new Error('API error');
            const data = await res.json();
            onCode(data.code || '// AI: No code generated.');
        } catch (err) {
            console.error(err);
            setError('Failed to generate code.');
        }
        setLoading(false);
    };

    return (
        <div className="mb-4 p-4 bg-[var(--color-surface)] rounded-lg shadow flex flex-col gap-2">
            <label className="font-semibold mb-1">Describe what you want to code (natural language):</label>
            <textarea
                className="w-full p-2 rounded border bg-[var(--color-bg)] text-[var(--color-muted)] min-h-[60px]"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="e.g. Print the first 10 Fibonacci numbers"
            />
            <button
                className="px-4 py-2 rounded bg-[var(--color-accent)] text-white font-semibold self-start"
                onClick={generateCode}
                disabled={loading || !input.trim()}
            >
                {loading ? 'Generating...' : 'Generate Cubit Code'}
            </button>
            {error && <span className="text-red-500 text-sm">{error}</span>}
        </div>
    );
}
