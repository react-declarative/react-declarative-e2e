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
        type: FieldType.Text,
        title: 'Checkbox group 1 value',
        testId: 'compute-field',
        compute: ({ checkbox1, checkbox2, checkbox3 }) => {
            const text = [checkbox1 ? 'checkbox1' : '', checkbox2 ? 'checkbox2' : '', checkbox3 ? 'checkbox3': ''].filter(v => v);
            if (text.length) {
                return text.join(', ');
            }
            return 'Please mark checkbox';
        },
    },
    {
        type: FieldType.Outline,
        fieldBottomMargin: '1',
        fields: [
            {
                type: FieldType.Typography,
                placeholder: 'Checkbox Group 1'
            },
            {
                type: FieldType.Checkbox,
                testId: 'checkbox1-first',
                title: 'First checkbox',
                name: 'checkbox1',
            },
            {
                type: FieldType.Checkbox,
                testId: 'checkbox1-second',
                title: 'Second checkbox',
                name: 'checkbox2',
            },
            {
                type: FieldType.Checkbox,
                testId: 'checkbox1-third',
                title: 'Third checkbox',
                name: 'checkbox3',
            },
        ]
    },
];

test("Will render nested schema", async ({ page }) => {
  const componentGroup = await renderFields(page, fields);
  await expect(componentGroup).toContainText('Checkbox Group 1');
});

test("Will change compute on selection", async ({ page }) => {
    const componentGroup = await renderFields(page, fields);
    await componentGroup.getByTestId('checkbox1-first').click();
    await componentGroup.getByTestId('checkbox1-third').click();
    const inputValue = await componentGroup.getByTestId('compute-field').getByRole('textbox').inputValue();
    expect(inputValue).toEqual('checkbox1, checkbox3')
});