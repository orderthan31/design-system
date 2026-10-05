import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
export default defineConfig({
  plugins: [react()],
  build: {rollupOptions:{input:{gallery:'index.html',bottomCTA:'browser/fixtures/bottom-cta.html'}}},
  test: {
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
    include: ["tests/**/*.test.ts?(x)"],
  },
});
