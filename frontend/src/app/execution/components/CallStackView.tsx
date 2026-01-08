'use client'

import React from 'react'

interface StackFrame {
  function: string;
  line: number;
  file?: string;
}

interface CallStackViewProps {
  stack?: StackFrame[];
}

export default function CallStackView({ stack = [] }: CallStackViewProps) {
  if (stack.length === 0) {
    return (
      <div className="p-4 bg-gray-50 rounded-lg text-center text-gray-600 text-sm">
        No call stack to display. Execute code to see the call stack.
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="bg-gray-800 text-white px-4 py-2 text-sm font-medium">
        Call Stack
      </div>
      <div className="divide-y">
        {stack.map((frame, index) => (
          <div
            key={index}
            className="p-3 hover:bg-gray-50 font-mono text-sm"
          >
            <div className="flex items-center gap-2">
              <span className="text-gray-500 w-6">#{index}</span>
              <span className="text-gray-900 font-medium">{frame.function}</span>
              <span className="text-gray-500">at line {frame.line}</span>
              {frame.file && (
                <span className="text-gray-400 text-xs">({frame.file})</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
