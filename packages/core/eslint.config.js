// @ts-check
import baseConfig from "@repo/configs/eslint.config.js";

/** @type {import("typescript-eslint").ConfigArray} */
export default [
  {
    ignores: [
      "eslint.config.js",
      "rollup.config.js",
      "jest.config.js",
      "dist/**",
      "docs/**",
    ],
  },
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
