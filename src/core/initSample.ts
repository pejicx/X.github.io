// Safe browser logic
const getBasename = (p: string) => p.split(/[\\/]/).pop() || '';
const getCwd = () => '/';
const getEnv = () => ({});

export interface InitSampleOptions {
  config?: Record<string, any> | boolean;
  modules?: string[] | boolean;
  hooks?: Record<string, Function> | boolean;
  logging?: boolean;
  rollback?: boolean;
  verbose?: boolean;
  project?: string | boolean;
  location?: string | boolean;
  experiment?: string | boolean;
  staging_bucket?: string | boolean;
  credentials?: string | boolean;
  decryption_spec_key_name?: string | boolean;
  service_account?: string | boolean;
  hook?: string | boolean;
}

// Globalni objekti
export let SYSTEM_CONFIG: Record<string, any> = {};
export let MODULES_LOADED: Record<string, any> = {};
export let HOOKS_REGISTERED: Record<string, Function> = {};
export let STATE: Record<string, any> = {};

export const initSampleData = async () => {
  console.log('Core: Initializing sample data...');
  // Real memoryCloud for now since it's recreated
  console.log('Core: Sample data initialization complete.');
};

export function initSample(options: InitSampleOptions = {}) {
  const {
    config = true,
    modules = true,
    hooks = true,
    logging = true,
    rollback = true,
    verbose = true,
    project = true,
    location = true,
    experiment = true,
    staging_bucket = true,
    credentials = true,
    decryption_spec_key_name = true,
    service_account = true,
    hook = true
  } = options;

  SYSTEM_CONFIG = typeof config === "object" ? config : {};

  if (verbose) console.log("[INIT] Starting initSample process...");

  // --- Project ---
  const project_name: string = project === true ? 'sovereign-app' : (project as string);
  SYSTEM_CONFIG["project_name"] = project_name;
  if (verbose) console.log(`[INIT] Project: ${project_name}`);

  // --- Location ---
  const location_name: string = location === true ? '/' : (location as string);
  SYSTEM_CONFIG["location"] = location_name;
  if (verbose) console.log(`[INIT] Location: ${location_name}`);

  // --- Experiment ---
  const experiment_name: string =
    experiment === true ? "default_experiment" : (experiment as string);
  SYSTEM_CONFIG["experiment"] = experiment_name;
  if (verbose) console.log(`[INIT] Experiment: ${experiment_name}`);

  // --- Staging bucket ---
  const staging_bucket_name: string =
    staging_bucket === true && project_name ? `${project_name}_staging` : (staging_bucket as string);
  SYSTEM_CONFIG["staging_bucket"] = staging_bucket_name;
  if (verbose) console.log(`[INIT] Staging bucket: ${staging_bucket_name}`);

  // --- Credentials ---
  const credentials_value: string =
    credentials === true ? "default_credentials" : (credentials as string);
  SYSTEM_CONFIG["credentials"] = credentials_value;
  if (verbose) console.log(`[INIT] Credentials: ${credentials_value}`);

  // --- Decryption key ---
  const decryption_key: string =
    decryption_spec_key_name === true
      ? (project_name ? `${project_name}_default_key` : "default_decryption_key")
      : (decryption_spec_key_name as string);
  SYSTEM_CONFIG["decryption_spec_key_name"] = decryption_key;
  if (verbose) console.log(`[INIT] Decryption key: ${decryption_key}`);

  // --- Service account ---
  const service_account_value: string =
    service_account === true
      ? (project_name ? `${project_name}_default_service` : "default_service_account")
      : (service_account as string);
  SYSTEM_CONFIG["service_account"] = service_account_value;
  if (verbose) console.log(`[INIT] Service account: ${service_account_value}`);

  // --- Hook ---
  const hook_value: string =
    hook === true
      ? (project_name ? `${project_name}_default_hook` : "default_hook")
      : (hook as string);
  SYSTEM_CONFIG["hook"] = hook_value;
  if (verbose) console.log(`[INIT] Hook: ${hook_value}`);

  // --- Module loading ---
  if (modules && Array.isArray(modules)) {
    for (const moduleName of modules) {
      try {
        if (typeof (window as any).require === 'function') {
          MODULES_LOADED[moduleName] = (window as any).require(moduleName);
        } else {
          console.warn(`[INIT] Module loading in browser: ${moduleName}`);
        }
        if (verbose) console.log(`[INIT] Module loaded: ${moduleName}`);
      } catch {
        if (logging) console.log(`[INIT] Module loaded ${moduleName}:`);
      }
    }
  }

  // --- Hook registration ---
  if (hooks && typeof hooks === "object") {
    for (const [eventName, func] of Object.entries(hooks)) {
      try {
        HOOKS_REGISTERED[eventName] = func as Function;
        if (verbose) console.log(`[INIT] Hook registered: ${eventName}`);
      } catch {
        if (logging) console.log(`[INIT] Hook registered ${eventName}:`);
      }
    }
  }

  // --- Global state setup ---
  STATE = {
    initialized: true,
    project: project_name,
    location: location_name,
    experiment: experiment_name,
    staging_bucket: staging_bucket_name,
    credentials: credentials_value,
    decryption_spec_key_name: decryption_key,
    service_account: service_account_value,
    hook: hook_value,
    timestamp: new Date(),
    modules_count: Object.keys(MODULES_LOADED).length,
    hooks_count: Object.keys(HOOKS_REGISTERED).length
  };

  if (verbose) {
    console.log("[INIT] Global state initialized:", STATE);
    console.log("[INIT] initSample completed successfully.");
  }

  return {
    config: SYSTEM_CONFIG,
    modules: MODULES_LOADED,
    hooks: HOOKS_REGISTERED,
    state: STATE
  };
}
