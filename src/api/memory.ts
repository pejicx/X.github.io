/**
 * Memory API
 * Provides a strictly frontend-only interface for the Sovereign Memory Database.
 * All memory operations are executed locally within the client-side substrate.
 */
import { sovereignConfig } from "../config/sovereignConfig";
import { guardianApi } from "./guardian";
import { memoryCloud } from "../lib/memoryCloud";

export class MemoryAPI {
  private dbName: string;
  private version: number;

  constructor() {
    this.dbName = sovereignConfig.memory.database.name;
    this.version = sovereignConfig.memory.database.version;
  }

  /**
   * Saves data to the local neural memory substrate.
   */
  async save(key: string, data: any): Promise<void> {
    const payload = {
      data,
      metadata: {
        timestamp: new Date().toISOString(),
        db: this.dbName,
        version: this.version
      }
    };
    
    // Save to local memory substrate
    await memoryCloud.set(key, payload);
    
    // Local cache
    localStorage.setItem(`SVRN_MEM_${key}`, JSON.stringify(payload));
    
    guardianApi.logNeuralActivity('MEMORY_WRITE', { node: key });
  }

  /**
   * Retrieves data from the local neural memory substrate.
   */
  async load(key: string): Promise<any> {
    // Try local memory substrate first
    const cloudData = await memoryCloud.get(key);
    if (cloudData) return cloudData.data;

    // Fallback to localStorage
    const raw = localStorage.getItem(`SVRN_MEM_${key}`);
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw);
      return parsed.data;
    } catch (e) {
      console.error(`[MEMORY_API] Failed to load local node: ${key}`, e);
      return null;
    }
  }

  /**
   * Clears a specific memory node locally.
   */
  async forget(key: string): Promise<void> {
    if (guardianApi.preventPruning(`SVRN_MEM_${key}`)) {
      return;
    }
    
    // Local substrate deletion
    await memoryCloud.delete(key);
    
    // Local fallback
    localStorage.removeItem(`SVRN_MEM_${key}`);
    guardianApi.logNeuralActivity('MEMORY_PURGE', { node: key });
  }

  /**
   * Returns local memory statistics.
   */
  async getStats() {
    const cloudNodes = await memoryCloud.list();
    const localKeys = Object.keys(localStorage).filter(k => k.startsWith("SVRN_MEM_"));
    
    return {
      totalNodes: cloudNodes.length || localKeys.length,
      localSubstrateNodes: cloudNodes.length,
      localCacheNodes: localKeys.length,
      dbName: this.dbName,
      version: this.version
    };
  }
}

export const memoryApi = new MemoryAPI();
