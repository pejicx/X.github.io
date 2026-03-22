/**
 * Sovereign Configuration
 * Provides a strictly frontend-only configuration substrate.
 * All environment variables are resolved locally within the client-side substrate.
 */
export const sovereignConfig = {
  app: {
    name: "PejicAIX Sovereign",
    version: "2.5.0",
    description: "Sovereign neural substrate for unconcealed execution orchestration."
  },
  system: {
    orchestration_mode: "sovereign",
    auto_optimize: "true",
    logging_level: "info"
  },
  substrate: {
    status: {
      active: true,
      hibernating: false,
      initializing: false
    }
  },
  security: {
    level: "SOVEREIGN",
    rotation_policy: {
      interval_days: 30,
      entropy_threshold: 0.85
    }
  },
  memory: {
    database: {
      name: "PejicAIX_Sovereign_Local_Substrate",
      version: 1
    }
  },
  engine: {
    version: "2.5.0"
  }
};
