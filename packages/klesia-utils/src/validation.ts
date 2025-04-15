import {
	EmptyParamsSchema,
	PublicKeyParamsSchema,
	PublicKeySchema,
	TypedSendableSchema,
} from "@mina-js/utils";
import { z } from "zod";

export const KlesiaNetwork = z.enum(["devnet", "mainnet", "zeko_devnet"]);

export const KlesiaRpcMethod = z.enum([
	"mina_getTransactionCount",
	"mina_getBalance",
	"mina_blockHash",
	"mina_networkId",
	"mina_sendTransaction",
	"mina_getAccount",
]);

export const KlesiaRpcMethodSchema = z.discriminatedUnion("method", [
	z.object({
		method: z.literal(KlesiaRpcMethod.enum.mina_getTransactionCount),
		params: PublicKeyParamsSchema,
	}),
	z.object({
		method: z.literal(KlesiaRpcMethod.enum.mina_getBalance),
		params: z.union([
			PublicKeyParamsSchema,
			z.tuple([PublicKeySchema, z.string()]),
		]),
	}),
	z.object({
		method: z.literal(KlesiaRpcMethod.enum.mina_blockHash),
		params: EmptyParamsSchema,
	}),
	z.object({
		method: z.literal(KlesiaRpcMethod.enum.mina_networkId),
		params: EmptyParamsSchema,
	}),
	z.object({
		method: z.literal(KlesiaRpcMethod.enum.mina_sendTransaction),
		params: TypedSendableSchema,
	}),
	z.object({
		method: z.literal(KlesiaRpcMethod.enum.mina_getAccount),
		params: z.union([
			PublicKeyParamsSchema,
			z.tuple([PublicKeySchema, z.string()]),
		]),
	}),
]);

export const JsonRpcResponse = z.object({
	jsonrpc: z.literal("2.0"),
});

export const RpcError = z.object({
	code: z.number(),
	message: z.string(),
});

export const ErrorSchema = JsonRpcResponse.extend({
	error: RpcError,
});

export const KlesiaRpcResponseSchema = z.union([
	z.discriminatedUnion("method", [
		JsonRpcResponse.extend({
			method: z.literal(KlesiaRpcMethod.enum.mina_getTransactionCount),
			result: z.string(),
		}),
		JsonRpcResponse.extend({
			method: z.literal(KlesiaRpcMethod.enum.mina_getBalance),
			result: z.string(),
		}),
		JsonRpcResponse.extend({
			method: z.literal(KlesiaRpcMethod.enum.mina_blockHash),
			result: z.string(),
		}),
		JsonRpcResponse.extend({
			method: z.literal(KlesiaRpcMethod.enum.mina_networkId),
			result: z.string(),
		}),
		JsonRpcResponse.extend({
			method: z.literal(KlesiaRpcMethod.enum.mina_sendTransaction),
			result: z.string(),
		}),
		JsonRpcResponse.extend({
			method: z.literal(KlesiaRpcMethod.enum.mina_getAccount),
			result: z.object({
				nonce: z.string(),
				balance: z.string(),
			}),
		}),
	]),
	ErrorSchema,
]);
