import { defineConfig } from "tsup";
import sharedConfig from "../../packages/utils/tsup.config";

export default defineConfig({
	...sharedConfig,
	entry: ["src/index.ts", "src/server.ts"],
});
