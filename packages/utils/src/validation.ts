import { z } from "zod";
import type { Json } from "./types";

export const networkPattern = /^[^:]+:[^:]+$/;

/**
 * Data primitive schemas
 */
export const LiteralSchema = z.union([
	z.string(),
	z.number(),
	z.boolean(),
	z.null(),
]);
export const JsonSchema: z.ZodType<Json> = z.lazy(() =>
	z.union([LiteralSchema, z.array(JsonSchema), z.record(JsonSchema)]),
);

export const FieldSchema = z.coerce.string();

export const GroupSchema = z
	.object({
		x: FieldSchema,
		y: FieldSchema,
	})
	.strict();

export const PublicKeySchema = z.string().length(55).startsWith("B62");

export const PrivateKeySchema = z.string().length(52);

export const NetworkId = z.string().regex(networkPattern);

export const KlesiaNetwork = z.enum(["devnet", "mainnet", "zeko_devnet"]);

export const MinaScanNetwork = z.enum(["devnet", "mainnet"]);

export const FeePayerSchema = z
	.object({
		feePayer: PublicKeySchema,
		fee: z.coerce.string(),
		nonce: z.coerce.string(),
		memo: z.string().optional(),
		validUntil: z.coerce.string().optional(),
	})
	.strict();

export const TransactionBodySchema = z
	.object({
		from: PublicKeySchema,
		to: PublicKeySchema,
		memo: z.string().optional(),
		fee: z.coerce.string(),
		nonce: z.coerce.string(),
		validUntil: z.coerce.string().optional(),
		amount: z.coerce.string().optional(),
	})
	.strict();

export const TransactionPayloadSchema = z
	.object({
		transaction: TransactionBodySchema,
	})
	.strict();

export const PartialTransactionSchema = TransactionBodySchema.extend({
	fee: z.coerce.string().optional(),
	nonce: z.coerce.string().optional(),
});

export const ZkAppCommandBodySchema = z
	.object({
		zkappCommand: JsonSchema,
		feePayer: FeePayerSchema,
	})
	.strict();

export const ZkAppCommandPayload = z
	.object({
		command: ZkAppCommandBodySchema,
	})
	.strict();
export const TransactionOrZkAppCommandSchema = z.union([
	TransactionPayloadSchema,
	ZkAppCommandPayload,
]);

/**
 * Return type schemas
 */
export const SignatureSchema = z
	.object({
		field: z.string(),
		scalar: z.string(),
	})
	.strict();

export const SignedMessageSchema = z
	.object({
		publicKey: PublicKeySchema,
		data: z.string(),
		signature: SignatureSchema,
	})
	.strict();

export const SignedFieldsSchema = z
	.object({
		data: z.array(FieldSchema),
		publicKey: PublicKeySchema,
		signature: z.string(),
	})
	.strict();

export const NullifierSchema = z
	.object({
		publicKey: GroupSchema,
		public: z.object({
			nullifier: GroupSchema,
			s: FieldSchema,
		}),
		private: z.object({
			c: FieldSchema,
			g_r: GroupSchema,
			h_m_pk_r: GroupSchema,
		}),
	})
	.strict();

export const SignedTransactionSchema = z
	.object({
		signature: z.union([SignatureSchema, z.string()]),
		publicKey: PublicKeySchema,
		data: z.union([TransactionBodySchema, ZkAppCommandBodySchema]),
	})
	.strict();

export const TransactionReceiptSchema = z
	.object({
		hash: z.string(),
	})
	.strict();

export const SendTransactionBodySchema = z.object({
	input: TransactionBodySchema,
	signature: SignatureSchema,
});

export const SendZkAppBodySchema = z.object({
	input: JsonSchema,
});

export const SendableSchema = z.union([
	SendTransactionBodySchema,
	SendZkAppBodySchema,
]);

export const TypedSendableSchema = z.tuple([
	SendableSchema,
	z.enum(["payment", "delegation", "zkapp"]),
]);

export const KlesiaRpcMethod = z.enum([
	"mina_getTransactionCount",
	"mina_getBalance",
	"mina_blockHash",
	"mina_networkId",
	"mina_sendTransaction",
	"mina_getAccount",
]);

export const PublicKeyParamsSchema = z.tuple([PublicKeySchema]);

export const EmptyParamsSchema = z.tuple([]).optional();

export const KlesiaRpcMethodSchema = z.discriminatedUnion("method", [
	z.object({
		method: z.literal(KlesiaRpcMethod.enum.mina_getTransactionCount),
		params: PublicKeyParamsSchema,
	}),
	z.object({
		method: z.literal(KlesiaRpcMethod.enum.mina_getBalance),
		params: z.union([PublicKeyParamsSchema, z.tuple([PublicKeySchema, z.string()])]),
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
		params: z.union([PublicKeyParamsSchema, z.tuple([PublicKeySchema, z.string()])]),
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

export const zkAppAccountSchema = z.object({
	address: PublicKeySchema,
	tokenId: z.string(),
	network: MinaScanNetwork,
});
