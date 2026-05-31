// Express app assembly: middleware + static assets + route mounting.
// Kept thin — all behavior lives in services/routes.
import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

import config from './config.js';
import { rateLimit } from './middleware/rateLimit.js';
import { parseCookies, attachUser, requireSession, csrfProtect } from './middleware/session.js';

import authRoutes from './routes/auth.routes.js';
import chatRoutes from './routes/chat.routes.js';
import historyRoutes from './routes/history.routes.js';
import mediaRoutes from './routes/media.routes.js';
import voiceRoutes from './routes/voice.routes.js';
import translateRoutes from './routes/translate.routes.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = join(__dirname, '..', 'public');

export function createApp() {
  const app = express();
  app.set('trust proxy', true); // so req.ip reflects client behind a proxy

  // CORS only when an explicit allowlist is configured (credentialed cookies
  // must never be combined with a wildcard origin). Default: same-origin only.
  if (config.allowedOrigins.length) {
    app.use(cors({ origin: config.allowedOrigins, credentials: true }));
  }

  app.use(express.json({ limit: '10mb' }));
  app.use(parseCookies);
  app.use(attachUser); // resolve session -> req.user (if any) for all routes

  // Serve ONLY the client bundle — never the repo root (no more /.env, /data, /server.js).
  app.use(express.static(PUBLIC_DIR));

  // Auth endpoints are reachable without a session. Brute-force rate limited.
  app.use('/auth', rateLimit({ windowMs: 60000, max: 20 }));
  app.use(authRoutes);

  // ─── API gate (everything below requires a valid session) ───
  app.use(requireSession); // 401 unless logged in
  app.use(csrfProtect);    // mutating requests need a valid x-csrf-token

  // Generous rate limit on the paid (LLM/TTS) endpoints.
  const paid = rateLimit({ windowMs: 60000, max: 60 });
  app.use('/chat', paid);
  app.use('/tts', paid);
  app.use('/translate', paid);
  app.use('/describe-gif', paid);

  app.use(chatRoutes);
  app.use(historyRoutes);
  app.use(mediaRoutes);
  app.use(voiceRoutes);
  app.use(translateRoutes);

  return app;
}
