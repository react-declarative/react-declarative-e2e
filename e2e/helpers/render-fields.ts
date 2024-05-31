import IOneProps from "react-declarative/model/IOneProps";
import { Page } from "@playwright/test";
import stringify from "code-stringify";

import IField from "../model/IField";
import TypedField from "../model/TypedField";

import deepFlat from "../utils/deepFlat";
import deepClone from "../utils/deepClone";

const READY_CLASS = 'react-declarative__oneGenesisReady';

interface ILaunchConfig {
    fields: Field[];
    data: Record<string, unknown>;
    payload: Record<string, unknown>;
}

interface ILauncher {
    launch(config: Partial<ILaunchConfig>): void;
}

interface ICallbacks {
    focus: IOneProps['focus'];
    blur: IOneProps['blur'];
    change: IOneProps['change'];
}

declare global {
    interface Window {
        oneLauncher: ILauncher;
    }
}

type Field = IField | TypedField;

export const renderFields = async (page: Page, f: Field[], {
    blur: oneBlur = (name, data) => console.log({ type: 'blur', name, data }),
    change: oneChange = (data, initial) => console.log({ type: 'change', data, initial }),
    focus: oneFocus = (name, data) => console.log({ type: 'focus', name, data }),
}: Partial<ICallbacks> = {}) => {
    const fields = deepClone(f);
    deepFlat(fields).forEach((field) => {
        for (const [key, value] of Object.entries(field)) {
            field[key] = stringify(value);
        }
    });
    const config: Partial<ILaunchConfig> = { fields };
    await page.evaluate((config) => window.oneLauncher.launch(config), config);
    if (oneBlur) {
        await page.exposeFunction('oneBlur', oneBlur);
    }
    if (oneFocus) {
        await page.exposeFunction('oneFocus', oneFocus);
    }
    if (oneChange) {
        await page.exposeFunction('oneChange', oneChange);
    }
    const component = await page.getByTestId(READY_CLASS);
    await component.waitFor({ state: "visible" });
    return component;
};
