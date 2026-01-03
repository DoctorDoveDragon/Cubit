import React, { useState } from 'react';

const FUNCTION_GROUPS = [
    {
        group: 'Math',
        functions: [
            { name: 'sqrt', usage: 'sqrt(x)', example: 'sqrt(16)  # 4.0' },
            { name: 'pow', usage: 'pow(a, b)', example: 'pow(2, 8)  # 256' },
            { name: 'abs', usage: 'abs(x)', example: 'abs(-42)  # 42' },
            { name: 'min', usage: 'min(a, b, ...)', example: 'min(5, 2, 8, 1)  # 1' },
            { name: 'max', usage: 'max(a, b, ...)', example: 'max(5, 2, 8, 1)  # 8' },
            { name: 'floor', usage: 'floor(x)', example: 'floor(3.7)  # 3' },
            { name: 'ceil', usage: 'ceil(x)', example: 'ceil(3.2)  # 4' },
            { name: 'round', usage: 'round(x)', example: 'round(3.5)  # 4' },
            { name: 'sin', usage: 'sin(x)', example: 'sin(0)  # 0.0' },
            { name: 'cos', usage: 'cos(x)', example: 'cos(0)  # 1.0' },
            { name: 'tan', usage: 'tan(x)', example: 'tan(0)  # 0.0' },
        ]
    },
    {
        group: 'String',
        functions: [
            { name: 'len', usage: 'len(s)', example: 'len("hello")  # 5' },
            { name: 'upper', usage: 'upper(s)', example: 'upper("hi")  # "HI"' },
            { name: 'lower', usage: 'lower(s)', example: 'lower("HI")  # "hi"' },
            { name: 'split', usage: 'split(s, sep)', example: 'split("a,b,c", ",")  # ["a", "b", "c"]' },
            { name: 'join', usage: 'join(sep, list)', example: 'join("-", ["a", "b"])  # "a-b"' },
            { name: 'strip', usage: 'strip(s)', example: 'strip("  hi  ")  # "hi"' },
            { name: 'replace', usage: 'replace(s, old, new)', example: 'replace("hi", "h", "b")  # "bi"' },
            { name: 'startswith', usage: 'startswith(s, prefix)', example: 'startswith("hi", "h")  # true' },
            { name: 'endswith', usage: 'endswith(s, suffix)', example: 'endswith("hi", "i")  # true' },
        ]
    },
    {
        group: 'List',
        functions: [
            { name: 'append', usage: 'append(list, item)', example: 'append(nums, 9)' },
            { name: 'pop', usage: 'pop(list)', example: 'pop(nums)' },
            { name: 'insert', usage: 'insert(list, idx, item)', example: 'insert(nums, 0, 2)' },
            { name: 'remove', usage: 'remove(list, item)', example: 'remove(nums, 1)' },
            { name: 'sort', usage: 'sort(list)', example: 'sort(nums)' },
            { name: 'reverse', usage: 'reverse(list)', example: 'reverse(nums)' },
            { name: 'shuffle', usage: 'shuffle(list)', example: 'shuffle(nums)' },
        ]
    },
    {
        group: 'Random',
        functions: [
            { name: 'random', usage: 'random()', example: 'random()  # 0.0-1.0' },
            { name: 'randint', usage: 'randint(a, b)', example: 'randint(1, 10)' },
            { name: 'choice', usage: 'choice(list)', example: 'choice([1,2,3])' },
            { name: 'shuffle', usage: 'shuffle(list)', example: 'shuffle(nums)' },
        ]
    },
    {
        group: 'Type Conversion',
        functions: [
            { name: 'int', usage: 'int(x)', example: 'int(3.14)  # 3' },
            { name: 'float', usage: 'float(x)', example: 'float(42)  # 42.0' },
            { name: 'str', usage: 'str(x)', example: 'str(123)  # "123"' },
        ]
    },
    {
        group: 'Input/Output',
        functions: [
            { name: 'input', usage: 'input(prompt)', example: 'input("Enter: ")' },
            { name: 'print', usage: 'print(x)', example: 'print "Hello, World!"' },
        ]
    },
];

export default function FunctionExplorer() {
    const [expanded, setExpanded] = useState<string | null>(FUNCTION_GROUPS[0].group);

    return (
        <div className="max-w-3xl mx-auto py-10">
            <h1 className="text-3xl font-bold mb-6 text-center">Cubit Function Explorer</h1>
            <div className="space-y-4">
                {FUNCTION_GROUPS.map(group => (
                    <div key={group.group} className="border rounded-lg bg-[var(--color-surface)]">
                        <button
                            className="w-full text-left px-4 py-3 font-semibold text-lg flex justify-between items-center focus:outline-none"
                            onClick={() => setExpanded(expanded === group.group ? null : group.group)}
                        >
                            <span>{group.group}</span>
                            <span>{expanded === group.group ? '−' : '+'}</span>
                        </button>
                        {expanded === group.group && (
                            <div className="px-6 pb-4">
                                <table className="w-full text-sm mt-2">
                                    <thead>
                                        <tr className="text-[var(--color-accent)]">
                                            <th className="text-left">Function</th>
                                            <th className="text-left">Usage</th>
                                            <th className="text-left">Example</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {group.functions.map(fn => (
                                            <tr key={fn.name} className="border-t">
                                                <td className="py-1 font-mono">{fn.name}</td>
                                                <td className="py-1 font-mono">{fn.usage}</td>
                                                <td className="py-1 font-mono">{fn.example}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
