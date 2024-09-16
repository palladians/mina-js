import type { z } from "zod";
import type {
	LiteralSchema,
	NullifierSchema,
	PrivateKeySchema,
	PublicKeySchema,
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
 * Return types
 */
export type SignedMessage = z.infer<typeof SignedMessageSchema>;
export type SignedFields = z.infer<typeof SignedFieldsSchema>;
export type Nullifier = z.infer<typeof NullifierSchema>;
export type SignedTransaction = z.infer<typeof SignedTransactionSchema>;
export type TransactionReceipt = z.infer<typeof TransactionReceiptSchema>;
