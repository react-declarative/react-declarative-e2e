import { expect, test } from "@playwright/test";

import { waitForReady } from "../helpers/wait-for-ready";
import { renderFields } from "../helpers/render-fields";

import TypedField from "../model/TypedField";
import FieldType from "../model/FieldType";

test.beforeEach(async ({ page }) => {
    await waitForReady(page);
});

const CHILDREN_LABEL = "Children label";

const fields: TypedField[] = [
    {
        type: FieldType.Typography,
        placeholder: 'Fragment testbed',
    },
    {
        type: FieldType.Fragment,
        isVisible: ({ visible }) => visible,
        child: {
            type: FieldType.Typography,
            placeholder: CHILDREN_LABEL,
        },
    }
];

test("Will render visible state", async ({ page }) => {
    const componentGroup = await renderFields(page, fields, {
        data: {
            visible: true,
        }
    });
    const component = await componentGroup.getByText(CHILDREN_LABEL);
    const isVisible = await component.isVisible();
    await expect(isVisible).toBeTruthy();
});

test("Will render hidden state", async ({ page }) => {
    const componentGroup = await renderFields(page, fields, {
        data: {
            visible: false,
        }
    });
    const component = await componentGroup.getByText(CHILDREN_LABEL);
    const isVisible = await component.isVisible();
    await expect(isVisible).toBeFalsy();
});
