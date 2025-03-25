import { KlesiaNetwork } from "@mina-js/klesia-utils";
import { match } from "ts-pattern";
import { z } from "zod";

const MINA_NETWORK = KlesiaNetwork.parse(process.env.MINA_NETWORK ?? "devnet");
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
const NODE_API_ZEKO_DEVNET = z
	.string()
	.parse(process.env.NODE_API_ZEKO_DEVNET ?? "https://devnet.zeko.io/graphql");

export const getNodeApiUrl = () => {
	return match(MINA_NETWORK)
		.with("devnet", () => NODE_API_DEVNET)
		.with("mainnet", () => NODE_API_MAINNET)
		.with("zeko_devnet", () => NODE_API_ZEKO_DEVNET)
		.exhaustive();
};
