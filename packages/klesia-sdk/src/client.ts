import {
	KlesiaNetwork,
	type RpcRequestType,
	type RpcResponseType,
} from "@mina-js/klesia/schema";
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
				.with("devnet", () => "https://devnet.klesia.palladians.xyz")
				.with("mainnet", () => "https://mainnet.klesia.palladians.xyz")
				.with("zeko_devnet", () => "https://zeko-devnet.klesia.palladians.xyz")
				.exhaustive();
	const rpc = jsonrpc(net, `${baseUrl}/api`);
	const request = async <T extends string>(req: RpcRequestType) => {
		const params = req.params ?? [];
		const json: Extract<RpcResponseType, { method: T }>["result"] =
			await rpc.call(req.method, ...params);
		return json;
	};
	return {
		request,
	};
};
