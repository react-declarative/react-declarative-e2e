import { useMemo } from "react";
import Entry from "./components/Entry";
import App from "./components/App";
import { OneSlotFactory } from "react-declarative";

export const Main = () => {

    const isPlaywrite = useMemo(() => {
        const url = new URL(location.href, location.origin);
        return url.searchParams.has('playwrite');
    }, []);

    const renderInner = () => {
        if (isPlaywrite) {
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
