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

  test("Will accept freeSolo", async () => {
    const fields: TypedField[] = [
      {
        type: FieldType.Items,
        testId: 'items-field',
        freeSolo: true,
        name: 'items'
      },
    ];
    let dataRef: Record<string, unknown> = {};
    const componentGroup = await renderFields(page, fields, {
      change: (data) => dataRef = data,
    });
    await componentGroup.getByTestId('items-field').click();
    await page.keyboard.insertText("Hello world");
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);
    await expect(dataRef.items).toEqual(expect.arrayContaining(['Hello world']));
  });

  test("Will accept selection", async () => {
    const fields: TypedField[] = [
      {
        type: FieldType.Items,
        testId: 'items-field',
        itemList: [
          "Foo",
          "Bar",
          "Baz",
        ],
        name: 'items'
      },
    ];
    let dataRef: Record<string, unknown> = {};
    const componentGroup = await renderFields(page, fields, {
      change: (data) => dataRef = data,
    });
    await componentGroup.getByTestId('items-field').click();
    await page.getByText("Foo").click();
    await page.getByText("Bar").click();
    await page.waitForTimeout(1000);
    await expect(dataRef.items).toEqual(expect.arrayContaining(['Foo', 'Bar']));
  });

  test("Will translate labels", async () => {
    const fields: TypedField[] = [
      {
        type: FieldType.Items,
        testId: 'items-field',
        itemList: [
          "foo-id",
          "bar-id",
          "baz-id",
        ],
        tr: (value) => {
          const valueMap = {
            "foo-id": "Foo",
            "bar-id": "Bar",
            "baz-id": "Baz",
          };
          return valueMap[value] ?? value;
        },
        name: 'items'
      },
    ];
    let dataRef: Record<string, unknown> = {};
    const componentGroup = await renderFields(page, fields, {
      change: (data) => dataRef = data,
    });
    await componentGroup.getByTestId('items-field').click();
    const text = await page.textContent('*');
    await page.waitForTimeout(1000);
    await expect(text).toContain('Foo');
  });

  test("Will show invalid message", async () => {
    const fields: TypedField[] = [
      {
        type: FieldType.Items,
        testId: 'items-field',
        dirty: true,
        isInvalid: () => "Invalid",
        name: 'items'
      },
    ];
    const componentGroup = await renderFields(page, fields);
    await expect(componentGroup).toContainText('Invalid');
  });

  test("Will show disabled state", async () => {
    const fields: TypedField[] = [
      {
        type: FieldType.Items,
        testId: 'items-field',
        dirty: true,
        isDisabled: () => true,
        name: 'items'
      },
    ];
    const componentGroup = await renderFields(page, fields);
    const isDisabled = await componentGroup.getByLabel('Items').isDisabled();
    await expect(isDisabled).toBeTruthy();
  });

  test("Will show readonly state", async () => {
    const fields: TypedField[] = [
      {
        type: FieldType.Items,
        testId: 'items-field',
        dirty: true,
        isReadonly: () => true,
        name: 'items'
      },
    ];
    const componentGroup = await renderFields(page, fields);
    const isEditable = await componentGroup.getByLabel('Items').isEditable();
    await expect(isEditable).toBeFalsy();
  });

  test("Will read value", async () => {
    const fields: TypedField[] = [
      {
        type: FieldType.Items,
        freeSolo: true,
        testId: 'items-field',
        name: 'items'
      },
    ];
    const componentGroup = await renderFields(page, fields, {
      data: {
        items: ["Hello", "world"],
      },
    });
    await expect(componentGroup).toContainText('Hello');
    await expect(componentGroup).toContainText('world');
  });

  test("Will compute value", async () => {
    const fields: TypedField[] = [
      {
        type: FieldType.Items,
        freeSolo: true,
        testId: 'items-field',
        name: 'items',
        compute: () => ["Hello", "world"],
      },
    ];
    const componentGroup = await renderFields(page, fields);
    await expect(componentGroup).toContainText('Hello');
    await expect(componentGroup).toContainText('world');
  });

});
