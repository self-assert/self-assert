import { createDefaultPreset, pathsToModuleNameMapper } from "ts-jest";
import baseConfig from "@repo/configs/jest.config.js";

/** @type {import('jest').Config} */
const config = {
  ...baseConfig,
  rootDir: ".",
  roots: ["<rootDir>/src", "<rootDir>/testing-support"],
  setupFilesAfterEnv: ["<rootDir>/testing-support/jest.setup.ts"],
  moduleNameMapper: pathsToModuleNameMapper({
    "@testing-support/*": ["<rootDir>/testing-support/*"],
  }),
  ...createDefaultPreset({
    tsconfig: "./tsconfig.json",
  }),
};

export default config;
