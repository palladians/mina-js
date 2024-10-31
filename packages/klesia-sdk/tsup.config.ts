import { defineConfig } from "tsup";
import sharedConfig from "../utils/tsup.config";

export default defineConfig({ ...sharedConfig, external: ["@mina-js/klesia"] });
