import dotenv from 'dotenv';
import path from 'path';

/**
 * Sovereign Environment Loader
 * Dynamically loads environment variables based on NODE_ENV.
 */
export const loadEnv = () => {
  const nodeEnv = process.env.NODE_ENV || 'development';
  
  // Load .env.local first (highest priority)
  dotenv.config({ path: path.resolve(process.cwd(), './.env.local') });
  
  // Load environment-specific file
  const envFile = `.env.${nodeEnv}`;
  dotenv.config({ path: path.resolve(process.cwd(), envFile) });
  
  // Finally load base .env if it exists
  dotenv.config();

  console.log(`[SVRN_ENV] Environment loaded: ${nodeEnv}`);
};
