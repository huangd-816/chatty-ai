// Transparent fetch wrapper for same-origin API calls.
//
//  - Attaches APP_TOKEN as `x-app-token` (only when the server injected one).
//  - Attaches the CSRF token as `x-csrf-token` on mutating requests, read from
//    the readable `csrf` cookie set at login.
//  - Same-origin ONLY: never leaks tokens to third parties (Giphy, pravatar, …).
//  - Sends cookies (credentials) so the session travels with each request.
//
// No call-site changes needed: every existing fetch('/chat'), fetch('/tts'), …
// is upgraded automatically.
(function () {
  const APP_TOKEN = window.__APP_TOKEN__ || null;
  const origFetch = window.fetch.bind(window);

  function getCookie(name) {
    const row = document.cookie.split('; ').find(r => r.startsWith(name + '='));
    return row ? decodeURIComponent(row.slice(name.length + 1)) : null;
  }

  window.fetch = function (input, init) {
    let url;
    try {
      const raw = typeof input === 'string' ? input : input.url;
      url = new URL(raw, location.href);
    } catch {
      return origFetch(input, init); // opaque/unknown — leave alone
    }

    // Only our own origin gets tokens + credentials.
    if (url.origin !== location.origin) return origFetch(input, init);

    const headers = new Headers(
      (init && init.headers) ||
      (typeof input !== 'string' && input.headers) ||
      {}
    );

    if (APP_TOKEN) headers.set('x-app-token', APP_TOKEN);

    const method = (
      (init && init.method) ||
      (typeof input !== 'string' && input.method) ||
      'GET'
    ).toUpperCase();
    if (!['GET', 'HEAD', 'OPTIONS'].includes(method)) {
      const csrf = getCookie('csrf');
      if (csrf) headers.set('x-csrf-token', csrf);
    }

    return origFetch(input, { ...(init || {}), headers, credentials: 'same-origin' });
  };
})();
