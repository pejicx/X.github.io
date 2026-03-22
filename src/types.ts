/**
 * Sovereign Frontend Types
 * Defines the strictly frontend-only data structures for the neural substrate.
 * All types are optimized for client-side execution and state management.
 */

export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface SystemStatus {
  active: boolean;
  timestamp: string;
}

export interface NeuralResponse {
  content: string;
  confidence: number;
}

export interface AutoExecuteLog {
  id: string;
  command?: string;
  file?: string;
  change_type?: string;
  status: 'success' | 'failure' | 'pending' | 'executed' | 'detected' | 'accepted' | 'optimized' | 'integrated';
  timestamp: string;
  details?: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}
