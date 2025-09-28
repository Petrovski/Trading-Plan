import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: ["react", "react-dom"],
  },
  optimizeDeps: {
    // helps Vite pre-bundle correctly; not strictly required but nice with Apollo/MUI
    include: ["@apollo/client", "graphql"],
  },
});
