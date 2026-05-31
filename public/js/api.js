// Token-aware fetch wrapper.
//
// The server injects window.__APP_TOKEN__ into the page ONLY when APP_TOKEN is
// configured. When present, we transparently attach it as `x-app-token` to
// SAME-ORIGIN requests so every existing fetch('/chat'), fetch('/tts'), etc.
// works with no call-site changes.
//
// Same-origin only: we must never leak the token to third parties
// (Giphy, pravatar, …). Cross-origin requests pass through untouched.
//
// If no token is configured, this file is a complete no-op — behavior is
// identical to before.
(function () {
  const TOKEN = window.__APP_TOKEN__ || null;
  if (!TOKEN) return;

  const origFetch = window.fetch.bind(window);

  window.fetch = function (input, init) {
    let url;
    try {
      const raw = typeof input === 'string' ? input : input.url;
      url = new URL(raw, location.href);
    } catch {
      return origFetch(input, init); // opaque/unknown — leave alone
    }

    // Only our own origin gets the token.
    if (url.origin !== location.origin) return origFetch(input, init);

    const headers = new Headers(
      (init && init.headers) ||
      (typeof input !== 'string' && input.headers) ||
      {}
    );
    headers.set('x-app-token', TOKEN);

    return origFetch(input, { ...(init || {}), headers });
  };
})();
