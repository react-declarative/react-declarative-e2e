import { expect, test } from "@playwright/test";

import { waitForReady } from "../helpers/wait-for-ready";
import { renderFields } from "../helpers/render-fields";
import { writeText } from "../helpers/write-text";

import TypedField from "../model/TypedField";
import FieldType from "../model/FieldType";

test.beforeEach(async ({ page }) => {
    await waitForReady(page);
});

test("Will compute value", async ({ page }) => {
    const fields: TypedField[] = [
        {
            type: FieldType.Progress,
            maxPercent: 100,
            testId: 'compute-field',
            compute: ({ text }) => text,
        },
        {
            type: FieldType.Text,
            testId: 'text-field',
            name: 'text',
        },
    ];
    await renderFields(page, fields);
    await writeText(page, 'text-field', "25");
    const progressBar = await page.locator('[aria-valuenow="25"]').all();
    await expect(progressBar).toHaveLength(1);
});

test("Will bind value", async ({ page }) => {
    const fields: TypedField[] = [
        {
            type: FieldType.Progress,
            testId: 'bind-field',
            maxPercent: 100,
            name: "text",
        },
        {
            type: FieldType.Text,
            testId: 'text-field',
            name: 'text',
        },
    ];
    await renderFields(page, fields);
    await writeText(page, 'text-field', "25");
    const progressBar = await page.locator('[aria-valuenow="25"]').all();
    await expect(progressBar).toHaveLength(1);
});

test("Will read value", async ({ page }) => {
    const fields: TypedField[] = [
        {
            type: FieldType.Progress,
            testId: 'bind-field',
            maxPercent: 100,
            name: "text",
        },
    ];
    await renderFields(page, fields, {
        data: {
            text: 25,
        }
    });
    const progressBar = await page.locator('[aria-valuenow="25"]').all();
    await expect(progressBar).toHaveLength(1);
});