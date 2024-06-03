import { chromium, expect, test } from "@playwright/test";

import { renderFields } from "../helpers/render-fields";

import TypedField from "../model/TypedField";
import FieldType from "../model/FieldType";

test.describe('Switch', () => {

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

    const fields: TypedField[] = [
        {
            type: FieldType.Text,
            title: 'Switch group 1 value',
            testId: 'compute-field',
            compute: ({ switch1, switch2, switch3 }) => {
                const text = [switch1 ? 'switch1' : '', switch2 ? 'switch2' : '', switch3 ? 'switch3' : ''].filter(v => v);
                if (text.length) {
                    return text.join(', ');
                }
                return 'Please mark switch';
            },
        },
        {
            type: FieldType.Outline,
            fieldBottomMargin: '1',
            fields: [
                {
                    type: FieldType.Typography,
                    placeholder: 'Switch Group 1'
                },
                {
                    type: FieldType.Switch,
                    testId: 'switch1-first',
                    title: 'First switch',
                    name: 'switch1',
                },
                {
                    type: FieldType.Switch,
                    testId: 'switch1-second',
                    title: 'Second switch',
                    name: 'switch2',
                },
                {
                    type: FieldType.Switch,
                    testId: 'switch1-third',
                    title: 'Third switch',
                    name: 'switch3',
                },
            ]
        },
    ];

    test("Will render nested schema", async ({ page }) => {
        const componentGroup = await renderFields(page, fields);
        await expect(componentGroup).toContainText('Switch Group 1');
    });

    test("Will change compute on selection", async ({ page }) => {
        const componentGroup = await renderFields(page, fields);
        await componentGroup.getByTestId('switch1-first').getByRole("checkbox").click();
        await componentGroup.getByTestId('switch1-third').getByRole("checkbox").click();
        const inputValue = await componentGroup.getByTestId('compute-field').getByRole('textbox').inputValue();
        expect(inputValue).toEqual('switch1, switch3')
    });


    test("Will show disabled state", async ({ page }) => {
        const fields: TypedField[] = [
            {
                type: FieldType.Switch,
                testId: 'switch-field',
                dirty: true,
                isDisabled: () => true,
                name: 'test'
            },
        ];
        const componentGroup = await renderFields(page, fields);
        const isDisabled = await componentGroup.getByRole('checkbox').isDisabled();
        await expect(isDisabled).toBeTruthy();
    });

});
