import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";

export default defineConfig({
  plugins: [react(), tailwindcss(), cssInjectedByJsPlugin()],

  build: {
    emptyOutDir: false,
    rollupOptions: {
      input: "src/content.jsx",

      output: {
        format: "iife",
        entryFileNames: "content.js",
      },
    },
  },
});