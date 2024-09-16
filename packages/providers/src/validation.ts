import {
	FieldSchema,
	NullifierSchema,
	PublicKeySchema,
	SignedFieldsSchema,
	SignedMessageSchema,
	SignedTransactionSchema,
	TransactionPayload,
	TransactionReceiptSchema,
} from "@mina-js/shared";
import { z } from "zod";

export const SwitchChainRequestParams = z.object({
	chainId: z.string(),
});

export const AddChainRequestParams = z.object({
	url: z.string().url(),
	name: z.string(),
});

// Params
export const AccountsRequestParamsSchema = z
	.object({ method: z.literal("mina_accounts") })
	.strict();
export const ChainIdRequestParamsSchema = z
	.object({ method: z.literal("mina_chainId") })
	.strict();
export const ChainInformationRequestParamsSchema = z
	.object({ method: z.literal("mina_chainInformation") })
	.strict();
export const GetBalanceRequestParamsSchema = z
	.object({ method: z.literal("mina_getBalance") })
	.strict();
export const SignRequestParamsSchema = z
	.object({
		method: z.literal("mina_sign"),
		params: z.array(z.string()),
	})
	.strict();
export const SignFieldsRequestParamsSchema = z
	.object({
		method: z.literal("mina_signFields"),
		params: z.array(z.array(FieldSchema)),
	})
	.strict();
export const SignTransactionRequestParamsSchema = z
	.object({
		method: z.literal("mina_signTransaction"),
		params: z.array(TransactionPayload),
	})
	.strict();
export const SendTransactionRequestParamsSchema = z
	.object({
		method: z.literal("mina_sendTransaction"),
		params: z.array(TransactionPayload),
	})
	.strict();
export const CreateNullifierRequestParamsSchema = z
	.object({
		method: z.literal("mina_createNullifier"),
		params: z.array(z.array(FieldSchema)),
	})
	.strict();
export const SwitchChainRequestParamsSchema = z.object({
	method: z.literal("mina_switchChain"),
	params: z.array(z.string()),
});
export const AddChainRequestParamsSchema = z
	.object({
		method: z.literal("mina_addChain"),
		params: z.array(AddChainRequestParams),
	})
	.strict();

// Returns
export const AccountsRequestReturnSchema = z
	.object({
		method: z.literal("mina_accounts"),
		result: z.array(PublicKeySchema),
	})
	.strict();
export const ChainIdRequestReturnSchema = z
	.object({
		method: z.literal("mina_chainId"),
		result: z.string(),
	})
	.strict();
export const ChainInformationRequestReturnSchema = z
	.object({
		method: z.literal("mina_chainInformation"),
		result: z.object({ url: z.string(), name: z.string() }).strict(),
	})
	.strict();
export const GetBalanceRequestReturnSchema = z
	.object({
		method: z.literal("mina_getBalance"),
		result: z.number(),
	})
	.strict();
export const SignRequestReturnSchema = z
	.object({
		method: z.literal("mina_sign"),
		result: SignedMessageSchema,
	})
	.strict();
export const SignFieldsRequestReturnSchema = z
	.object({
		method: z.literal("mina_signFields"),
		result: SignedFieldsSchema,
	})
	.strict();
export const SignTransactionRequestReturnSchema = z
	.object({
		method: z.literal("mina_signTransaction"),
		result: SignedTransactionSchema,
	})
	.strict();
export const SendTransactionRequestReturnSchema = z
	.object({
		method: z.literal("mina_sendTransaction"),
		result: TransactionReceiptSchema,
	})
	.strict();
export const CreateNullifierRequestReturnSchema = z
	.object({
		method: z.literal("mina_createNullifier"),
		result: NullifierSchema,
	})
	.strict();
export const SwitchChainRequestReturnSchema = z
	.object({
		method: z.literal("mina_switchChain"),
		result: z.string(),
	})
	.strict();
export const AddChainRequestReturnSchema = z
	.object({
		method: z.literal("mina_addChain"),
		result: z.string(),
	})
	.strict();

export const RpcReturnTypesUnion = z.discriminatedUnion("method", [
	AccountsRequestReturnSchema,
	ChainIdRequestReturnSchema,
	ChainInformationRequestReturnSchema,
	GetBalanceRequestReturnSchema,
	SignRequestReturnSchema,
	SignFieldsRequestReturnSchema,
	SignTransactionRequestReturnSchema,
	SendTransactionRequestReturnSchema,
	CreateNullifierRequestReturnSchema,
	SwitchChainRequestReturnSchema,
	AddChainRequestReturnSchema,
]);

export const ProviderRequestParamsUnion = z.discriminatedUnion("method", [
	AccountsRequestParamsSchema,
	ChainIdRequestParamsSchema,
	ChainInformationRequestParamsSchema,
	GetBalanceRequestParamsSchema,
	SignRequestParamsSchema,
	SignFieldsRequestParamsSchema,
	SignTransactionRequestParamsSchema,
	SendTransactionRequestParamsSchema,
	CreateNullifierRequestParamsSchema,
	SwitchChainRequestParamsSchema,
	AddChainRequestParamsSchema,
]);
export type RpcReturnTypesUnionType = z.infer<typeof RpcReturnTypesUnion>;
export type ResultType<M extends string> = {
	jsonrpc: "2.0";
	result: Extract<RpcReturnTypesUnionType, { method: M }>["result"];
};

export const ChainIdCallbackSchema = z
	.function()
	.args(z.object({ chainId: z.string() }))
	.returns(z.void());

// TODO: Add missing deconstruction types to listeners
export const ConnectedListenerSchema = z
	.function()
	.args(z.literal("connected"), ChainIdCallbackSchema)
	.returns(z.void());
export const DisconnectedListenerSchema = z
	.function()
	.args(z.literal("disconnected"), z.function())
	.returns(z.void());
export const ChainChangedListenerSchema = z
	.function()
	.args(z.literal("chainChanged"), ChainIdCallbackSchema)
	.returns(z.void());
export const AccountsChangedListenerSchema = z
	.function()
	.args(z.literal("accountsChanged"), z.function())
	.returns(z.void());
export const MessageListenerSchema = z
	.function()
	.args(z.literal("mina_message"), z.function())
	.returns(z.void());

export const ProviderListenerSchema = z.union([
	ConnectedListenerSchema,
	DisconnectedListenerSchema,
	ChainChangedListenerSchema,
	AccountsChangedListenerSchema,
	MessageListenerSchema,
]);

export const ProviderRpcErrorSchema = z.discriminatedUnion("code", [
	z
		.object({
			code: z.literal(4001),
			message: z.literal("User Rejected Request"),
		})
		.strict(),
	z
		.object({
			code: z.literal(4100),
			message: z.literal("Unauthorized"),
		})
		.strict(),
	z
		.object({
			code: z.literal(4200),
			message: z.literal("Unsupported Method"),
		})
		.strict(),
	z
		.object({
			code: z.literal(4900),
			message: z.literal("Disconnected"),
		})
		.strict(),
	z
		.object({
			code: z.literal(4901),
			message: z.literal("Chain Disconnected"),
		})
		.strict(),
]);

export const MinaProviderInfoSchema = z.object({
	icon: z.string().startsWith("data:image/"),
	name: z.string(),
	rdns: z.string(),
	slug: z.string(),
});
