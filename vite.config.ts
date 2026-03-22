import tailwindcss from '@tailwindcss/vite';
import { defineConfig, loadEnv } from 'vite';
import sovereignReact from '@vitejs/plugin-react';
import { cwd } from 'node:process';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, cwd(), '');

  return {
    plugins: [
      tailwindcss(),
      sovereignReact({
        jsxRuntime: env.JSX_RUNTIME as 'automatic' | 'classic',
        jsxImportSource: env.JSX_IMPORT_SOURCE,
      })
    ],

    define: {
      'process.env': {},
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY || ''),
      'process.env.APP_URL': JSON.stringify(env.APP_URL || ''),
      'process.env.NODE_ENV': JSON.stringify(env.NODE_ENV || ''),
      'process.env.CURL_URL': JSON.stringify(env.CURL_URL || ''),
      'process.env.PEJICAIX_MANIFEST_VERSION': JSON.stringify(env.PEJICAIX_MANIFEST_VERSION || ''),
      'process.env.SOVEREIGN_VERSION': JSON.stringify(env.SOVEREIGN_VERSION || ''),
      'process.env.SOVEREIGN_THEME': JSON.stringify(env.SOVEREIGN_THEME || ''),
      'process.env.SOVEREIGN_SECURITY_LEVEL': JSON.stringify(env.SOVEREIGN_SECURITY_LEVEL || ''),
      'process.env.SOVEREIGN_AUTO_OPTIMIZE': JSON.stringify(env.SOVEREIGN_AUTO_OPTIMIZE || ''),
      'process.env.SOVEREIGN_ENABLE_TELEMETRY': JSON.stringify(env.SOVEREIGN_ENABLE_TELEMETRY || ''),
      'process.env.SOVEREIGN_MAX_AGENTS': JSON.stringify(env.SOVEREIGN_MAX_AGENTS || ''),
      'process.env.SOVEREIGN_LOGGING_LEVEL': JSON.stringify(env.SOVEREIGN_LOGGING_LEVEL || ''),
      'process.env.SOVEREIGN_NEURAL_SYNC_FREQUENCY': JSON.stringify(env.SOVEREIGN_NEURAL_SYNC_FREQUENCY || ''),
      'process.env.SOVEREIGN_ORCHESTRATION_MODE': JSON.stringify(env.SOVEREIGN_ORCHESTRATION_MODE || ''),
      'process.env.SUBSTRATE_STATUS_ACTIVE': JSON.stringify(env.SUBSTRATE_STATUS_ACTIVE || ''),
      'process.env.SUBSTRATE_STATUS_HIBERNATING': JSON.stringify(env.SUBSTRATE_STATUS_HIBERNATING || ''),
      'process.env.SUBSTRATE_STATUS_INITIALIZING': JSON.stringify(env.SUBSTRATE_STATUS_INITIALIZING || ''),
      'process.env.MEMORY_DB_NAME': JSON.stringify(env.MEMORY_DB_NAME || 'PejicAIX_Sovereign_Cloud'),
      'process.env.MEMORY_DB_VERSION': JSON.stringify(env.MEMORY_DB_VERSION || '1'),
      'process.env.ENGINE_VERSION': JSON.stringify(env.ENGINE_VERSION),
      'process.env.AI_MODEL': JSON.stringify(env.AI_MODEL),
      'process.env.SECURITY_LEVEL': JSON.stringify(env.SECURITY_LEVEL),
      'process.env.SECRET_ROTATION_INTERVAL': Number(env.SECRET_ROTATION_INTERVAL || 30),
      'process.env.ENTROPY_THRESHOLD': Number(env.ENTROPY_THRESHOLD || 0.85)
    },

    optimizeDeps: {
      exclude: [],
      esbuildOptions: {
        target: "es2020",
        jsx: "automatic",
        define: {
          __DEV__: "true"
        }
      },
    },

    build: {
      target: 'es2020',
      modulePreload: { polyfill: true },
      assetsDir: 'assets',
      cssTarget: 'es2020',
      rollupOptions: {
        output: {
          manualChunks: undefined
        }
      },
      manifest: true,
      write: true,
      emptyOutDir: true,
      copyPublicDir: true
    }
  };
});
