import { chromium, expect, test } from "@playwright/test";

import { renderFields } from "../helpers/render-fields";

import TypedField from "../model/TypedField";
import FieldType from "../model/FieldType";

test.describe('Combo', () => {

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

  test("Will accept freeSolo", async () => {
    const fields: TypedField[] = [
      {
        type: FieldType.Combo,
        testId: 'combo-field',
        freeSolo: true,
        name: 'combo'
      },
    ];
    let dataRef: Record<string, unknown> = {};
    const componentGroup = await renderFields(page, fields, {
      change: (data) => dataRef = data,
    });
    await componentGroup.getByTestId('combo-field').click();
    await page.keyboard.insertText("Hello world");
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);
    await expect(dataRef.combo).toEqual('Hello world');
  });

  test("Will accept selection", async () => {
    const fields: TypedField[] = [
      {
        type: FieldType.Combo,
        testId: 'combo-field',
        itemList: [
          "Foo",
          "Bar",
          "Baz",
        ],
        name: 'combo'
      },
    ];
    let dataRef: Record<string, unknown> = {};
    const componentGroup = await renderFields(page, fields, {
      change: (data) => dataRef = data,
    });
    await componentGroup.getByTestId('combo-field').click();
    await page.getByText("Foo").click();
    await page.waitForTimeout(1000);
    await expect(dataRef.combo).toEqual('Foo');
  });

  test("Will translate labels", async () => {
    const fields: TypedField[] = [
      {
        type: FieldType.Combo,
        testId: 'combo-field',
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
        name: 'combo'
      },
    ];
    let dataRef: Record<string, unknown> = {};
    const componentGroup = await renderFields(page, fields, {
      change: (data) => dataRef = data,
    });
    await componentGroup.getByTestId('combo-field').click();
    const text = await page.textContent('*');
    await page.waitForTimeout(1000);
    await expect(text).toContain('Foo');
  });

  test("Will show invalid message", async () => {
    const fields: TypedField[] = [
      {
        type: FieldType.Combo,
        testId: 'combo-field',
        dirty: true,
        isInvalid: () => "Invalid",
        name: 'combo'
      },
    ];
    const componentGroup = await renderFields(page, fields);
    await expect(componentGroup).toContainText('Invalid');
  });

  test("Will show disabled state", async () => {
    const fields: TypedField[] = [
      {
        type: FieldType.Combo,
        testId: 'combo-field',
        dirty: true,
        isDisabled: () => true,
        name: 'combo'
      },
    ];
    const componentGroup = await renderFields(page, fields);
    const isDisabled = await componentGroup.getByLabel('Combo').isDisabled();
    await expect(isDisabled).toBeTruthy();
  });

  test("Will show readonly state", async () => {
    const fields: TypedField[] = [
      {
        type: FieldType.Combo,
        testId: 'combo-field',
        dirty: true,
        isReadonly: () => true,
        name: 'combo'
      },
    ];
    const componentGroup = await renderFields(page, fields);
    const isEditable = await componentGroup.getByLabel('Combo').isEditable();
    await expect(isEditable).toBeFalsy();
  });

  test("Will read value", async () => {
    const fields: TypedField[] = [
      {
        type: FieldType.Combo,
        freeSolo: true,
        testId: 'combo-field',
        name: 'combo'
      },
    ];
    const componentGroup = await renderFields(page, fields, {
      data: {
        combo: "Hello world",
      },
    });
    const inputValue = await componentGroup.getByTestId('combo-field').getByRole('combobox').inputValue();
    await expect(inputValue).toContain('Hello world');
  });

  test("Will compute value", async () => {
    const fields: TypedField[] = [
      {
        type: FieldType.Combo,
        freeSolo: true,
        testId: 'combo-field',
        name: 'combo',
        compute: () => "Hello world",
      },
    ];
    const componentGroup = await renderFields(page, fields);
    const inputValue = await componentGroup.getByTestId('combo-field').getByRole('combobox').inputValue();
    await expect(inputValue).toContain('Hello world');
  });

});
