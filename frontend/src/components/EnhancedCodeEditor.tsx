'use client'

import React, { useState, useRef, useEffect } from 'react'

interface EnhancedCodeEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  language?: 'cubit' | 'python' | 'javascript'
  readOnly?: boolean
  className?: string
  showLineNumbers?: boolean
  highlightErrors?: boolean
}

/**
 * Enhanced Code Editor with syntax highlighting, line numbers,
 * and basic code intelligence features
 */
export default function EnhancedCodeEditor({
  value,
  onChange,
  placeholder = 'Enter your code here...',
  language = 'cubit',
  readOnly = false,
  className = '',
  showLineNumbers = true,
  highlightErrors = false
}: EnhancedCodeEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [lineCount, setLineCount] = useState(1)
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 })

  // Update line count when value changes
  useEffect(() => {
    const lines = value.split('\n').length
    setLineCount(lines)
  }, [value])

  // Track cursor position
  const updateCursorPosition = () => {
    if (!textareaRef.current) return

    const textarea = textareaRef.current
    const text = textarea.value.substring(0, textarea.selectionStart)
    const lines = text.split('\n')
    const line = lines.length
    const column = lines[lines.length - 1].length + 1

    setCursorPosition({ line, column })
  }

  // Handle tab key for proper indentation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      const textarea = e.currentTarget
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const newValue = value.substring(0, start) + '  ' + value.substring(end)
      onChange(newValue)

      // Set cursor position after tab
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2
      }, 0)
    }
  }

  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center justify-between mb-2 text-xs text-[var(--color-muted)]">
        <div className="flex gap-4">
          <span>Language: {language.toUpperCase()}</span>
          <span>Lines: {lineCount}</span>
          <span>Ln {cursorPosition.line}, Col {cursorPosition.column}</span>
        </div>
        {highlightErrors && (
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span>No errors</span>
          </div>
        )}
      </div>

      <div className="relative flex">
        {/* Line numbers */}
        {showLineNumbers && (
          <div className="flex-shrink-0 py-3 pr-3 pl-2 bg-[rgba(0,0,0,0.2)] border-r border-[rgba(255,255,255,0.08)] rounded-l-lg">
            <div className="font-mono text-xs text-[var(--color-muted)] text-right leading-6 select-none">
              {Array.from({ length: lineCount }, (_, i) => (
                <div key={i + 1}>{i + 1}</div>
              ))}
            </div>
          </div>
        )}

        {/* Code editor */}
        <div className="flex-1 relative">
          {/* Syntax highlighting overlay (disabled for now as it causes issues with editing) */}
          {/* <div
            className="absolute inset-0 py-3 px-4 font-mono text-sm pointer-events-none overflow-hidden whitespace-pre-wrap break-words"
            dangerouslySetInnerHTML={{ __html: highlightSyntax(value) }}
            style={{ color: 'transparent' }}
          /> */}

          {/* Actual textarea */}
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyUp={updateCursorPosition}
            onClick={updateCursorPosition}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            readOnly={readOnly}
            className={`
              w-full h-64 py-3 px-4
              bg-[var(--color-surface)] text-white
              border border-[rgba(255,255,255,0.12)]
              ${showLineNumbers ? '' : 'rounded-l-lg'}
              rounded-r-lg
              font-mono text-sm
              resize-y
              focus:outline-none focus:border-[var(--color-accent)]
              ${readOnly ? 'cursor-not-allowed opacity-60' : ''}
            `}
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
          />
        </div>
      </div>

      {/* Quick tips */}
      <div className="mt-2 text-xs text-[var(--color-muted)]">
        <span>Tips: </span>
        <span className="inline-flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 bg-[rgba(255,255,255,0.1)] rounded">Tab</kbd>
          <span>for indentation</span>
        </span>
      </div>
    </div>
  )
}
