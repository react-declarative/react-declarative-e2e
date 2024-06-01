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
  await expect(dataRef.combo).toEqual('Hello world');
});

test("Will accept selection", async ({ page }) => {
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
  await expect(dataRef.combo).toEqual('Foo');
});

test("Will translate labels", async ({ page }) => {
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
  await expect(text).toContain('Foo');
});
