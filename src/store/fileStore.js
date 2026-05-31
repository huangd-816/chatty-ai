// The ONLY module that touches the filesystem for persistence.
// Validates ids to prevent path traversal, and writes atomically
// (temp file + rename) so concurrent requests can't corrupt a file.
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
// Overridable so tests (and alternate deployments) can point elsewhere.
const DATA_DIR = process.env.CHATTY_DATA_DIR || join(__dirname, '..', '..', 'data');
fs.mkdirSync(DATA_DIR, { recursive: true });

// Companion ids are slugs/timestamps like "0816" or "ai_1779798629531".
// Anything outside this charset could escape the data dir — reject it.
const ID_RE = /^[A-Za-z0-9_-]+$/;

export function safeId(id) {
  const v = id || '0816';
  if (!ID_RE.test(v)) throw new Error(`Invalid id: ${JSON.stringify(id)}`);
  return v;
}

export function historyFile(id) {
  return join(DATA_DIR, `history_${safeId(id)}.json`);
}

export function memoryFile(id) {
  return join(DATA_DIR, `memory_${safeId(id)}.json`);
}

export function usersFile() {
  return join(DATA_DIR, 'users.json');
}

export function sessionsFile() {
  return join(DATA_DIR, 'sessions.json');
}

// Namespace a companion's storage by the authenticated user, so users can't
// see or clobber each other's history/memory. Both parts are id-validated.
export function userScopedId(userId, companionId) {
  return `${safeId(userId)}__${safeId(companionId || '0816')}`;
}

export function readJson(file, fallback) {
  try {
    if (!fs.existsSync(file)) return fallback;
    return JSON.parse(fs.readFileSync(file, 'utf-8'));
  } catch {
    return fallback;
  }
}

export function writeJson(file, data) {
  try {
    const tmp = `${file}.${process.pid}.tmp`;
    fs.writeFileSync(tmp, JSON.stringify(data, null, 2));
    fs.renameSync(tmp, file); // atomic on same filesystem
  } catch (e) {
    console.error('writeJson:', e.message);
  }
}

export function exists(file) {
  return fs.existsSync(file);
}

export function remove(file) {
  try { if (fs.existsSync(file)) fs.unlinkSync(file); }
  catch (e) { console.error('remove:', e.message); }
}
