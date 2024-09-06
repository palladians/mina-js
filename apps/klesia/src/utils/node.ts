import { Client, cacheExchange, fetchExchange } from "@urql/core";
import { match } from "ts-pattern";
import { z } from "zod";

const NetworkMatcher = z.enum(["devnet", "mainnet"]);

const MINA_NETWORK = NetworkMatcher.parse(process.env.MINA_NETWORK ?? "devnet");
const NODE_API_DEVNET = z
	.string()
	.parse(
		process.env.NODE_API_DEVNET ??
			"https://api.minascan.io/node/devnet/v1/graphql",
	);
const NODE_API_MAINNET = z
	.string()
	.parse(
		process.env.NODE_API_MAINNET ??
			"https://api.minascan.io/node/mainnet/v1/graphql",
	);

export const getNodeApiUrl = () => {
	return match(MINA_NETWORK)
		.with("devnet", () => NODE_API_DEVNET)
		.with("mainnet", () => NODE_API_MAINNET)
		.exhaustive();
};

export const getNodeClient = () => {
	const url = getNodeApiUrl();
	if (!url) throw new Error("Invalid network config.");
	return new Client({ url, exchanges: [cacheExchange, fetchExchange] });
};
