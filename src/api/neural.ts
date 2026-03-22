/**
 * Neural Engine API
 * Provides a strictly frontend-only interface for neural generation.
 * All generation and learning are processed locally within the client-side substrate.
 */
import { GoogleGenAI } from "@google/genai";

class NeuralEngine {
  public ai: any;

  constructor() {
    // API key is handled by the platform environment
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      this.ai = new GoogleGenAI({ apiKey });
    }
  }

  /**
   * Generates a base response locally using the neural substrate.
   */
  async generateBaseResponse(prompt: string): Promise<string> {
    if (!this.ai) {
      return "Neural link offline. Local substrate requires GEMINI_API_KEY.";
    }

    try {
      const response = await this.ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });
      const content = response.text || "Neural substrate returned empty signal locally.";
      
      // Auto-Learning: Observe interaction locally
      const { autoLearningEngine } = await import('../services/autoLearningEngine');
      await autoLearningEngine.observe(prompt, content);

      return content;
    } catch (error) {
      console.error('Neural generation error locally:', error);
      return "Neural substrate interference detected locally. Command failed.";
    }
  }

  /**
   * Generates an AGI response locally within the frontend substrate.
   */
  async generateResponse(prompt: string): Promise<string> {
    try {
      const { agiEngine } = await import('../services/agiEngine');
      const result = await agiEngine.process(prompt);
      return result.response;
    } catch (error) {
      console.error('AGI Assistant error locally:', error);
      return "AGI substrate interference detected locally. Command failed.";
    }
  }
}

export const neural = new NeuralEngine();
