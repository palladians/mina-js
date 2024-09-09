import { defineConfig } from "tsup";
import sharedConfig from "../../packages/shared/tsup.config";

export default defineConfig({
	...sharedConfig,
	entry: ["src/index.ts", "src/server.ts"],
});
