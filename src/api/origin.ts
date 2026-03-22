/**
 * Origin API
 * Provides a strictly frontend-only interface for system origin tracking.
 * All origin data is resolved locally within the client-side substrate.
 */
export class OriginAPI {
  /**
   * Retrieves the local system origin data.
   */
  getSystemOrigin() {
    return {
      root: window.location.origin,
      substrate: 'v4.2-SIGMA-LOCAL',
      timestamp: new Date().toISOString()
    };
  }
}

export const originApi = new OriginAPI();
