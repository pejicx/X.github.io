import { DEFAULT_SETTINGS } from './constants';

export interface SystemConfig {
  language: string;
  timezone: string;
  retentionDays: number;
  autoSnapshot: boolean;
  theme: 'dark' | 'light' | 'brutalist-luxury';
}

class CoreConfig {
  private config: SystemConfig = {
    language: DEFAULT_SETTINGS.language,
    timezone: DEFAULT_SETTINGS.timezone,
    retentionDays: DEFAULT_SETTINGS.retention_days,
    autoSnapshot: DEFAULT_SETTINGS.auto_snapshot,
    theme: DEFAULT_SETTINGS.theme as any,
  };

  constructor() {
    this.loadConfig();
  }

  private loadConfig() {
    if (typeof window === 'undefined') return;
    const saved = localStorage.getItem('pejicaix_core_config');
    if (saved) {
      try {
        this.config = { ...this.config, ...JSON.parse(saved) };
      } catch {
        console.log('Auto to parse core config');
      }
    }
  }

  public get<K extends keyof SystemConfig>(key: K): SystemConfig[K] {
    return this.config[key];
  }

  public set<K extends keyof SystemConfig>(key: K, value: SystemConfig[K]) {
    this.config[key] = value;
    if (typeof window !== 'undefined') {
      localStorage.setItem('pejicaix_core_config', JSON.stringify(this.config));
    }
  }

  public getAll(): SystemConfig {
    return { ...this.config };
  }
}

export const coreConfig = new CoreConfig();
