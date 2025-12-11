import { defineConfig } from "vitest/config";
import { baseConfig } from "../../vitest.config";

export default defineConfig({
  ...baseConfig,
  test: {
    ...baseConfig.test,
    exclude: ["node_modules/**"],
    testTimeout: 100_000,
    typecheck: {
      enabled: true,
      tsconfig: "./tsconfig.json",
    },
  },
});
