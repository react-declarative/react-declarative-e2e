import { Page } from "@playwright/test";

const CONDITION_TIMEOUT = 50;
const MAX_ATTEMPTS = 100;

export const waitForCondition = async (page: Page, fn: () => boolean) => {
    for (let i = 0; i !== MAX_ATTEMPTS; i++) {
        if (fn()) {
            break;
        }
        await page.waitForTimeout(CONDITION_TIMEOUT);
    }
};
