// @ts-check
import { createDefaultPreset } from "ts-jest";
import baseConfig from "@repo/configs/jest.config.js";

/** @type {import('jest').Config} */
const config = {
  ...baseConfig,
  testEnvironment: "jsdom",
  rootDir: ".",
  roots: ["<rootDir>/src"],
  ...createDefaultPreset({
    tsconfig: "./tsconfig.json",
  }),
};

export default config;
