import { FieldSchema, TransactionBodySchema } from "@mina-js/utils";
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
		transaction: TransactionBodySchema,
	})
	.strict();
