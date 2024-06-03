import { Browser, Page, chromium, expect, test } from "@playwright/test";

import { renderFields } from "../helpers/render-fields";

import TypedField from "../model/TypedField";
import FieldType from "../model/FieldType";

test.describe('YesNo', () => {

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
            type: FieldType.YesNo,
            name: 'yesno',
            testId: 'yesno-field',
            dirty: true,
            isReadonly: ({ readonly }) => readonly,
            isDisabled: ({ disabled }) => disabled,
            isInvalid: ({ invalid }) => invalid || null,
        },
    ];

    test("Will show intermediate state", async () => {
        const textField = await renderFields(page, fields, {
            data: {
                yesno: null,
            },
        });
        const inputValue = await textField.getByRole('combobox').inputValue();
        await expect(inputValue).toEqual("");
    });

    test("Will show true state", async () => {
        const textField = await renderFields(page, fields, {
            data: {
                yesno: true,
            },
        });
        const inputValue = await textField.getByRole('combobox').inputValue();
        await expect(inputValue).toEqual("Yes");
    });

    test("Will show false state", async () => {
        const textField = await renderFields(page, fields, {
            data: {
                yesno: false,
            },
        });
        const inputValue = await textField.getByRole('combobox').inputValue();
        await expect(inputValue).toEqual("No");
    });

    test("Will write value", async () => {
        let dataRef;
        const textField = await renderFields(page, fields, {
            change: (data) => {
                dataRef = data;
            },
        });
        await textField.click();
        await page.getByText("Yes", { exact: true }).first().click();
        await expect(dataRef.yesno).toEqual(true);
    });

    test("Will set true state", async () => {
        const textField = await renderFields(page, fields);
        await textField.click();
        await page.getByText("Yes", { exact: true }).first().click();
        const inputValue = await textField.getByRole('combobox').inputValue();
        await expect(inputValue).toEqual("Yes");
    });

    test("Will set false state", async () => {
        const textField = await renderFields(page, fields);
        await textField.click();
        await page.getByText("No", { exact: true }).first().click();
        const inputValue = await textField.getByRole('combobox').inputValue();
        await expect(inputValue).toEqual("No");
    });

    test("Will show invalid message", async () => {
        const componentGroup = await renderFields(page, fields, {
            data: {
                invalid: "Invalid",
            }
        });
        await expect(componentGroup).toContainText('Invalid');
    });

    test("Will show disabled state", async () => {
        const componentGroup = await renderFields(page, fields, {
            data: {
                disabled: true,
            }
        });
        const isDisabled = await componentGroup.getByLabel('Yesno').isDisabled();
        await expect(isDisabled).toBeTruthy();
    });

    test("Will show readonly state", async () => {
        const componentGroup = await renderFields(page, fields, {
            data: {
                readonly: true,
            },
        });
        const isEditable = await componentGroup.getByLabel('Yesno').isEditable();
        await expect(isEditable).toBeFalsy();
    });

});
