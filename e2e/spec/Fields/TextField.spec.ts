import { Browser, Page, chromium, expect, test } from "@playwright/test";

import { waitForCondition } from "../../helpers/wait-for-condition";
import { renderFields } from "../../helpers/render-fields";
import { writeText } from "../../helpers/write-text";

import TypedField from "../../model/TypedField";
import FieldType from "../../model/FieldType";

declare function isNaN(number: any): boolean;

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

  test("Will write text", async () => {
    const fields: TypedField[] = [
      {
        type: FieldType.Text,
        testId: 'text-field',
        name: 'text',
      },
    ];
    let dataRef;
    const componentGroup = await renderFields(page, fields, {
      change: (data) => {
        dataRef = data;
      },
    });
    await writeText(page, 'text-field', "Hello world");
    await expect(dataRef.text).toEqual('Hello world');
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

  test("Will allow only reqexp", async () => {
    const fields: TypedField[] = [
      {
        type: FieldType.Text,
        testId: 'text-field',
        inputFormatterSymbol: '0',
        inputFormatterAllowed: (char) => !isNaN(char),
        inputFormatterTemplate: "000000000000000",
        name: 'date',
      },
    ];
    const componentGroup = await renderFields(page, fields);
    await writeText(page, 'text-field', "123abc123");
    const textField = await componentGroup.getByTestId('text-field');
    const inputValue = await textField.getByRole('textbox').inputValue();
    await expect(inputValue).toEqual('123123');
  });

  
  test("Will keep template order", async () => {
    const fields: TypedField[] = [
      {
        type: FieldType.Text,
        testId: 'text-field',
        inputFormatterSymbol: '0',
        inputFormatterAllowed: (char) => !isNaN(char),
        inputFormatterTemplate: "#00 00 00",
        name: 'date',
      },
    ];
    const componentGroup = await renderFields(page, fields);
    await writeText(page, 'text-field', "123456");
    const input = await page.getByTestId('text-field');
    await input.click();
    await page.keyboard.press("ArrowLeft");
    await page.keyboard.press("ArrowLeft");
    await page.keyboard.press("ArrowLeft");
    await page.keyboard.press("ArrowLeft");
    await page.keyboard.type("789")
    const textField = await componentGroup.getByTestId('text-field');
    const inputValue = await textField.getByRole('textbox').inputValue();
    await expect(inputValue).toEqual('#12 37 89');
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

  test("Will emit callback on invalid", async () => {
    const fields: TypedField[] = [
      {
        name: 'email',
        type: FieldType.Text,
        testId: 'text-field',
        outlined: true,
        isInvalid: ({ email }) => {
          const expr = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
          if (!expr.test(email)) {
            return 'Invalid email address provided';
          }
          else {
            return null;
          }
        },
        title: 'Email',
        description: 'tripolskypetr@gmail.com',
      },
    ];
    let dataRef;
    const componentGroup = await renderFields(page, fields, {
      change: (data) => {
        dataRef = data;
      },
      invalid: () => {
        dataRef = null;
      },
    });
    await writeText(page, 'text-field', "tripolskypetr@gmail.com");
    await waitForCondition(page, () => {
      return dataRef !== undefined;
    });
    await expect(dataRef).toBeTruthy();
    await writeText(page, 'text-field', "tripolskypetrgmail.com");
    await expect(componentGroup).toContainText('Invalid email address provided');
    await expect(dataRef).toEqual(null);
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
          type: FieldType.Text,
          name: 'text',
          defaultValue: 'Hello world',
          columns: '3',
      },
      {
          type: FieldType.Text,
          name: 'text',
          defaultValue: 'Hello world',
          columns: '3',
      },
      {
          type: FieldType.Text,
          name: 'text',
          defaultValue: 'Hello world',
          columns: '3',
      },
      {
          type: FieldType.Text,
          name: 'text',
          defaultValue: 'Hello world',
          columns: '3',
      },
      {
          type: FieldType.Text,
          name: 'text',
          defaultValue: 'Hello world',
          columns: '3',
      },
      {
          type: FieldType.Text,
          name: 'text',
          defaultValue: 'Hello world',
          columns: '3',
      },
      {
          type: FieldType.Text,
          name: 'text',
          defaultValue: 'Hello world',
          columns: '3',
      },
      {
          type: FieldType.Text,
          name: 'text',
          defaultValue: 'Hello world',
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

