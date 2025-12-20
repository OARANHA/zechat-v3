import { defineConfig } from '@playwright/test';

export default defineConfig({
  timeout: 30000,
  use: {
    headless: true,
    baseURL: process.env.E2E_BASE_URL || 'http://localhost:3000',
  },
});
