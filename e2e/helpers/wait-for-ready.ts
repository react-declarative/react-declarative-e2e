import { Page } from "@playwright/test";

const waitForMsg = (page: Page) => new Promise<void>((res) => {
  page.exposeFunction('launcherReady', () => res());
});

const waitForIdle = async (page: Page) => {
  await page.waitForLoadState("domcontentloaded");
  await page.waitForLoadState("load");
  await page.waitForLoadState("networkidle");
};

export const waitForReady = async (page: Page) => {
  await page.goto('about:blank');
  await waitForIdle(page);
  await page.goto("http://localhost:3000/");
  await waitForIdle(page);
  await waitForMsg(page);
};
