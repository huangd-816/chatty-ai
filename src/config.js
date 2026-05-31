// Centralized configuration + boot-time validation.
// Loads .env once and exposes a frozen config object. Fails fast on missing
// required keys instead of erroring mid-request.
import dotenv from 'dotenv';

dotenv.config();

const config = {
  port: process.env.PORT || 3000,
  geminiApiKey: process.env.GEMINI_API_KEY,
  groqApiKey: process.env.GROQ_API_KEY || null,
  giphyApiKey: process.env.GIPHY_API_KEY || null,
  elevenLabsApiKey: process.env.ELEVENLABS_API_KEY || null,
  // ─── Session auth ───
  sessionTtlMs: 1000 * 60 * 60 * 24 * 30, // 30 days
  // Secure cookies require HTTPS. On by default in production; opt-in elsewhere.
  cookieSecure: process.env.COOKIE_SECURE === 'true' || process.env.NODE_ENV === 'production',
  // Comma-separated cross-origin allowlist. Empty = same-origin only (no CORS).
  allowedOrigins: (process.env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean),
  // Open registration unless explicitly disabled.
  allowRegistration: process.env.ALLOW_REGISTRATION !== 'false',
};

// Required for the core chat feature.
if (!config.geminiApiKey) {
  throw new Error('Missing GEMINI_API_KEY — set it in .env before starting the server.');
}

// Optional providers: warn (degraded feature) rather than crash.
const optional = [
  ['GROQ_API_KEY', config.groqApiKey, 'Gemini quota fallback disabled'],
  ['GIPHY_API_KEY', config.giphyApiKey, 'GIF search/trending disabled'],
  ['ELEVENLABS_API_KEY', config.elevenLabsApiKey, 'voice playback disabled'],
];
for (const [name, value, effect] of optional) {
  if (!value) console.warn(`⚠️  ${name} not set — ${effect}.`);
}

export default Object.freeze(config);
