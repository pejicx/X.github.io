#!/bin/bash

# Neural Sync Substrate Script
echo "[SVRN_SYNC] Synchronizing neural pathways..."

# Check for node_modules
if [ ! -d "node_modules" ]; then
    echo "[SVRN_SYNC] node_modules missing. Running install..."
    npm install
fi

# Run linting to ensure integrity
echo "[SVRN_SYNC] Verifying substrate integrity..."
npm run lint

if [ $? -eq 0 ]; then
    echo "[SVRN_SYNC] Integrity verified. Substrate is stable."
else
    echo "[SVRN_SYNC] Integrity check failed. Please review substrate logs."
    exit 1
fi

echo "[SVRN_SYNC] Synchronization complete."
