/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */
import type { Config } from "jest";
import { createDefaultPreset, pathsToModuleNameMapper } from "ts-jest";
import baseConfig from "@repo/configs/jest.config";

const config: Config = {
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
