import { expect, test } from "@playwright/test";

import { waitForReady } from "../helpers/wait-for-ready";
import { renderFields } from "../helpers/render-fields";
import { writeText } from "../helpers/write-text";

import TypedField from "../model/TypedField";
import FieldType from "../model/FieldType";

test.beforeEach(async ({ page }) => {
  await waitForReady(page);
});

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
