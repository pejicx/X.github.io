import fs from "fs";
import path from "path";
import sqlite3 from "sqlite3";
import crypto from "crypto";
import { Fernet } from "fernet";

function setupSecretEngine(): void {
  console.log("PejicAIX Sovereign OS - Secret Engine Initialization...");

  // Database setup
  const dbPath = path.resolve("./pejicaix_secrets.db");
  const db = new sqlite3.Database(dbPath);

  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS sovereign_secrets (
        id TEXT PRIMARY KEY,
        key_alias TEXT UNIQUE NOT NULL,
        decrypted_value TEXT NOT NULL,
        entropy_level REAL,
        last_rotated DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  });

  // Generate Master Key if not exists
  const keyFile = path.resolve("./master.key");

  if (!fs.existsSync(keyFile)) {
    console.log("Generating Master Key...");

    const masterKey = crypto.randomBytes(32).toString("base64");

    fs.writeFileSync(keyFile, masterKey);

    console.log(`Master Key saved to ${keyFile} [SECURE]`);
  } else {
    console.log("Master Key already exists.");
  }

  console.log("Secret Engine Substrate initialized successfully.");

  db.close();
}

setupSecretEngine();
