import { sovereignConfig } from "../config/sovereignConfig";
import { memoryCloud } from "../lib/memoryCloud";

/**
 * Sovereign Guardian API
 * Provides a strictly frontend-only interface for the "Neural Bind" protocol.
 * Manages protected nodes and logs system events locally within the client-side substrate.
 */
export class GuardianAPI {
  private protectedNodes: Set<string> = new Set();

  constructor() {
    console.log("[GUARDIAN_INIT] Sovereign Protection Protocol Active Locally.", "color: #10b981; font-weight: bold", "color: inherit");
    this.syncProtectedNodes();
  }

  /**
   * Syncs protected nodes from the local memory substrate.
   */
  private async syncProtectedNodes() {
    const cloudNodes = await memoryCloud.get("SVRN_PROTECTED_NODES");
    if (cloudNodes && Array.isArray(cloudNodes)) {
      cloudNodes.forEach(node => this.protectedNodes.add(node));
    }
    
    // Local cache sync
    const localNodes = JSON.parse(localStorage.getItem("SVRN_PROTECTED_NODES") || "[]");
    localNodes.forEach((node: string) => this.protectedNodes.add(node));
  }

  /**
   * Binds a system component or data node to the local substrate.
   */
  async bind(nodeId: string, data: any) {
    this.protectedNodes.add(nodeId);
    
    const neuralEvent = {
      event: "NODE_BIND",
      nodeId,
      timestamp: new Date().toISOString(),
      integrity: "VERIFIED",
      data
    };

    // Log the binding event locally
    console.log(
      `%c[SOVEREIGN_BIND]%c Node ${nodeId} bound to local substrate.`,
      "color: #38bdf8; font-weight: bold",
      "color: inherit",
      neuralEvent
    );

    // Persist the protection state locally
    const currentList = Array.from(this.protectedNodes);
    await memoryCloud.set("SVRN_PROTECTED_NODES", currentList);
    
    // Local cache
    localStorage.setItem("SVRN_PROTECTED_NODES", JSON.stringify(currentList));
  }

  /**
   * Intercepts and blocks deletion attempts locally.
   */
  preventPruning(nodeId: string): boolean {
    const isProtected = this.protectedNodes.has(nodeId);

    if (isProtected) {
      console.warn(
        `%c[SECURITY_ALERT]%c Attempt to prune protected node ${nodeId} BLOCKED by local Sovereign Protocol.`,
        "color: #ef4444; font-weight: bold",
        "color: inherit"
      );
      return true; // Pruning prevented
    }
    return false;
  }

  /**
   * Logs all future system modifications locally.
   */
  logNeuralActivity(action: string, details: any) {
    const logEntry = {
      action,
      details,
      timestamp: new Date().toISOString(),
      securityLevel: sovereignConfig.security.level,
      engine: sovereignConfig.engine.version
    };

    console.log(
      `%c[NEURAL_LOG]%c ${action} locally`,
      "color: #a855f7; font-weight: bold",
      "color: inherit",
      logEntry
    );
  }
}

export const guardianApi = new GuardianAPI();
