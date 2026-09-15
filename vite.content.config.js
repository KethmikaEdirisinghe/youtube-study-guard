import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

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