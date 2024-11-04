import dotenv from "dotenv";
import { defineConfig } from "tsup";
import sharedConfig from "../../packages/utils/tsup.config";

export default defineConfig({
	...sharedConfig,
	entry: ["src/index.ts", "src/server.ts", "src/schema.ts"],
	external: ["dotenv"],
	env: dotenv.config().parsed,
});
