/**
 * Sovereign API Routes
 * Defines the internal routing substrate for local neural and system services.
 * All routes are virtual and handled locally within the frontend substrate.
 */
export const apiRoutes = {
  neural: {
    generate: '/local-api/neural/generate',
    stream: '/local-api/neural/stream',
    embed: '/local-api/neural/embed',
    sync: '/local-api/neural/sync'
  },
  substrate: {
    status: '/local-api/substrate/status',
    health: '/local-api/substrate/health',
    metrics: '/local-api/substrate/metrics',
    config: '/local-api/substrate/config'
  },
  memory: {
    save: '/local-api/memory/save',
    load: '/local-api/memory/load',
    purge: '/local-api/memory/purge',
    stats: '/local-api/memory/stats'
  },
  security: {
    posture: '/local-api/security/posture',
    rotate: '/local-api/security/rotate',
    audit: '/local-api/security/audit',
    keys: '/local-api/security/keys'
  },
  guardian: {
    bind: '/local-api/guardian/bind',
    protect: '/local-api/guardian/protect',
    logs: '/local-api/guardian/logs'
  }
};

export type APIRoutes = typeof apiRoutes;

/**
 * Helper to resolve virtual local API routes.
 */
export const resolveRoute = (origin: string): string => {
  return `virtual://${origin}`;
};
