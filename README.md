# ⚛️ react-declarative-e2e

> Playwright end-to-end testbed for [react-declarative](https://github.com/react-declarative/react-declarative)

![screenshot](./docs/screenshot.png)

## Contribute

> [!IMPORTANT]
> Made especially for newbies as an advanced documentation for `react-declarative` to solve their problems. **⭐Star** and **💻Fork** It [on github](https://github.com/react-declarative/react-declarative) will be appreciated

## Usage

1. Build the project

```bash
npm run build
```

2. Run tests

```bash
npm run test:ui
```

or

```bash
npm run test
```


## Test Cases

<!--
```
const fieldMap = {
    'custom-layout': FieldType.Layout,
    'switch-field': FieldType.Switch,
    'yesno-field': FieldType.YesNo,
    'line-field': FieldType.Line,
    'file-field': FieldType.File,
    'group-layout': FieldType.Group,
    'paper-layout': FieldType.Paper,
    'outline-layout': FieldType.Outline,
    'expansion-layout': FieldType.Expansion,
    'checkbox-field': FieldType.Checkbox,
    'date-field': FieldType.Date,
    'time-field': FieldType.Time,
    'progress-field': FieldType.Progress,
    'component-field': FieldType.Component,
    'slider-field': FieldType.Slider,
    'combo-field': FieldType.Combo,
    'choose-field': FieldType.Choose,
    'tree-field': FieldType.Tree,
    'dict-field': FieldType.Dict,
    'init-field': FieldType.Init,
    'phony-field': FieldType.Phony,
    'complete-field': FieldType.Complete,
    'items-field': FieldType.Items,
    'rating-field': FieldType.Rating,
    'fragment-layout': FieldType.Fragment,
    'div-layout': FieldType.Div,
    'box-layout': FieldType.Box,
    'tabs-layout': FieldType.Tabs,
    'hero-layout': FieldType.Hero,
    'center-layout': FieldType.Center,
    'stretch-layout': FieldType.Stretch,
    'condition-layout': FieldType.Condition,
}
```
-->

1. [TypographyField](./e2e/spec/Typography.spec.ts)
2. [TextField](./e2e/spec/TextField.spec.ts)
3. [RadioField](./e2e/spec/Radio.spec.ts)


## Code Sample

```tsx
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

test("Will render nested schema", async ({ page }) => {
  const componentGroup = await renderFields(page, fields);
  await expect(componentGroup).toContainText('Radio Group 1');
  await expect(componentGroup).toContainText('Radio Group 2');
});

test("Will change compute on selection", async ({ page }) => {
    const componentGroup = await renderFields(page, fields);
    await componentGroup.getByTestId('radio1-first').click();
    const inputValue = await componentGroup.getByTestId('compute-field').getByRole('textbox').inputValue();
    expect(inputValue).toEqual('It looks like radio #1 was cheched')
});


test("Changing another radio group will not affect first one", async ({ page }) => {
    const componentGroup = await renderFields(page, fields);
    await componentGroup.getByTestId('radio1-first').click();
    await componentGroup.getByTestId('radio2-second').click();
    const inputValue = await componentGroup.getByTestId('compute-field').getByRole('textbox').inputValue();
    expect(inputValue).toEqual('It looks like radio #1 was cheched')
});

test("Changing another radio will affect text compute", async ({ page }) => {
    const componentGroup = await renderFields(page, fields);
    await componentGroup.getByTestId('radio1-first').click();
    await componentGroup.getByTestId('radio1-second').click();
    const inputValue = await componentGroup.getByTestId('compute-field').getByRole('textbox').inputValue();
    expect(inputValue).toEqual('It looks like radio #2 was cheched')
});

```