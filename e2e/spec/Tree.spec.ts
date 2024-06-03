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

  test("Will accept child selection", async () => {
    let dataRef: Record<string, unknown> = {};
    const componentGroup = await renderFields(page, fields, {
      change: (data) => {
        dataRef = data
      },
    });
    await componentGroup.getByTestId('tree-field').click();
    await page.getByText("Foo").click();
    await page.getByText("Baz").click();
    await page.waitForTimeout(1000);
    await expect(dataRef.tree).toEqual(expect.arrayContaining(['foo', 'baz']));
  });

  test("Will accept parent selection", async () => {
    let dataRef: Record<string, unknown> = {};
    const componentGroup = await renderFields(page, fields, {
      change: (data) => {
        console.log({ data })
        dataRef = data
      },
    });
    await componentGroup.getByTestId('tree-field').click();
    await page.getByText("Bar").first().click();
    await page.waitForTimeout(1000);
    await expect(dataRef.tree).toEqual(expect.arrayContaining(['baz', 'bad']));
  });

  test("Will show invalid message", async () => {
    const fields: TypedField[] = [
      {
        type: FieldType.Tree,
        testId: 'tree-field',
        dirty: true,
        isInvalid: () => "Invalid",
        name: 'tree'
      },
    ];
    const componentGroup = await renderFields(page, fields);
    await expect(componentGroup).toContainText('Invalid');
  });

  test("Will show disabled state", async () => {
    const fields: TypedField[] = [
      {
        type: FieldType.Tree,
        testId: 'tree-field',
        dirty: true,
        isDisabled: () => true,
        name: 'tree'
      },
    ];
    const componentGroup = await renderFields(page, fields);
    const isDisabled = await componentGroup.getByLabel('Tree').isDisabled();
    await expect(isDisabled).toBeTruthy();
  });

  test("Will show readonly state", async () => {
    const fields: TypedField[] = [
      {
        type: FieldType.Tree,
        testId: 'tree-field',
        dirty: true,
        isReadonly: () => true,
        name: 'tree'
      },
    ];
    const componentGroup = await renderFields(page, fields);
    const isEditable = await componentGroup.getByLabel('Tree').isEditable();
    await expect(isEditable).toBeFalsy();
  });


  test("Will read value", async () => {
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
    const componentGroup = await renderFields(page, fields, {
      data: {
        tree: ["foo", "bad"],
      },
    });
    await expect(componentGroup).toContainText('Foo');
    await expect(componentGroup).toContainText('Bad');
  });

  test("Will compute value", async () => {
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
        compute: () => ['foo', 'bad'],
        name: 'tree'
      },
    ];
    const componentGroup = await renderFields(page, fields);
    await expect(componentGroup).toContainText('Foo');
    await expect(componentGroup).toContainText('Bad');
  });


});
