import { z } from "zod";

export const PublicKeySchema = z.string().length(55);
export const PublicKeyParamsSchema = z.array(PublicKeySchema).length(1);
export const EmptyParamsSchema = z.array(z.string()).length(0).optional();
export const SendTransactionSchema = z.array(z.any(), z.string()).length(2);

export const RpcMethodSchema = z.discriminatedUnion("method", [
	z.object({
		method: z.literal("mina_getTransactionCount"),
		params: PublicKeyParamsSchema,
	}),
	z.object({
		method: z.literal("mina_getBalance"),
		params: PublicKeyParamsSchema,
	}),
	z.object({
		method: z.literal("mina_blockHash"),
		params: EmptyParamsSchema,
	}),
	z.object({
		method: z.literal("mina_chainId"),
		params: EmptyParamsSchema,
	}),
	z.object({
		method: z.literal("mina_sendTransaction"),
		params: SendTransactionSchema,
	}),
]);

export const RpcResponseSchema = z.object({
	jsonrpc: z.literal("2.0"),
	result: z.unknown(),
});
