import { sovereignConfig as baseConfig } from './src/config/sovereignConfig';
import { UserConfigBackend } from './src/config/UserConfig.backend';

/**
 * Sovereign Server Configuration Extension
 * Provides a unified interface for server-side settings.
 */
export const serverConfig = {
  ...baseConfig,
  user: UserConfigBackend,
  port: Number(process.env.PORT) || 3000,
  env: process.env.NODE_ENV || 'development',
  
  // Extended server settings
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-goog-api-key']
  },
  
  timeouts: {
    request: 30000,
    neural: 60000
  },
  
  paths: {
    api: '/api',
    static: '/dist',
    public: '/public'
  }
};

export type ServerConfig = typeof serverConfig;
