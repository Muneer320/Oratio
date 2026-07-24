import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const backendUrl = process.env.VITE_BACKEND_URL || "http://127.0.0.1:8000";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 5000,
    strictPort: false,
    proxy: {
      "/api": {
        target: backendUrl,
        changeOrigin: true,
        ws: true,
        rewrite: (path) => path,
      },
      "/socket.io": {
        target: backendUrl,
        changeOrigin: true,
        ws: true,
        rewrite: (path) => path,
      },
    },
  },
});
