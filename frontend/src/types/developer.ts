/**
 * Type definitions for Developer Mode features
 */

export type DeveloperMode = 'learning' | 'developer'

export interface DeveloperPreferences {
  mode: DeveloperMode
  theme: 'light' | 'dark'
  editorTheme: string
  fontSize: number
  enableVim: boolean
  enableAutocomplete: boolean
  enableLinting: boolean
}

export interface ASTNode {
  type: string
  value?: string | number | boolean
  children?: ASTNode[]
  line?: number
  column?: number
}

export interface Token {
  type: string
  value: string
  line: number
  column: number
}

export interface ExecutionStep {
  line: number
  variables: Record<string, unknown>
  callStack: string[]
  timestamp: number
}

export interface PerformanceMetric {
  name: string
  duration: number
  timestamp: number
  type: 'function' | 'operation' | 'total'
}

export interface MemorySnapshot {
  heap: number
  stack: number
  total: number
  timestamp: number
}

export interface DebuggerState {
  isRunning: boolean
  isPaused: boolean
  currentLine: number
  breakpoints: number[]
  executionHistory: ExecutionStep[]
  variables: Record<string, unknown>
}

export interface APIFunction {
  name: string
  signature: string
  description: string
  parameters: {
    name: string
    type: string
    description: string
    optional?: boolean
  }[]
  returnType: string
  examples: string[]
  category: string
  complexity: 'O(1)' | 'O(n)' | 'O(n^2)' | 'O(log n)' | 'O(n log n)'
}

export interface ModuleInfo {
  name: string
  version: string
  description: string
  dependencies: string[]
  exports: string[]
  path: string
  size: number
}

export interface TestCase {
  id: string
  name: string
  code: string
  expectedOutput: string
  passed?: boolean
  actualOutput?: string
  error?: string
}

export interface WorkflowNode {
  id: string
  type: 'trigger' | 'action' | 'condition' | 'loop'
  label: string
  config: Record<string, unknown>
  position: { x: number; y: number }
}

export interface WorkflowEdge {
  id: string
  source: string
  target: string
  label?: string
}

export interface Workflow {
  id: string
  name: string
  description: string
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
}

export interface CodePattern {
  id: string
  name: string
  category: 'design' | 'architectural' | 'refactoring' | 'antipattern'
  description: string
  problem: string
  solution: string
  example: string
  relatedPatterns: string[]
}

export interface DocumentationSection {
  id: string
  title: string
  level: 'fundamentals' | 'intermediate' | 'advanced'
  content: string
  examples: string[]
  exercises?: string[]
}

export interface ProfilerResult {
  totalTime: number
  functionCalls: {
    name: string
    count: number
    totalTime: number
    averageTime: number
  }[]
  bottlenecks: {
    line: number
    time: number
    percentage: number
  }[]
  memoryUsage: MemorySnapshot[]
  suggestions: string[]
}
