'use client'

import React, { useState, useEffect } from 'react'

interface LogEntry {
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  module?: string;
}

export default function LogViewer() {
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      timestamp: new Date().toISOString(),
      level: 'info',
      message: 'System initialized successfully',
      module: 'system'
    },
    {
      timestamp: new Date().toISOString(),
      level: 'info',
      message: 'Log viewer ready. Execute code to see real-time logs.',
      module: 'frontend'
    }
  ])
  const [filter, setFilter] = useState<'all' | 'info' | 'warn' | 'error' | 'debug'>('all')

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'info': return 'text-blue-600'
      case 'warn': return 'text-yellow-600'
      case 'error': return 'text-red-600'
      case 'debug': return 'text-gray-600'
      default: return 'text-gray-800'
    }
  }

  const getLevelBg = (level: string) => {
    switch (level) {
      case 'info': return 'bg-blue-50'
      case 'warn': return 'bg-yellow-50'
      case 'error': return 'bg-red-50'
      case 'debug': return 'bg-gray-50'
      default: return 'bg-white'
    }
  }

  const filteredLogs = filter === 'all' ? logs : logs.filter(log => log.level === filter)

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="bg-gray-800 text-white px-6 py-3 flex items-center justify-between">
        <span className="font-semibold">System Logs</span>
        <div className="flex gap-2">
          {['all', 'info', 'warn', 'error', 'debug'].map((level) => (
            <button
              key={level}
              onClick={() => setFilter(level as never)}
              className={`px-3 py-1 text-xs rounded ${
                filter === level
                  ? 'bg-white text-gray-800'
                  : 'bg-gray-700 text-white hover:bg-gray-600'
              }`}
            >
              {level.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
      
      <div className="max-h-96 overflow-y-auto font-mono text-xs">
        {filteredLogs.map((log, index) => (
          <div
            key={index}
            className={`px-4 py-2 border-b ${getLevelBg(log.level)}`}
          >
            <div className="flex items-start gap-2">
              <span className="text-gray-500 shrink-0">
                {new Date(log.timestamp).toLocaleTimeString()}
              </span>
              <span className={`font-semibold uppercase shrink-0 ${getLevelColor(log.level)}`}>
                [{log.level}]
              </span>
              {log.module && (
                <span className="text-gray-600 shrink-0">[{log.module}]</span>
              )}
              <span className="text-gray-800">{log.message}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
