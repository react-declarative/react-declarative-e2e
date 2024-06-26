import { get, set } from "lodash";
import { useMemo } from "react";
import { BehaviorSubject, FieldType, IField, LoaderView, One, deepFlat, singlerun, sleep, useAsyncValue } from "react-declarative";
import IOneProps from "react-declarative/model/IOneProps";

const AWAIT_MSG = "SYSTEM_LAUNCHER_READY";

interface ILaunchConfig {
    fields: IField[];
    data: Record<string, unknown>;
    payload: Record<string, unknown>;
}

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
    'radio-field': FieldType.Radio,
    'checkbox-field': FieldType.Checkbox,
    'button-field': FieldType.Button,
    'icon-field': FieldType.Icon,
    'text-field': FieldType.Text,
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
    'typography-field': FieldType.Typography,
    'fragment-layout': FieldType.Fragment,
    'div-layout': FieldType.Div,
    'box-layout': FieldType.Box,
    'tabs-layout': FieldType.Tabs,
    'hero-layout': FieldType.Hero,
    'center-layout': FieldType.Center,
    'stretch-layout': FieldType.Stretch,
    'condition-layout': FieldType.Condition,
}

const beginSubject = new BehaviorSubject<ILaunchConfig>();

const parseValue = (value: string) => {
    try {
        return eval(value);
    } catch {
        return value;
    }
};

const waitForEnviroment = async (attempt = 0) => {
    if (window.launcherReady) {
        window.launcherReady(AWAIT_MSG);
        return;
    }
    attempt && console.log(`launcherReady not mounted. attempt=${attempt}`);
    await sleep();
    await waitForEnviroment(attempt + 1);
};

const oneLauncher = new class {
    launch = singlerun(async ({
        fields = [],
        data = {},
        payload = {},
    }: Partial<ILaunchConfig>) => {
        console.log('Fields: ', JSON.stringify(fields, null, 2))
        console.log('Data: ', JSON.stringify(data, null, 2))
        deepFlat(fields).forEach((field) => {
            for (const [key, value] of Object.entries(field)) {
                if (key === "type") {
                    field.type = get(fieldMap, parseValue(value));
                    continue
                }
                set(field, key, parseValue(value));
            }
        });
        await beginSubject.next({
            fields,
            data,
            payload,
        });
    });
}

export const Entry = () => {

    const [config] = useAsyncValue(async () => {
        await waitForEnviroment();
        if (beginSubject.data) {
            return beginSubject.data;
        }
        return await beginSubject.toPromise();
    });

    const handleFocus = useMemo((): IOneProps['focus'] => (...args) => {
        const params = args.map((value) => typeof value === "function" ? null : value);
        window.oneFocus && window.oneFocus(...params);
    }, []);

    const handleBlur = useMemo((): IOneProps['blur'] => (...args) => {
        const params = args.map((value) => typeof value === "function" ? null : value);
        window.oneBlur && window.oneBlur(...params);
    }, []);

    const handleChange = useMemo((): IOneProps['change'] => (...args) => {
        const params = args.map((value) => typeof value === "function" ? null : value);
        window.oneChange && window.oneChange(...params);
    }, []);

    const handleClick = useMemo((): IOneProps['click'] => (...args) => {
        const params = args.map((value) => typeof value === "function" ? null : value);
        window.oneClick && window.oneClick(...params);
    }, []);

    const handleInvalid = useMemo((): IOneProps['invalidity'] => (...args) => {
        const params = args.map((value) => typeof value === "function" ? null : value);
        window.oneInvalid && window.oneInvalid(...params);
    }, []);


    if (!config) {
        return <LoaderView sx={{ height: '100%', width: '100%' }} />
    }

    const { data, fields, payload } = config;

    return (
        <One
            handler={() => data}
            fields={fields}
            payload={payload}
            onClick={handleClick}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
            onInvalid={handleInvalid}
        />
    );
};

declare global {
    interface Window {
        oneLauncher: typeof oneLauncher;
        oneFocus?: (...args: unknown[]) => void;
        oneBlur?: (...args: unknown[]) => void;
        oneChange?: (...args: unknown[]) => void;
        oneClick?: (...args: unknown[]) => void;
        oneInvalid?: (...args: unknown[]) => void;
        launcherReady?: (msg: string) => void;
    }
}

window.oneLauncher = oneLauncher

export default Entry;
