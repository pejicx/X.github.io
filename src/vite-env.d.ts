/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_URL: string;
  readonly VITE_SOVEREIGN_THEME: string;
  readonly VITE_SECURITY_LEVEL: string;
  readonly VITE_SOVEREIGN_VERSION: string;
  readonly VITE_AUTO_OPTIMIZE: string;
  readonly VITE_ENABLE_TELEMETRY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module 'fernet';
declare module 'sovereign-react';
