import { chromium, expect, test } from "@playwright/test";

import { renderFields } from "../helpers/render-fields";
import { writeText } from "../helpers/write-text";

import TypedField from "../model/TypedField";
import FieldType from "../model/FieldType";

test.describe('Text', () => {

  let browser;
  let page;

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

  test("Will render default value", async () => {
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

  test("Will change text", async () => {
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

  test("Will format text by template", async () => {
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

  test("Will skip leading symbols if equal to template", async () => {
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

  test("Will add leading symbols if not equal to template", async () => {
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


  test("Will compute value", async () => {
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

  test("Will bind value", async () => {
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

  test("Will validate value", async () => {
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

  test("Will hide by condition", async () => {
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

  test("Will disable by condition", async () => {
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

  test("Will validate required", async () => {
    const fields: TypedField[] = [
      {
        type: FieldType.Text,
        testId: 'text-field',
        validation: {
          required: true,
        },
        name: "text",
      },
    ];
    const componentGroup = await renderFields(page, fields);
    await componentGroup.getByTestId('text-field').click();
    await expect(componentGroup).toContainText('Required');
  });

  test("Will validate min length", async () => {
    const fields: TypedField[] = [
      {
        type: FieldType.Text,
        testId: 'text-field',
        validation: {
          minLength: 5,
        },
        name: "text",
      },
    ];
    const componentGroup = await renderFields(page, fields);
    await writeText(page, 'text-field', "1234");
    await expect(componentGroup).toContainText('Minimum length reached');
  });


  test("Will validate max length", async () => {
    const fields: TypedField[] = [
      {
        type: FieldType.Text,
        testId: 'text-field',
        validation: {
          maxLength: 5,
        },
        name: "text",
      },
    ];
    const componentGroup = await renderFields(page, fields);
    await writeText(page, 'text-field', "123456");
    await expect(componentGroup).toContainText('Maximum length reached');
  });

  test("Will validate min numeric value", async () => {
    const fields: TypedField[] = [
      {
        type: FieldType.Text,
        testId: 'text-field',
        validation: {
          minNum: 5,
        },
        name: "text",
      },
    ];
    const componentGroup = await renderFields(page, fields);
    await writeText(page, 'text-field', "4");
    await expect(componentGroup).toContainText('Minimum value reached');
  });


  test("Will validate max numeric value", async () => {
    const fields: TypedField[] = [
      {
        type: FieldType.Text,
        testId: 'text-field',
        validation: {
          maxNum: 5,
        },
        name: "text",
      },
    ];
    const componentGroup = await renderFields(page, fields);
    await writeText(page, 'text-field', "6");
    await expect(componentGroup).toContainText('Maximum value reached');
  });

  test("Will validate numeric", async () => {
    const fields: TypedField[] = [
      {
        type: FieldType.Text,
        testId: 'text-field',
        validation: {
          numeric: true,
        },
        name: "text",
      },
    ];
    const componentGroup = await renderFields(page, fields);
    await writeText(page, 'text-field', "Hello wolrd");
    await expect(componentGroup).toContainText('Must be a number');
  });

  test("Will show disabled state", async () => {
    const fields: TypedField[] = [
      {
        type: FieldType.Text,
        testId: 'text-field',
        dirty: true,
        isDisabled: () => true,
        name: 'text'
      },
    ];
    const componentGroup = await renderFields(page, fields);
    const isDisabled = await componentGroup.getByLabel('Text').isDisabled();
    await expect(isDisabled).toBeTruthy();
  });

  test("Will show readonly state", async () => {
    const fields: TypedField[] = [
      {
        type: FieldType.Text,
        testId: 'text-field',
        dirty: true,
        isReadonly: () => true,
        name: 'text'
      },
    ];
    const componentGroup = await renderFields(page, fields);
    const isEditable = await componentGroup.getByLabel('Text').isEditable();
    await expect(isEditable).toBeFalsy();
  });

  test("Will read value", async () => {
    const fields: TypedField[] = [
      {
        type: FieldType.Text,
        testId: 'text-field',
        name: 'text'
      },
    ];
    const componentGroup = await renderFields(page, fields, {
      data: {
        text: "Hello world",
      },
    });
    const inputValue = await componentGroup.getByRole('textbox').inputValue();
    await expect(inputValue).toContain('Hello world');
  });

});
