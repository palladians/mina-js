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
		signature: SignatureSchema,
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
		params: PublicKeyParamsSchema,
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
		params: PublicKeyParamsSchema,
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

// TODO: Should probably move these validations to a separate file

interface ProofType {
	name: string;
	publicInput: SerializedType;
	publicOutput: SerializedType;
	maxProofsVerified: number;
	featureFlags: Record<string, unknown>;
}

export interface SerializedType {
	_type?: string;
	// TODO: update based on mina-credentials
	type?: "Constant";
	value?: string;
	size?: number;
	proof?: ProofType;
	innerType?: SerializedType;
	[key: string]: SerializedType | string | number | ProofType | undefined;
}

// Private Credentials: Serialized Type and Value Schemas

const SerializedValueSchema = z
	.object({
		_type: z.string(),
		value: JsonSchema,
		properties: z.record(z.any()).optional(),
	})
	.strict();

const ProofTypeSchema: z.ZodType<ProofType> = z.lazy(() =>
	z
		.object({
			name: z.string(),
			publicInput: SerializedTypeSchema,
			publicOutput: SerializedTypeSchema,
			maxProofsVerified: z.number(),
			featureFlags: z.record(z.any()),
		})
		.strict(),
);

const SerializedTypeSchema: z.ZodType<SerializedType> = z.lazy(() =>
	z.union([
		// Basic type
		z
			.object({
				_type: z.string(),
			})
			.strict(),
		// Constant type
		z
			.object({
				type: z.literal("Constant"),
				value: z.string(),
			})
			.strict(),
		// Bytes type
		z
			.object({
				_type: z.literal("Bytes"),
				size: z.number(),
			})
			.strict(),
		// Proof type
		z
			.object({
				_type: z.literal("Proof"),
				proof: ProofTypeSchema,
			})
			.strict(),
		// Array type
		z
			.object({
				_type: z.literal("Array"),
				innerType: SerializedTypeSchema,
				size: z.number(),
			})
			.strict(),
		// Allow records of nested types for Struct
		z.record(SerializedTypeSchema),
	]),
);

const SerializedFieldSchema = z
	.object({
		_type: z.literal("Field"),
		value: z.string(),
	})
	.strict();

const SerializedPublicKeySchema = z
	.object({
		_type: z.literal("PublicKey"),
		value: z.string(),
	})
	.strict();

const SerializedPublicKeyTypeSchema = z
	.object({
		_type: z.literal("PublicKey"),
	})
	.strict();

const SerializedSignatureSchema = z
	.object({
		_type: z.literal("Signature"),
		value: z.object({
			r: z.string(),
			s: z.string(),
		}),
	})
	.strict();

// Private Credentials: Node schemas

export type Node =
	| { type: "owner" }
	| { type: "issuer"; credentialKey: string }
	| { type: "constant"; data: z.infer<typeof SerializedValueSchema> }
	| { type: "root" }
	| { type: "property"; key: string; inner: Node }
	| { type: "record"; data: Record<string, Node> }
	| { type: "equals"; left: Node; right: Node }
	| { type: "equalsOneOf"; input: Node; options: Node[] | Node }
	| { type: "lessThan"; left: Node; right: Node }
	| { type: "lessThanEq"; left: Node; right: Node }
	| { type: "add"; left: Node; right: Node }
	| { type: "sub"; left: Node; right: Node }
	| { type: "mul"; left: Node; right: Node }
	| { type: "div"; left: Node; right: Node }
	| { type: "and"; inputs: Node[] }
	| { type: "or"; left: Node; right: Node }
	| { type: "not"; inner: Node }
	| { type: "hash"; inputs: Node[]; prefix?: string | null }
	| { type: "ifThenElse"; condition: Node; thenNode: Node; elseNode: Node };

const NodeSchema: z.ZodType<Node> = z.lazy(() =>
	z.discriminatedUnion("type", [
		z
			.object({
				type: z.literal("owner"),
			})
			.strict(),

		z
			.object({
				type: z.literal("issuer"),
				credentialKey: z.string(),
			})
			.strict(),

		z
			.object({
				type: z.literal("constant"),
				data: SerializedValueSchema,
			})
			.strict(),

		z
			.object({
				type: z.literal("root"),
			})
			.strict(),

		z
			.object({
				type: z.literal("property"),
				key: z.string(),
				inner: NodeSchema,
			})
			.strict(),

		z
			.object({
				type: z.literal("record"),
				data: z.record(NodeSchema),
			})
			.strict(),

		z
			.object({
				type: z.literal("equals"),
				left: NodeSchema,
				right: NodeSchema,
			})
			.strict(),

		z
			.object({
				type: z.literal("equalsOneOf"),
				input: NodeSchema,
				options: z.union([
					z.array(NodeSchema), // For array of nodes case
					NodeSchema,
				]),
			})
			.strict(),

		z
			.object({
				type: z.literal("lessThan"),
				left: NodeSchema,
				right: NodeSchema,
			})
			.strict(),

		z
			.object({
				type: z.literal("lessThanEq"),
				left: NodeSchema,
				right: NodeSchema,
			})
			.strict(),

		z
			.object({
				type: z.literal("add"),
				left: NodeSchema,
				right: NodeSchema,
			})
			.strict(),

		z
			.object({
				type: z.literal("sub"),
				left: NodeSchema,
				right: NodeSchema,
			})
			.strict(),

		z
			.object({
				type: z.literal("mul"),
				left: NodeSchema,
				right: NodeSchema,
			})
			.strict(),

		z
			.object({
				type: z.literal("div"),
				left: NodeSchema,
				right: NodeSchema,
			})
			.strict(),

		z
			.object({
				type: z.literal("and"),
				inputs: z.array(NodeSchema),
			})
			.strict(),

		z
			.object({
				type: z.literal("or"),
				left: NodeSchema,
				right: NodeSchema,
			})
			.strict(),

		z
			.object({
				type: z.literal("not"),
				inner: NodeSchema,
			})
			.strict(),

		z
			.object({
				type: z.literal("hash"),
				inputs: z.array(NodeSchema),
				prefix: z.union([z.string(), z.null()]).optional(),
			})
			.strict(),

		z
			.object({
				type: z.literal("ifThenElse"),
				condition: NodeSchema,
				thenNode: NodeSchema,
				elseNode: NodeSchema,
			})
			.strict(),
	]),
);

