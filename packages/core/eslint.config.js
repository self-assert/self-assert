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
  },
];
