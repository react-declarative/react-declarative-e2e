import { expect, test } from "@playwright/test";

import { waitForReady } from "../helpers/wait-for-ready";
import { renderFields } from "../helpers/render-fields";

import TypedField from "../model/TypedField";
import FieldType from "../model/FieldType";

test.beforeEach(async ({ page }) => {
  await waitForReady(page);
});

test("Will show invalid message", async ({ page }) => {
  const fields: TypedField[] = [
    {
      type: FieldType.Choose,
      testId: 'choose-field',
      dirty: true,
      isInvalid: () => "Invalid",
      name: 'choose'
    },
  ];
  const componentGroup = await renderFields(page, fields);
  await expect(componentGroup).toContainText('Invalid');
});

test("Will show disabled state", async ({ page }) => {
  const fields: TypedField[] = [
    {
      type: FieldType.Choose,
      testId: 'choose-field',
      dirty: true,
      isDisabled: () => true,
      name: 'choose'
    },
  ];
  const componentGroup = await renderFields(page, fields);
  const isDisabled = await componentGroup.getByLabel('Choose').isDisabled();
  await expect(isDisabled).toBeTruthy();
});

test("Will show readonly state", async ({ page }) => {
  const fields: TypedField[] = [
    {
      type: FieldType.Choose,
      testId: 'choose-field',
      dirty: true,
      isReadonly: () => true,
      name: 'choose'
    },
  ];
  const componentGroup = await renderFields(page, fields);
  const isEditable = await componentGroup.getByLabel('Choose').isEditable();
  await expect(isEditable).toBeFalsy();
});

test("Will read value", async ({ page }) => {
  const fields: TypedField[] = [
    {
      type: FieldType.Choose,
      testId: 'choose-field',
      name: 'choose'
    },
  ];
  const componentGroup = await renderFields(page, fields, {
    data: {
      choose: "Hello world",
    },
  });
  const inputValue = await componentGroup.getByTestId('choose-field').getByRole('combobox').inputValue();
  await expect(inputValue).toContain('Hello world');
});

test("Will compute value", async ({ page }) => {
  const fields: TypedField[] = [
    {
      type: FieldType.Choose,
      testId: 'choose-field',
      name: 'choose',
      compute: () => "Hello world",
    },
  ];
  const componentGroup = await renderFields(page, fields);
  const inputValue = await componentGroup.getByTestId('choose-field').getByRole('combobox').inputValue();
  await expect(inputValue).toContain('Hello world');
});

test("Will translate value", async ({ page }) => {
  const fields: TypedField[] = [
    {
      type: FieldType.Choose,
      testId: 'choose-field',
      name: 'choose',
      choose: () => "some-id",
      tr: (value) => {
        if (value === "some-id") {
          return "Hello world"
        }
        return "";
      }
    },
  ];
  const componentGroup = await renderFields(page, fields);
  await componentGroup.getByTestId('choose-field').getByText('Choose').click();
  const inputValue = await componentGroup.getByTestId('choose-field').getByRole('combobox').inputValue();
  await expect(inputValue).toContain('Hello world');
});


test("Will deselect value", async ({ page }) => {
  const fields: TypedField[] = [
    {
      type: FieldType.Choose,
      testId: 'choose-field',
      name: 'choose'
    },
  ];
  const componentGroup = await renderFields(page, fields, {
    data: {
      choose: "Hello world",
    },
  });
  await componentGroup.getByTestId('choose-field').getByText('Deselect').click();
  const inputValue = await componentGroup.getByTestId('choose-field').getByRole('combobox').inputValue();
  await expect(inputValue).toContain('');
});
