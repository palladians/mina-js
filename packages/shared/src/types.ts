import type { z } from "zod";
import type {
	CreateNullifierParamsSchema,
	LiteralSchema,
	NullifierSchema,
	PrivateKeySchema,
	PublicKeySchema,
	SendTransactionParamsSchema,
	SignFieldsParamsSchema,
	SignMessageParamsSchema,
	SignTransactionParamsSchema,
	SignedFieldsSchema,
	SignedMessageSchema,
	SignedTransactionSchema,
	TransactionReceiptSchema,
} from "./validation";

/**
 * Primitive types
 */
export type Literal = z.infer<typeof LiteralSchema>;
export type Json = Literal | { [key: string]: Json } | Json[];
export type PublicKey = z.infer<typeof PublicKeySchema>;
export type PrivateKey = z.infer<typeof PrivateKeySchema>;

/**
 * Parameter types
 */
export type SignFieldsParams = z.infer<typeof SignFieldsParamsSchema>;
export type SignMessageParams = z.infer<typeof SignMessageParamsSchema>;
export type CreateNullifierParams = z.infer<typeof CreateNullifierParamsSchema>;
export type SignTransactionParams = z.infer<typeof SignTransactionParamsSchema>;
export type SendTransactionParams = z.infer<typeof SendTransactionParamsSchema>;

/**
 * Return types
 */
export type SignedMessage = z.infer<typeof SignedMessageSchema>;
export type SignedFields = z.infer<typeof SignedFieldsSchema>;
export type Nullifier = z.infer<typeof NullifierSchema>;
export type SignedTransaction = z.infer<typeof SignedTransactionSchema>;
export type TransactionReceipt = z.infer<typeof TransactionReceiptSchema>;

/**
 * Signer methods
 */
export type SignFields = (params: SignFieldsParams) => Promise<SignedFields>;
export type SignMessage = (params: SignMessageParams) => Promise<SignedMessage>;
export type CreateNullifier = (
	params: CreateNullifierParams,
) => Promise<Nullifier>;
export type SignTransaction = (
	params: SignTransactionParams,
) => Promise<SignedTransaction>;
export type SendTransaction = (
	params: SendTransactionParams,
) => Promise<TransactionReceipt>;
