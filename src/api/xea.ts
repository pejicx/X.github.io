/**
 * XEA API
 * Provides a strictly frontend-only interface for Explainable AI (XEA) operations.
 * All analysis and reports are generated locally within the client-side substrate.
 */
import { xeaEngine } from '../services/xeaEngine';

export const xeaApi = {
  /**
   * Analyzes a prompt and result locally using the XEA engine.
   */
  analyze(prompt: string, result: any, context: any = {}) {
    return xeaEngine.analyze(prompt, result, context);
  },

  /**
   * Retrieves a local interpretability report.
   */
  getReport(analytics: any) {
    return xeaEngine.getInterpretabilityReport(analytics);
  }
};
