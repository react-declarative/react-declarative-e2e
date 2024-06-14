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
        type: FieldType.Time,
        testId: 'time-field',
        dirty: true,
        isInvalid: () => "Invalid",
        name: 'time'
      },
    ];
    const componentGroup = await renderFields(page, fields);
    await expect(componentGroup).toContainText('Invalid');
  });

  test("Will show disabled state", async () => {
    const fields: TypedField[] = [
      {
        type: FieldType.Time,
        testId: 'time-field',
        dirty: true,
        isDisabled: () => true,
        name: 'time'
      },
    ];
    const componentGroup = await renderFields(page, fields);
    const isDisabled = await componentGroup.getByLabel('Time').isDisabled();
    await expect(isDisabled).toBeTruthy();
  });

  test("Will show readonly state", async () => {
    const fields: TypedField[] = [
      {
        type: FieldType.Time,
        testId: 'time-field',
        dirty: true,
        isReadonly: () => true,
        name: 'time'
      },
    ];
    const componentGroup = await renderFields(page, fields);
    const isEditable = await componentGroup.getByLabel('Time').isEditable();
    await expect(isEditable).toBeFalsy();
  });

  test("Will read value", async () => {
    const fields: TypedField[] = [
      {
        type: FieldType.Time,
        testId: 'time-field',
        name: 'time'
      },
    ];
    const componentGroup = await renderFields(page, fields, {
      data: {
        time: "13:37",
      },
    });
    const inputValue = await componentGroup.getByTestId('time-field').getByRole('textbox').inputValue();
    await expect(inputValue).toContain('13:37');
  });

  test("Will compute value", async () => {
    const fields: TypedField[] = [
      {
        type: FieldType.Time,
        testId: 'time-field',
        name: 'time',
        compute: () => "13:37",
      },
    ];
    const componentGroup = await renderFields(page, fields);
    const inputValue = await componentGroup.getByTestId('time-field').getByRole('textbox').inputValue();
    await expect(inputValue).toContain('13:37');
  });

  test("Will type value", async () => {
    const fields: TypedField[] = [
      {
        type: FieldType.Time,
        testId: 'time-field',
        name: 'time',
      },
    ];
    let dataRef;
    const componentGroup = await renderFields(page, fields, {
      change: (data) => {
        dataRef = data;
      }
    });
    const timeField = await componentGroup.getByTestId('time-field');
    await timeField.click();
    await page.keyboard.insertText("1337");
    await timeField.blur();
    await page.waitForTimeout(1000);
    await expect(dataRef.time).toContain('13:37');
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
      type: FieldType.Time,
      compute: () => "13:37",
      name: 'time',
      columns: '3',
    },
    {
      type: FieldType.Time,
      compute: () => "13:37",
      name: 'time',
      columns: '3',
    },
    {
      type: FieldType.Time,
      compute: () => "13:37",
      name: 'time',
      columns: '3',
    },
    {
      type: FieldType.Time,
      compute: () => "13:37",
      name: 'time',
      columns: '3',
    },
    {
      type: FieldType.Time,
      compute: () => "13:37",
      name: 'time',
      columns: '3',
    },
    {
      type: FieldType.Time,
      compute: () => "13:37",
      name: 'time',
      columns: '3',
    },
    {
      type: FieldType.Time,
      compute: () => "13:37",
      name: 'time',
      columns: '3',
    },
    {
      type: FieldType.Time,
      compute: () => "13:37",
      name: 'time',
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
