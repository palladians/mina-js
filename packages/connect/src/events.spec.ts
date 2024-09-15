import { expect, it, mock } from "bun:test";
import type { MinaAnnounceProviderEvent } from "@mina-js/providers";
import { mockedProvider } from "./__mocks__/provider";
import { announceProvider, requestProviders } from "./events";

type Resolver = (value: unknown) => void;

it("announces Mina Provider with window event", async () => {
	const listener =
		(resolve: Resolver) =>
		({ detail }: MinaAnnounceProviderEvent) => {
			expect(detail.info.slug).toEqual(mockedProvider.info.slug);
			resolve(true);
		};
	await new Promise((resolve) => {
		window.addEventListener("mina:announceProvider", listener(resolve));
		announceProvider(mockedProvider);
		window.removeEventListener("mina:announceProvider", listener(resolve));
	});
});

it("requests Mina Provider with window event", () => {
	const listener = mock();
	window.addEventListener("mina:requestProvider", listener);
	requestProviders(() => {});
	expect(listener).toHaveBeenCalled();
	window.removeEventListener("mina:requestProvider", listener);
});
