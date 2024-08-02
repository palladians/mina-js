import { mock } from "bun:test";
import type { MinaProviderDetail } from "@mina-js/providers";

export const mockedProvider: MinaProviderDetail = {
	info: {
		name: "Pallad",
		icon: "data:image/",
		rdns: "co.pallad",
		slug: "pallad",
	},
	provider: {
		request: mock(),
		addListener: mock(),
		removeListener: mock(),
	},
};
