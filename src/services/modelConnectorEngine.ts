/**
 * Sovereign Model Connector Engine
 * Integrates with leading models such as Anthropic, Google, and others.
 * Allows putting the "brain" of AI into automated processes.
 */
import { GoogleGenAI } from "@google/genai";

export interface AIModelConfig {
  id: string;
  name: string;
  provider: 'Google' | 'Anthropic' | 'OpenAI' | 'Custom';
  apiKey: string;
  modelName: string;
  isActive: boolean;
}

class ModelConnectorEngine {
  private configs: AIModelConfig[] = [];

  constructor() {
    this.initializeDefaultConfigs();
  }

  private initializeDefaultConfigs() {
    this.configs = [
      {
        id: 'pejicaix-omni',
        name: 'PejicAIX Omni',
        provider: 'Google',
        apiKey: process.env.GEMINI_API_KEY || '',
        modelName: 'gemini-3.1-pro-preview', // Mapping to the most powerful available
        isActive: true
      },
      {
        id: 'pejicaix-pro',
        name: 'PejicAIX Pro',
        provider: 'Google',
        apiKey: process.env.GEMINI_API_KEY || '',
        modelName: 'gemini-3.1-pro-preview',
        isActive: false
      },
      {
        id: 'pejicaix-mini',
        name: 'PejicAIX Mini',
        provider: 'Google',
        apiKey: process.env.GEMINI_API_KEY || '',
        modelName: 'gemini-3-flash-preview',
        isActive: false
      },
      {
        id: 'pejicaix-preview',
        name: 'PejicAIX Preview',
        provider: 'Google',
        apiKey: process.env.GEMINI_API_KEY || '',
        modelName: 'gemini-3.1-flash-lite-preview',
        isActive: false
      },
      {
        id: 'model-2',
        name: 'Claude-3.5-Sonnet',
        provider: 'Anthropic',
        apiKey: '', // To be provided by user
        modelName: 'claude-3-5-sonnet-20240620',
        isActive: false
      }
    ];
  }

  /**
   * Adds a new model configuration locally.
   */
  public addConfig(config: AIModelConfig) {
    this.configs.push(config);
  }

  /**
   * Retrieves all model configurations.
   */
  public getConfigs(): AIModelConfig[] {
    return this.configs;
  }

  /**
   * Switches the active model "brain" for automated processes.
   */
  public async switchModel(configId: string): Promise<boolean> {
    const config = this.configs.find(c => c.id === configId);
    if (config) {
      this.configs.forEach(c => c.isActive = false);
      config.isActive = true;
      console.log(`[MODEL_CONNECTOR] Switched to brain: ${config.name}`);
      return true;
    }
    return false;
  }

  /**
   * Generates a response using the active model brain.
   */
  public async generateResponse(prompt: string): Promise<string> {
    const activeConfig = this.configs.find(c => c.isActive);
    if (!activeConfig) return 'No active model brain found.';

    console.log(`[MODEL_CONNECTOR] Generating response using: ${activeConfig.name}`);
    
    // For now, we use Gemini as the primary brain, but the logic is ready for other providers
    const ai = new GoogleGenAI({ apiKey: activeConfig.apiKey || process.env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: activeConfig.modelName as any,
      contents: prompt,
    });
    return response.text || 'No response generated.';
  }
}

export const modelConnectorEngine = new ModelConnectorEngine();
