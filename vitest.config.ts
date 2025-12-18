import { defineConfig, type ViteUserConfig } from "vitest/config";

export const baseConfig: ViteUserConfig = {
  test: {
    environment: "node",
    globals: true,
    watch: false,
    exclude: ["tests/integration/**", "node_modules/**"],
  },
};

export default defineConfig({
  ...baseConfig,
});
