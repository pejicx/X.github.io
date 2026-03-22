import fs from 'fs';
import path from 'path';

/**
 * Sovereign Substrate - Installation & Initialization
 * 
 * This script ensures all required directories and substrate files are present.
 */
async function initializeSubstrate() {
  console.log('[SVRN_INSTALL] Initializing Sovereign Substrate...');

  const root = process.cwd();
  const originDir = path.join(root, 'origin');
  const secretFile = path.join(root, 'agent.secret.json');

  // 1. Ensure Origin Directory
  if (!fs.existsSync(originDir)) {
    console.log('[SVRN_INSTALL] Creating origin substrate directory...');
    fs.mkdirSync(originDir);
    fs.writeFileSync(path.join(originDir, 'README.md'), '# Sovereign Origin State\n');
  }

  // 2. Initialize Secret Placeholder
  if (!fs.existsSync(secretFile)) {
    console.log('[SVRN_INSTALL] Initializing agent.secret.json placeholder...');
    fs.writeFileSync(secretFile, JSON.stringify({ status: 'UNINITIALIZED', key: 'PLACEHOLDER' }, null, 2));
  }

  console.log('[SVRN_INSTALL] Substrate initialization complete.');
}

initializeSubstrate().catch(err => {
  console.error('[SVRN_INSTALL] Initialization failed:', err);
  process.exit(1);
});
