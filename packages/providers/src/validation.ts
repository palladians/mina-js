import { z } from "zod";

const literalSchema = z.union([z.string(), z.number(), z.boolean(), z.null()]);
type Literal = z.infer<typeof literalSchema>;
type Json = Literal | { [key: string]: Json } | Json[];
const jsonSchema: z.ZodType<Json> = z.lazy(() =>
	z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)]),
);

export const signFieldsRequestSchema = z.object({
	fields: z.array(z.coerce.number()),
});

export type SignFieldsData = z.infer<typeof signFieldsRequestSchema>;

export const signMessageRequestSchema = z.object({
	message: z.string(),
});

export type SignMessageData = z.infer<typeof signMessageRequestSchema>;

export const createNullifierRequestSchema = z.object({
	message: z.array(z.coerce.number()),
});

export type CreateNullifierData = z.infer<typeof createNullifierRequestSchema>;

export const publicKeySchema = z.string().length(55);

export const transactionSchema = z
	.object({
		to: publicKeySchema,
		from: publicKeySchema,
		fee: z.coerce.number(),
		nonce: z.coerce.number(),
		memo: z.string().optional(),
		validUntil: z.coerce.number().optional(),
		amount: z.coerce.number().optional(),
	})
	.strict();

export const signatureSchema = z
	.object({
		field: z.string(),
		scalar: z.string(),
	})
	.strict();

export const signedTransactionSchema = z.object({
	data: transactionSchema,
	publicKey: publicKeySchema,
	signature: signatureSchema,
});

export const signTransactionRequestSchema = z.object({
	transaction: transactionSchema.strict(),
});

export type SignTransactionData = z.infer<typeof signTransactionRequestSchema>;

export const sendTransactionRequestSchema = z.object({
	signedTransaction: signedTransactionSchema.strict(),
	transactionType: z.enum(["payment", "delegation", "zkapp"]),
});

export type SendTransactionData = z.infer<typeof sendTransactionRequestSchema>;

export const switchChainRequestSchema = z.object({
	chainId: z.string(),
});

export type SwitchChainData = z.infer<typeof switchChainRequestSchema>;

export const addChainRequestSchema = z.object({
	url: z.string().url(),
	name: z.string(),
});

export type AddChainData = z.infer<typeof addChainRequestSchema>;
