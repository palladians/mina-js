import type { z } from "zod";
import type {
	KlesiaRpcMethod,
	KlesiaRpcMethodSchema,
	KlesiaRpcResponseSchema,
	LiteralSchema,
	NullifierSchema,
	PartialTransactionSchema,
	PresentationRequestSchema,
	PrivateKeySchema,
	PublicKeySchema,
	SendableSchema,
	SignedFieldsSchema,
	SignedMessageSchema,
	SignedTransactionSchema,
	StoredCredentialSchema,
	TransactionBodySchema,
	TransactionPayloadSchema,
	TransactionReceiptSchema,
	ZkAppCommandBodySchema,
	ZkAppCommandPayload,
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
export type ZkAppCommandBody = z.infer<typeof ZkAppCommandBodySchema>;
export type ZkAppCommandProperties = z.infer<typeof ZkAppCommandPayload>;
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
 * Klesia RPC types
 */
export type KlesiaRpcMethodType = z.infer<typeof KlesiaRpcMethod>;
export type KlesiaRpcRequestType = z.infer<typeof KlesiaRpcMethodSchema>;
export type KlesiaRpcResponseType = z.infer<typeof KlesiaRpcResponseSchema>;

/**
 * Private Credential types
 */
export type StoredPrivateCredential = z.infer<typeof StoredCredentialSchema>;
export type PresentationRequest = z.infer<typeof PresentationRequestSchema>;
