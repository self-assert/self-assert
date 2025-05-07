/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */
import type { Config } from "jest";
import { createDefaultPreset, pathsToModuleNameMapper } from "ts-jest";

const config: Config = {
  clearMocks: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  collectCoverageFrom: ["<rootDir>/src/**/*.{ts,tsx,js,jsx}"],
  coveragePathIgnorePatterns: ["index.ts$"],
  maxWorkers: "50%",
  rootDir: ".",
  // "<rootDir>/examples"
  roots: ["<rootDir>/src", "<rootDir>/testing-support"],
  setupFilesAfterEnv: ["<rootDir>/testing-support/jest.setup.ts"],
  slowTestThreshold: 2,
  testMatch: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[tj]s?(x)"],
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
  moduleNameMapper: pathsToModuleNameMapper(
    {
      "@testing-support/*": ["./testing-support/*"],
      "self-assert": ["./src/index.ts"],
    },
    {
      prefix: "<rootDir>/",
    }
  ),
  ...createDefaultPreset({
    tsconfig: "./tsconfig.json",
  }),
};

export default config;
