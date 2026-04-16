import { defineConfig } from "vitest/config";
import { baseConfig } from "../../vitest.base.config";

export default defineConfig({
  ...baseConfig,
  test: {
    ...baseConfig.test,
    exclude: ["./dist"],
  },
});
