import type {
	MinaAnnounceProviderEvent,
	MinaProviderClient,
	MinaRequestProviderEvent,
} from "@mina-js/providers";

declare global {
	interface WindowEventMap {
		"mina:announceProvider": MinaAnnounceProviderEvent;
		"mina:requestProvider": MinaRequestProviderEvent;
	}
	interface Window {
		mina?: MinaProviderClient | undefined;
	}
}

export * from "./store";
export * from "./events";
