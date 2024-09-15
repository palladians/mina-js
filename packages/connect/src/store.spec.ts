import { expect, it, mock } from "bun:test";
import { mockedProvider } from "./__mocks__/provider";
import { announceProvider } from "./events";
import { createStore } from "./store";

it("should initialize the store", () => {
	const store = createStore();
	expect(store).toMatchSnapshot();
});

it("should update providers", () => {
	const store = createStore();
	const listener = mock();
	store.subscribe(listener);
	announceProvider(mockedProvider);
	const provider = store.getProviders()[0];
	expect(listener).toHaveBeenCalled();
	expect(provider).toEqual(mockedProvider);
});

it("should unsubscribe from store", () => {
	const store = createStore();
	const listener = mock();
	const unsub = store.subscribe(listener);
	unsub();
	announceProvider(mockedProvider);
	expect(listener).not.toHaveBeenCalled();
});

it("should clear providers list", () => {
	const store = createStore();
	const listener = mock();
	store.subscribe(listener);
	announceProvider(mockedProvider);
	store.clear();
	const providers = store.getProviders();
	expect(providers.length).toEqual(0);
});
