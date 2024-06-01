import { expect, test } from "@playwright/test";

import { waitForReady } from "../helpers/wait-for-ready";
import { renderFields } from "../helpers/render-fields";

import TypedField from "../model/TypedField";
import FieldType from "../model/FieldType";

test.beforeEach(async ({ page }) => {
  await waitForReady(page);
});

const fields: TypedField[] = [
    {
      type: FieldType.Tree,
      testId: 'tree-field',
      itemTree: [
        {
            label: 'Foo',
            value: 'foo',
        },
        {
            label: 'Bar',
            value: 'bar',
            child: [
                {
                    label: 'Baz',
                    value: 'baz'
                },
                {
                    label: 'Bad',
                    value: 'bad'
                }
            ]
        },
      ],
      name: 'tree'
    },
];

test("Will accept child selection", async ({ page }) => {
  let dataRef: Record<string, unknown> = {};
  const componentGroup = await renderFields(page, fields, {
    change: (data) => {
        console.log({data})
        dataRef = data
    },
  });
  await componentGroup.getByTestId('tree-field').click();
  await page.getByText("Foo").click();
  await page.getByText("Baz").click();
  await page.waitForTimeout(1000);
  await expect(dataRef.tree).toEqual(expect.arrayContaining(['foo', 'baz']));
});

test("Will accept parent selection", async ({ page }) => {
    let dataRef: Record<string, unknown> = {};
    const componentGroup = await renderFields(page, fields, {
        change: (data) => {
            console.log({data})
            dataRef = data
        },
    });
    await componentGroup.getByTestId('tree-field').click();
    await page.getByText("Bar").first().click();
    await page.waitForTimeout(1000);
    await expect(dataRef.tree).toEqual(expect.arrayContaining(['baz', 'bad']));
});
  