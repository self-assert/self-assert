/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */
import type { Config } from "jest";
import {
  createDefaultPreset,
  pathsToModuleNameMapper,
  TsConfigCompilerOptionsJson,
} from "ts-jest";

import { compilerOptions } from "./tsconfig.json";

const config: Config = {
  clearMocks: true,
  coverageDirectory: "coverage",
  coverageProvider: "babel",
  collectCoverageFrom: ["<rootDir>/src/**/*.{ts,tsx,js,jsx}"],
  coveragePathIgnorePatterns: ["index.ts$"],
  maxWorkers: "50%",
  rootDir: ".",
  roots: ["<rootDir>/src", "<rootDir>/testing-support", "<rootDir>/examples"],
  setupFilesAfterEnv: ["<rootDir>/testing-support/jest.setup.ts"],
  slowTestThreshold: 2,
  testMatch: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[tj]s?(x)"],
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
  moduleNameMapper: pathsToModuleNameMapper(
    { ...compilerOptions.paths, "self-assert": ["./src/index.ts"] },
    {
      prefix: "<rootDir>/",
    }
  ),
  ...createDefaultPreset({
    tsconfig: {
      ...(compilerOptions as TsConfigCompilerOptionsJson),
      noEmit: true,
    },
  }),
};

export default config;
