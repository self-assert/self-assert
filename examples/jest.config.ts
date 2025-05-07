import type { Config } from "jest";
import { createDefaultPreset, pathsToModuleNameMapper } from "ts-jest";
import baseConfig from "@repo/configs/jest.config";

const config: Config = {
  ...baseConfig,
  rootDir: ".",
  // roots: ["<rootDir>/src", "<rootDir>/testing-support"],
  // setupFilesAfterEnv: ["<rootDir>/testing-support/jest.setup.ts"],
  // moduleNameMapper: pathsToModuleNameMapper({
  //   "@testing-support/*": ["<rootDir>/testing-support/*"],
  //   // "self-assert": ["<rootDir>/src/index.ts"],
  // }),
  ...createDefaultPreset({
    tsconfig: "./tsconfig.json",
  }),
};

export default config;
