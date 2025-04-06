/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */
import type { Config } from "jest";
import { createDefaultPreset, pathsToModuleNameMapper } from "ts-jest";

import { compilerOptions } from "./tsconfig.json";

const config: Config = {
  clearMocks: true,
  coverageDirectory: "coverage",
  coverageProvider: "babel",
  collectCoverageFrom: ["<rootDir>/src/**/*.{ts,tsx,js,jsx}"],
  // The maximum amount of workers used to run your tests. Can be specified as % or a number. E.g. maxWorkers: 10% will use 10% of your CPU amount + 1 as the maximum worker number. maxWorkers: 2 will use a maximum of 2 workers.
  maxWorkers: "50%",
  rootDir: ".",
  roots: ["<rootDir>/src", "<rootDir>/testing-support"],
  // A path to a module which exports an async function that is triggered once before all test suites
  // globalSetup: undefined,
  // A path to a module which exports an async function that is triggered once after all test suites
  // globalTeardown: undefined,
  // The paths to modules that run some code to configure or set up the testing environment before each test
  // setupFiles: [],
  setupFilesAfterEnv: ["<rootDir>/testing-support/jest.setup.ts"],
  // The number of seconds after which a test is considered as slow and reported as such in the results.
  slowTestThreshold: 2,
  testMatch: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[tj]s?(x)"],
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: "<rootDir>/" }),
  // ts-jest
  ...createDefaultPreset({}),
};

export default config;
