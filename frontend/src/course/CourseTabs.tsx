'use client'

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiBook, FiStar, FiCheckCircle } from 'react-icons/fi';
import curriculum from './curriculum.json';

export default function CourseTabs() {
    const [activeModule, setActiveModule] = useState(0);
    const [activeLesson, setActiveLesson] = useState(0);
    const modules = curriculum.modules;
    const currentModule = modules[activeModule];
    const lessons = currentModule.lessons;
    const currentLesson = lessons[activeLesson];

    const moduleColors = [
        'from-purple-400 to-pink-500',
        'from-blue-400 to-cyan-500',
        'from-green-400 to-emerald-500',
        'from-yellow-400 to-orange-500',
        'from-pink-400 to-rose-500'
    ];

    const moduleEmojis = ['📚', '🔤', '🔢', '🎨', '🚀'];

    return (
        <div className="max-w-5xl mx-auto py-8">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-8"
            >
                <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-3">
                    <FiBook className="text-purple-600" />
                    Cubit Full Course
                    <motion.span
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        ✨
                    </motion.span>
                </h1>
                <p className="text-gray-600">Learn coding step by step through interactive lessons!</p>
            </motion.div>

            {/* Module Tabs */}
            <div className="flex gap-2 mb-6 justify-center flex-wrap">
                {modules.map((mod, i) => (
                    <motion.button
                        key={mod.title}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className={`
                            px-6 py-3 rounded-2xl font-bold border-2 transition-all shadow-md
                            ${i === activeModule 
                                ? `bg-gradient-to-r ${moduleColors[i]} text-white border-white shadow-lg` 
                                : 'bg-white text-gray-700 border-purple-200 hover:border-purple-300'
                            }
                        `}
                        onClick={() => { setActiveModule(i); setActiveLesson(0); }}
                    >
                        <span className="mr-2 text-xl">{moduleEmojis[i]}</span>
                        {mod.title}
                    </motion.button>
                ))}
            </div>

            {/* Module Content */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeModule}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border-2 border-white/50"
                >
                    <div className={`inline-block px-6 py-3 rounded-full bg-gradient-to-r ${moduleColors[activeModule]} text-white font-bold mb-4 shadow-lg`}>
                        <span className="mr-2 text-xl">{moduleEmojis[activeModule]}</span>
                        {currentModule.title}
                    </div>
                    <p className="mb-6 text-gray-600 text-lg">{currentModule.description}</p>

                    {/* Lesson Pills */}
                    <div className="flex gap-2 mb-6 flex-wrap">
                        {lessons.map((lesson, j) => (
                            <motion.button
                                key={lesson.title}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`
                                    px-4 py-2 rounded-full font-semibold text-sm transition-all shadow-md
                                    ${j === activeLesson 
                                        ? `bg-gradient-to-r ${moduleColors[activeModule]} text-white` 
                                        : 'bg-purple-50 text-gray-700 hover:bg-purple-100'
                                    }
                                `}
                                onClick={() => setActiveLesson(j)}
                            >
                                {j === activeLesson && <FiStar className="inline w-3 h-3 mr-1" />}
                                {lesson.title}
                                {j < activeLesson && <FiCheckCircle className="inline w-3 h-3 ml-1 text-green-400" />}
                            </motion.button>
                        ))}
                    </div>

                    {/* Lesson Content */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeLesson}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2 }}
                        >
                            <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <span className="text-3xl">{moduleEmojis[activeModule]}</span>
                                {currentLesson.title}
                            </h3>
                            <div className="bg-gradient-to-br from-gray-50 to-purple-50 p-6 rounded-2xl border-2 border-purple-200 shadow-inner">
                                <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono overflow-x-auto">
                                    <code>{currentLesson.content}</code>
                                </pre>
                            </div>

                            {/* Navigation Buttons */}
                            <div className="flex justify-between mt-6 gap-4">
                                <motion.button
                                    whileHover={{ scale: 1.05, x: -5 }}
                                    whileTap={{ scale: 0.95 }}
                                    disabled={activeLesson === 0}
                                    onClick={() => setActiveLesson(activeLesson - 1)}
                                    className="px-6 py-3 rounded-full font-bold bg-white text-gray-700 border-2 border-purple-200 hover:border-purple-300 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    ← Previous
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.05, x: 5 }}
                                    whileTap={{ scale: 0.95 }}
                                    disabled={activeLesson === lessons.length - 1}
                                    onClick={() => setActiveLesson(activeLesson + 1)}
                                    className={`px-6 py-3 rounded-full font-bold text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r ${moduleColors[activeModule]}`}
                                >
                                    Next →
                                </motion.button>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
