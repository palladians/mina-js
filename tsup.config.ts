import { defineConfig } from "tsup";

export default defineConfig({
	outDir: "./dist",
	format: ["esm", "cjs"],
	sourcemap: true,
	clean: true,
	bundle: true,
	dts: true,
});
