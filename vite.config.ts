import { defineConfig } from "vite";
import fullReload from "vite-plugin-full-reload";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    react(),
    fullReload(["**/*.ts*", "**/*.js*", "**/*.mjs"], {
      always: true,
      root: "lib",
    }),
    nodePolyfills({
      protocolImports: true,
    }),
  ],
  build: {
    target: "chrome87",
    outDir: "build",
    minify: "terser",
  },
  server: {
    hmr: false,
  },
});
