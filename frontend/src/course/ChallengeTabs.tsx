import React, { useState } from 'react';
import challengesData from './challenges.json';

export default function ChallengeTabs() {
    const [active, setActive] = useState(0);
    const [userCode, setUserCode] = useState(challengesData.challenges[0].starter);
    const [result, setResult] = useState<string | null>(null);
    const [checking, setChecking] = useState(false);

    const challenge = challengesData.challenges[active];

    const handleTab = (i: number) => {
        setActive(i);
        setUserCode(challengesData.challenges[i].starter);
        setResult(null);
    };

    // This is a placeholder for backend code execution/validation
    const checkSolution = async () => {
        setChecking(true);
        // TODO: Replace with real API call to backend Cubit executor
        const isCorrect = userCode.trim() === challenge.solution.trim();
        setResult(isCorrect ? 'Correct! 🎉' : 'Try again.');
        setChecking(false);
    };

    return (
        <div className="max-w-3xl mx-auto py-10">
            <h1 className="text-3xl font-bold mb-6 text-center">Cubit Code Challenges</h1>
            <div className="flex gap-2 mb-6 justify-center flex-wrap">
                {challengesData.challenges.map((c, i) => (
                    <button
                        key={c.title}
                        className={`px-4 py-2 rounded-t-lg font-semibold border-b-2 ${i === active ? 'border-[var(--color-accent)] bg-[var(--color-surface)]' : 'border-transparent bg-transparent'} transition`}
                        onClick={() => handleTab(i)}
                    >
                        {c.title}
                    </button>
                ))}
            </div>
            <div className="bg-[var(--color-surface)] rounded-lg shadow p-6">
                <h2 className="text-2xl font-semibold mb-2">{challenge.title}</h2>
                <p className="mb-4 text-[var(--color-muted)]">{challenge.description}</p>
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
                    <pre className="bg-[var(--color-bg)] p-3 rounded mt-2 text-sm overflow-x-auto"><code>{challenge.solution}</code></pre>
                </details>
            </div>
        </div>
    );
}
