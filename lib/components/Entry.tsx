import { get, set } from "lodash";
import { useMemo } from "react";
import { BehaviorSubject, FieldType, IField, LoaderView, One, deepFlat, singlerun, useAsyncValue } from "react-declarative";
import IOneProps from "react-declarative/model/IOneProps";

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

const oneLauncher = new class {
    launch = singlerun(async ({
        fields = [],
        data = {},
        payload = {},
    }: Partial<ILaunchConfig>) => {
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

    if (!config) {
        return <LoaderView sx={{ height: '100%', width: '100%' }} />
    }

    const { data, fields, payload } = config;

    return (
        <One
            handler={() => data}
            sx={{ p: 1 }}
            fields={fields}
            payload={payload}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
        />
    );
};

declare global {
    interface Window {
        oneLauncher: typeof oneLauncher;
        oneFocus?: (...args: unknown[]) => void;
        oneBlur?: (...args: unknown[]) => void;
        oneChange?: (...args: unknown[]) => void;
    }
}

window.oneLauncher = oneLauncher

export default Entry;
