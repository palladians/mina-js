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

export const UInt32Schema = z.coerce.string();

export const UInt64Schema = z.coerce.string();

export const SignSchema = z.union([
	z.literal("Positive"),
	z.literal("Negative"),
]);

export const FieldSchema = z.coerce.string();

export const GroupSchema = z
	.object({
		x: FieldSchema,
		y: FieldSchema,
	})
	.strict();

export const PublicKeySchema = z.string().length(55).startsWith("B62");

export const TokenIdSchema = z.union([z.string().length(50), z.literal("1")]);

export const PrivateKeySchema = z.string().length(52);

export const NetworkId = z.string().regex(networkPattern);

export const MinaScanNetwork = z.enum(["devnet", "mainnet"]);

export const EpochDataSchema = z
	.object({
		ledger: z
			.object({
				hash: FieldSchema.nullable(),
				totalCurrency: z
					.object({
						lower: UInt64Schema,
						upper: UInt64Schema,
					})
					.strict()
					.nullable(),
			})
			.strict(),
		seed: FieldSchema.nullable(),
		startCheckpoint: FieldSchema.nullable(),
		lockCheckpoint: FieldSchema.nullable(),
		epochLength: z
			.object({
				lower: UInt32Schema,
				upper: UInt32Schema,
			})
			.strict()
			.nullable(),
	})
	.strict();

// https://github.com/o1-labs/o1js/blob/4c60cda83949262db1449bc1103b7b46f9d6980a/src/lib/mina/v1/account-update.ts#L593
export const FeePayerBodySchema = z
	.object({
		publicKey: PublicKeySchema,
		fee: UInt64Schema,
		nonce: UInt32Schema,
		validUntil: UInt32Schema.nullable().optional(),
	})
	.strict();

export const TransactionBodySchema = z
	.object({
		from: PublicKeySchema,
		to: PublicKeySchema,
		memo: z.string().optional(),
		fee: UInt64Schema,
		nonce: UInt32Schema,
		validUntil: UInt32Schema.optional(),
		amount: UInt64Schema.optional(),
	})
	.strict();

export const TransactionPayloadSchema = z
	.object({
		transaction: TransactionBodySchema,
	})
	.strict();

export const PartialTransactionSchema = TransactionBodySchema.extend({
	fee: UInt64Schema.optional(),
	nonce: UInt32Schema.optional(),
});

/**
 * zkApp command schemas
 */
export const AuthRequiredSchema = z.union([
	z.literal("Signature"),
	z.literal("Proof"),
	z.literal("Either"),
	z.literal("None"),
	z.literal("Impossible"),
]);

export const ZkAppStateSchema = z.array(FieldSchema.nullable()).length(8);

