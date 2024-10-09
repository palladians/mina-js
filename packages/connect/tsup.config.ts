import { defineConfig } from "tsup";
import sharedConfig from "../utils/tsup.config";

export default defineConfig({
	...sharedConfig,
	entry: ["./src/index.ts", "./src/window.ts"],
});
