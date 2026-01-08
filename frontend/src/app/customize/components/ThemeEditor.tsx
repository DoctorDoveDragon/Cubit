'use client'

import React, { useState, useEffect } from 'react'

interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
}

const defaultTheme: ThemeColors = {
  primary: '#3b82f6',
  secondary: '#8b5cf6',
  accent: '#10b981',
  background: '#f3f4f6',
  surface: '#ffffff',
  text: '#111827'
}

export default function ThemeEditor() {
  const [theme, setTheme] = useState<ThemeColors>(defaultTheme)
  const [previewMode, setPreviewMode] = useState(false)

  useEffect(() => {
    const savedTheme = localStorage.getItem('cubit-theme')
    if (savedTheme) {
      try {
        setTheme(JSON.parse(savedTheme))
      } catch (error) {
        console.error('Failed to load saved theme:', error)
      }
    }
  }, [])

  const handleColorChange = (key: keyof ThemeColors, value: string) => {
    const newTheme = { ...theme, [key]: value }
    setTheme(newTheme)
    localStorage.setItem('cubit-theme', JSON.stringify(newTheme))
  }

  const handleReset = () => {
    setTheme(defaultTheme)
    localStorage.setItem('cubit-theme', JSON.stringify(defaultTheme))
  }

  const colorInputs: Array<{ key: keyof ThemeColors; label: string; description: string }> = [
    { key: 'primary', label: 'Primary Color', description: 'Main brand color' },
    { key: 'secondary', label: 'Secondary Color', description: 'Secondary brand color' },
    { key: 'accent', label: 'Accent Color', description: 'Highlights and CTAs' },
    { key: 'background', label: 'Background', description: 'Page background' },
    { key: 'surface', label: 'Surface', description: 'Cards and panels' },
    { key: 'text', label: 'Text Color', description: 'Primary text' }
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Theme Customization</h3>
          <p className="text-sm text-gray-600">Customize the color scheme for your workspace</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
          >
            {previewMode ? 'Edit Mode' : 'Preview Mode'}
          </button>
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm"
          >
            Reset to Default
          </button>
        </div>
      </div>

      {!previewMode ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {colorInputs.map(({ key, label, description }) => (
            <div key={key} className="p-4 bg-white rounded-lg shadow">
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={theme[key]}
                  onChange={(e) => handleColorChange(key, e.target.value)}
                  className="w-12 h-12 rounded cursor-pointer"
                />
                <div className="flex-1">
                  <label className="block font-medium text-sm">{label}</label>
                  <p className="text-xs text-gray-600">{description}</p>
                  <input
                    type="text"
                    value={theme[key]}
                    onChange={(e) => handleColorChange(key, e.target.value)}
                    className="mt-1 font-mono text-xs border rounded px-2 py-1 w-full"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-6 rounded-lg" style={{ backgroundColor: theme.background }}>
          <div className="p-6 rounded-lg shadow-lg" style={{ backgroundColor: theme.surface }}>
            <h3 className="text-2xl font-bold mb-4" style={{ color: theme.text }}>
              Theme Preview
            </h3>
            <p className="mb-4" style={{ color: theme.text }}>
              This is how your customized theme will look in the application.
            </p>
            <div className="flex gap-3">
              <button
                className="px-4 py-2 rounded font-medium text-white"
                style={{ backgroundColor: theme.primary }}
              >
                Primary Button
              </button>
              <button
                className="px-4 py-2 rounded font-medium text-white"
                style={{ backgroundColor: theme.secondary }}
              >
                Secondary Button
              </button>
              <button
                className="px-4 py-2 rounded font-medium text-white"
                style={{ backgroundColor: theme.accent }}
              >
                Accent Button
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> Theme changes are saved to localStorage. To apply theme globally,
          you would need to integrate this with your CSS variables or a state management solution.
        </p>
      </div>
    </div>
  )
}
