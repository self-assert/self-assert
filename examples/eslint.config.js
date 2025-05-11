// @ts-check
import baseConfig from "@repo/configs/eslint.config.js";

/** @type {import("typescript-eslint").ConfigArray} */
export default [
  ...baseConfig,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-empty-function": "off",
      "@typescript-eslint/no-unused-expressions": "off",
    },
  },
];
