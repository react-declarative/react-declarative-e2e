import { expect, test } from "@playwright/test";

import { waitForReady } from "../helpers/wait-for-ready";
import { renderFields } from "../helpers/render-fields";

import TypedField from "../model/TypedField";
import FieldType from "../model/FieldType";

test.beforeEach(async ({ page }) => {
    await waitForReady(page);
});

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

test("Will show intermediate state", async ({ page }) => {
    const textField = await renderFields(page, fields, {
        data: {
            yesno: null,
        },
    });
    const inputValue = await textField.getByRole('combobox').inputValue();
    await expect(inputValue).toEqual("");
});

test("Will show true state", async ({ page }) => {
    const textField = await renderFields(page, fields, {
        data: {
            yesno: true,
        },
    });
    const inputValue = await textField.getByRole('combobox').inputValue();
    await expect(inputValue).toEqual("Yes");
});

test("Will show false state", async ({ page }) => {
    const textField = await renderFields(page, fields, {
        data: {
            yesno: false,
        },
    });
    const inputValue = await textField.getByRole('combobox').inputValue();
    await expect(inputValue).toEqual("No");
});

test("Will set true state", async ({ page }) => {
    const textField = await renderFields(page, fields);
    await textField.click();
    await page.getByLabel("Yes").last().click();
    const inputValue = await textField.getByRole('combobox').inputValue();
    await expect(inputValue).toEqual("Yes");
});

test("Will set false state", async ({ page }) => {
    const textField = await renderFields(page, fields);
    await textField.click();
    await page.getByLabel("No").last().click();
    const inputValue = await textField.getByRole('combobox').inputValue();
    await expect(inputValue).toEqual("No");
});

test("Will show invalid message", async ({ page }) => {
    const componentGroup = await renderFields(page, fields, {
        data: {
            invalid: "Invalid",
        }
    });
    await expect(componentGroup).toContainText('Invalid');
});

test("Will show disabled state", async ({ page }) => {
    const componentGroup = await renderFields(page, fields, {
        data: {
            disabled: true,
        }
    });
    const isDisabled = await componentGroup.getByLabel('Yesno').isDisabled();
    await expect(isDisabled).toBeTruthy();
});

test("Will show readonly state", async ({ page }) => {
    const componentGroup = await renderFields(page, fields, {
        data: {
            readonly: true,
        },
    });
    const isEditable = await componentGroup.getByLabel('Yesno').isEditable();
    await expect(isEditable).toBeFalsy();
});
