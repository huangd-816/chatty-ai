// Express app assembly: middleware + static assets + route mounting.
// Kept thin — all behavior lives in services/routes.
import express from 'express';
import cors from 'cors';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

import config from './config.js';
import { rateLimit } from './middleware/rateLimit.js';
import { requireToken } from './middleware/auth.js';

import chatRoutes from './routes/chat.routes.js';
import historyRoutes from './routes/history.routes.js';
import mediaRoutes from './routes/media.routes.js';
import voiceRoutes from './routes/voice.routes.js';
import translateRoutes from './routes/translate.routes.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = join(__dirname, '..', 'public');

// Build index.html once with the APP_TOKEN injected ONLY when configured.
// The token lives in the env, never in committed source. When unset, the
// marker is replaced with an empty string and the page is identical to before.
function buildIndexHtml() {
  const html = readFileSync(join(PUBLIC_DIR, 'index.html'), 'utf-8');
  const inject = config.appToken
    // JSON.stringify quotes/escapes; the <-escape prevents a </script> breakout.
    ? `<script>window.__APP_TOKEN__=${JSON.stringify(config.appToken).replace(/</g, '\\u003c')};</script>`
    : '';
  return html.replace('<!--APP_CONFIG-->', inject);
}

export function createApp() {
  const app = express();
  app.set('trust proxy', true); // so req.ip reflects client behind a proxy
  app.use(cors());
  app.use(express.json({ limit: '10mb' }));

  // Serve ONLY the client bundle — never the repo root (no more /.env, /data, /server.js).
  // index:false so we serve index.html ourselves (with token injection) below.
  app.use(express.static(PUBLIC_DIR, { index: false }));

  const indexHtml = buildIndexHtml();
  app.get(['/', '/index.html'], (req, res) => {
    res.set('Cache-Control', 'no-store'); // token-bearing HTML must not be cached
    res.type('html').send(indexHtml);
  });

  // Gate ALL API endpoints behind the optional token (no-op unless APP_TOKEN set).
  // Placed after static + index so assets and the page itself stay reachable.
  app.use(requireToken);

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
