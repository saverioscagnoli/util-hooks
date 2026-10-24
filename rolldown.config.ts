import { readFileSync } from "node:fs";
import { defineConfig } from "rolldown";

// Run from a package directory: bundles its src and leaves its deps to the consumer.
const pkg = JSON.parse(readFileSync("package.json", "utf8"));
const deps = [
  ...Object.keys(pkg.dependencies ?? {}),
  ...Object.keys(pkg.peerDependencies ?? {})
];

// One entry per subpath export: "." -> src/index.ts, "./worker" -> src/worker.ts
const input = Object.keys(pkg.exports).map(key =>
  key === "." ? "src/index.ts" : `src/${key.slice(2)}.ts`
);

export default defineConfig({
  input,
  external: id => deps.some(dep => id === dep || id.startsWith(`${dep}/`)),
  platform: "neutral",
  output: [
    { dir: "dist", format: "esm", entryFileNames: "[name].js", minify: true },
    { dir: "dist", format: "cjs", entryFileNames: "[name].cjs", minify: true }
  ]
});
