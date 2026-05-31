// Express app assembly: middleware + static assets + route mounting.
// Kept thin — all behavior lives in services/routes.
import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

import { rateLimit } from './middleware/rateLimit.js';
import { requireToken } from './middleware/auth.js';

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
  app.use(cors());
  app.use(express.json({ limit: '10mb' }));

  // Serve ONLY the client bundle — never the repo root (no more /.env, /data, /server.js).
  app.use(express.static(PUBLIC_DIR));
  app.get('/', (req, res) => res.sendFile(join(PUBLIC_DIR, 'index.html')));

  // Optional auth gate (no-op unless APP_TOKEN set) + generous rate limit on paid endpoints.
  const guard = [requireToken, rateLimit({ windowMs: 60000, max: 60 })];
  app.use('/chat', guard);
  app.use('/tts', guard);
  app.use('/translate', guard);
  app.use('/describe-gif', guard);

  app.use(chatRoutes);
  app.use(historyRoutes);
  app.use(mediaRoutes);
  app.use(voiceRoutes);
  app.use(translateRoutes);

  return app;
}
