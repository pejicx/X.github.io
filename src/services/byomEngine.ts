/**
 * Sovereign BYOM Engine
 * Provides "Bring Your Own Model" (BYOM) configurations locally.
 * Allows users to connect external large language models via API keys for more control over the underlying conversational engine.
 */
import { GoogleGenAI } from "@google/genai";

export interface BYOMConfig {
  id: string;
  name: string;
  provider: string;
  apiKey: string;
  modelName: string;
  baseUrl?: string;
  isActive: boolean;
}

class BYOMEngine {
  private configs: BYOMConfig[] = [];

  constructor() {
    this.initializeDefaultConfigs();
  }

  private initializeDefaultConfigs() {
    this.configs = [
      {
        id: 'byom-1',
        name: 'Gemini-3-Pro',
        provider: 'Google',
        apiKey: process.env.GEMINI_API_KEY || '',
        modelName: 'gemini-3.1-pro-preview',
        isActive: true
      }
    ];
  }

  /**
   * Adds a new BYOM configuration locally.
   */
  public addConfig(config: BYOMConfig) {
    this.configs.push(config);
  }

  /**
   * Retrieves all BYOM configurations.
   */
  public getConfigs(): BYOMConfig[] {
    return this.configs;
  }

  /**
   * Switches the active conversational engine to a specific BYOM configuration.
   */
  public async switchEngine(configId: string): Promise<boolean> {
    const config = this.configs.find(c => c.id === configId);
    if (config) {
      this.configs.forEach(c => c.isActive = false);
      config.isActive = true;
      console.log(`[BYOM_ENGINE] Switched to conversational engine: ${config.name}`);
      return true;
    }
    return false;
  }

  /**
   * Generates a response using the active BYOM configuration.
   */
  public async generateResponse(prompt: string): Promise<string> {
    const activeConfig = this.configs.find(c => c.isActive);
    if (activeConfig) {
      console.log(`[BYOM_ENGINE] Generating response using: ${activeConfig.name}`);
      const ai = new GoogleGenAI({ apiKey: activeConfig.apiKey });
      const response = await ai.models.generateContent({
        model: activeConfig.modelName as any,
        contents: prompt,
      });
      return response.text || 'No response generated.';
    }
    return 'No active BYOM configuration found.';
  }
}

export const byomEngine = new BYOMEngine();
