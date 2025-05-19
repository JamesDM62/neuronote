import { defineConfig } from "vite";
import eslintPlugin from "vite-plugin-eslint";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig(({ mode }) => ({
  base: "./",
  plugins: [
    react(),
    eslintPlugin({
      lintOnStart: true,
      failOnError: mode === "production",
    }),
  ],
  server: {
    open: true,
    proxy: {
      "/api": "http://localhost:8000", // ✅ local dev only
    },
  },
  build: {
    outDir: path.resolve(__dirname, "./dist"), // for Render deployment
    emptyOutDir: true,
  },
}));

