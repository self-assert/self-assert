import tseslint from "typescript-eslint";
import baseConfig from "@repo/configs/eslint.config.js";

export default tseslint.config(
  {
    ignores: [
      "eslint.config.js",
      "rollup.config.js",
      "jest.config.ts",
      "dist/**",
      "docs/**",
    ],
  },
  baseConfig
);
