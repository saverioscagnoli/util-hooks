import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["use-event/src/index.ts"],
  dts: true,
  clean: true,
  minify: true,
});
