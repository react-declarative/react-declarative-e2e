import { Browser, Page, chromium, expect, test } from "@playwright/test";

import { renderFields } from "../../helpers/render-fields";

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

  test("Will show invalid message", async () => {
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

  test("Will show disabled state", async () => {
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

  test("Will show readonly state", async () => {
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

  test("Will read value", async () => {
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

  test("Will compute value", async () => {
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

  test("Will translate value", async () => {
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
    await componentGroup.getByTestId('choose-field').getByRole('button').click();
    const inputValue = await componentGroup.getByTestId('choose-field').getByRole('combobox').inputValue();
    await expect(inputValue).toContain('Hello world');
  });

  test("Will write value", async () => {
    const fields: TypedField[] = [
      {
        type: FieldType.Choose,
        testId: 'choose-field',
        name: 'choose',
        choose: () => "Hello world",
      },
    ];
    let dataRef;
    const componentGroup = await renderFields(page, fields, {
      change: (data) => {
        dataRef = data;
      },
    });
    await componentGroup.getByTestId('choose-field').getByRole('button').click();
    await expect(dataRef.choose).toEqual("Hello world");
  });

  test("Will deselect value", async () => {
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
    await componentGroup.getByTestId('choose-field').getByRole('button').click();
    const inputValue = await componentGroup.getByTestId('choose-field').getByRole('combobox').inputValue();
    await expect(inputValue).toContain('');
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
      type: FieldType.Choose,
      compute: () => "Hello world",
      name: 'choose',
      columns: '3',
    },
    {
      type: FieldType.Choose,
      compute: () => "Hello world",
      name: 'choose',
      columns: '3',
    },
    {
      type: FieldType.Choose,
      compute: () => "Hello world",
      name: 'choose',
      columns: '3',
    },
    {
      type: FieldType.Choose,
      compute: () => "Hello world",
      name: 'choose',
      columns: '3',
    },
    {
      type: FieldType.Choose,
      compute: () => "Hello world",
      name: 'choose',
      columns: '3',
    },
    {
      type: FieldType.Choose,
      compute: () => "Hello world",
      name: 'choose',
      columns: '3',
    },
    {
      type: FieldType.Choose,
      compute: () => "Hello world",
      name: 'choose',
      columns: '3',
    },
    {
      type: FieldType.Choose,
      compute: () => "Hello world",
      name: 'choose',
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
