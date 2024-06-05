import IOneProps from "react-declarative/model/IOneProps";
import { Page, expect } from "@playwright/test";
import stringify from "code-stringify";

import IField from "../model/IField";
import TypedField from "../model/TypedField";

import deepFlat from "../utils/deepFlat";
import deepClone from "../utils/deepClone";
import isObject from "../utils/isObject";

import { waitForReady } from "./wait-for-ready";

const READY_CLASS = 'react-declarative__oneGenesisReady';

interface ILaunchConfig {
    fields: Field[];
    data: Record<string, unknown>;
    payload: Record<string, unknown>;
}

interface ILauncher {
    launch(config: Partial<ILaunchConfig>): void;
}

interface IConfig extends Omit<ILaunchConfig, keyof {
    fields: never;
}> {
    click: IOneProps['click'];
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
    click: oneClick = (name, data) => console.log({ type: 'click', name, data }),
    data = {},
    payload = {},
}: Partial<IConfig> = {}) => {
    let isOk = true;
    try {
        await waitForReady(page);
        const fields = deepClone(f);
        deepFlat(fields).forEach((field) => {
            for (const [key, value] of Object.entries(field)) {
                if (Array.isArray(value)) {
                    continue;
                }
                if (isObject(value)) {
                    continue;
                }
                field[key] = stringify(value);
            }
        });
        const config: Partial<ILaunchConfig> = { fields, data, payload };
        await page.evaluate((config) => {
            const sleep = async (delay = 1_000) => new Promise((res) => setTimeout(() => res(undefined), delay));
            const run = async (attempt = 0) => {
                if ('oneLauncher' in window) {
                    window.oneLauncher.launch(config);
                    return;
                }
                attempt && console.log(`oneLauncher not mounted. attempt=${attempt}`);
                await sleep();
                await run(attempt + 1);
            }
            run();
        }, config);
        if (oneBlur) {
            await page.exposeFunction('oneBlur', oneBlur);
        }
        if (oneFocus) {
            await page.exposeFunction('oneFocus', oneFocus);
        }
        if (oneChange) {
            await page.exposeFunction('oneChange', oneChange);
        }
        if (oneClick) {
            await page.exposeFunction('oneClick', oneClick);
        }
        const component = await page.getByTestId(READY_CLASS);
        await component.waitFor({ state: "visible" });
        return component;
    } catch (error) {
        console.log('Browser context stuck. Another attempt');
        isOk = false;
    } finally {
        expect(isOk).toBeTruthy();
    }
    return await page.locator('div');
};
