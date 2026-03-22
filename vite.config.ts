import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) return "vendor";
        },
      },
    },
  },
  define: {
    "process.env.TLDRAW_WORKER_URL": JSON.stringify(
      process.env.TLDRAW_WORKER_URL ?? "http://localhost:5172",
    ),
  },
});
