// Login/registration overlay logic.
// On load, checks /auth/me; shows the overlay (covering the app) unless the
// user has a valid session. Login/register reload the page on success so the
// app re-initializes cleanly with the session in place.
(function () {
  function el(id) { return document.getElementById(id); }
  function show() { const o = el('authOverlay'); if (o) o.style.display = 'flex'; }
  function hide() { const o = el('authOverlay'); if (o) o.style.display = 'none'; }
  function setError(msg) { const e = el('authError'); if (e) e.textContent = msg || ''; }
  function setBusy(b) { document.querySelectorAll('.auth-btn').forEach(x => x.disabled = b); }

  async function check() {
    try {
      const r = await fetch('/auth/me');
      if (r.ok) { hide(); return true; }
    } catch { /* offline / server down — fall through to overlay */ }
    show();
    return false;
  }

  window.authSubmit = async function (mode) {
    setError('');
    const username = el('authUser').value.trim();
    const password = el('authPass').value;
    if (!username || !password) { setError('Enter a username and password'); return; }
    setBusy(true);
    try {
      const r = await fetch('/auth/' + (mode === 'register' ? 'register' : 'login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) { setError(data.error || 'Something went wrong'); setBusy(false); return; }
      location.reload();
    } catch {
      setError('Network error — is the server running?');
      setBusy(false);
    }
  };

  window.authLogout = async function () {
    try { await fetch('/auth/logout', { method: 'POST' }); } catch { /* ignore */ }
    location.reload();
  };

  // Submit on Enter from the password field.
  document.addEventListener('DOMContentLoaded', () => {
    el('authPass')?.addEventListener('keydown', e => { if (e.key === 'Enter') window.authSubmit('login'); });
    check();
  });
})();
