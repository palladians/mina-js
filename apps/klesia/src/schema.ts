import {
	PublicKeySchema,
	TransportableDelegationPayload,
	TransportableTransactionPayload,
} from "@mina-js/utils";
import { z } from "zod";
import { SendZkappInput } from "./zkapp";

export const KlesiaNetwork = z.enum(["devnet", "mainnet", "zeko_devnet"]);
export const PublicKeyParamsSchema = z.array(PublicKeySchema).length(1);
export const EmptyParamsSchema = z.array(z.string()).length(0).optional();
export const SignatureSchema = z.union([
	z.object({
		rawSignature: z.string(),
	}),
	z.object({ field: z.string(), scalar: z.string() }),
]);
export const SendTransactionBodySchema = z.object({
	input: TransportableTransactionPayload,
	signature: SignatureSchema,
});
export const SendDelegationBodySchema = z.object({
	input: TransportableDelegationPayload,
	signature: SignatureSchema,
});
export const SendZkAppBodySchema = z.object({
	input: SendZkappInput,
});
export const SendableSchema = z.union([
	SendTransactionBodySchema,
	SendDelegationBodySchema,
	SendZkAppBodySchema,
]);
export const SendTransactionSchema = z.tuple([
	z.any(),
	z.enum(["payment", "delegation", "zkapp"]),
]);

export const RpcMethod = z.enum([
	"mina_getTransactionCount",
	"mina_getBalance",
	"mina_blockHash",
	"mina_chainId",
	"mina_sendTransaction",
	"mina_getAccount",
	"mina_estimateFees",
]);
export type RpcMethodType = z.infer<typeof RpcMethod>;

export const RpcMethodSchema = z.discriminatedUnion("method", [
	z.object({
		method: z.literal(RpcMethod.enum.mina_getTransactionCount),
		params: PublicKeyParamsSchema,
	}),
	z.object({
		method: z.literal(RpcMethod.enum.mina_getBalance),
		params: PublicKeyParamsSchema,
	}),
	z.object({
		method: z.literal(RpcMethod.enum.mina_blockHash),
		params: EmptyParamsSchema,
	}),
	z.object({
		method: z.literal(RpcMethod.enum.mina_chainId),
		params: EmptyParamsSchema,
	}),
	z.object({
		method: z.literal(RpcMethod.enum.mina_sendTransaction),
		params: SendTransactionSchema,
	}),
	z.object({
		method: z.literal(RpcMethod.enum.mina_getAccount),
		params: PublicKeyParamsSchema,
	}),
	z.object({
		method: z.literal(RpcMethod.enum.mina_estimateFees),
		params: EmptyParamsSchema,
	}),
]);

export const JsonRpcResponse = z.object({
	jsonrpc: z.literal("2.0"),
});

export const RpcError = z.object({
	code: z.number(),
	message: z.string(),
});

export type RpcErrorType = z.infer<typeof RpcError>;

export const ErrorSchema = JsonRpcResponse.extend({
	error: RpcError,
});

export const RpcResponseSchema = z.union([
	z.discriminatedUnion("method", [
		JsonRpcResponse.extend({
			method: z.literal(RpcMethod.enum.mina_getTransactionCount),
			result: z.string(),
		}),
		JsonRpcResponse.extend({
			method: z.literal(RpcMethod.enum.mina_getBalance),
			result: z.string(),
		}),
		JsonRpcResponse.extend({
			method: z.literal(RpcMethod.enum.mina_blockHash),
			result: z.string(),
		}),
		JsonRpcResponse.extend({
			method: z.literal(RpcMethod.enum.mina_chainId),
			result: z.string(),
		}),
		JsonRpcResponse.extend({
			method: z.literal(RpcMethod.enum.mina_sendTransaction),
			result: z.string(),
		}),
		JsonRpcResponse.extend({
			method: z.literal(RpcMethod.enum.mina_getAccount),
			result: z.object({
				nonce: z.string(),
				balance: z.string(),
			}),
		}),
		JsonRpcResponse.extend({
			method: z.literal(RpcMethod.enum.mina_estimateFees),
			result: z.object({
				low: z.string(),
				medium: z.string(),
				high: z.string(),
			}),
		}),
	]),
	ErrorSchema,
]);

export type RpcResponseType = z.infer<typeof RpcResponseSchema>;
