import { Page } from "@playwright/test";

/**
 * @type {import("react-declarative").OneConfig}
 */
const TOTAL_DELAY = 800;

/**
 * @type {import("react-declarative").OneConfig}
 */
const CORD_STEPS = 10;

const cords: [number, number][] = [
    [0, 0],
    [0, 100],
    [100, 100],
    [100, 0],
    [0, 0],
];

const STEP_DELAY = TOTAL_DELAY / cords.length;

export const moveMouse = async (page: Page) => {
    for (const cord of cords) {
        await page.mouse.move(...cord, { steps: CORD_STEPS });
        await page.waitForTimeout(STEP_DELAY);
    }
}
