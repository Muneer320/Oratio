import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const backendUrl = process.env.VITE_BACKEND_URL || "http://127.0.0.1:8000";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 5000,
    strictPort: false,
    allowedHosts: [
      "all",
      "orat-io.replit.app",
      "1b30c50e-5d45-4d93-a9ab-7423c61d9c21-00-1f0hhy6mf29d9.sisko.replit.dev",
    ],
    proxy: {
      "/api": {
        target: backendUrl,
        changeOrigin: true,
        ws: true,
        rewrite: (path) => path,
      },
      "/ws": {
        target: backendUrl,
        changeOrigin: true,
        ws: true,
        rewrite: (path) => path,
      },
    },
  },
});
