/**
 * Sovereign Replay Engine
 * Provides a high-performance substrate for recording and replaying command executions locally.
 * Optimized for low-latency telemetry and automated state verification.
 */
import { Yallist } from 'yallist';

export interface ReplayEntry {
  id: string;
  type: 'command' | 'self-command' | 'conversation';
  input: string;
  output: string;
  timestamp: number;
  metrics: {
    load: number;
    intelligence: number;
    executionTime: number;
  };
}

class ReplayEngine {
  private history: Yallist<ReplayEntry>;
  private maxEntries: number = 50;

  constructor() {
    this.history = new Yallist<ReplayEntry>();
  }

  /**
   * Records a command execution in the high-performance replay substrate.
   */
  public record(entry: Omit<ReplayEntry, 'id' | 'timestamp'>) {
    const fullEntry: ReplayEntry = {
      ...entry,
      id: `replay_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now()
    };
    
    this.history.push(fullEntry);
    
    // Maintain circular buffer for high-performance memory management
    if (this.history.length > this.maxEntries) {
      this.history.shift();
    }
    
    console.log(`[REPLAY_ENGINE] Recorded ${entry.type}: ${entry.input}`);
  }

  /**
   * Retrieves the last recorded entry.
   */
  public getLast(): ReplayEntry | undefined {
    return this.history.tail?.value;
  }

  /**
   * Retrieves the full replay history.
   */
  public getHistory(): ReplayEntry[] {
    return this.history.toArray();
  }

  /**
   * Clears the replay substrate.
   */
  public clear() {
    this.history = new Yallist<ReplayEntry>();
  }
}

export const replayEngine = new ReplayEngine();
