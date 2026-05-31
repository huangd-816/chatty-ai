// Browser smoke test (Phase 2). Validates that the ES-module split did not
// change runtime behavior: the page boots with NO uncaught JS errors, the
// window-shim exposes the extracted functions, the shared state object works,
// and the companion sidebar renders after login.
import { test, expect } from '@playwright/test';

const cred = () => ({
  username: `smoke_${Date.now()}_${Math.floor(Math.random() * 1e6)}`,
  password: 'hunter2pass',
});

test('app boots, modules wire to window, sidebar renders, no JS errors', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));

  await page.goto('/');

  // Login overlay is shown for an unauthenticated visitor.
  await expect(page.locator('#authOverlay')).toBeVisible();

  // Module bootstrap ran before app.js: extracted functions + state are on window.
  const wired = await page.evaluate(() => ({
    showToast: typeof window.showToast,
    addXp: typeof window.addXp,
    getCurrentCompanion: typeof window.getCurrentCompanion,
    hasState: !!window.state && Array.isArray(window.state.companions),
    currentId: window.state && window.state.currentId,
    // app.js's own functions remain global (classic script) for inline onclick.
    sendMessage: typeof window.sendMessage,
  }));
  expect(wired.showToast).toBe('function');
  expect(wired.addXp).toBe('function');
  expect(wired.getCurrentCompanion).toBe('function');
  expect(wired.sendMessage).toBe('function');
  expect(wired.hasState).toBe(true);
  expect(wired.currentId).toBeTruthy();

  // Register through the real overlay UI -> reloads into the authed app.
  const c = cred();
  await page.fill('#authUser', c.username);
  await page.fill('#authPass', c.password);
  await page.click('button.auth-btn:has-text("Create account")');

  // After reload the overlay is gone and the sidebar has rendered a companion.
  await expect(page.locator('#authOverlay')).toBeHidden();
  await expect(page.locator('#companionsList .companion-item').first()).toBeVisible();

  // getCurrentCompanion (uses state.currentId) resolves to a real companion.
  const name = await page.evaluate(() => window.getCurrentCompanion()?.name);
  expect(name).toBeTruthy();

  expect(errors, `uncaught page errors: ${errors.join(' | ')}`).toEqual([]);
});
