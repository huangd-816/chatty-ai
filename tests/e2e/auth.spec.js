import { test, expect } from '@playwright/test';

const cred = () => ({ username: `e2e_${Date.now()}_${Math.floor(Math.random() * 1e6)}`, password: 'hunter2pass' });

test('static assets are served but secrets are not', async ({ request }) => {
  expect((await request.get('/')).status()).toBe(200);
  expect((await request.get('/css/style.css')).status()).toBe(200);
  // Secrets/source outside public/ are never served (the auth gate catches
  // unknown paths, so they return 401 — either way, never 200 / the file).
  expect([401, 404]).toContain((await request.get('/.env')).status());
  expect([401, 404]).toContain((await request.get('/server.js')).status());
});

test('API requires authentication', async ({ request }) => {
  expect((await request.get('/get-history?companionId=0816')).status()).toBe(401);
});

test('register establishes a session that unlocks the API', async ({ playwright }) => {
  const ctx = await playwright.request.newContext({ baseURL: 'http://localhost:3199' });

  const reg = await ctx.post('/auth/register', { data: cred() });
  expect(reg.ok()).toBeTruthy();

  // Authenticated GET works.
  expect((await ctx.get('/get-history?companionId=0816')).status()).toBe(200);

  // Mutating request WITHOUT csrf header -> 403.
  const noCsrf = await ctx.post('/clear-memory', { data: { companionId: '0816' } });
  expect(noCsrf.status()).toBe(403);

  // Mutating request WITH the csrf token (read from the cookie) -> 200.
  const { cookies } = await ctx.storageState();
  const csrf = cookies.find((c) => c.name === 'csrf')?.value;
  const withCsrf = await ctx.post('/clear-memory', {
    headers: { 'x-csrf-token': csrf },
    data: { companionId: '0816' },
  });
  expect(withCsrf.ok()).toBeTruthy();

  await ctx.dispose();
});

test('login rejects a wrong password', async ({ request }) => {
  const c = cred();
  expect((await request.post('/auth/register', { data: c })).ok()).toBeTruthy();
  const bad = await request.post('/auth/login', { data: { username: c.username, password: 'totally-wrong' } });
  expect(bad.status()).toBe(401);
});
