import { defineConfig } from "eslint/config";
import baseConfig from "../eslint.config.js";

export default defineConfig({
  extends: [baseConfig],
  rules: {
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/no-empty-function": "off",
  },
});
