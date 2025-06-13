import { PublicKeySchema, TokenIdSchema } from "@mina-js/utils";
import { match } from "ts-pattern";
import { buildResponse } from "./build-response";
import { mina } from "./methods/mina";
import { getNodeClient } from "./node";
import type { KlesiaRpcRequestType } from "./types";
import { KlesiaRpcMethod, KlesiaRpcMethodSchema } from "./validation";

export async function handleJsonRpcRequest(
	graphqlEndpoint: string,
	request: KlesiaRpcRequestType,
) {
	const body = KlesiaRpcMethodSchema.parse(request);
	const client = getNodeClient(graphqlEndpoint);
	return match(body)
		.with(
			{ method: KlesiaRpcMethod.enum.mina_getTransactionCount },
			async ({ params }) => {
				const [publicKey] = params;
				const result = await mina(client).getTransactionCount({
					publicKey: PublicKeySchema.parse(publicKey),
				});
				return buildResponse({
					result,
				});
			},
		)
		.with(
			{ method: KlesiaRpcMethod.enum.mina_getBalance },
			async ({ params }) => {
				const [publicKey, tokenId] = params;
				const result = await mina(client).getBalance({
					publicKey: PublicKeySchema.parse(publicKey),
					tokenId: tokenId !== undefined ? TokenIdSchema.parse(tokenId) : "1",
				});
				return buildResponse({ result });
			},
		)
		.with({ method: KlesiaRpcMethod.enum.mina_blockHash }, async () => {
			const result = await mina(client).blockHash();
			return buildResponse({ result });
		})
		.with({ method: KlesiaRpcMethod.enum.mina_networkId }, async () => {
			const result = await mina(client).networkId();
			return buildResponse({ result });
		})
		.with(
			{ method: KlesiaRpcMethod.enum.mina_sendTransaction },
			async ({ params }) => {
				const [signedTransaction, type] = params;
				const result = await mina(client).sendTransaction({
					signedTransaction,
					type,
				});
				return buildResponse({
					result,
				});
			},
		)
		.with(
			{ method: KlesiaRpcMethod.enum.mina_getAccount },
			async ({ params }) => {
				const [publicKey, tokenId] = params;
				const result = await mina(client).getAccount({
					publicKey: PublicKeySchema.parse(publicKey),
					tokenId: tokenId !== undefined ? TokenIdSchema.parse(tokenId) : "1",
				});
				return buildResponse({ result });
			},
		)
		.exhaustive();
}
