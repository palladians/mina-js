import type { Account } from "@mina-js/accounts";
import { createClient } from "@mina-js/klesia-sdk";
import { match } from "ts-pattern";
import { createStore } from "./store";

export type WalletProviderSlug = "pallad";

export type ProviderSource = "window.mina" | "klesia" | WalletProviderSlug;

export type CreateWalletClientProps = {
	account: Account;
	network: "mainnet" | "devnet";
	providerSource?: ProviderSource;
};

const getWalletProvider = (providerSource: ProviderSource) => {
	if (providerSource === "window.mina") {
		if (!window.mina) throw new Error("window.mina is not available");
		return window.mina;
	}
	const providerStore = createStore();
	const injectedProvider = providerStore.findProvider({ slug: providerSource });
	if (!injectedProvider)
		throw new Error(`Provider ${providerSource} not found`);
	return injectedProvider.provider;
};

export const createWalletClient = ({
	account,
	network,
	providerSource = "window.mina",
}: CreateWalletClientProps) => {
	const klesiaClient = createClient({ network });
	const getAccounts = async () => {
		return match(providerSource)
			.with("klesia", () => [account.publicKey])
			.otherwise(async () => {
				const provider = getWalletProvider(providerSource);
				const { result } = await provider.request<"mina_accounts">({
					method: "mina_accounts",
				});
				return result;
			});
	};
	const getBalance = async () => {
		return match(providerSource)
			.with("klesia", async () => {
				console.log(">>>START");
				const { result } = await klesiaClient.request<"mina_getBalance">({
					method: "mina_getBalance",
					params: [account.publicKey],
				});
				console.log(">>>RES", result);
				return BigInt(result);
			})
			.otherwise(async () => {
				const provider = getWalletProvider(providerSource);
				const { result } = await provider.request<"mina_getBalance">({
					method: "mina_getBalance",
				});
				return result;
			});
	};
	return {
		getAccounts,
		getBalance,
	};
};
