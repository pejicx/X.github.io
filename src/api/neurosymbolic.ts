/**
 * Neurosymbolic API
 * Provides a strictly frontend-only interface for neurosymbolic reasoning.
 * All reasoning and explanations are generated locally within the client-side substrate.
 */
import { neurosymbolicBridge, NeurosymbolicResponse } from '../services/neurosymbolicBridge';

export const neurosymbolicApi = {
  /**
   * Processes a prompt locally using the neurosymbolic bridge.
   */
  async process(prompt: string, context?: any): Promise<NeurosymbolicResponse> {
    return await neurosymbolicBridge.generateWithExplanation(prompt, context);
  },

  /**
   * Retrieves a local reasoning trace for a given prompt.
   */
  getTrace(prompt: string): string {
    return neurosymbolicBridge.getReasoningTrace(prompt);
  }
};
