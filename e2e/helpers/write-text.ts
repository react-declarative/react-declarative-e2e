import { Page } from "@playwright/test";

export const writeText = async (page: Page, testId: string, text: string) => {
    const input = await page.getByTestId(testId);
    await input.click();
    await input.waitFor({ state: "visible" });
    await input.getByRole("textbox").fill(text);
    await input.blur();
    await page.waitForTimeout(1000);
};
