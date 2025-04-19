import typescript from "@rollup/plugin-typescript";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import nodePolyfills from "rollup-plugin-node-polyfills";

export default [
  {
    input: "src/index.ts",
    output: [
      {
        file: "dist/index.js",
        format: "es",
        sourcemap: true,
      },
      {
        file: "dist/index.cjs",
        format: "cjs",
        sourcemap: true,
      },
    ],
    plugins: [
      nodePolyfills(),
      typescript({
        tsconfig: "./tsconfig.json",
        exclude: ["**/*.test.ts"],
        include: ["./src/**/*"],
      }),
      resolve(),
      commonjs(),
    ],
  },
];
