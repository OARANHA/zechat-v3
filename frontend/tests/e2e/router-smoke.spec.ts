import { test, expect } from '@playwright/test';

// Helpers
async function clearToken(page) {
  await page.addInitScript(() => localStorage.removeItem('token'));
}

async function setToken(page) {
  await page.addInitScript(() => localStorage.setItem('token', JSON.stringify({ accessToken: 'dummy' })));
}

// User without token
test.describe('Router smoke - no token', () => {
  test('access / redirects to /login', async ({ page, baseURL }) => {
    await clearToken(page);
    await page.goto(baseURL + '/');
    await expect(page).toHaveURL(/\/login$/);
  });

  test('access /login stays in /login', async ({ page, baseURL }) => {
    await clearToken(page);
    await page.goto(baseURL + '/login');
    await expect(page).toHaveURL(/\/login$/);
  });
});

// User with token
test.describe('Router smoke - with token', () => {
  test('access / goes to /home', async ({ page, baseURL }) => {
    await setToken(page);
    await page.goto(baseURL + '/');
    await expect(page).toHaveURL(/\/home$/);
  });

  test('access /login redirects to /home', async ({ page, baseURL }) => {
    await setToken(page);
    await page.goto(baseURL + '/login');
    await expect(page).toHaveURL(/\/home$/);
  });

  test('access /atendimento/chats stays and renders layout', async ({ page, baseURL }) => {
    await setToken(page);
    await page.goto(baseURL + '/atendimento/chats');
    await expect(page).toHaveURL(/\/atendimento\/chats$/);
  });
});
