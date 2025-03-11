import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ["lucide-react"],
  },
  worker: {
    format: "es",
  },
  server: {
    proxy: {
      "/api": {
        target: "https://api.vxlverse.com",
        changeOrigin: true,
      },
    },
  },
  build: {
    target: "esnext",
    minify: "terser",
    terserOptions: {
      compress: {
        // Disable console.log stripping in production for now
        // to help with debugging
        drop_console: false,
      },
    },
  },
});
