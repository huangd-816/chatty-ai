// Auth endpoints: register, login, logout, me.
// Mounted BEFORE the session/CSRF gate so login/register are reachable
// without an existing session.
import { Router } from 'express';
import config from '../config.js';
import { registerUser, authenticate, createSession, destroySession, registrationAllowed } from '../services/auth.service.js';

const router = Router();

function cookieBase() {
  return { sameSite: 'lax', secure: config.cookieSecure, maxAge: config.sessionTtlMs, path: '/' };
}

function setSessionCookies(res, sid, csrf) {
  res.cookie('sid', sid, { ...cookieBase(), httpOnly: true });   // session id — JS can't read it
  res.cookie('csrf', csrf, { ...cookieBase(), httpOnly: false }); // CSRF token — JS reads + echoes it
}

router.post('/auth/register', (req, res) => {
  if (!registrationAllowed()) return res.status(403).json({ error: 'Registration is disabled' });
  const { username, password } = req.body || {};
  try {
    const user = registerUser(username, password);
    const { sid, csrf } = createSession(user);
    setSessionCookies(res, sid, csrf);
    res.json({ user, csrfToken: csrf });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.post('/auth/login', (req, res) => {
  const { username, password } = req.body || {};
  const user = authenticate(username, password);
  if (!user) return res.status(401).json({ error: 'Invalid username or password' });
  const { sid, csrf } = createSession(user);
  setSessionCookies(res, sid, csrf);
  res.json({ user, csrfToken: csrf });
});

router.post('/auth/logout', (req, res) => {
  destroySession(req.cookies?.sid);
  res.clearCookie('sid', { path: '/' });
  res.clearCookie('csrf', { path: '/' });
  res.json({ ok: true });
});

router.get('/auth/me', (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
  res.json({ user: req.user, csrfToken: req.session.csrf, registrationAllowed: registrationAllowed() });
});

export default router;
