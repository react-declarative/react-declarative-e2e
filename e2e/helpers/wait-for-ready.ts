import { Page } from "@playwright/test";

const waitForIdle = async (page: Page) => {
  await page.waitForLoadState("domcontentloaded");
  await page.waitForLoadState("load");
  await page.waitForLoadState("networkidle");
}

export const waitForReady = async (page: Page) => {
  await waitForIdle(page);
  await page.goto("http://localhost:3000/");
  await waitForIdle(page);
  await page.waitForTimeout(1000);
};
