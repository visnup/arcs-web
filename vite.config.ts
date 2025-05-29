import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    "process.env.TLDRAW_WORKER_URL":
      "'https://tldraw-worker.visnup.workers.dev'",
  },
});
