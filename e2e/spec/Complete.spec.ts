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

  test("Will show invalid message", async () => {
    const fields: TypedField[] = [
      {
        type: FieldType.Complete,
        testId: 'complete-field',
        dirty: true,
        isInvalid: () => "Invalid",
        name: 'complete'
      },
    ];
    const componentGroup = await renderFields(page, fields);
    await expect(componentGroup).toContainText('Invalid');
  });

  test("Will show disabled state", async () => {
    const fields: TypedField[] = [
      {
        type: FieldType.Complete,
        testId: 'complete-field',
        dirty: true,
        isDisabled: () => true,
        name: 'complete'
      },
    ];
    const componentGroup = await renderFields(page, fields);
    const isDisabled = await componentGroup.getByLabel('Complete').isDisabled();
    await expect(isDisabled).toBeTruthy();
  });

  test("Will show readonly state", async () => {
    const fields: TypedField[] = [
      {
        type: FieldType.Complete,
        testId: 'complete-field',
        dirty: true,
        isReadonly: () => true,
        name: 'complete'
      },
    ];
    const componentGroup = await renderFields(page, fields);
    const isEditable = await componentGroup.getByLabel('Complete').isEditable();
    await expect(isEditable).toBeFalsy();
  });

  test("Will read value", async () => {
    const fields: TypedField[] = [
      {
        type: FieldType.Complete,
        testId: 'complete-field',
        name: 'complete'
      },
    ];
    const componentGroup = await renderFields(page, fields, {
      data: {
        complete: "Hello world",
      },
    });
    const inputValue = await componentGroup.getByTestId('complete-field').getByRole('textbox').inputValue();
    await expect(inputValue).toContain('Hello world');
  });

  test("Will compute value", async () => {
    const fields: TypedField[] = [
      {
        type: FieldType.Complete,
        testId: 'complete-field',
        name: 'complete',
        compute: () => "Hello world",
      },
    ];
    const componentGroup = await renderFields(page, fields);
    const inputValue = await componentGroup.getByTestId('complete-field').getByRole('textbox').inputValue();
    await expect(inputValue).toContain('Hello world');
  });

  test("Will type value", async () => {
    const fields: TypedField[] = [
      {
        type: FieldType.Complete,
        testId: 'complete-field',
        name: 'complete',
        tip: [
          'Foo',
          'Bar',
          'Baz',
        ],
      },
    ];
    let dataRef;
    const componentGroup = await renderFields(page, fields, {
      change: (data) => {
        dataRef = data;
      }
    });
    const completeField = await componentGroup.getByTestId('complete-field');
    await completeField.click();
    await page.keyboard.insertText("Hello world");
    await completeField.blur();
    await page.waitForTimeout(1000);
    await expect(dataRef.complete).toContain('Hello world');
  });

  test("Will complete value", async () => {
    const fields: TypedField[] = [
      {
        type: FieldType.Complete,
        testId: 'complete-field',
        name: 'complete',
        tip: [
          'Foo',
          'Bar',
          'Baz',
          'Bad',
        ],
      },
    ];
    let dataRef;
    const componentGroup = await renderFields(page, fields, {
      change: (data) => {
        dataRef = data;
      }
    });
    const completeField = await componentGroup.getByTestId('complete-field');
    await completeField.click();
    await page.keyboard.insertText("Ba");
    await page.getByText("Bad").first().click();
    await page.waitForTimeout(1000);
    await expect(dataRef.complete).toContain('Bad');
  });

});
