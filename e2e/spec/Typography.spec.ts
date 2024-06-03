import { Browser, Page, chromium, expect, test } from "@playwright/test";

import { renderFields } from "../helpers/render-fields";
import { writeText } from "../helpers/write-text";

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

  test("Will render placeholder", async ({ page }) => {
    const fields: TypedField[] = [
      {
        type: FieldType.Typography,
        placeholder: 'Hello world',
      },
    ];
    const componentGroup = await renderFields(page, fields);
    await expect(componentGroup).toContainText('Hello world');
  });

  test("Will render compute", async ({ page }) => {
    const fields: TypedField[] = [
      {
        type: FieldType.Typography,
        testId: 'typography-field',
        compute: ({ text }) => text,
      },
      {
        type: FieldType.Text,
        testId: 'text-field',
        name: 'text',
      }
    ];
    const componentGroup = await renderFields(page, fields);
    await writeText(page, 'text-field', "Hello world");
    const targetField = await componentGroup.getByTestId('typography-field');
    expect(targetField).toContainText('Hello world');
  });

  test("Will bind value", async ({ page }) => {
    const fields: TypedField[] = [
      {
        type: FieldType.Typography,
        name: 'text',
        testId: 'typography-field',
      },
      {
        type: FieldType.Text,
        testId: 'text-field',
        name: 'text',
      }
    ];
    const componentGroup = await renderFields(page, fields);
    await writeText(page, 'text-field', "Hello world");
    const targetField = await componentGroup.getByTestId('typography-field');
    expect(targetField).toContainText('Hello world');
  });


  test("Will read value", async ({ page }) => {
    const fields: TypedField[] = [
      {
        type: FieldType.Typography,
        name: 'text',
        testId: 'typography-field',
      },
    ];
    const componentGroup = await renderFields(page, fields, {
      data: {
        text: "Hello world"
      }
    });
    const targetField = await componentGroup.getByTestId('typography-field');
    expect(targetField).toContainText('Hello world');
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
      type: FieldType.Typography,
      placeholder: "Hello world",
      columns: '3',
    },
    {
      type: FieldType.Typography,
      placeholder: "Hello world",
      columns: '3',
    },
    {
      type: FieldType.Typography,
      placeholder: "Hello world",
      columns: '3',
    },
    {
      type: FieldType.Typography,
      placeholder: "Hello world",
      columns: '3',
    },
    {
      type: FieldType.Typography,
      placeholder: "Hello world",
      columns: '3',
    },
    {
      type: FieldType.Typography,
      placeholder: "Hello world",
      columns: '3',
    },
    {
      type: FieldType.Typography,
      placeholder: "Hello world",
      columns: '3',
    },
    {
      type: FieldType.Typography,
      placeholder: "Hello world",
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
