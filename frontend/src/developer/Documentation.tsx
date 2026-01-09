/**
 * Technical Documentation System
 * Comprehensive documentation from fundamentals to advanced topics
 */

'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { FiBook, FiChevronDown, FiChevronRight, FiCode } from 'react-icons/fi'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface DocSection {
  id: string
  title: string
  level: 'fundamentals' | 'intermediate' | 'advanced'
  content: string
  examples: { title: string; code: string }[]
}

const documentationData: DocSection[] = [
  {
    id: 'variables',
    title: 'Variables and Data Types',
    level: 'fundamentals',
    content: `Variables in Cubit are used to store data. They are dynamically typed, meaning you don't need to specify the type explicitly.

Memory Representation:
- Variables are stored in a symbol table (dictionary)
- Each variable maps to a memory location
- Type is determined at runtime based on the value

Data Types:
- Numbers: Integers and floating-point
- Strings: Text enclosed in quotes
- Booleans: true or false
- Lists: Ordered collections
- Dictionaries: Key-value pairs`,
    examples: [
      {
        title: 'Basic Variables',
        code: `# Numbers
x = 42
y = 3.14

# Strings
name = "Cubit"
message = 'Hello, World!'

# Booleans
is_active = true
is_complete = false`
      }
    ]
  },
  {
    id: 'control-flow',
    title: 'Control Flow',
    level: 'fundamentals',
    content: `Control flow determines the order in which code executes.

Execution Model:
- The interpreter maintains a program counter
- Conditional statements alter the program counter
- Loops repeat blocks until a condition is false

Under the Hood:
- if statements: Jump to different code blocks based on conditions
- Loops: Repeat code blocks while maintaining loop variables
- Break/Continue: Modify loop execution flow`,
    examples: [
      {
        title: 'Conditional Statements',
        code: `if x > 10 {
    print("x is large")
} else if x > 5 {
    print("x is medium")
} else {
    print("x is small")
}`
      },
      {
        title: 'Loops',
        code: `# For loop
for i in range(5) {
    print(i)
}

# While loop
count = 0
while count < 5 {
    print(count)
    count = count + 1
}`
      }
    ]
  },
  {
    id: 'functions',
    title: 'Functions and Scope',
    level: 'intermediate',
    content: `Functions are reusable blocks of code that encapsulate logic.

Call Stack:
- Each function call creates a new stack frame
- Stack frames contain local variables and parameters
- When function returns, stack frame is popped

Closures:
- Functions can capture variables from outer scope
- Captured variables remain accessible even after outer function returns
- Creates a closure over the captured environment`,
    examples: [
      {
        title: 'Function Definition',
        code: `function greet(name) {
    return "Hello, " + name
}

result = greet("Developer")
print(result)`
      },
      {
        title: 'Closures',
        code: `function makeCounter() {
    count = 0
    function increment() {
        count = count + 1
        return count
    }
    return increment
}

counter = makeCounter()
print(counter())  # 1
print(counter())  # 2`
      }
    ]
  },
  {
    id: '3d-graphics',
    title: '3D Graphics Programming',
    level: 'advanced',
    content: `3D graphics involve representing and rendering three-dimensional objects.

Vector Mathematics:
- Positions: (x, y, z) coordinates in 3D space
- Vectors: Direction and magnitude
- Dot product: Measure angle between vectors
- Cross product: Find perpendicular vector

Transformations:
- Translation: Move objects in space
- Rotation: Rotate around axes
- Scaling: Resize objects
- Matrix multiplication: Combine transformations

Rendering Pipeline:
1. Model space: Object's local coordinates
2. World space: Position in the scene
3. View space: From camera's perspective
4. Projection: 3D to 2D conversion`,
    examples: [
      {
        title: '3D Vector Operations',
        code: `# Define 3D vector
v1 = [1, 2, 3]
v2 = [4, 5, 6]

# Dot product
dot = v1[0]*v2[0] + v1[1]*v2[1] + v1[2]*v2[2]

# Cross product
cross = [
    v1[1]*v2[2] - v1[2]*v2[1],
    v1[2]*v2[0] - v1[0]*v2[2],
    v1[0]*v2[1] - v1[1]*v2[0]
]`
      },
      {
        title: 'Simple 3D Scene',
        code: `# Create 3D cube
function drawCube(x, y, z, size) {
    # Draw 8 vertices of cube
    vertices = [
        [x-size, y-size, z-size],
        [x+size, y-size, z-size],
        [x+size, y+size, z-size],
        [x-size, y+size, z-size],
        [x-size, y-size, z+size],
        [x+size, y-size, z+size],
        [x+size, y+size, z+size],
        [x-size, y+size, z+size]
    ]
    return vertices
}`
      }
    ]
  },
  {
    id: 'automation',
    title: 'Advanced Automation',
    level: 'advanced',
    content: `Automation allows you to build systems that run tasks automatically.

Event-Driven Programming:
- Register handlers for events
- Events trigger when conditions are met
- Asynchronous execution model

Task Scheduling:
- Cron-like syntax for recurring tasks
- Priority queues for task management
- Error handling and retry logic

Build Automation:
- Define build steps
- Manage dependencies
- Parallel execution when possible`,
    examples: [
      {
        title: 'Event Handler',
        code: `# Define event handler
function onButtonClick(event) {
    print("Button clicked!")
    print("Position: " + event.x + ", " + event.y)
}

# Register handler
registerEvent("click", onButtonClick)`
      },
      {
        title: 'Task Scheduler',
        code: `# Schedule recurring task
function dailyBackup() {
    print("Running backup...")
    # Backup logic here
}

# Run every day at 2 AM
schedule("0 2 * * *", dailyBackup)`
      }
    ]
  }
]

