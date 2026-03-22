import { v4 as uuidv4 } from 'uuid';

export interface Notification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'error';
  timestamp: string;
}

export interface SovereignState {
  notifications: Notification[];
  isNeuralActive: boolean;
  entropyLevel: number;
}

class StateManager {
  private state: SovereignState = {
    notifications: [],
    isNeuralActive: false,
    entropyLevel: 0.85
  };

  private listeners: Set<() => void> = new Set();

  public getState(): SovereignState {
    return { ...this.state };
  }

  public subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach(l => l());
  }

  public addNotification(message: string, type: Notification['type'] = 'info') {
    const notification: Notification = {
      id: uuidv4(),
      message,
      type,
      timestamp: new Date().toISOString()
    };
    this.state.notifications = [notification, ...this.state.notifications].slice(0, 5);
    this.notify();
    
    setTimeout(() => {
      this.removeNotification(notification.id);
    }, 5000);
  }

  public removeNotification(id: string) {
    this.state.notifications = this.state.notifications.filter(n => n.id !== id);
    this.notify();
  }

  public setNeuralActive(active: boolean) {
    this.state.isNeuralActive = active;
    this.notify();
  }
}

export const sovereignState = new StateManager();
