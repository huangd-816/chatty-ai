// Minimal in-memory per-IP rate limiter (dependency-free).
// Defaults are generous so normal single-user usage is unaffected; the point
// is to cap runaway/abusive calls to the paid LLM/TTS endpoints.
export function rateLimit({ windowMs = 60000, max = 60 } = {}) {
  const hits = new Map(); // ip -> { count, reset }

  return (req, res, next) => {
    const now = Date.now();
    const ip = req.ip || req.socket?.remoteAddress || 'unknown';

    // Occasional cleanup so the map can't grow unbounded.
    if (hits.size > 5000) {
      for (const [k, v] of hits) if (now > v.reset) hits.delete(k);
    }

    let entry = hits.get(ip);
    if (!entry || now > entry.reset) {
      entry = { count: 0, reset: now + windowMs };
      hits.set(ip, entry);
    }
    entry.count++;

    if (entry.count > max) {
      res.set('Retry-After', String(Math.ceil((entry.reset - now) / 1000)));
      return res.status(429).json({ error: 'Too many requests — slow down a sec.' });
    }
    next();
  };
}
