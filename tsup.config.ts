import { defineConfig } from "tsup";

export default defineConfig({
  entry: [
    "packages/use-event-react/src/index.ts",
    "packages/use-event-solid/src/index.ts"
  ],
  clean: true,
  minify: true,
  sourcemap: true
});
