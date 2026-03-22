import { sovereignConfig } from "../config";
import { api } from "../api";
import { pluginRegistry } from "../plugins/registry";
import { reactPlugin } from "../plugins/react.plugin";

/**
 * Sovereign Frontend Runtime
 * Manages the execution environment, performance metrics, and neural substrate linkage.
 */
export class FrontendRuntime {
  private startTime: number;
  private frameCount: number = 0;
  private lastFpsUpdate: number = 0;
  private currentFps: number = 0;

  constructor() {
    this.startTime = Date.now();
    // Register core plugins
    pluginRegistry.register(reactPlugin);
  }

  /**
   * Initializes the frontend runtime environment.
   */
  async init() {
    console.log(`[SVRN_RUNTIME] Initializing Sovereign Frontend v${sovereignConfig.app.version}`);
    
    // Initialize plugins
    await pluginRegistry.initAll();
    
    this.detectEnvironment();
    this.startPerformanceMonitoring();
    
    // Link to neural substrate
    const status = api.substrate.getStatus();
    if (status.active) {
      console.log("[SVRN_RUNTIME] Neural substrate link established.");
    }

    // Start plugins
    await pluginRegistry.startAll();
  }

  /**
   * Detects the current execution environment capabilities.
   */
  private detectEnvironment() {
    const capabilities = {
      isIframe: window.self === window.top,
      hasWebGL: window.WebGLRenderingContext,
      hasWebGPU: 'gpu' in navigator,
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform
    };

    console.log("[SVRN_RUNTIME] Environment detected:", capabilities);
    return capabilities;
  }

  /**
   * Starts tracking performance metrics (FPS, etc.)
   */
  private startPerformanceMonitoring() {
    const tick = () => {
      this.frameCount++;
      const now = Date.now();
      
      if (now - this.lastFpsUpdate >= 1000) {
        this.currentFps = this.frameCount;
        this.frameCount = 0;
        this.lastFpsUpdate = now;
        
        if (sovereignConfig.system.logging_level === 'debug') {
          // Silent monitoring in background
        }
      }
      
      requestAnimationFrame(tick);
    };
    
    requestAnimationFrame(tick);
  }

  /**
   * Returns current system health and performance metrics.
   */
  getMetrics() {
    return {
      uptime: Math.floor((Date.now() - this.startTime) / 1000),
      fps: this.currentFps,
      memory: (performance as any).memory ? {
        used: Math.round((performance as any).memory.usedJSHeapSize / 1024 / 1024),
        total: Math.round((performance as any).memory.totalJSHeapSize / 1024 / 1024)
      } : 'N/A'
    };
  }

  /**
   * Reports health status to the Sovereign Substrate.
   */
  async reportHealth() {
    const metrics = this.getMetrics();
    await api.memory.save("runtime_health", {
      ...metrics,
      timestamp: new Date().toISOString(),
      status: metrics.fps > 30 ? "OPTIMAL" : "GRADED"
    });
  }
}

export const frontendRuntime = new FrontendRuntime();
