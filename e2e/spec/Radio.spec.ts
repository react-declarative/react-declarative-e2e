import { Browser, Page, chromium, expect, test } from "@playwright/test";

import { renderFields } from "../helpers/render-fields";

import TypedField from "../model/TypedField";
import FieldType from "../model/FieldType";

test.describe('Radio', () => {

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
            title: 'Radio group 1 value',
            testId: 'compute-field',
            compute: (obj) => {
                if (obj.radio1 === 'first') {
                    return 'It looks like radio #1 was cheched';
                } else if (obj.radio1 === 'second') {
                    return 'It looks like radio #2 was cheched';
                } else if (obj.radio1 === 'third') {
                    return 'It looks like radio #3 was cheched';
                } else {
                    return 'Please mark radio button';
                }
            },
        },
        {
            type: FieldType.Outline,
            fieldBottomMargin: '1',
            fields: [
                {
                    type: FieldType.Typography,
                    placeholder: 'Radio Group 1'
                },
                {
                    type: FieldType.Radio,
                    testId: 'radio1-first',
                    title: 'First radio button',
                    name: 'radio1',
                    radioValue: 'first',
                },
                {
                    type: FieldType.Radio,
                    testId: 'radio1-second',
                    title: 'Second radio button',
                    name: 'radio1',
                    radioValue: 'second',
                },
                {
                    type: FieldType.Radio,
                    testId: 'radio1-third',
                    title: 'Third radio button',
                    name: 'radio1',
                    radioValue: 'third',
                },
            ]
        },
        {
            type: FieldType.Outline,
            fields: [
                {
                    type: FieldType.Typography,
                    placeholder: 'Radio Group 2'
                },
                {
                    type: FieldType.Radio,
                    testId: 'radio2-first',
                    title: 'First radio button',
                    name: 'radio2',
                    radioValue: 'first',
                },
                {
                    type: FieldType.Radio,
                    testId: 'radio2-second',
                    title: 'Second radio button',
                    name: 'radio2',
                    radioValue: 'second',
                },
                {
                    type: FieldType.Radio,
                    testId: 'radio2-third',
                    title: 'Third radio button',
                    name: 'radio2',
                    radioValue: 'third',
                },
            ]
        }
    ];

    test("Will render nested schema", async () => {
        const componentGroup = await renderFields(page, fields);
        await expect(componentGroup).toContainText('Radio Group 1');
        await expect(componentGroup).toContainText('Radio Group 2');
    });

    test("Will change compute on selection", async () => {
        const componentGroup = await renderFields(page, fields);
        await componentGroup.getByTestId('radio1-first').click();
        const inputValue = await componentGroup.getByTestId('compute-field').getByRole('textbox').inputValue();
        expect(inputValue).toEqual('It looks like radio #1 was cheched')
    });

    test("Will write value", async () => {
        let dataRef;
        const componentGroup = await renderFields(page, fields, {
            change: (data) => {
                dataRef = data;
            },
        });
        await componentGroup.getByTestId('radio1-first').click();
        await componentGroup.getByTestId('radio1-third').click();
        expect(dataRef.radio1).toEqual("third");
    });

    test("Changing another radio group will not affect first one", async () => {
        const componentGroup = await renderFields(page, fields);
        await componentGroup.getByTestId('radio1-first').click();
        await componentGroup.getByTestId('radio2-second').click();
        const inputValue = await componentGroup.getByTestId('compute-field').getByRole('textbox').inputValue();
        expect(inputValue).toEqual('It looks like radio #1 was cheched')
    });

    test("Changing another radio will affect text compute", async () => {
        const componentGroup = await renderFields(page, fields);
        await componentGroup.getByTestId('radio1-first').click();
        await componentGroup.getByTestId('radio1-second').click();
        const inputValue = await componentGroup.getByTestId('compute-field').getByRole('textbox').inputValue();
        expect(inputValue).toEqual('It looks like radio #2 was cheched')
    });

    test("Will show disabled state", async () => {
        const fields: TypedField[] = [
            {
                type: FieldType.Radio,
                testId: 'radio-field',
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
