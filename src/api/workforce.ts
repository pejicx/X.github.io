/**
 * Sovereign Workforce API
 * Provides a strictly frontend-only interface for neural workforce orchestration.
 * All logic is executed within the client-side substrate.
 */
import { workforceOrchestrator } from '../services/workforceOrchestrator';
import { workforceAnalytics } from '../services/workforceAnalytics';
import { Task } from '../types/workforce';

/**
 * Frontend-only API for workforce management.
 * No backend dependencies are required for these operations.
 */
export const workforceApi = {
  /**
   * Retrieves the current set of neural agents from the local orchestrator.
   */
  getAgents() {
    return workforceOrchestrator.getAgents();
  },

  /**
   * Retrieves the current set of tasks from the local orchestrator.
   */
  getTasks() {
    return workforceOrchestrator.getTasks();
  },

  /**
   * Creates a new task within the frontend workforce environment.
   */
  async createTask(title: string, description: string, requiredSkills: string[], priority: Task['priority']) {
    return await workforceOrchestrator.createTask(title, description, requiredSkills, priority);
  },

  /**
   * Marks a task as completed within the local substrate.
   */
  async completeTask(taskId: string) {
    return await workforceOrchestrator.completeTask(taskId);
  },

  /**
   * Retrieves real-time metrics from the frontend analytics engine.
   */
  getMetrics() {
    return workforceAnalytics.getRealTimeMetrics();
  },

  /**
   * Retrieves predictive insights generated locally by the analytics engine.
   */
  getPredictiveInsights() {
    return workforceAnalytics.getPredictiveLoadBalancing();
  }
};
