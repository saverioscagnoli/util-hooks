import { readFileSync } from "node:fs";
import { defineConfig } from "rolldown";

// Run from a package directory: bundles its src and leaves its deps to the consumer.
const pkg = JSON.parse(readFileSync("package.json", "utf8"));
const deps = [
  ...Object.keys(pkg.dependencies ?? {}),
  ...Object.keys(pkg.peerDependencies ?? {})
];

export default defineConfig({
  input: "src/index.ts",
  external: id => deps.some(dep => id === dep || id.startsWith(`${dep}/`)),
  platform: "neutral",
  output: [
    { dir: "dist", format: "esm", entryFileNames: "[name].js", minify: true },
    { dir: "dist", format: "cjs", entryFileNames: "[name].cjs", minify: true }
  ]
});
