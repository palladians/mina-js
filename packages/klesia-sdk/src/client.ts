import type { KlesiaRpc } from "@mina-js/klesia";
import { hc } from "hono/client";
import { match } from "ts-pattern";
import { z } from "zod";

const NetworkMatcher = z.enum(["mainnet", "devnet"]);

type CreateClientProps = { network: "mainnet" | "devnet"; customUrl?: string };

export const createClient = ({ network, customUrl }: CreateClientProps) => {
	const baseClient = match(NetworkMatcher.parse(network))
		.with("devnet", () =>
			hc<KlesiaRpc>(customUrl ?? "https://devnet.klesia.palladians.xyz"),
		)
		.with("mainnet", () =>
			hc<KlesiaRpc>(customUrl ?? "https://mainnet.klesia.palladians.xyz"),
		)
		.exhaustive();
	const rpcHandler = baseClient.api.$post;
	type RpcRequest = Parameters<typeof rpcHandler>[0];
	const request = async (req: RpcRequest["json"]) => {
		return (await baseClient.api.$post({ json: req })).json();
	};
	return {
		request,
	};
};