export default function Documentation() {
  const [selectedLevel, setSelectedLevel] = useState<'fundamentals' | 'intermediate' | 'advanced'>('fundamentals')
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['variables']))

  const toggleSection = (id: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedSections(newExpanded)
  }

  const filteredDocs = documentationData.filter(doc => doc.level === selectedLevel)

  return (
    <div className="space-y-6">
      {/* Level Selector */}
      <div className="flex gap-2">
        <button
          onClick={() => setSelectedLevel('fundamentals')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            selectedLevel === 'fundamentals'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          Fundamentals
        </button>
        <button
          onClick={() => setSelectedLevel('intermediate')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            selectedLevel === 'intermediate'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          Intermediate
        </button>
        <button
          onClick={() => setSelectedLevel('advanced')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            selectedLevel === 'advanced'
              ? 'bg-red-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          Advanced
        </button>
      </div>

      {/* Documentation Sections */}
      <div className="space-y-4">
        {filteredDocs.map((doc) => (
          <motion.div
            key={doc.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden"
          >
            {/* Section Header */}
            <button
              onClick={() => toggleSection(doc.id)}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <FiBook className="text-green-400" />
                <h3 className="text-lg font-bold text-gray-100">{doc.title}</h3>
              </div>
              {expandedSections.has(doc.id) ? (
                <FiChevronDown className="text-gray-400" />
              ) : (
                <FiChevronRight className="text-gray-400" />
              )}
            </button>

            {/* Section Content */}
            {expandedSections.has(doc.id) && (
              <div className="px-6 pb-6 space-y-4">
                {/* Description */}
                <div className="text-gray-300 whitespace-pre-line leading-relaxed">
                  {doc.content}
                </div>

                {/* Examples */}
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wide flex items-center gap-2">
                    <FiCode />
                    Examples
                  </h4>
                  {doc.examples.map((example, idx) => (
                    <div key={idx} className="bg-gray-900 rounded-lg overflow-hidden border border-gray-700">
                      <div className="px-4 py-2 bg-gray-800 border-b border-gray-700">
                        <p className="text-sm text-gray-400">{example.title}</p>
                      </div>
                      <SyntaxHighlighter
                        language="python"
                        style={vscDarkPlus}
                        customStyle={{
                          margin: 0,
                          padding: '1rem',
                          background: 'transparent',
                        }}
                      >
                        {example.code}
                      </SyntaxHighlighter>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
}
