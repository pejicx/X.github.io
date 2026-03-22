/**
 * PejicAIX Sovereign Memory Cloud
 * Provides a strictly frontend-only interface for persistent state management.
 * All memory operations are executed locally within the client-side substrate.
 */
export interface MemorySecret {
  key: string;
  value: string;
  timestamp: number;
}

export interface MemoryLog {
  id: string;
  event: string;
  timestamp: number;
  type: 'info' | 'ai' | 'warn' | 'error';
}

export interface MemorySnapshot {
  id: string;
  name: string;
  timestamp: number;
  size: number;
  data: any;
}

/**
 * Frontend-only memory substrate for managing persistent state locally.
 * No backend dependencies are required for these memory operations.
 */
class MemoryCloudSubstrate {
  private storage: Record<string, any> = {};

  constructor() {
    this.init();
  }

  async init(): Promise<void> {
    console.log('[MEMORY_CLOUD] Local substrate initialized.');
    // Load from localStorage if available
    const saved = localStorage.getItem('SVRN_CLOUD_SUBSTRATE');
    if (saved) {
      try {
        this.storage = JSON.parse(saved);
      } catch (e) {
        console.error('[MEMORY_CLOUD] Failed to parse local substrate.', e);
        this.storage = {};
      }
    }
  }

  async get(key: string): Promise<any> {
    return this.storage[key] || null;
  }
  
  async set(key: string, value: any): Promise<boolean> {
    this.storage[key] = value;
    localStorage.setItem('SVRN_CLOUD_SUBSTRATE', JSON.stringify(this.storage));
    return true;
  }
  
  async list(): Promise<string[]> {
    return Object.keys(this.storage);
  }

  async delete(key: string): Promise<boolean> {
    delete this.storage[key];
    localStorage.setItem('SVRN_CLOUD_SUBSTRATE', JSON.stringify(this.storage));
    return true;
  }
  
  async clearAll(): Promise<boolean> {
    this.storage = {};
    localStorage.removeItem('SVRN_CLOUD_SUBSTRATE');
    return true;
  }

  async getAllSecrets(): Promise<MemorySecret[]> {
    const secrets = await this.get('SVRN_SECRETS');
    return secrets || [];
  }

  async saveSecret(key: string, value: string): Promise<void> {
    const secrets = await this.getAllSecrets();
    const existingIndex = secrets.findIndex(s => s.key === key);
    const newSecret = { key, value, timestamp: Date.now() };
    
    if (existingIndex >= 0) {
      secrets[existingIndex] = newSecret;
    } else {
      secrets.push(newSecret);
    }
    
    await this.set('SVRN_SECRETS', secrets);
  }

  async getLogs(limit: number = 100): Promise<MemoryLog[]> {
    const logs = await this.get('SVRN_LOGS');
    return (logs || []).slice(0, limit);
  }

  async addLog(event: string, type: 'info' | 'ai' | 'warn' | 'error' = 'info'): Promise<void> {
    const logs = await this.getLogs(1000);
    const newLog: MemoryLog = {
      id: Math.random().toString(36).substring(7),
      event,
      timestamp: Date.now(),
      type
    };
    logs.unshift(newLog);
    await this.set('SVRN_LOGS', logs.slice(0, 1000));
  }

  async ensureDb(): Promise<any> {
    return {
      transaction: () => ({
        objectStore: () => ({
          getAll: () => ({ onsuccess: null, result: [] })
        })
      })
    };
  }
}

export const memoryCloud = new MemoryCloudSubstrate();
