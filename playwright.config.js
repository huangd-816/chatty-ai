import { defineConfig } from '@playwright/test';
import { resolve } from 'path';

// API-level e2e: tests use the `request` fixture only (no browser binaries),
// against a real server booted on an isolated port + temp data dir with a
// dummy API key (no live LLM calls are made).
const PORT = 3199;
const TMP = resolve(import.meta.dirname, 'tests/.e2edata');

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30000,
  use: { baseURL: `http://localhost:${PORT}` },
  webServer: {
    command: 'node server.js',
    url: `http://localhost:${PORT}/`,
    reuseExistingServer: false,
    timeout: 30000,
    env: {
      PORT: String(PORT),
      GEMINI_API_KEY: 'test-key-not-used',
      CHATTY_DATA_DIR: TMP,
      ALLOW_REGISTRATION: 'true',
    },
  },
});
