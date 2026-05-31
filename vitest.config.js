import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

// Unit tests run against an isolated temp data dir and a dummy API key so
// importing config.js (which requires GEMINI_API_KEY) doesn't throw.
const TMP = resolve(import.meta.dirname, 'tests/.tmpdata');

export default defineConfig({
  test: {
    include: ['tests/unit/**/*.test.js'],
    globalSetup: ['tests/globalSetup.js'],
    env: {
      GEMINI_API_KEY: 'test-key-not-used',
      CHATTY_DATA_DIR: TMP,
    },
  },
});
