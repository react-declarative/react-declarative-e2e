import { expect, test } from "@playwright/test";

import { waitForReady } from "../helpers/wait-for-ready";
import { renderFields } from "../helpers/render-fields";
import { writeText } from "../helpers/write-text";

import TypedField from "../model/TypedField";
import FieldType from "../model/FieldType";

test.beforeEach(async ({ page }) => {
  await waitForReady(page);
});

test("Will show invalid message", async ({ page }) => {
  const fields: TypedField[] = [
    {
      type: FieldType.Date,
      testId: 'date-field',
      dirty: true,
      isInvalid: () => "Invalid",
      name: 'date'
    },
  ];
  const componentGroup = await renderFields(page, fields);
  await expect(componentGroup).toContainText('Invalid');
});

test("Will show disabled state", async ({ page }) => {
  const fields: TypedField[] = [
    {
      type: FieldType.Date,
      testId: 'date-field',
      dirty: true,
      isDisabled: () => true,
      name: 'date'
    },
  ];
  const componentGroup = await renderFields(page, fields);
  const isDisabled = await componentGroup.getByLabel('Date').isDisabled();
  await expect(isDisabled).toBeTruthy();
});

test("Will show readonly state", async ({ page }) => {
  const fields: TypedField[] = [
    {
      type: FieldType.Date,
      testId: 'date-field',
      dirty: true,
      isReadonly: () => true,
      name: 'date'
    },
  ];
  const componentGroup = await renderFields(page, fields);
  const isEditable = await componentGroup.getByLabel('Date').isEditable();
  await expect(isEditable).toBeFalsy();
});

test("Will read value", async ({ page }) => {
  const fields: TypedField[] = [
    {
      type: FieldType.Date,
      testId: 'date-field',
      name: 'date'
    },
  ];
  const componentGroup = await renderFields(page, fields, {
    data: {
      date: "01/01/1970",
    },
  });
  const inputValue = await componentGroup.getByTestId('date-field').getByRole('textbox').inputValue();
  await expect(inputValue).toContain('01/01/1970');
});

test("Will compute value", async ({ page }) => {
  const fields: TypedField[] = [
    {
      type: FieldType.Date,
      testId: 'date-field',
      name: 'date',
      compute: () => "01/01/1970",
    },
  ];
  const componentGroup = await renderFields(page, fields);
  const inputValue = await componentGroup.getByTestId('date-field').getByRole('textbox').inputValue();
  await expect(inputValue).toContain('01/01/1970');
});

test("Will type value", async ({ page }) => {
  const fields: TypedField[] = [
    {
      type: FieldType.Date,
      testId: 'date-field',
      name: 'date',
    },
  ];
  let dataRef;
  const componentGroup = await renderFields(page, fields, {
    change: (data) => {
      dataRef = data;
    }
  });
  const dateField = await componentGroup.getByTestId('date-field');
  await dateField.click();
  await page.keyboard.insertText("01011970");
  await dateField.blur();
  await page.waitForTimeout(1000);
  await expect(dataRef.date).toContain('01/01/1970');
});
