/**
 * Type definitions for backend API responses
 */

// Module status types
export interface ModuleMetrics {
  total_requests: number;
  successful_requests: number;
  failed_requests: number;
  average_duration_ms: number;
  last_request_time: string | null;
}

export interface Module {
  id: string;
  name: string;
  type: 'core' | 'pedagogical' | 'game' | 'api';
  status: 'active' | 'inactive' | 'error';
  version: string;
  metrics: ModuleMetrics;
}

export interface SystemSummary {
  total_modules: number;
  active_modules: number;
  error_modules: number;
  uptime_seconds: number;
}

export interface ModuleStatusResponse {
  modules: Module[];
  system: SystemSummary;
}

// Debug execution types
export interface ExecutionStep {
  id: string;
  module: string;
  timestamp: string;
  duration_ms: number;
  input: string;
  output: {
    tokens?: string[];
    ast_summary?: string;
    result?: unknown;
    stdout?: string;
    variables?: Record<string, unknown>;
  };
  status: 'completed' | 'error';
  error?: string;
}

export interface DebugFinalResult {
  output: string | null;
  result: unknown;
  error: string | null;
  skill_level: string;
  progress: Record<string, unknown>;
  suggestions: string[];
}

export interface DebugExecutionResponse {
  steps: ExecutionStep[];
  final_result: DebugFinalResult;
  total_duration_ms: number;
}

// Health check types
export interface HealthResponse {
  status: 'healthy' | 'unhealthy';
}

// Progress types
export interface ProgressResponse {
  total_calls: number;
  method_diversity: string[];
  mastered_concepts: string[];
  current_skill_level: string;
  session_info: string;
  skill_trajectory: Array<{
    timestamp: string;
    skill_level: string;
  }>;
}

// Concepts types
export interface ConceptsResponse {
  concepts: {
    beginner: string[];
    intermediate: string[];
    advanced: string[];
  };
  graph: Record<string, {
    prerequisites: string[];
    difficulty: string;
  }>;
}
