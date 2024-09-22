import "./global-polyfill";
import type {
	Account,
	CreateNullifier,
	SignFields,
	SignMessage,
	SignTransaction,
} from "@mina-js/accounts";
import { createClient } from "@mina-js/klesia-sdk";
import type { PartiallyFormedTransactionProperties } from "@mina-js/shared";
import { match } from "ts-pattern";
import { createStore } from "./store";

export type WalletProviderSlug = "pallad";

export type ProviderSource = "window.mina" | "klesia" | WalletProviderSlug;

export type CreateWalletClientProps = {
	account?: Account;
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
			.with("klesia", () => (account ? [account.publicKey] : []))
			.otherwise(async () => {
				const provider = getWalletProvider(providerSource);
				const { result } = await provider.request<"mina_accounts">({
					method: "mina_accounts",
				});
				return result;
			});
	};
	const getBalance = async () => {
		const getBalanceFromInjectedWallet = async () => {
			const provider = getWalletProvider(providerSource);
			const { result } = await provider.request<"mina_getBalance">({
				method: "mina_getBalance",
			});
			return result;
		};
		const getBalanceFromKlesia = async (account: Account) => {
			const { result } = await klesiaClient.request<"mina_getBalance">({
				method: "mina_getBalance",
				params: [account.publicKey],
			});
			return BigInt(result);
		};
		return match(providerSource)
			.with("klesia", async () => {
				if (account) return getBalanceFromKlesia(account);
				return getBalanceFromInjectedWallet();
			})
			.otherwise(getBalanceFromInjectedWallet);
	};
	const getTransactionCount = async () => {
		if (!account)
			throw new Error("Account is required to get transaction count");
		const { result } = await klesiaClient.request<"mina_getTransactionCount">({
			method: "mina_getTransactionCount",
			params: [account.publicKey],
		});
		return BigInt(result);
	};
	const getChainId = async () => {
		return match(providerSource)
			.with("klesia", async () => {
				const { result } = await klesiaClient.request<"mina_chainId">({
					method: "mina_chainId",
				});
				return result;
			})
			.otherwise(async () => {
				const provider = getWalletProvider(providerSource);
				const { result } = await provider.request<"mina_chainId">({
					method: "mina_chainId",
				});
				return result;
			});
	};
	const signTransaction: SignTransaction = async (params) => {
		if (!account) throw new Error("Account is required to sign transaction");
		if (account.type !== "local") throw new Error("Account type not supported");
		return account.signTransaction(params);
	};
	const signMessage: SignMessage = async (params) => {
		if (!account) throw new Error("Account is required to sign message");
		if (account.type !== "local") throw new Error("Account type not supported");
		return account.signMessage(params);
	};
	const signFields: SignFields = async (params) => {
		if (!account) throw new Error("Account is required to sign fields");
		if (account.type !== "local") throw new Error("Account type not supported");
		return account.signFields(params);
	};
	const createNullifier: CreateNullifier = async (params) => {
		if (!account) throw new Error("Account is required to create nullifier");
		if (account.type !== "local") throw new Error("Account type not supported");
		return account.createNullifier(params);
	};
	const estimateFees = async () => {
		const { result } = await klesiaClient.request<"mina_estimateFees">({
			method: "mina_estimateFees",
		});
		return {
			low: BigInt(result.low),
			medium: BigInt(result.medium),
			high: BigInt(result.high),
		};
	};
	const prepareTransactionRequest = async (
		transaction: PartiallyFormedTransactionProperties,
	) => {
		let fee = transaction.fee;
		let nonce = transaction.nonce;
		if (!nonce) {
			nonce = await getTransactionCount();
		}
		if (!fee) {
			fee = BigInt((await estimateFees()).medium);
		}
		return {
			...transaction,
			fee,
			nonce,
		};
	};
	return {
		getAccounts,
		getBalance,
		getTransactionCount,
		getChainId,
		signTransaction,
		signMessage,
		signFields,
		createNullifier,
		estimateFees,
		prepareTransactionRequest,
	};
};
