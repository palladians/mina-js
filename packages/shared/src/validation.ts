import { z } from "zod";

export const FieldSchema = z.coerce.bigint();

export const GroupSchema = z.object({
	x: FieldSchema,
	y: FieldSchema,
});

export const PublicKeySchema = z.string().length(55).startsWith("B62");

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
	data: z.array(z.number()),
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

export const TransactionReceiptSchema = z.object({
	hash: z.string(),
});
