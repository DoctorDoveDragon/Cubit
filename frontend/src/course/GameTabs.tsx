import React, { useState } from 'react';
import gamesData from './games.json';
import { executeGameCode } from '../utils/api';

export default function GameTabs() {
    const [active, setActive] = useState(0);
    const [userCode, setUserCode] = useState(gamesData.games[0].starter);
    const [result, setResult] = useState<string | null>(null);
    const [checking, setChecking] = useState(false);

    const game = gamesData.games[active];

    const handleTab = (i: number) => {
        setActive(i);
        setUserCode(gamesData.games[i].starter);
        setResult(null);
    };

    const checkSolution = async () => {
        setChecking(true);
        try {
            // Use backend to execute the code
            const response = await executeGameCode({
                game: game.title,
                code: userCode,
                teaching_enabled: false
            });
            
            if (response.error) {
                setResult(`Error: ${response.error}`);
            } else {
                // For now, simple check - you could enhance this to compare shapes, etc.
                const isCorrect = userCode.trim() === game.solution.trim();
                setResult(isCorrect ? 'Success! 🎉' : 'Code executed. Try to match the solution!');
            }
        } catch (error) {
            setResult(`Error: ${error instanceof Error ? error.message : String(error)}`);
        } finally {
            setChecking(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto py-10">
            <h1 className="text-3xl font-bold mb-6 text-center">Cubit Coding Games</h1>
            <div className="flex gap-2 mb-6 justify-center flex-wrap">
                {gamesData.games.map((g, i) => (
                    <button
                        key={g.title}
                        className={`px-4 py-2 rounded-t-lg font-semibold border-b-2 ${i === active ? 'border-[var(--color-accent)] bg-[var(--color-surface)]' : 'border-transparent bg-transparent'} transition`}
                        onClick={() => handleTab(i)}
                    >
                        {g.title}
                    </button>
                ))}
            </div>
            <div className="bg-[var(--color-surface)] rounded-lg shadow p-6">
                <h2 className="text-2xl font-semibold mb-2">{game.title}</h2>
                <p className="mb-2 text-[var(--color-muted)]">{game.description}</p>
                <p className="mb-4 text-sm text-[var(--color-accent)]">{game.instructions}</p>
                <textarea
                    className="w-full font-mono p-3 rounded border bg-[var(--color-bg)] text-[var(--color-muted)] mb-4 min-h-[120px]"
                    value={userCode}
                    onChange={e => setUserCode(e.target.value)}
                />
                <div className="flex gap-2 mb-4">
                    <button
                        className="px-4 py-2 rounded bg-[var(--color-accent)] text-white font-semibold"
                        onClick={checkSolution}
                        disabled={checking}
                    >
                        {checking ? 'Checking...' : 'Check Solution'}
                    </button>
                    {result && <span className="text-lg font-bold">{result}</span>}
                </div>
                <details className="mt-2">
                    <summary className="cursor-pointer text-sm text-[var(--color-accent)]">Show Solution</summary>
                    <pre className="bg-[var(--color-bg)] p-3 rounded mt-2 text-sm overflow-x-auto"><code>{game.solution}</code></pre>
                </details>
            </div>
        </div>
    );
}
