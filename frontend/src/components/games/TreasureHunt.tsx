'use client'

import React, { useState, useEffect } from 'react';

interface Position {
    x: number;
    y: number;
}

export default function TreasureHunt() {
    const [playerPos, setPlayerPos] = useState<Position>({ x: 0, y: 0 });
    const [treasurePos] = useState<Position>({ x: 3, y: 3 });
    const [moves, setMoves] = useState<string[]>([]);
    const [won, setWon] = useState(false);
    const gridSize = 5;

    useEffect(() => {
        if (playerPos.x === treasurePos.x && playerPos.y === treasurePos.y) {
            const t = setTimeout(() => setWon(true), 0);
            return () => clearTimeout(t);
        }
    }, [playerPos, treasurePos]);

    const move = (direction: string) => {
        setMoves([...moves, direction]);
        const newPos = { ...playerPos };

        switch (direction) {
            case 'up':
                if (newPos.y > 0) newPos.y--;
                break;
            case 'down':
                if (newPos.y < gridSize - 1) newPos.y++;
                break;
            case 'left':
                if (newPos.x > 0) newPos.x--;
                break;
            case 'right':
                if (newPos.x < gridSize - 1) newPos.x++;
                break;
        }

        setPlayerPos(newPos);
    };

    const reset = () => {
        setPlayerPos({ x: 0, y: 0 });
        setMoves([]);
        setWon(false);
    };

    return (
        <div className="flex flex-col items-center gap-4">
            <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}>
                {Array.from({ length: gridSize * gridSize }).map((_, i) => {
                    const x = i % gridSize;
                    const y = Math.floor(i / gridSize);
                    const isPlayer = playerPos.x === x && playerPos.y === y;
                    const isTreasure = treasurePos.x === x && treasurePos.y === y;

                    return (
                        <div
                            key={i}
                            className="w-16 h-16 border-2 border-[var(--color-accent)] flex items-center justify-center text-3xl"
                            style={{
                                backgroundColor: isPlayer ? '#7c3aed' : isTreasure ? '#fbbf24' : 'var(--color-surface)'
                            }}
                        >
                            {isPlayer && '🧑'}
                            {isTreasure && !isPlayer && '💎'}
                        </div>
                    );
                })}
            </div>

            <div className="flex gap-2 flex-wrap justify-center">
                <button
                    onClick={() => move('up')}
                    className="px-6 py-3 rounded bg-[var(--color-accent)] text-white font-semibold hover:opacity-80 transition"
                >
                    ⬆️ Up
                </button>
            </div>
            <div className="flex gap-2">
                <button
                    onClick={() => move('left')}
                    className="px-6 py-3 rounded bg-[var(--color-accent)] text-white font-semibold hover:opacity-80 transition"
                >
                    ⬅️ Left
                </button>
                <button
                    onClick={() => move('down')}
                    className="px-6 py-3 rounded bg-[var(--color-accent)] text-white font-semibold hover:opacity-80 transition"
                >
                    ⬇️ Down
                </button>
                <button
                    onClick={() => move('right')}
                    className="px-6 py-3 rounded bg-[var(--color-accent)] text-white font-semibold hover:opacity-80 transition"
                >
                    ➡️ Right
                </button>
            </div>

            <button
                onClick={reset}
                className="px-6 py-2 rounded bg-gray-600 text-white font-semibold hover:opacity-80 transition"
            >
                Reset
            </button>

            {won && (
                <div className="text-2xl font-bold text-green-400 animate-pulse">
                    🎉 You found the treasure! 🎉
                </div>
            )}

            <div className="text-sm text-[var(--color-muted)]">
                Moves: {moves.length}
            </div>
        </div>
    );
}
