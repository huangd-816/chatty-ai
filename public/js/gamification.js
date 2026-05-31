// XP / level + daily streak system. Extracted from app.js (Phase 2).
import { state } from './state.js';
import { showToast } from './utils.js';

const XP_THRESHOLDS = [0, 100, 250, 500, 900, 1400, 2000];
const LEVEL_NAMES = ['Strangers', 'Acquaintances', 'Friends', 'Close Friends', 'Best Friends', 'Soulmates', 'Bonded ✨'];

export function getXpData(id) { return JSON.parse(localStorage.getItem(`chatty-xp-${id}`) || '{"xp":0,"level":0}'); }
export function saveXpData(id, data) { localStorage.setItem(`chatty-xp-${id}`, JSON.stringify(data)); }

export function addXp(id, amount) {
  const data = getXpData(id);
  data.xp += amount;
  const oldLevel = data.level;
  while (data.level < XP_THRESHOLDS.length - 1 && data.xp >= XP_THRESHOLDS[data.level + 1]) data.level++;
  saveXpData(id, data);
  if (data.level > oldLevel) showToast(`💫 Level up! Now: ${LEVEL_NAMES[data.level] || 'Bonded'}`);
  if (id === state.currentId) _refreshXpDisplay(id);
}

export function _refreshXpDisplay(id) {
  const data = getXpData(id);
  const lvl = data.level;
  const prev = XP_THRESHOLDS[lvl] || 0;
  const next = XP_THRESHOLDS[lvl + 1];
  const pct = next ? Math.min(100, ((data.xp - prev) / (next - prev)) * 100) : 100;
  const fill = document.getElementById('xpBarFill');
  const name = document.getElementById('xpLevelName');
  if (fill) fill.style.width = pct + '%';
  if (name) name.textContent = LEVEL_NAMES[lvl] || 'Bonded ✨';
  const sc = document.getElementById('streakCount');
  if (sc) sc.textContent = '🔥 ' + getStreak(id);
  _refreshTopbarStreak(id);
}

export function _refreshTopbarStreak(id) {
  const el = document.getElementById('topbarStreak');
  if (!el) return;
  const streak = getStreak(id);
  if (streak > 0) {
    el.textContent = '🔥 ' + streak;
    el.classList.add('visible');
  } else {
    el.textContent = '';
    el.classList.remove('visible');
  }
}

export function updateStreak(id) {
  const key = `chatty-streak-${id}`;
  const data = JSON.parse(localStorage.getItem(key) || '{"streak":0,"lastDate":""}');
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  if (data.lastDate === today) return;
  data.streak = (data.lastDate === yesterday) ? data.streak + 1 : 1;
  data.lastDate = today;
  localStorage.setItem(key, JSON.stringify(data));
  if (data.streak > 1) showToast(`🔥 ${data.streak} day streak!`);
}

export function getStreak(id) {
  return JSON.parse(localStorage.getItem(`chatty-streak-${id}`) || '{"streak":0}').streak || 0;
}