// Private Credentials: Input Schema

const InputSchema = z.discriminatedUnion("type", [
	z
		.object({
			type: z.literal("credential"),
			credentialType: z.union([
				z.literal("simple"),
				z.literal("unsigned"),
				z.literal("recursive"),
			]),
			witness: z.union([z.record(SerializedTypeSchema), SerializedTypeSchema]),
			data: z.union([z.record(SerializedTypeSchema), SerializedTypeSchema]),
		})
		.strict(),

	z
		.object({
			type: z.literal("constant"),
			data: SerializedTypeSchema,
			value: z.union([z.string(), z.record(z.string())]),
		})
		.strict(),

	z
		.object({
			type: z.literal("claim"),
			data: z.union([z.record(SerializedTypeSchema), SerializedTypeSchema]),
		})
		.strict(),
]);

// Private Credentials: Context schemas

const HttpsContextSchema = z
	.object({
		type: z.literal("https"),
		action: z.string(),
		serverNonce: SerializedFieldSchema,
	})
	.strict();

const ZkAppContextSchema = z
	.object({
		type: z.literal("zk-app"),
		action: SerializedFieldSchema,
		serverNonce: SerializedFieldSchema,
	})
	.strict();

const ContextSchema = z.union([HttpsContextSchema, ZkAppContextSchema]);

// Private Credentials: PresentationRequestSchema

export const PresentationRequestSchema = z
	.object({
		type: z.union([
			z.literal("no-context"),
			z.literal("zk-app"),
			z.literal("https"),
		]),
		spec: z
			.object({
				inputs: z.record(InputSchema),
				logic: z
					.object({
						assert: NodeSchema,
						outputClaim: NodeSchema,
					})
					.strict(),
			})
			.strict(),
		claims: z.record(SerializedValueSchema),
		inputContext: z.union([ContextSchema, z.null()]),
	})
	.strict();

// Private Credentials: Witness Schemas

const SimpleWitnessSchema = z
	.object({
		type: z.literal("simple"),
		issuer: SerializedPublicKeySchema,
		issuerSignature: SerializedSignatureSchema,
	})
	.strict();

const RecursiveWitnessSchema = z
	.object({
		type: z.literal("recursive"),
		vk: z
			.object({
				data: z.string(),
				hash: SerializedFieldSchema,
			})
			.strict(),
		proof: z
			.object({
				_type: z.literal("Proof"),
				value: z
					.object({
						publicInput: JsonSchema,
						publicOutput: JsonSchema,
						maxProofsVerified: z.number().min(0).max(2),
						proof: z.string(),
					})
					.strict(),
			})
			.strict(),
	})
	.strict();

const UnsignedWitnessSchema = z
	.object({
		type: z.literal("unsigned"),
	})
	.strict();

const WitnessSchema = z.discriminatedUnion("type", [
	SimpleWitnessSchema,
	RecursiveWitnessSchema,
	UnsignedWitnessSchema,
]);

// Private Credentials: Credential Schemas

const SimpleCredentialSchema = z
	.object({
		owner: SerializedPublicKeySchema,
		data: z.record(SerializedValueSchema),
	})
	.strict();

const StructCredentialSchema = z
	.object({
		_type: z.literal("Struct"),
		properties: z
			.object({
				owner: SerializedPublicKeyTypeSchema,
				data: JsonSchema,
			})
			.strict(),
		value: z
			.object({
				owner: PublicKeySchema,
				data: JsonSchema,
			})
			.strict(),
	})
	.strict();

// Private Credentials: Stored Credential Schema

export const StoredCredentialSchema = z
	.object({
		version: z.literal("v0"),
		witness: WitnessSchema,
		metadata: JsonSchema.optional(),
		credential: z.union([SimpleCredentialSchema, StructCredentialSchema]),
	})
	.strict();
