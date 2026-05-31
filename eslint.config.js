import js from '@eslint/js';
import globals from 'globals';

const shared = {
  'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
  'no-empty': ['warn', { allowEmptyCatch: true }],
};

export default [
  {
    ignores: [
      'node_modules/**',
      'data/**',
      'tests/.tmpdata/**',
      'tests/.e2edata/**',
      // Third-party tooling (ruflo CommonJS helpers) — not our code.
      '.claude/**',
      '.claude-flow/**',
      // Legacy monolith — modularized in Phase 2; not linted yet.
      'public/js/app.js',
    ],
  },
  js.configs.recommended,
  {
    // Backend + tests + config files (Node ESM).
    files: ['src/**/*.js', 'server.js', 'tests/**/*.js', '*.config.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: { ...globals.node, fetch: 'readonly', URL: 'readonly', URLSearchParams: 'readonly' },
    },
    rules: shared,
  },
  {
    // Browser scripts (classic IIFE, not modules).
    files: ['public/js/api.js', 'public/js/auth.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'script',
      globals: { ...globals.browser },
    },
    rules: shared,
  },
  {
    // e2e specs mix Node test code with browser page.evaluate() callbacks.
    files: ['tests/e2e/**/*.js'],
    languageOptions: { globals: { ...globals.browser } },
  },
  {
    // Browser ES modules (Phase 2 extraction).
    files: ['public/js/state.js', 'public/js/utils.js', 'public/js/gamification.js', 'public/js/bootstrap.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: { ...globals.browser },
    },
    rules: shared,
  },
];
