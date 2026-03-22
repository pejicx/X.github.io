#!/bin/bash

# PejicAIX Sovereign - Installation & Substrate Initialization Script

echo "[SVRN_INSTALL] Initializing Sovereign Neural Substrate..."

# 1. Ensure Origin Directory exists
if [ ! -d "origin" ]; then
    echo "[SVRN_INSTALL] Creating origin substrate directory..."
    mkdir origin
    echo "# Sovereign Origin State" > origin/README.md
fi

# 2. Install Node Dependencies
echo "[SVRN_INSTALL] Installing dependencies via npm..."
npm install

# 3. Initialize Secret Placeholders if missing
if [ ! -f "agent.secret.json" ]; then
    echo "[SVRN_INSTALL] Initializing agent.secret.json placeholder..."
    echo '{"status": "UNINITIALIZED", "key": "PLACEHOLDER"}' > agent.secret.json
fi

# 4. Build the Production Assets
echo "[SVRN_INSTALL] Building production substrate..."
npm run build

echo "[SVRN_INSTALL] Installation complete. Sovereign Substrate is ready."
