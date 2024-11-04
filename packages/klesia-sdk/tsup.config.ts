import { defineConfig } from "tsup";
import sharedConfig from "../utils/tsup.config";

export default defineConfig({
	...sharedConfig,
	bundle: true,
	splitting: false,
});
