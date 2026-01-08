/**
 * TypeScript type definitions for Cubit API responses
 */

// Module Status Types
export interface ModuleMetrics {
  total_requests: number;
  successful_requests: number;
  failed_requests: number;
  average_response_time_ms: number;
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

export interface ModulesStatusResponse {
  modules: Module[];
  system: SystemSummary;
}

// Debug Execution Types
export interface DebugStep {
  id: string;
  module: string;
  timestamp: string;
  duration_ms: number;
  input: string | Record<string, unknown>;
  output: Record<string, unknown>;
  status: 'completed' | 'failed' | 'running';
  error?: string;
}

export interface DebugResponse {
  steps: DebugStep[];
  result: {
    output: string | null;
    result: unknown;
    error: string | null;
    skill_level: string;
    progress: Record<string, unknown>;
    suggestions: string[];
  };
}

// Concept Types
export interface ConceptNode {
  prerequisites: string[];
  difficulty: string;
}

export interface ConceptsResponse {
  concepts: {
    beginner: string[];
    intermediate: string[];
    advanced: string[];
  };
  graph: Record<string, ConceptNode>;
}

// Progress Types
export interface ProgressResponse {
  total_calls: number;
  method_diversity: string[];
  mastered_concepts: string[];
  current_skill_level: string;
  session_info: string;
  skill_trajectory: Array<{
    timestamp: string;
    level: string;
  }>;
}

// Health Check Types
export interface HealthResponse {
  status: 'healthy' | 'unhealthy';
}

// Games Types
export interface Game {
  title: string;
  description: string;
  instructions: string;
  starter: string;
  solution: string;
}

export interface GamesResponse {
  games: Game[];
  error?: string;
}

// Execute Types
export interface ExecuteRequest {
  code: string;
  teaching_enabled?: boolean;
  verbosity?: 'minimal' | 'normal' | 'detailed';
}

export interface TeachingMoment {
  type: string;
  level: string;
  message: string;
  timestamp: string;
}

export interface ExecuteResponse {
  output: string | null;
  result: unknown;
  error: string | null;
  teaching_moment?: TeachingMoment;
  skill_level?: string;
  progress?: Record<string, unknown>;
  suggestions?: string[];
  shapes?: Array<{
    type: 'circle' | 'square' | 'triangle';
    x: number;
    y: number;
    size: number;
    color: string;
  }>;
}
