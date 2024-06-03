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

    const fields: TypedField[] = [
        {
            type: FieldType.Text,
            title: 'Checkbox group 1 value',
            testId: 'compute-field',
            compute: ({ checkbox1, checkbox2, checkbox3 }) => {
                const text = [checkbox1 ? 'checkbox1' : '', checkbox2 ? 'checkbox2' : '', checkbox3 ? 'checkbox3' : ''].filter(v => v);
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

    test("Will render nested schema", async () => {
        const componentGroup = await renderFields(page, fields);
        await expect(componentGroup).toContainText('Checkbox Group 1');
    });

    test("Will change compute on selection", async () => {
        const componentGroup = await renderFields(page, fields);
        await componentGroup.getByTestId('checkbox1-first').click();
        await componentGroup.getByTestId('checkbox1-third').click();
        const inputValue = await componentGroup.getByTestId('compute-field').getByRole('textbox').inputValue();
        expect(inputValue).toEqual('checkbox1, checkbox3')
    });

    test("Will write value", async () => {
        let dataRef;
        const componentGroup = await renderFields(page, fields, {
            change: (data) => {
                dataRef = data;
            },
        });
        await componentGroup.getByTestId('checkbox1-first').click();
        await componentGroup.getByTestId('checkbox1-third').click();
        expect(dataRef.checkbox1).toBeTruthy();
        expect(dataRef.checkbox3).toBeTruthy();
    });

    test("Will show disabled state", async () => {
        const fields: TypedField[] = [
            {
                type: FieldType.Checkbox,
                testId: 'checkbox-field',
                dirty: true,
                isDisabled: () => true,
                name: 'test'
            },
        ];
        const componentGroup = await renderFields(page, fields);
        const isDisabled = await componentGroup.getByLabel('Test').isDisabled();
        await expect(isDisabled).toBeTruthy();
    });
});
