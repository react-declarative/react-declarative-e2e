import {
  ModalProvider,
  OneConfig,
  ScrollAdjust,
} from "react-declarative";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { CacheProvider } from "@emotion/react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { TssCacheProvider } from "tss-react";
import createCache from "@emotion/cache";
import { createRoot } from "react-dom/client";
import Entry from "./components/Entry";

const container = document.getElementById("root")!;

const muiCache = createCache({
  key: "mui",
  prepend: true,
});

const tssCache = createCache({
  key: "tss",
});

const wrappedApp = (
    <CacheProvider value={muiCache}>
      <TssCacheProvider value={tssCache}>
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
            <ModalProvider>
                <Entry />
            </ModalProvider>
          </LocalizationProvider>
      </TssCacheProvider>
    </CacheProvider>
);

const root = createRoot(container);

OneConfig.setValue({
  WITH_DIRTY_CLICK_LISTENER: true,
  WITH_MOBILE_READONLY_FALLBACK: true,
  WITH_WAIT_FOR_MOVE_LISTENER: true,
  WITH_WAIT_FOR_TOUCH_LISTENER: true,
  WITH_DISMOUNT_LISTENER: true,
  WITH_SYNC_COMPUTE: true,
  CUSTOM_FIELD_DEBOUNCE: 800,
  FIELD_BLUR_DEBOUNCE: 50,
});

ScrollAdjust.setAdjustHeight(25);

document.addEventListener("wheel", () => {
  const activeElement = document.activeElement as HTMLInputElement;
  if (activeElement && activeElement.type === "number") {
    activeElement.blur();
  }
});

root.render(wrappedApp);
