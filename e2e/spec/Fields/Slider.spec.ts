import { Browser, Page, chromium, expect, test } from "@playwright/test";

import { renderFields } from "../../helpers/render-fields";
import { writeText } from "../../helpers/write-text";

import TypedField from "../../model/TypedField";
import FieldType from "../../model/FieldType";

test.describe('Unit', { tag: "@fields" }, () => {

    let browser: Browser;
    let page: Page;

    test.beforeAll(async () => {
        browser = await chromium.launch();
    });

    test.beforeEach(async () => {
        page = await browser.newPage();
    });

    test.afterEach(async () => {
        await page.close();
    });

    test.afterAll(async () => {
        await browser.close();
    });

    test.describe.configure({ retries: 3 });

    test("Will compute value", async () => {
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

    test("Will bind value", async () => {
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

    test("Will read value", async () => {
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

    test("Will accept click", async () => {
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


    test("Will write value", async () => {
        const fields: TypedField[] = [
            {
                type: FieldType.Slider,
                testId: 'slider-field',
                maxSlider: 100,
                name: "text",
            },
        ];
        let dataRef;
        const componentGroup = await renderFields(page, fields, {
            change: (data) => {
                dataRef = data;
            },
        });
        await componentGroup.getByTestId('slider-field').click();
        await expect(dataRef.text).toEqual(51);
    });
});


test.describe('Integration', { tag: "@fields" }, () => {

    let browser: Browser;
    let page: Page;

    test.beforeAll(async () => {
        browser = await chromium.launch();
    });

    test.beforeEach(async () => {
        page = await browser.newPage();
    });

    test.afterEach(async () => {
        await page.close();
    });

    test.afterAll(async () => {
        await browser.close();
    });

    test.describe.configure({ retries: 3 });

    const fields: TypedField[] = [
        {
            type: FieldType.Slider,
            compute: () => 75,
            maxSlider: 100,
            columns: '3',
        },
        {
            type: FieldType.Slider,
            compute: () => 75,
            maxSlider: 100,
            columns: '3',
        },
        {
            type: FieldType.Slider,
            compute: () => 75,
            maxSlider: 100,
            columns: '3',
        },
        {
            type: FieldType.Slider,
            compute: () => 75,
            maxSlider: 100,
            columns: '3',
        },
        {
            type: FieldType.Slider,
            compute: () => 75,
            maxSlider: 100,
            columns: '3',
        },
        {
            type: FieldType.Slider,
            compute: () => 75,
            maxSlider: 100,
            columns: '3',
        },
        {
            type: FieldType.Slider,
            compute: () => 75,
            maxSlider: 100,
            columns: '3',
        },
        {
            type: FieldType.Slider,
            compute: () => 75,
            maxSlider: 100,
            columns: '3',
        },
    ];

    test("Will match snapshot", async () => {
        await renderFields(page, fields);
        await expect(page).toHaveScreenshot({
            maxDiffPixels: 100,
        });
    });

});
