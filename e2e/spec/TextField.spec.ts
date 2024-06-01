import { expect, test } from "@playwright/test";

import { waitForReady } from "../helpers/wait-for-ready";
import { renderFields } from "../helpers/render-fields";
import { writeText } from "../helpers/write-text";

import TypedField from "../model/TypedField";
import FieldType from "../model/FieldType";

test.beforeEach(async ({ page }) => {
  await waitForReady(page);
});

test("Will render default value", async ({ page }) => {
  const fields: TypedField[] = [
    {
      type: FieldType.Text,
      testId: 'text-field',
      name: 'text',
      title: 'Text field',
      defaultValue: 'Hello world'
    },
  ];
  const componentGroup = await renderFields(page, fields);
  const textField = await componentGroup.getByTestId('text-field');
  const inputValue = await textField.getByRole('textbox').inputValue();
  await expect(inputValue).toEqual('Hello world');
});

test("Will change text", async ({ page }) => {
  const fields: TypedField[] = [
    {
      type: FieldType.Text,
      testId: 'text-field',
      name: 'text',
    },
  ];
  const componentGroup = await renderFields(page, fields);
  await writeText(page, 'text-field', "Hello world");
  const textField = await componentGroup.getByTestId('text-field');
  const inputValue = await textField.getByRole('textbox').inputValue();
  await expect(inputValue).toEqual('Hello world');
});

test("Will format text by template", async ({ page }) => {
  const fields: TypedField[] = [
    {
      type: FieldType.Text,
      testId: 'text-field',
      inputFormatterSymbol: '0',
      inputFormatterTemplate: '00/00/0000',
      name: 'date',
    },
  ];
  const componentGroup = await renderFields(page, fields);
  await writeText(page, 'text-field', "01011970");
  const textField = await componentGroup.getByTestId('text-field');
  const inputValue = await textField.getByRole('textbox').inputValue();
  await expect(inputValue).toEqual('01/01/1970');
});

test("Will skip leading symbols if equal to template", async ({ page }) => {
  const fields: TypedField[] = [
    {
      type: FieldType.Text,
      testId: 'text-field',
      inputFormatterSymbol: '0',
      inputFormatterTemplate: '+7(999)000-00-00',
      name: 'date',
    },
  ];
  const componentGroup = await renderFields(page, fields);
  await writeText(page, 'text-field', "+79996735658");
  const textField = await componentGroup.getByTestId('text-field');
  const inputValue = await textField.getByRole('textbox').inputValue();
  await expect(inputValue).toEqual('+7(999)673-56-58');
});

test("Will add leading symbols if not equal to template", async ({ page }) => {
  const fields: TypedField[] = [
    {
      type: FieldType.Text,
      testId: 'text-field',
      inputFormatterSymbol: '0',
      inputFormatterTemplate: '+7(999)000-00-00',
      name: 'date',
    },
  ];
  const componentGroup = await renderFields(page, fields);
  await writeText(page, 'text-field', "6735658");
  const textField = await componentGroup.getByTestId('text-field');
  const inputValue = await textField.getByRole('textbox').inputValue();
  await expect(inputValue).toEqual('+7(999)673-56-58');
});


test("Will compute value", async ({ page }) => {
  const fields: TypedField[] = [
    {
      type: FieldType.Text,
      testId: 'compute-field',
      compute: ({ text }) => text,
    },
    {
      type: FieldType.Text,
      testId: 'text-field',
      name: 'text',
    },
  ];
  const componentGroup = await renderFields(page, fields);
  await writeText(page, 'text-field', "Hello world");
  const textField = await componentGroup.getByTestId('compute-field');
  const inputValue = await textField.getByRole('textbox').inputValue();
  await expect(inputValue).toEqual('Hello world');
});

test("Will bind value", async ({ page }) => {
  const fields: TypedField[] = [
    {
      type: FieldType.Text,
      testId: 'bind-field',
      name: "text",
    },
    {
      type: FieldType.Text,
      testId: 'text-field',
      name: 'text',
    },
  ];
  const componentGroup = await renderFields(page, fields);
  await writeText(page, 'text-field', "Hello world");
  const textField = await componentGroup.getByTestId('bind-field');
  const inputValue = await textField.getByRole('textbox').inputValue();
  await expect(inputValue).toEqual('Hello world');
});

test("Will validate value", async ({ page }) => {
  const fields: TypedField[] = [
    {
      type: FieldType.Text,
      testId: 'text-field',
      isInvalid: ({ text }) => {
        if (text === "Hello world") {
          return "Value not allowed";
        }
        return null;
      },
      name: "text",
    },
  ];
  const componentGroup = await renderFields(page, fields);
  await writeText(page, 'text-field', "Hello world");
  await expect(componentGroup).toContainText('Value not allowed');
});

test("Will hide by condition", async ({ page }) => {
  const fields: TypedField[] = [
    {
      type: FieldType.Text,
      testId: 'text-field',
      isVisible: ({ text }) => {
        if (text === "Hello world") {
          return false;
        }
        return true;
      },
      name: "text",
    },
  ];
  const componentGroup = await renderFields(page, fields);
  await writeText(page, 'text-field', "Hello world");
  const isVisible = await componentGroup.getByTestId('text-field').isVisible();
  await expect(isVisible).toBeFalsy();
});

test("Will disable by condition", async ({ page }) => {
  const fields: TypedField[] = [
    {
      type: FieldType.Text,
      testId: 'text-field',
      isDisabled: ({ text }) => {
        if (text === "Hello world") {
          return true;
        }
        return false;
      },
      name: "text",
    },
  ];
  const componentGroup = await renderFields(page, fields);
  await writeText(page, 'text-field', "Hello world");
  const isDisabled = await componentGroup.getByTestId('text-field').getByRole('textbox').isDisabled();
  await expect(isDisabled).toBeTruthy();
});
