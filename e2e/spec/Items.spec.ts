import { expect, test } from "@playwright/test";

import { waitForReady } from "../helpers/wait-for-ready";
import { renderFields } from "../helpers/render-fields";

import TypedField from "../model/TypedField";
import FieldType from "../model/FieldType";

test.beforeEach(async ({ page }) => {
  await waitForReady(page);
});

test("Will accept freeSolo", async ({ page }) => {
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

test("Will accept selection", async ({ page }) => {
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

test("Will translate labels", async ({ page }) => {
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
