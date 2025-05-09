import { defineConfig } from "eslint/config";
import baseConfig from "@repo/configs/eslint.config.js";

export default defineConfig({
  ignores: [
    "eslint.config.js",
    "rollup.config.js",
    "jest.config.js",
    "dist/**",
    "docs/**",
  ],
  extends: [baseConfig],
});
