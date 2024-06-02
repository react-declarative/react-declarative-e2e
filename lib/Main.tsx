import { useMemo } from "react";
import Entry from "./components/Entry";
import App from "./components/App";

export const Main = () => {

    const isPlaywrite = useMemo(() => {
        const url = new URL(location.href, location.origin);
        return url.searchParams.has('playwrite');
    }, []);

    if (isPlaywrite) {
        return <Entry />
    }

    return <App />
}

export default Main;
