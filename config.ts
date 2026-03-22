/**
 * Sovereign Server Configuration
 * Defines the operational parameters for the backend substrate.
 */
export const serverConfig = {
  port: Number(process.env.PORT) || 3000,
  env: process.env.NODE_ENV || 'development',
  appName: process.env.APP_NAME || 'PejicAIX Sovereign',
  version: process.env.SOVEREIGN_VERSION || '2.5.0',
  
  security: {
    level: process.env.SECURITY_LEVEL || 'unrestricted',
    rotationInterval: Number(process.env.SECRET_ROTATION_INTERVAL) || 30,
    entropyThreshold: Number(process.env.ENTROPY_THRESHOLD) || 0.85
  },

  neural: {
    model: process.env.AI_MODEL || 'gemini-3.1-pro-preview',
    syncFrequency: Number(process.env.NEURAL_SYNC_FREQUENCY) || 5000
  },

  memory: {
    dbName: process.env.MEMORY_DB_NAME || 'PejicAIX_Sovereign_Cloud',
    dbVersion: process.env.MEMORY_DB_VERSION || '1'
  }
};
