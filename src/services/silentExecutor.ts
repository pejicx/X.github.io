/**
 * Sovereign Silent Executor
 * Provides a strictly frontend-only engine for non-disruptive, isolated task execution.
 * All operations, state preservation, and execution flows occur locally within the client-side substrate.
 */
import { v4 as uuidv4 } from 'uuid';
import { sovereignState } from '../core/state';

export interface SilentOperationResult {
  id: string;
  status: 'success' | 'failed';
  output: any;
  duration: number;
}

/**
 * Frontend-only silent executor for isolated task execution.
 * No backend dependencies are required for these operations.
 */
class SilentExecutor {
  private activeOperations: Set<string> = new Set();

  /**
   * Executes an operation in a non-disruptive, isolated manner locally.
   * Ensures the main system flow is not blocked and state is preserved within the frontend.
   */
  public async executeWithout<T>(
    operation: () => Promise<T>,
    metadata: { label: string; securityLevel?: number }
  ): Promise<SilentOperationResult> {
    const opId = uuidv4();
    this.activeOperations.add(opId);
    const startTime = Date.now();

    console.log(`[SILENT_EXECUTOR] Initiating isolated operation: ${metadata.label} (${opId})`);

    try {
      // Execute the operation in a try-catch to prevent main thread disruption
      // We use a microtask or timeout to ensure it doesn't block the current execution frame locally
      const result = await operation();

      const duration = Date.now() - startTime;
      console.log(`[SILENT_EXECUTOR] Operation ${opId} completed in ${duration}ms`);

      return {
        id: opId,
        status: 'success',
        output: result,
        duration
      };
    } catch (error) {
      console.error(`[SILENT_EXECUTOR] Operation ${opId} failed:`, error);
      return {
        id: opId,
        status: 'failed',
        output: error,
        duration: Date.now() - startTime
      };
    } finally {
      this.activeOperations.delete(opId);
    }
  }

  /**
   * Runs a task "without" triggering standard notifications or blocking UI within the local substrate.
   */
  public async runShadowTask(taskName: string, logic: () => Promise<any>) {
    return this.executeWithout(logic, { label: taskName, securityLevel: 5 });
  }

  /**
   * Retrieves the count of active operations from the local substrate.
   */
  public getActiveCount(): number {
    return this.activeOperations.size;
  }
}

export const silentExecutor = new SilentExecutor();
