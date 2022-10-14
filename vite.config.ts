import { defineConfig } from "vite";
import path from "path";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 8080,
    host: "0.0.0.0",
    proxy: {
      "/ws": {
        ws: true,
        target: "ws://localhost:8082",
      },
      "/": {
        ws: false,
        target: "http://localhost:8082",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\//, ""),
      },
    },
  },
});
