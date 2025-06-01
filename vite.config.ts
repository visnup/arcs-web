import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// https://vite.dev/config/
const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  define: {
    "process.env.TLDRAW_WORKER_URL": JSON.stringify(
      process.env.TLDRAW_WORKER_URL ?? "http://localhost:5172",
    ),
  },
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, "index.html"),
        new: resolve(__dirname, "new.html"),
      },
    },
  },
});
