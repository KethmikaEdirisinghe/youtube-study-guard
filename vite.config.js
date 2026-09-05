import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],

  // Important for Chrome extensions
  base: "./",

  build: {
    rollupOptions: {
      input: {
        popup: "index.html",
      },
    },
  },
});