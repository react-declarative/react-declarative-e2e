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
            type: FieldType.Slider,
            maxSlider: 100,
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
    const sliderBar = await page.locator('[aria-valuenow="25"]').all();
    await expect(sliderBar).toHaveLength(1);
});

test("Will bind value", async ({ page }) => {
    const fields: TypedField[] = [
        {
            type: FieldType.Slider,
            testId: 'bind-field',
            maxSlider: 100,
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
    const sliderBar = await page.locator('[aria-valuenow="25"]').all();
    await expect(sliderBar).toHaveLength(1);
});

test("Will read value", async ({ page }) => {
    const fields: TypedField[] = [
        {
            type: FieldType.Slider,
            testId: 'bind-field',
            maxSlider: 100,
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

test("Will accept click", async ({ page }) => {
    const fields: TypedField[] = [
        {
            type: FieldType.Slider,
            testId: 'slider-field',
            maxSlider: 100,
            name: "text",
        },
    ];
    const componentGroup = await renderFields(page, fields, {
        data: {
            text: 25,
        }
    });
    await componentGroup.getByTestId('slider-field').click();
    const sliderBar = await page.locator('[aria-valuenow="51"]').all();
    await expect(sliderBar).toHaveLength(1);
});