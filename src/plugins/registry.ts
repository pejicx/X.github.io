export interface Plugin {
  name: string;
  init: () => Promise<void>;
  start: () => Promise<void>;
}

class PluginRegistry {
  private plugins: Plugin[] = [];

  register(plugin: Plugin) {
    this.plugins.push(plugin);
  }

  async initAll() {
    for (const plugin of this.plugins) {
      console.log(`[PLUGIN_REGISTRY] Initializing ${plugin.name}...`);
      await plugin.init();
    }
  }

  async startAll() {
    for (const plugin of this.plugins) {
      console.log(`[PLUGIN_REGISTRY] Starting ${plugin.name}...`);
      await plugin.start();
    }
  }
}

export const pluginRegistry = new PluginRegistry();
