import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";

export default [
  {
    external: ["crypto"],
    input: "src/index.ts",
    output: { dir: "./lib/cjs/", exports: "named", format: "cjs" },
    plugins: [
      resolve(),
      commonjs(),
      typescript({
        declarationDir: "./lib/cjs/types/",
        noEmitOnError: false,
        outDir: "./lib/cjs/",
      }),
    ],
  },

  {
    external: ["crypto"],
    input: "src/index.ts",
    output: { dir: "./lib/esm/", format: "es" },
    plugins: [
      resolve(),
      commonjs(),
      typescript({
        declarationDir: "./lib/esm/types/",
        noEmitOnError: false,
        outDir: "./lib/esm/",
      }),
    ],
  },
];
