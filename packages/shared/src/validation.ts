import { z } from "zod";
import type { Json } from "./types";

/**
 * Data primitive schemas
 */
export const LiteralSchema = z.union([
	z.string(),
	z.number(),
	z.boolean(),
	z.null(),
]);
const JsonSchema: z.ZodType<Json> = z.lazy(() =>
	z.union([LiteralSchema, z.array(JsonSchema), z.record(JsonSchema)]),
);

export const FieldSchema = z.coerce.bigint();

export const GroupSchema = z.object({
	x: FieldSchema,
	y: FieldSchema,
});

export const PublicKeySchema = z.string().length(55).startsWith("B62");

export const PrivateKeySchema = z.string().length(52);

export const TransactionPayload = z.object({
	from: PublicKeySchema,
	to: PublicKeySchema,
	memo: z.string().optional(),
	fee: z.coerce.bigint(),
	amount: z.coerce.bigint(),
	nonce: z.coerce.bigint(),
	validUntil: z.coerce.bigint().optional(),
});

/**
 * Parameter schemas
 */
export const SignFieldsParamsSchema = z.object({
	fields: z.array(z.coerce.bigint()),
});

export const SignMessageParamsSchema = z.object({
	message: z.string(),
});

export const CreateNullifierParamsSchema = z.object({
	message: z.array(z.coerce.bigint()),
});

export const SignTransactionParamsSchema = z.object({
	transaction: TransactionPayload,
});

export const SendTransactionParamsSchema = z.object({
	signedTransaction: TransactionPayload.strict(),
	transactionType: z.enum(["payment", "delegation", "zkapp"]),
});

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

export const SignedFieldsSchema = z.object({
	data: z.array(FieldSchema),
	publicKey: PublicKeySchema,
	signature: z.string(),
});

export const NullifierSchema = z.object({
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
});

export const SignedTransactionSchema = z.object({
	signature: SignatureSchema,
	publicKey: PublicKeySchema,
	data: TransactionPayload,
});

export const TransactionReceiptSchema = z.object({
	hash: z.string(),
});
