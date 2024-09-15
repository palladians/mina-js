import type { MinaProviderDetail } from "@mina-js/providers";
import { match } from "ts-pattern";

export const unito = (provider: MinaProviderDetail) => {
	return match(provider)
		.with({ info: { slug: "auro" } }, (provider) => {
			return {
				...provider,
				provider: {
					...provider.provider,
					request: null,
				},
			};
		})
		.otherwise((provider) => provider);
};
