/**
 * Sovereign URL Utilities
 * Provides frontend-centric URL path resolution for the Sovereign environment.
 */

/**
 * Converts a path to a URL relative to the current application origin.
 */
export function getAppURL(path: string = ''): URL {
  const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
  return new URL(path, origin);
}

/**
 * Returns the URL for the application root.
 */
export function getRootURL(): URL {
  return getAppURL('/');
}

/**
 * Returns the URL for the public assets directory.
 */
export function getPublicURL(): URL {
  return getAppURL('/public/');
}

/**
 * Returns the URL for the current module's location.
 */
export function getModuleURL(path: string = ''): URL {
  return new URL(path, import.meta.url);
}
