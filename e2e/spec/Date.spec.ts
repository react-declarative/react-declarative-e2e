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

  test("Will show invalid message", async () => {
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

  test("Will show disabled state", async () => {
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

  test("Will show readonly state", async () => {
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

  test("Will read value", async () => {
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

  test("Will compute value", async () => {
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

  test("Will type value", async () => {
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
      type: FieldType.Date,
      compute: () => "01/01/1970",
      name: 'date',
      columns: '3',
    },
    {
      type: FieldType.Date,
      compute: () => "01/01/1970",
      name: 'date',
      columns: '3',
    },
    {
      type: FieldType.Date,
      compute: () => "01/01/1970",
      name: 'date',
      columns: '3',
    },
    {
      type: FieldType.Date,
      compute: () => "01/01/1970",
      name: 'date',
      columns: '3',
    },
    {
      type: FieldType.Date,
      compute: () => "01/01/1970",
      name: 'date',
      columns: '3',
    },
    {
      type: FieldType.Date,
      compute: () => "01/01/1970",
      name: 'date',
      columns: '3',
    },
    {
      type: FieldType.Date,
      compute: () => "01/01/1970",
      name: 'date',
      columns: '3',
    },
    {
      type: FieldType.Date,
      compute: () => "01/01/1970",
      name: 'date',
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
