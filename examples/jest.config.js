import { createDefaultPreset } from "ts-jest";
import baseConfig from "@repo/configs/jest.config.js";

/** @type {import('jest').Config} */
const config = {
  ...baseConfig,
  rootDir: ".",
  ...createDefaultPreset({
    tsconfig: "./tsconfig.json",
  }),
};

export default config;
