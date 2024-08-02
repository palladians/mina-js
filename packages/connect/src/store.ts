import type { MinaProviderDetail } from "@mina-js/providers";
import { requestProviders } from "./events";

export type Listener = (providerDetails: readonly MinaProviderDetail[]) => void;

export type Store = {
	/**
	 * Clears the store, including all provider details.
	 */
	clear(): void;
	/**
	 * Destroys the store, including all provider details and listeners.
	 */
	destroy(): void;
	/**
	 * Finds a provider detail by its slug.
	 */
	findProvider(args: { slug: string }): MinaProviderDetail | undefined;
	/**
	 * Returns all provider details that have been emitted.
	 */
	getProviders(): readonly MinaProviderDetail[];
	/**
	 * Resets the store, and emits an event to request provider details.
	 */
	reset(): void;
	/**
	 * Subscribes to emitted provider details.
	 */
	subscribe(
		listener: Listener,
		args?: { emitImmediately?: boolean | undefined } | undefined,
	): () => void;

	/**
	 * @internal
	 * Current state of listening listeners.
	 */
	_listeners(): Set<Listener>;
};

export function createStore(): Store {
	const listeners: Set<Listener> = new Set();
	let providerDetails: readonly MinaProviderDetail[] = [];

	const request = () =>
		requestProviders((providerDetail) => {
			if (
				providerDetails.some(
					({ info }) => info.slug === providerDetail.info.slug,
				)
			)
				return;

			providerDetails = [...providerDetails, providerDetail];
			for (const listener of listeners) {
				listener(providerDetails);
			}
		});
	let unwatch = request();

	return {
		_listeners() {
			return listeners;
		},
		clear() {
			for (const listener of listeners) {
				listener([]);
			}
			providerDetails = [];
		},
		destroy() {
			this.clear();
			listeners.clear();
			unwatch?.();
		},
		findProvider({ slug }) {
			return providerDetails.find(
				(providerDetail) => providerDetail.info.slug === slug,
			);
		},
		getProviders() {
			return providerDetails;
		},
		reset() {
			this.clear();
			unwatch?.();
			unwatch = request();
		},
		subscribe(listener, { emitImmediately } = {}) {
			listeners.add(listener);
			if (emitImmediately) listener(providerDetails);
			return () => listeners.delete(listener);
		},
	};
}
