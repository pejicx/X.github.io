/**
 * AGI API
 * Provides a strictly frontend-only interface for the Artificial General Intelligence engine.
 * All cognitive processing is executed locally within the client-side substrate.
 */
import { agiEngine } from '../services/agiEngine';

export const agiApi = {
  /**
   * Processes input locally using the AGI engine.
   */
  process(input: string) {
    return agiEngine.process(input);
  },

  /**
   * Retrieves the current state of the local AGI engine.
   */
  getState() {
    return agiEngine.getState();
  },

  /**
   * Activates the local AGI substrate.
   */
  activate() {
    return agiEngine.activate();
  }
};
