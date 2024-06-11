import { Browser, Page, chromium, expect, test } from "@playwright/test";

import { renderFields } from "../helpers/render-fields";

import TypedField from "../model/TypedField";
import FieldType from "../model/FieldType";

test.describe('Unit', () => {

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
            type: FieldType.Icon,
            testId: 'test-button',
            click: (name, e, data, payload, onValueChange, onChange) => {
                onChange({
                    foo: 'bar',
                });
            },
            isDisabled: ({ disabled }) => !!disabled,
        },
        {
            type: FieldType.Init,
            name: 'foo',
            defaultValue: 'foo',
        },
    ];

    test("Will accept click", async ({ page }) => {
        let dataRef;
        const componentGroup = await renderFields(page, fields, {
            change: (data) => {
                dataRef = data;
            }
        });
        await componentGroup.getByTestId('test-button').getByRole("button").click();
        await expect(dataRef.foo).toEqual('bar');
    });

    test("Will ignore click when disabled", async ({ page }) => {
        let dataRef;
        const componentGroup = await renderFields(page, fields, {
            change: (data) => {
                dataRef = data;
            },
            data: {
                disabled: true,
            }
        });
        const component = await componentGroup.getByTestId('test-button');
        await component.evaluate((e: HTMLElement) => e.click());
        await expect(dataRef).toBeUndefined();
    });

});

test.describe('Integration', () => {

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
            type: FieldType.Icon,
            columns: '3',
        },
        {
            type: FieldType.Icon,
            columns: '3',
        },
        {
            type: FieldType.Icon,
            columns: '3',
        },
        {
            type: FieldType.Icon,
            columns: '3',
        },
        {
            type: FieldType.Icon,
            columns: '3',
        },
        {
            type: FieldType.Icon,
            columns: '3',
        },
        {
            type: FieldType.Icon,
            columns: '3',
        },
        {
            type: FieldType.Icon,
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
