// Leaf utilities — pure/DOM helpers with no shared app state.
// Extracted verbatim from app.js (Phase 2).

export function escapeHtml(t) {
  return String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export function formatTime(ts) {
  const d = new Date(ts), now = new Date();
  if (d.toDateString() === now.toDateString()) {
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  return d.toLocaleDateString([], { weekday: 'short' });
}

export function avatarColor(emoji) {
  const colors = { '👻': '#0084FF', '🐱': '#FF9500', '🦊': '#FF6B35', '🐺': '#636366', '🐰': '#FF2D55', '🐸': '#30D158', '🦋': '#BF5AF2', '🌙': '#5E5CE6', '⭐': '#FFD60A', '🔥': '#FF3B30', '💎': '#32ADE6', '🌸': '#FF6B9D' };
  return colors[emoji] || '#0084FF';
}

export function lightenColor(hex, amount) {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, (num >> 16) + amount);
  const g = Math.min(255, ((num >> 8) & 0xff) + amount);
  const b = Math.min(255, (num & 0xff) + amount);
  return `rgb(${r},${g},${b})`;
}

export function showToast(msg) {
  const t = document.createElement('div'); t.className = 'toast'; t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.classList.add('toast-show'), 10);
  setTimeout(() => { t.classList.remove('toast-show'); setTimeout(() => t.remove(), 300); }, 2200);
}

export function showConfirm(message, onConfirm) {
  const overlay = document.createElement('div');
  overlay.style.cssText = 'position:fixed;inset:0;z-index:1000;background:rgba(0,0,0,0.6);backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;';
  overlay.innerHTML = `<div style="background:#1a1a2e;border:1px solid rgba(255,255,255,0.1);border-radius:20px;padding:24px;width:280px;text-align:center;"><div style="font-size:15px;color:#f0f0f0;margin-bottom:20px;">${message}</div><div style="display:flex;gap:10px;"><button id="confirmCancel" style="flex:1;padding:10px;border-radius:12px;border:1px solid rgba(255,255,255,0.15);background:rgba(255,255,255,0.08);color:#f0f0f0;cursor:pointer;font-size:14px;">Cancel</button><button id="confirmOk" style="flex:1;padding:10px;border-radius:12px;border:none;background:#ff3b30;color:#fff;cursor:pointer;font-size:14px;font-weight:600;">Delete</button></div></div>`;
  document.body.appendChild(overlay);
  overlay.querySelector('#confirmCancel').onclick = () => overlay.remove();
  overlay.querySelector('#confirmOk').onclick = () => { overlay.remove(); onConfirm(); };
}

export function compressPhoto(file, maxSize, cb) {
  if (file.type === 'image/gif') {
    if (file.size > 3 * 1024 * 1024) { showToast('GIF too large (max 3MB)'); return; }
    const r = new FileReader(); r.onload = e => cb(e.target.result); r.readAsDataURL(file);
    return;
  }
  const r = new FileReader();
  r.onload = e => {
    const img = new Image();
    img.onload = () => {
      const ratio = Math.min(maxSize / img.width, maxSize / img.height, 1);
      const w = Math.round(img.width * ratio), h = Math.round(img.height * ratio);
      const canvas = document.createElement('canvas');
      canvas.width = w; canvas.height = h;
      canvas.getContext('2d').drawImage(img, 0, 0, w, h);
      try { cb(canvas.toDataURL('image/jpeg', 0.82)); } catch { cb(e.target.result); }
    };
    img.src = e.target.result;
  };
  r.readAsDataURL(file);
}

let _audioCtx = null;
export function playChime() {
  try {
    if (!_audioCtx) _audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const ctx = _audioCtx;
    [[523.25, 0], [659.25, 0.1], [783.99, 0.2]].forEach(([freq, delay]) => {
      const osc = ctx.createOscillator(), gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.frequency.value = freq; osc.type = 'sine';
      const t = ctx.currentTime + delay;
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.15, t + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
      osc.start(t); osc.stop(t + 0.55);
    });
  } catch { /* AudioContext unavailable */ }
}

// Matches voice placeholders that have no real spoken text.
export const _voicePlaceholderRE = /^(spoken version|placeholder|\[.*\]|0:\d\d)$/i;
