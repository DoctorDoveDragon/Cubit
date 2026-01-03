'use client'

import React, { useState } from 'react';
import dynamic from 'next/dynamic';

const TreasureHunt = dynamic(() => import('../components/games/TreasureHunt'), { ssr: false });
const AnimatedArt = dynamic(() => import('../components/games/AnimatedArt'), { ssr: false });
const ComputationalGeometry = dynamic(() => import('../components/games/ComputationalGeometry'), { ssr: false });
const GraphingCalculator = dynamic(() => import('../components/games/GraphingCalculator'), { ssr: false });
const SolarSystem = dynamic(() => import('../components/games/SolarSystem'), { ssr: false });
const Flowchart = dynamic(() => import('../components/games/Flowchart'), { ssr: false });

const games = [
    { title: 'Computational Geometry', component: ComputationalGeometry, description: 'Learn computation through geometric patterns - Benkhawiya style' },
    { title: 'Treasure Hunt', component: TreasureHunt, description: 'Navigate a grid to find the hidden treasure' },
    { title: 'Animated Art', component: AnimatedArt, description: 'Create generative art with interactive shapes' },
    { title: 'Flowchart Builder', component: Flowchart, description: 'Build schematic flowcharts that map shapes to computational processes' },
    { title: 'Solar System', component: SolarSystem, description: 'Explore our solar system with realistic orbital mechanics' },
    { title: 'Graphing Calculator', component: GraphingCalculator, description: 'Plot mathematical functions visually' },
];

export default function GameTabs() {
    const [active, setActive] = useState(0);

    const GameComponent = games[active].component;

    return (
        <div className="max-w-4xl mx-auto py-10">
            <h1 className="text-3xl font-bold mb-6 text-center">🎮 Cubit Interactive Games 🎮</h1>
            <div className="flex gap-2 mb-6 justify-center flex-wrap">
                {games.map((g, i) => (
                    <button
                        key={g.title}
                        className={`px-4 py-2 rounded-t-lg font-semibold border-b-2 ${i === active
                            ? 'border-[var(--color-accent)] bg-[var(--color-surface)] text-white'
                            : 'border-transparent bg-transparent text-[var(--color-muted)]'
                            } transition hover:text-white`}
                        onClick={() => setActive(i)}
                    >
                        {g.title}
                    </button>
                ))}
            </div>
            <div className="bg-[var(--color-surface)] rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-semibold mb-2 text-center">{games[active].title}</h2>
                <p className="mb-6 text-[var(--color-muted)] text-center">{games[active].description}</p>
                <GameComponent />
            </div>
        </div>
    );
}
