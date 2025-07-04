import type { z } from "zod";
import type {
	FeePayerBodySchema,
	LiteralSchema,
	NullifierSchema,
	PartialTransactionSchema,
	PrivateKeySchema,
	PublicKeySchema,
	SendableSchema,
	SignedFieldsSchema,
	SignedMessageSchema,
	SignedTransactionSchema,
	TransactionBodySchema,
	TransactionOrZkAppCommandSchema,
	TransactionPayloadSchema,
	TransactionReceiptSchema,
	ZkAppCommandPayload,
	ZkAppCommandTransactionInputSchema,
} from "./validation";

/**
 * Primitive types
 */
export type Literal = z.infer<typeof LiteralSchema>;
export type Json = Literal | { [key: string]: Json } | Json[];
export type PublicKey = z.infer<typeof PublicKeySchema>;
export type PrivateKey = z.infer<typeof PrivateKeySchema>;
export type TransactionBody = z.infer<typeof TransactionBodySchema>;
export type TransactionPayload = z.infer<typeof TransactionPayloadSchema>;
export type PartialTransaction = z.infer<typeof PartialTransactionSchema>;
export type FeePayerBody = z.infer<typeof FeePayerBodySchema>;
export type ZkAppCommandTransactionInput = z.infer<
	typeof ZkAppCommandTransactionInputSchema
>;
export type ZkAppCommandProperties = z.infer<typeof ZkAppCommandPayload>;
export type TransactionOrZkAppCommandProperties = z.infer<
	typeof TransactionOrZkAppCommandSchema
>;
export type Sendable = z.infer<typeof SendableSchema>;

/**
 * Return types
 */
export type SignedMessage = z.infer<typeof SignedMessageSchema>;
export type SignedFields = z.infer<typeof SignedFieldsSchema>;
export type Nullifier = z.infer<typeof NullifierSchema>;
export type SignedTransaction = z.infer<typeof SignedTransactionSchema>;
export type TransactionReceipt = z.infer<typeof TransactionReceiptSchema>;

/**
 * Private Credential types
 */
