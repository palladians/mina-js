import type { RpcErrorType, RpcMethodType } from "../schema";

export const buildResponse = ({
	result,
	error,
	method,
}: { result?: unknown; error?: RpcErrorType; method: RpcMethodType }) => {
	if (error) {
		return {
			jsonrpc: "2.0",
			error,
			method,
		};
	}
	return { jsonrpc: "2.0", result, method };
};