export const AccountUpdateSchema = z
	.object({
		body: z
			.object({
				publicKey: PublicKeySchema,
				tokenId: TokenIdSchema,
				update: z
					.object({
						appState: ZkAppStateSchema,
						delegate: PublicKeySchema.nullable(),
						verificationKey: z
							.object({
								data: z.string(),
								hash: FieldSchema,
							})
							.strict()
							.nullable(),
						permissions: z
							.object({
								editState: AuthRequiredSchema,
								access: AuthRequiredSchema,
								send: AuthRequiredSchema,
								receive: AuthRequiredSchema,
								setDelegate: AuthRequiredSchema,
								setPermissions: AuthRequiredSchema,
								setVerificationKey: z
									.object({
										auth: AuthRequiredSchema,
										txnVersion: UInt32Schema,
									})
									.strict(),
								setZkappUri: AuthRequiredSchema,
								editActionState: AuthRequiredSchema,
								setTokenSymbol: AuthRequiredSchema,
								incrementNonce: AuthRequiredSchema,
								setVotingFor: AuthRequiredSchema,
								setTiming: AuthRequiredSchema,
							})
							.strict()
							.nullable(),
						zkappUri: z.string().nullable(),
						tokenSymbol: z.string().nullable(),
						timing: z
							.object({
								initialMinimumBalance: UInt64Schema,
								cliffTime: UInt32Schema,
								cliffAmount: UInt64Schema,
								vestingPeriod: UInt32Schema,
								vestingIncrement: UInt64Schema,
							})
							.strict()
							.nullable(),
						votingFor: FieldSchema.nullable(),
					})
					.strict(),
				balanceChange: z
					.object({
						magnitude: UInt64Schema,
						sgn: SignSchema,
					})
					.strict(),
				incrementNonce: z.boolean(),
				events: z.array(z.array(FieldSchema)),
				actions: z.array(z.array(FieldSchema)),
				callData: FieldSchema,
				callDepth: z.number(),
				preconditions: z
					.object({
						network: z
							.object({
								snarkedLedgerHash: FieldSchema.nullable(),
								blockchainLength: z
									.object({
										lower: UInt32Schema,
										upper: UInt32Schema,
									})
									.strict()
									.nullable(),
								minWindowDensity: z
									.object({
										lower: UInt32Schema,
										upper: UInt32Schema,
									})
									.strict()
									.nullable(),
								totalCurrency: z
									.object({
										lower: UInt64Schema,
										upper: UInt64Schema,
									})
									.strict()
									.nullable(),
								globalSlotSinceGenesis: z
									.object({
										lower: UInt32Schema,
										upper: UInt32Schema,
									})
									.strict()
									.nullable(),
								stakingEpochData: EpochDataSchema,
								nextEpochData: EpochDataSchema,
							})
							.strict(),
						account: z
							.object({
								balance: z
									.object({
										lower: UInt64Schema,
										upper: UInt64Schema,
									})
									.strict()
									.nullable(),
								nonce: z
									.object({
										lower: UInt32Schema,
										upper: UInt32Schema,
									})
									.strict()
									.nullable(),
								receiptChainHash: FieldSchema.nullable(),
								delegate: PublicKeySchema.nullable(),
								state: ZkAppStateSchema,
								actionState: FieldSchema.nullable(),
								provedState: z.boolean().nullable(),
								isNew: z.boolean().nullable(),
							})
							.strict(),
						validWhile: z
							.object({
								lower: UInt32Schema,
								upper: UInt32Schema,
							})
							.strict()
							.nullable(),
					})
					.strict(),
				useFullCommitment: z.boolean(),
				implicitAccountCreationFee: z.boolean(),
				mayUseToken: z
					.object({
						parentsOwnToken: z.boolean(),
						inheritFromParent: z.boolean(),
					})
					.strict(),
				authorizationKind: z
					.object({
						isSigned: z.boolean(),
						isProved: z.boolean(),
						verificationKeyHash: FieldSchema,
					})
					.strict(),
			})
			.strict(),
		authorization: z
			.object({
				proof: z.string().nullable().optional(),
				signature: z.string().nullable().optional(),
			})
			.strict(),
	})
	.strict();

// https://github.com/o1-labs/o1js/blob/4c60cda83949262db1449bc1103b7b46f9d6980a/src/bindings/mina-transaction/gen/v1/transaction-json.ts#L31
export const ZkAppCommandBodySchema = z
	.object({
		feePayer: z
			.object({
				body: FeePayerBodySchema,
				authorization: z.string(),
			})
			.strict(),
		accountUpdates: z.array(AccountUpdateSchema),
		memo: z.string(),
	})
	.strict();

export const ZkAppCommandTransactionInputSchema = z
	.object({
		zkappCommand: ZkAppCommandBodySchema,
		feePayer: FeePayerBodySchema,
	})
	.strict();

export const ZkAppCommandPayload = z
	.object({
		command: ZkAppCommandTransactionInputSchema,
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
		data: z.union([TransactionBodySchema, ZkAppCommandTransactionInputSchema]),
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
	input: ZkAppCommandTransactionInputSchema,
});

export const SendableSchema = z.union([
	SendTransactionBodySchema,
	SendZkAppBodySchema,
]);

export const TypedSendableSchema = z.tuple([
	SendableSchema,
	z.enum(["payment", "delegation", "zkapp"]),
]);

export const PublicKeyParamsSchema = z.tuple([PublicKeySchema]);

export const EmptyParamsSchema = z.tuple([]).optional();

export const zkAppAccountSchema = z.object({
	address: PublicKeySchema,
	tokenId: TokenIdSchema,
	network: MinaScanNetwork,
});
