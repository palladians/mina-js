import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["src/accounts/index.ts", "src/providers/index.ts"],
	outDir: "./dist",
	format: ["esm", "cjs"],
	sourcemap: true,
	clean: true,
	bundle: true,
	dts: true,
});
