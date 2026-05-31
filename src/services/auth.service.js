// User + session management. Passwords hashed with Node's built-in scrypt
// (no external dependency). Users and sessions persisted as JSON via fileStore.
//
// NOTE: read-modify-write of the JSON stores is not transactional; this is fine
// for a small/single-instance deployment. For multi-instance, move to a DB
// behind this same interface (the fileStore seam).
import crypto from 'crypto';
import config from '../config.js';
import { usersFile, sessionsFile, readJson, writeJson } from '../store/fileStore.js';

const USERNAME_RE = /^[A-Za-z0-9_-]{3,30}$/;

function loadUsers()    { return readJson(usersFile(), {}); }
function saveUsers(u)   { writeJson(usersFile(), u); }
function loadSessions() { return readJson(sessionsFile(), {}); }
function saveSessions(s){ writeJson(sessionsFile(), s); }

function hashPassword(password) {
  const salt = crypto.randomBytes(16);
  const hash = crypto.scryptSync(password, salt, 64);
  return `scrypt$${salt.toString('hex')}$${hash.toString('hex')}`;
}

function verifyPassword(password, stored) {
  try {
    const [scheme, saltHex, hashHex] = String(stored).split('$');
    if (scheme !== 'scrypt') return false;
    const salt = Buffer.from(saltHex, 'hex');
    const expected = Buffer.from(hashHex, 'hex');
    const actual = crypto.scryptSync(password, salt, expected.length);
    return expected.length === actual.length && crypto.timingSafeEqual(actual, expected);
  } catch {
    return false;
  }
}

export function registrationAllowed() {
  return config.allowRegistration;
}

export function registerUser(username, password) {
  if (!USERNAME_RE.test(username || '')) throw new Error('Username must be 3-30 chars: letters, numbers, _ or -');
  if (!password || password.length < 8) throw new Error('Password must be at least 8 characters');
  const users = loadUsers();
  const key = username.toLowerCase();
  if (users[key]) throw new Error('Username already taken');
  const id = crypto.randomBytes(8).toString('hex');
  users[key] = { id, username, hash: hashPassword(password), created: new Date().toISOString() };
  saveUsers(users);
  return { id, username };
}

export function authenticate(username, password) {
  const users = loadUsers();
  const u = users[(username || '').toLowerCase()];
  if (!u) {
    // Run a dummy verify so response timing doesn't reveal whether the user exists.
    verifyPassword(password || '', 'scrypt$00$00');
    return null;
  }
  if (!verifyPassword(password || '', u.hash)) return null;
  return { id: u.id, username: u.username };
}

function pruneExpired(sessions) {
  const now = Date.now();
  for (const [k, v] of Object.entries(sessions)) if (now > v.expires) delete sessions[k];
  return sessions;
}

export function createSession(user) {
  const sessions = pruneExpired(loadSessions());
  const sid = crypto.randomBytes(32).toString('hex');
  const csrf = crypto.randomBytes(32).toString('hex');
  sessions[sid] = { userId: user.id, username: user.username, csrf, expires: Date.now() + config.sessionTtlMs };
  saveSessions(sessions);
  return { sid, csrf };
}

export function getSession(sid) {
  if (!sid) return null;
  const sessions = loadSessions();
  const s = sessions[sid];
  if (!s) return null;
  if (Date.now() > s.expires) {
    delete sessions[sid];
    saveSessions(sessions);
    return null;
  }
  return s;
}

export function destroySession(sid) {
  if (!sid) return;
  const sessions = loadSessions();
  if (sessions[sid]) {
    delete sessions[sid];
    saveSessions(sessions);
  }
}
