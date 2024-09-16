import { FieldSchema, TransactionPayload } from "@mina-js/shared";
import { z } from "zod";

export const SignFieldsParamsSchema = z
	.object({
		fields: z.array(FieldSchema),
	})
	.strict();

export const SignMessageParamsSchema = z
	.object({
		message: z.string(),
	})
	.strict();

export const CreateNullifierParamsSchema = z
	.object({
		message: z.array(FieldSchema),
	})
	.strict();

export const SignTransactionParamsSchema = z
	.object({
		transaction: TransactionPayload,
	})
	.strict();
