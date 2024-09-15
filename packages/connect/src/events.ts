import type {
	MinaAnnounceProviderEvent,
	MinaProviderDetail,
} from "@mina-js/providers";

export type AnnounceProviderReturnType = () => void;

/**
 * Creates an event to announce a Mina provider and registers a handler to respond to subsequent requests.
 *
 * @param {MinaProviderDetail} detail - The details of the provider to announce.
 * @returns {AnnounceProviderReturnType} A function to remove the event listener when it is no longer needed.
 */
export function announceProvider(
	detail: MinaProviderDetail,
): AnnounceProviderReturnType {
	const event: CustomEvent<MinaProviderDetail> = new CustomEvent(
		"mina:announceProvider",
		{ detail: Object.freeze(detail) },
	);
	window.dispatchEvent(event);
	const handler = () => window.dispatchEvent(event);
	window.addEventListener("mina:requestProvider", handler);
	return () => window.removeEventListener("mina:requestProvider", handler);
}

export type RequestProvidersParameters = (
	providerDetail: MinaProviderDetail,
) => void;
export type RequestProvidersReturnType = (() => void) | undefined;

/**
 * Requests providers to be announced.
 *
 * This function adds an event listener for "mina:announceProvider" events and
 * dispatches a custom event named "mina:requestProvider" to trigger the announce.
 *
 * @param listener A callback function that will be called when a provider is announced.
 */
export function requestProviders(
	listener: RequestProvidersParameters,
): RequestProvidersReturnType {
	if (typeof window === "undefined") return;
	const handler = (event: MinaAnnounceProviderEvent) => listener(event.detail);

	window.addEventListener("mina:announceProvider", handler as never);

	window.dispatchEvent(new CustomEvent("mina:requestProvider"));

	return () =>
		window.removeEventListener("mina:announceProvider", handler as never);
}
