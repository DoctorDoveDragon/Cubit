'use client'

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlay, FiZap, FiAward } from 'react-icons/fi';
import gamesData from './games.json';
import { executeGameCode } from '../utils/api';

export default function GameTabs() {
    const [active, setActive] = useState(0);
    const [userCode, setUserCode] = useState(gamesData.games[0].starter);
    const [result, setResult] = useState<string | null>(null);
    const [checking, setChecking] = useState(false);
    const [showSolution, setShowSolution] = useState(false);

    const game = gamesData.games[active];

    const gameEmojis = ['🎨', '🎮', '🌟', '🎯', '🚀'];
    const gameColors = [
        'from-purple-400 to-pink-500',
        'from-blue-400 to-cyan-500',
        'from-green-400 to-emerald-500',
        'from-yellow-400 to-orange-500',
        'from-pink-400 to-rose-500'
    ];

    const handleTab = (i: number) => {
        setActive(i);
        setUserCode(gamesData.games[i].starter);
        setResult(null);
        setShowSolution(false);
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
                setResult(`❌ Error: ${response.error}`);
            } else {
                // For now, simple check - you could enhance this to compare shapes, etc.
                const isCorrect = userCode.trim() === game.solution.trim();
                setResult(isCorrect ? '🎉 Success! You solved it!' : '✨ Code executed! Keep trying to match the solution!');
            }
        } catch (error) {
            setResult(`❌ Error: ${error instanceof Error ? error.message : String(error)}`);
        } finally {
            setChecking(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto py-8">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-8"
            >
                <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-3">
                    <FiAward className="text-yellow-500" />
                    Cubit Coding Games
                    <motion.span
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" as const }}
                    >
                        🎮
                    </motion.span>
                </h1>
                <p className="text-gray-600">Play games while learning to code!</p>
            </motion.div>

            {/* Game Tabs */}
            <div className="flex gap-2 mb-6 justify-center flex-wrap">
                {gamesData.games.map((g, i) => (
                    <motion.button
                        key={g.title}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className={`
                            px-6 py-3 rounded-2xl font-bold border-2 transition-all shadow-md
                            ${i === active 
                                ? `bg-gradient-to-r ${gameColors[i]} text-white border-white shadow-lg` 
                                : 'bg-white text-gray-700 border-purple-200 hover:border-purple-300'
                            }
                        `}
                        onClick={() => handleTab(i)}
                    >
                        <span className="mr-2 text-xl">{gameEmojis[i]}</span>
                        {g.title}
                    </motion.button>
                ))}
            </div>

            {/* Game Content */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={active}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border-2 border-white/50"
                >
                    <div className={`inline-block px-6 py-3 rounded-full bg-gradient-to-r ${gameColors[active]} text-white font-bold mb-4 shadow-lg`}>
                        <span className="mr-2 text-xl">{gameEmojis[active]}</span>
                        {game.title}
                    </div>
                    <p className="mb-3 text-gray-700 text-lg font-medium">{game.description}</p>
                    <div className="mb-6 px-4 py-3 rounded-xl bg-blue-50 border-2 border-blue-200">
                        <p className="text-sm text-blue-800 font-semibold flex items-center gap-2">
                            <FiZap className="text-blue-600" />
                            {game.instructions}
                        </p>
                    </div>

                    {/* Code Editor */}
                    <div className="mb-6">
                        <label className="block text-sm font-bold text-gray-700 mb-2">Your Code:</label>
                        <textarea
                            className="w-full font-mono p-4 rounded-xl border-2 border-purple-200 bg-gray-50 text-gray-800 focus:outline-none focus:border-purple-400 shadow-inner min-h-[150px]"
                            value={userCode}
                            onChange={e => setUserCode(e.target.value)}
                            placeholder="Write your code here..."
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 mb-4 flex-wrap items-center">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`px-6 py-3 rounded-full font-bold text-white shadow-lg flex items-center gap-2 bg-gradient-to-r ${gameColors[active]}`}
                            onClick={checkSolution}
                            disabled={checking}
                        >
                            <FiPlay />
                            {checking ? '⏳ Checking...' : '▶️ Check Solution'}
                        </motion.button>
                        
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-6 py-3 rounded-full font-bold bg-white text-gray-700 border-2 border-purple-200 hover:border-purple-300 shadow-md"
                            onClick={() => setShowSolution(!showSolution)}
                        >
                            {showSolution ? '🙈 Hide' : '💡 Show'} Solution
                        </motion.button>
                    </div>

                    {/* Result Message */}
                    {result && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className={`px-6 py-4 rounded-2xl font-bold text-lg mb-4 ${
                                result.includes('Success') || result.includes('🎉')
                                    ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border-2 border-green-300'
                                    : result.includes('Error') || result.includes('❌')
                                    ? 'bg-gradient-to-r from-red-100 to-pink-100 text-red-700 border-2 border-red-300'
                                    : 'bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 border-2 border-blue-300'
                            }`}
                        >
                            {result}
                        </motion.div>
                    )}

                    {/* Solution Display */}
                    <AnimatePresence>
                        {showSolution && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-2xl border-2 border-yellow-200">
                                    <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                                        <FiAward className="text-yellow-600" />
                                        Solution:
                                    </h4>
                                    <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono overflow-x-auto">
                                        <code>{game.solution}</code>
                                    </pre>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
