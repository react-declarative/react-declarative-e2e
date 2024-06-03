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

    const CHILDREN_LABEL = "Children label";

    const fields: TypedField[] = [
        {
            type: FieldType.Typography,
            placeholder: 'Fragment testbed',
        },
        {
            type: FieldType.Fragment,
            isVisible: ({ visible }) => visible,
            child: {
                type: FieldType.Typography,
                placeholder: CHILDREN_LABEL,
            },
        }
    ];

    test("Will render visible state", async () => {
        const componentGroup = await renderFields(page, fields, {
            data: {
                visible: true,
            }
        });
        const component = await componentGroup.getByText(CHILDREN_LABEL);
        const isVisible = await component.isVisible();
        await expect(isVisible).toBeTruthy();
    });

    test("Will render hidden state", async () => {
        const componentGroup = await renderFields(page, fields, {
            data: {
                visible: false,
            }
        });
        const component = await componentGroup.getByText(CHILDREN_LABEL);
        const isVisible = await component.isVisible();
        await expect(isVisible).toBeFalsy();
    });

});
