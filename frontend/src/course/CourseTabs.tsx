import React, { useState } from 'react';
import curriculum from './curriculum.json';

export default function CourseTabs() {
    const [activeModule, setActiveModule] = useState(0);
    const [activeLesson, setActiveLesson] = useState(0);
    const modules = curriculum.modules;
    const currentModule = modules[activeModule];
    const lessons = currentModule.lessons;
    const currentLesson = lessons[activeLesson];

    return (
        <div className="max-w-3xl mx-auto py-10">
            <h1 className="text-3xl font-bold mb-6 text-center">Cubit Full Course</h1>
            <div className="flex gap-2 mb-6 justify-center flex-wrap">
                {modules.map((mod, i) => (
                    <button
                        key={mod.title}
                        className={`px-4 py-2 rounded-t-lg font-semibold border-b-2 ${i === activeModule ? 'border-[var(--color-accent)] bg-[var(--color-surface)]' : 'border-transparent bg-transparent'} transition`}
                        onClick={() => { setActiveModule(i); setActiveLesson(0); }}
                    >
                        {mod.title}
                    </button>
                ))}
            </div>
            <div className="bg-[var(--color-surface)] rounded-lg shadow p-6">
                <h2 className="text-2xl font-semibold mb-2">{currentModule.title}</h2>
                <p className="mb-4 text-[var(--color-muted)]">{currentModule.description}</p>
                <div className="flex gap-2 mb-4 flex-wrap">
                    {lessons.map((lesson, j) => (
                        <button
                            key={lesson.title}
                            className={`px-3 py-1 rounded font-medium text-sm ${j === activeLesson ? 'bg-[var(--color-accent)] text-white' : 'bg-[var(--color-bg)] text-[var(--color-muted)]'} transition`}
                            onClick={() => setActiveLesson(j)}
                        >
                            {lesson.title}
                        </button>
                    ))}
                </div>
                <div className="prose max-w-none">
                    <h3 className="text-xl font-bold mb-2">{currentLesson.title}</h3>
                    <pre className="bg-[var(--color-bg)] p-4 rounded mb-4 overflow-x-auto text-sm"><code>{currentLesson.content}</code></pre>
                </div>
            </div>
        </div>
    );
}
