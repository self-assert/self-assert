// @ts-check
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

/** @type {import("typescript-eslint").ConfigArray} */
export default tseslint.config(
  { ignores: ["eslint.config.js", "jest.config.js"] },
  eslint.configs.recommended,
  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  {
    rules: {
      "@typescript-eslint/no-confusing-void-expression": "off",
      "@typescript-eslint/no-extraneous-class": "off",
      "@typescript-eslint/restrict-template-expressions": "off",
      "@typescript-eslint/no-invalid-void-type": "off",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "error",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-deprecated": "warn",
    },
  }
);
