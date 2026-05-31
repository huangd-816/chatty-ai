// Session + CSRF middleware.
//  - parseCookies: populate req.cookies from the Cookie header (no dependency).
//  - attachUser: resolve the session and attach req.user / req.session (global).
//  - requireSession: 401 unless authenticated (API gate).
//  - csrfProtect: mutating requests must carry a matching x-csrf-token header.
import { getSession } from '../services/auth.service.js';

export function parseCookies(req, res, next) {
  const header = req.headers.cookie || '';
  const out = {};
  for (const part of header.split(';')) {
    const i = part.indexOf('=');
    if (i > -1) {
      const k = part.slice(0, i).trim();
      const v = part.slice(i + 1).trim();
      if (k) { try { out[k] = decodeURIComponent(v); } catch { out[k] = v; } }
    }
  }
  req.cookies = out;
  next();
}

export function attachUser(req, res, next) {
  const s = getSession(req.cookies?.sid);
  if (s) {
    req.user = { id: s.userId, username: s.username };
    req.session = s;
  }
  next();
}

export function requireSession(req, res, next) {
  if (req.user) return next();
  return res.status(401).json({ error: 'Not authenticated' });
}

export function csrfProtect(req, res, next) {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();
  const token = req.get('x-csrf-token');
  if (req.session && token && token === req.session.csrf) return next();
  return res.status(403).json({ error: 'Invalid CSRF token' });
}
