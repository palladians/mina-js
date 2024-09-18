import {
	KlesiaNetwork,
	type KlesiaRpc,
	type RpcErrorType,
	type RpcResponseType,
} from "@mina-js/klesia";
import { hc } from "hono/client";
import { match } from "ts-pattern";

type CreateClientProps = {
	network: "mainnet" | "devnet" | "zeko_devnet";
	customUrl?: string;
	throwable?: boolean;
};

const throwRpcError = ({
	code,
	message,
}: { code: number; message: string }) => {
	throw new Error(`${code} - ${message}`);
};

export const createClient = ({
	network,
	customUrl,
	throwable = true,
}: CreateClientProps) => {
	const baseUrl = customUrl
		? customUrl
		: match(KlesiaNetwork.parse(network))
				.with("devnet", () => "https://devnet.klesia.palladians.xyz")
				.with("mainnet", () => "https://mainnet.klesia.palladians.xyz")
				.with("zeko_devnet", () => "https://zeko-devnet.klesia.palladians.xyz")
				.exhaustive();
	const baseClient = hc<KlesiaRpc>(baseUrl, {
		headers: {
			"Access-Control-Allow-Origin": "*",
		},
	});
	const rpcHandler = baseClient.api.$post;
	type RpcRequest = Parameters<typeof rpcHandler>[0];
	const request = async <T extends string>(req: RpcRequest["json"]) => {
		const json = (await (
			await baseClient.api.$post({ json: req })
		).json()) as Extract<RpcResponseType, { method: T }> & {
			error?: RpcErrorType;
		};
		if (!throwable) {
			return json;
		}
		if (json?.error) {
			const { code, message } = json.error;
			return throwRpcError({ code, message });
		}
		return json;
	};
	return {
		request,
	};
};
