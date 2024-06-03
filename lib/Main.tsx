import { useMemo } from "react";
import Entry from "./components/Entry";
import App from "./components/App";
import { OneSlotFactory } from "react-declarative";

export const Main = () => {

    const isPlaywright = useMemo(() => {
        const url = new URL(location.href, location.origin);
        return url.searchParams.has('playwright');
    }, []);

    const renderInner = () => {
        if (isPlaywright) {
            return <Entry />
        }
        return <App />
    };

    return (
        <OneSlotFactory>
            {renderInner()}
        </OneSlotFactory>
    );
}

export default Main;
