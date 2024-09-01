import { Client, cacheExchange, fetchExchange } from "@urql/core";
import { match } from "ts-pattern";

const MINA_NETWORK = process.env.MINA_NETWORK;

export const getNodeApiUrl = () => {
	return match(MINA_NETWORK)
		.with("devnet", () => process.env.NODE_API_DEVNET)
		.with("mainnet", () => process.env.NODE_API_MAINNET)
		.run();
};

export const getNodeClient = () => {
	const url = getNodeApiUrl();
	if (!url) throw new Error("Invalid network config.");
	return new Client({ url, exchanges: [cacheExchange, fetchExchange] });
};
