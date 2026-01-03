'use client'

import React, { useState } from 'react'
import Button from './Button'
import Toast from './Toast'
import { analyzeBundleSize, generateBundleReport } from '../utils/bundleAnalyzer'
import { getProgress, getConceptGraph } from '../utils/api'

type CommandCategory = 'ai' | 'design' | 'workflow' | 'intelligence'

interface Command {
  name: string
  description: string
  action: () => void
  icon?: string
}

export default function CreativeCommandsPanel() {
  const [toast, setToast] = useState<string | null>(null)
  const [expandedCategory, setExpandedCategory] = useState<CommandCategory | null>('ai')
  const [showModal, setShowModal] = useState<{
    visible: boolean
    title: string
    content: string
  }>({ visible: false, title: '', content: '' })

  const showToast = (message: string) => {
    setToast(message)
  }

  const showModalDialog = (title: string, content: string) => {
    setShowModal({ visible: true, title, content })
  }

  const closeModal = () => {
    setShowModal({ visible: false, title: '', content: '' })
  }

  const toggleCategory = (category: CommandCategory) => {
    setExpandedCategory(expandedCategory === category ? null : category)
  }

  // AI & Code Generation Commands
  const aiCommands: Command[] = [
    {
      name: 'Generate Function',
      description: 'AI suggests a function based on description',
      action: () => {
        showModalDialog(
          'Generate Function',
          'Enter function description:\n\nExample: "A function that calculates factorial of a number"\n\n[This is a placeholder - AI integration coming soon]'
        )
        showToast('Generate Function modal opened')
      }
    },
    {
      name: 'Refactor Code',
      description: 'Analyzes and suggests improvements',
      action: () => {
        showToast('Analyzing code for refactoring suggestions...')
        setTimeout(() => {
          showModalDialog(
            'Refactoring Suggestions',
            '✓ Extract repeated code into functions\n✓ Use more descriptive variable names\n✓ Add error handling\n✓ Optimize loop performance\n\n[Simulated suggestions]'
          )
        }, 1000)
      }
    },
    {
      name: 'Write Tests',
      description: 'Generates unit test examples',
      action: () => {
        showToast('Generating test examples...')
        setTimeout(() => {
          showModalDialog(
            'Generated Tests',
            'Example test cases:\n\ntest "fibonacci(5) returns 5"\ntest "fibonacci(0) returns 0"\ntest "sum(10, 20) returns 30"\n\n[Simulated test generation]'
          )
        }, 800)
      }
    },
    {
      name: 'Explain Code',
      description: 'AI explains what the current code does',
      action: () => {
        showToast('Analyzing code...')
        setTimeout(() => {
          showModalDialog(
            'Code Explanation',
            'This code implements a Fibonacci sequence generator using an iterative approach with while loop. It maintains two variables to track consecutive Fibonacci numbers and prints the first 10 values.\n\nTime complexity: O(n)\nSpace complexity: O(1)\n\n[Simulated explanation]'
          )
        }, 1000)
      }
    },
    {
      name: 'Optimize',
      description: 'Performance optimization suggestions',
      action: () => {
        showToast('Running performance analysis...')
        setTimeout(() => {
          showModalDialog(
            'Optimization Suggestions',
            '⚡ Use memoization for recursive functions\n⚡ Replace string concatenation with array joins\n⚡ Cache frequently accessed values\n⚡ Reduce loop iterations where possible\n\n[Simulated optimization tips]'
          )
        }, 1200)
      }
    }
  ]

  // Design & Theming Commands
  const designCommands: Command[] = [
    {
      name: 'Generate Color Palette',
      description: 'Creates cohesive color schemes',
      action: () => {
        showToast('Generating color palette...')
        setTimeout(() => {
          showModalDialog(
            'Color Palette',
            '🎨 Primary: #7c3aed (Violet)\n🎨 Secondary: #3b82f6 (Blue)\n🎨 Accent: #f59e0b (Amber)\n🎨 Background: #0f172a (Navy)\n🎨 Surface: #1e293b (Slate)\n\n[Copy these to your theme]'
          )
        }, 600)
      }
    },
    {
      name: 'Theme Wizard',
      description: 'Step-by-step theme creator',
      action: () => {
        showModalDialog(
          'Theme Wizard',
          'Step 1: Choose base color\nStep 2: Select color harmony (Complementary/Analogous/Triadic)\nStep 3: Set light/dark preferences\nStep 4: Preview and export\n\n[Interactive wizard coming soon]'
        )
        showToast('Theme Wizard opened')
      }
    },
    {
      name: 'Add Animations',
      description: 'Suggests Framer Motion animations',
      action: () => {
        showToast('Loading animation suggestions...')
        setTimeout(() => {
          showModalDialog(
            'Animation Suggestions',
            'Suggested animations:\n\n• Fade In: { opacity: [0, 1] }\n• Slide Up: { y: [20, 0], opacity: [0, 1] }\n• Scale: { scale: [0.9, 1] }\n• Stagger Children: Use staggerChildren in parent\n\n[Framer Motion examples]'
          )
        }, 500)
      }
    },
    {
      name: 'Design Trends',
      description: 'Apply glassmorphism, neumorphism, etc.',
      action: () => {
        showModalDialog(
          'Design Trends',
          'Available styles:\n\n🔮 Glassmorphism\n🎯 Neumorphism\n🌈 Gradient Mesh\n✨ Aurora Effects\n🎨 Brutalism\n\n[Click to apply - feature in progress]'
        )
        showToast('Design trends panel opened')
      }
    },
    {
      name: 'Accessibility Check',
      description: 'A11y compliance scan',
      action: () => {
        showToast('Running accessibility audit...')
        setTimeout(() => {
          showModalDialog(
            'Accessibility Report',
            '✓ Color contrast ratio: WCAG AA compliant\n✓ Keyboard navigation: Supported\n⚠ Missing alt text on 2 images\n⚠ Form labels need improvement\n✓ ARIA labels present\n\nScore: 87/100\n\n[Simulated A11y audit]'
          )
        }, 1500)
      }
    }
  ]

  // Workflow & Productivity Commands
  const workflowCommands: Command[] = [
    {
      name: 'Deploy Preview',
      description: 'Simulate deployment',
      action: () => {
        showToast('Starting deployment...')
        setTimeout(() => {
          showModalDialog(
            'Deployment Steps',
            '1. ✓ Building application...\n2. ✓ Running tests...\n3. ✓ Optimizing assets...\n4. ✓ Uploading to CDN...\n5. ✓ Deployment complete!\n\nPreview URL: https://cubit-preview.app\n\n[Simulated deployment]'
          )
        }, 2000)
      }
    },
    {
      name: 'Export Package',
      description: 'Bundle components as NPM package',
      action: () => {
        showToast('Generating package manifest...')
        const manifest = {
          name: 'cubit-components',
          version: '1.0.0',
          components: ['Button', 'Card', 'Toast', 'CodeExecutor']
        }
        setTimeout(() => {
          const blob = new Blob([JSON.stringify(manifest, null, 2)], { type: 'application/json' })
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = 'package-manifest.json'
          a.click()
          showToast('Package manifest downloaded!')
        }, 500)
      }
    },
    {
      name: 'Share Playground',
      description: 'Generate shareable link',
      action: () => {
        const shareUrl = `${window.location.origin}${window.location.pathname}?share=abc123`
        navigator.clipboard.writeText(shareUrl).then(() => {
          showToast('Share link copied to clipboard!')
        }).catch(() => {
          showToast('Failed to copy link')
        })
      }
    },
    {
      name: 'Screenshot Gallery',
      description: 'Capture component screenshots',
      action: () => {
        showToast('Capturing screenshots...')
        setTimeout(() => {
          showModalDialog(
            'Screenshot Gallery',
            'Screenshots captured:\n\n📸 Button.tsx - button-light.png\n📸 Card.tsx - card-dark.png\n📸 CodeExecutor.tsx - executor.png\n\n[Simulated screenshot capture]'
          )
        }, 1000)
      }
    },
    {
      name: 'Record Demo',
      description: 'Screen recording simulation',
      action: () => {
        showToast('Starting screen recording...')
        setTimeout(() => {
          showModalDialog(
            'Recording Demo',
            '🔴 Recording in progress...\n\nDuration: 0:45\nQuality: 1080p\nFPS: 60\n\n[Click Stop to finish recording]\n\n[Simulated recording]'
          )
        }, 500)
      }
    }
  ]

  // Code Intelligence Commands
  const intelligenceCommands: Command[] = [
    {
      name: 'Debug Assistant',
      description: 'Analyze errors and suggest fixes',
      action: () => {
        showToast('Analyzing for bugs...')
        setTimeout(() => {
          showModalDialog(
            'Debug Assistant',
            'Potential issues found:\n\n🐛 Undefined variable on line 23\n💡 Suggestion: Initialize variable before use\n\n🐛 Possible infinite loop on line 45\n💡 Suggestion: Add break condition\n\n[Simulated debug analysis]'
          )
        }, 1000)
      }
    },
    {
      name: 'Bundle Analyzer',
      description: 'Show size breakdown',
      action: async () => {
        showToast('Analyzing bundle size...')
        try {
          const analysis = await analyzeBundleSize()
          const report = generateBundleReport(analysis)
          showModalDialog('Bundle Analysis', report)
        } catch (error) {
          showModalDialog(
            'Bundle Analysis Error',
            `Failed to analyze bundle:\n\n${error instanceof Error ? error.message : 'Unknown error'}\n\nPlease ensure the app is built or running in development mode.`
          )
        }
      }
    },
    {
      name: 'Learning Progress',
      description: 'View your programming progress',
      action: async () => {
        showToast('Fetching learning progress...')
        try {
          const progress = await getProgress()
          showModalDialog(
            'Learning Progress',
            `${progress.message}\n\n${progress.info || 'No detailed progress information available yet. Start coding with Teaching Mode enabled to track your progress!'}`
          )
        } catch (error) {
          showModalDialog(
            'Progress Error',
            `Failed to fetch progress:\n\n${error instanceof Error ? error.message : 'Unknown error'}\n\nMake sure the backend API is running and Teaching Mode has been used.`
          )
        }
      }
    },
    {
      name: 'Concept Explorer',
      description: 'Browse programming concepts',
      action: async () => {
        showToast('Loading concept graph...')
        try {
          const concepts = await getConceptGraph()
          const beginnerCount = concepts.concepts.beginner.length
          const intermediateCount = concepts.concepts.intermediate.length
          const advancedCount = concepts.concepts.advanced.length

          const report = `📚 Programming Concepts Library\n\n` +
            `🟢 Beginner: ${beginnerCount} concepts\n` +
            `${concepts.concepts.beginner.slice(0, 5).join(', ')}${beginnerCount > 5 ? '...' : ''}\n\n` +
            `🔵 Intermediate: ${intermediateCount} concepts\n` +
            `${concepts.concepts.intermediate.slice(0, 5).join(', ')}${intermediateCount > 5 ? '...' : ''}\n\n` +
            `🟣 Advanced: ${advancedCount} concepts\n` +
            `${concepts.concepts.advanced.slice(0, 5).join(', ')}${advancedCount > 5 ? '...' : ''}\n\n` +
            `Total: ${beginnerCount + intermediateCount + advancedCount} concepts tracked\n\n` +
            `View the Progress Dashboard for detailed concept information!`

          showModalDialog('Concept Explorer', report)
        } catch (error) {
          showModalDialog(
            'Concept Error',
            `Failed to load concepts:\n\n${error instanceof Error ? error.message : 'Unknown error'}`
          )
        }
      }
    },
    {
      name: 'Security Scan',
      description: 'Check for vulnerabilities',
      action: () => {
        showToast('Running security scan...')
        setTimeout(() => {
          showModalDialog(
            'Security Report',
            '🔒 Security Scan Results:\n\n✓ No critical vulnerabilities\n✓ Dependencies up to date\n⚠ 1 low-severity warning\n✓ No exposed secrets\n\nOverall Score: A+\n\n[Simulated security scan]'
          )
        }, 1800)
      }
    },
    {
      name: 'Performance Audit',
      description: 'Lighthouse-style metrics',
      action: () => {
        showToast('Running performance audit...')
        setTimeout(() => {
          showModalDialog(
            'Performance Audit',
            '⚡ Performance Metrics:\n\n• Performance: 95/100\n• Accessibility: 87/100\n• Best Practices: 92/100\n• SEO: 100/100\n\nFCP: 1.2s\nLCP: 2.1s\nTTI: 3.5s\n\n[Lighthouse-style report]'
          )
        }, 2000)
      }
    },
    {
      name: 'Code Complexity',
      description: 'Cyclomatic complexity analysis',
      action: () => {
        showToast('Analyzing code complexity...')
        setTimeout(() => {
          showModalDialog(
            'Complexity Analysis',
            'Code Complexity Metrics:\n\nAverage Complexity: 3.2\nMax Complexity: 8 (handleSubmit)\nFunctions analyzed: 12\n\n✓ Most functions are simple (< 5)\n⚠ Consider refactoring handleSubmit\n\n[McCabe complexity metrics]'
          )
        }, 1000)
      }
    }
  ]

  const categories = [
    { id: 'ai' as CommandCategory, name: '🧠 AI & Code Generation', commands: aiCommands },
    { id: 'design' as CommandCategory, name: '🎨 Design & Theming', commands: designCommands },
    { id: 'workflow' as CommandCategory, name: '🚀 Workflow & Productivity', commands: workflowCommands },
    { id: 'intelligence' as CommandCategory, name: '🔍 Code Intelligence', commands: intelligenceCommands }
  ]

  return (
    <div className="space-y-4">
      {categories.map(category => (
        <div key={category.id} className="border border-[rgba(255,255,255,0.08)] rounded-lg overflow-hidden">
          {/* Category Header */}
          <button
            onClick={() => toggleCategory(category.id)}
            className="w-full px-4 py-3 bg-[rgba(255,255,255,0.02)] hover:bg-[rgba(255,255,255,0.04)] text-left font-medium flex items-center justify-between transition-colors"
          >
            <span>{category.name}</span>
            <span className="text-[var(--color-muted)]">
              {expandedCategory === category.id ? '▼' : '▶'}
            </span>
          </button>

          {/* Category Commands */}
          {expandedCategory === category.id && (
            <div className="p-4 space-y-2">
              {category.commands.map((command, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <Button
                    variant="secondary"
                    onClick={command.action}
                    className="flex-1 text-left text-sm"
                  >
                    <div>
                      <div className="font-medium">{command.name}</div>
                      <div className="text-xs text-[var(--color-muted)] mt-1">
                        {command.description}
                      </div>
                    </div>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Toast Notifications */}
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      {/* Modal Dialog */}
      {showModal.visible && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--color-surface)] border border-[rgba(255,255,255,0.12)] rounded-xl p-6 max-w-lg w-full">
            <h3 className="text-lg font-semibold mb-4">{showModal.title}</h3>
            <pre className="text-sm text-[var(--color-muted)] whitespace-pre-wrap mb-6">
              {showModal.content}
            </pre>
            <Button onClick={closeModal} variant="primary">
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
