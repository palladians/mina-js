import type { z } from "zod";
import type {
	NullifierSchema,
	PublicKeySchema,
	SignedFieldsSchema,
	SignedMessageSchema,
	TransactionReceiptSchema,
} from "./validation";

export type PublicKey = z.infer<typeof PublicKeySchema>;

export type SignedMessage = z.infer<typeof SignedMessageSchema>;

export type SignedFields = z.infer<typeof SignedFieldsSchema>;

export type Nullifier = z.infer<typeof NullifierSchema>;

export type TransactionReceipt = z.infer<typeof TransactionReceiptSchema>;
