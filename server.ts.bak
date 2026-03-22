import { loadEnv } from './env.loader';
// Load environment before other imports that might use process.env
loadEnv();

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { serverConfig } from './server.config';
import apiRoutes from './routes';

/**
 * Sovereign Server
 * The main orchestration engine for the PejicAIX Sovereign environment.
 */
async function startServer() {
  const app = express();
  const PORT = serverConfig.port;

  // Middleware
  app.use(express.json());

  // API Routes
  app.use('/api', apiRoutes);

  // Vite Integration
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('[SVRN_SERVER] Vite middleware integrated.');
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log('[SVRN_SERVER] Serving production build.');
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[SVRN_SERVER] Sovereign Substrate active on http://localhost:${PORT}`);
    console.log(`[SVRN_SERVER] Environment: ${process.env.NODE_ENV}`);
  });
}

startServer().catch((error) => {
  console.error('[SVRN_SERVER] Error during startup:', error);
  process.exit(1);
});
