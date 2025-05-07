import { defineConfig } from "eslint/config";
import baseConfig from "@repo/configs/eslint.config.js";

export default defineConfig({
  extends: [baseConfig],
  ignores: ["eslint.config.js", "jest.config.js"],
  rules: {
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/no-empty-function": "off",
    "@typescript-eslint/no-unused-expressions": "off",
  },
});
