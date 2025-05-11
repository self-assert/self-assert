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
    // rules: {
    //   "@typescript-eslint/no-confusing-void-expression": ["off"],
    // },
  },
];
