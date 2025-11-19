import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  // No proxy needed in production
  server: {
    port: 5173,
  },

  build: {
    outDir: "dist",
  },
});
