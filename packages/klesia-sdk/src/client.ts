import {
	KlesiaNetwork,
	type KlesiaRpcRequestType,
	type KlesiaRpcResponseType,
} from "@mina-js/klesia-utils";
import { ftch, jsonrpc } from "micro-ftch";
import { match } from "ts-pattern";

const net = ftch(fetch);

type CreateClientProps = {
	network: "mainnet" | "devnet" | "zeko_devnet";
	customUrl?: string;
};

export const createClient = ({ network, customUrl }: CreateClientProps) => {
	const baseUrl = customUrl
		? customUrl
		: match(KlesiaNetwork.parse(network))
				.with("devnet", () => "https://devnet.klesia.palladians.xyz/api")
				.with("mainnet", () => "https://mainnet.klesia.palladians.xyz/api")
				.with(
					"zeko_devnet",
					() => "https://zeko-devnet.klesia.palladians.xyz/api",
				)
				.exhaustive();
	const rpc = jsonrpc(net, baseUrl);
	const request = async <T extends string>(req: KlesiaRpcRequestType) => {
		const params = req.params ?? [];
		const json: Extract<KlesiaRpcResponseType, { method: T }>["result"] =
			await rpc.call(req.method, ...params);
		return json;
	};
	return {
		request,
	};
};
