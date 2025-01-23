import {
	FieldSchema,
	JsonSchema,
	NetworkId,
	NullifierSchema,
	PublicKeySchema,
	SignedFieldsSchema,
	SignedMessageSchema,
	SignedTransactionSchema,
	TransactionPayloadSchema,
	TransactionReceiptSchema,
	TypedSendableSchema,
	ZkAppCommandPayload,
	zkAppAccountSchema,
} from "@mina-js/utils";
import { z } from "zod";

import {
	PresentationRequestSchema,
	StoredCredentialSchema,
} from "mina-credentials/validation";

export const SwitchChainRequestParams = z
	.object({
		networkId: z.string(),
	})
	.strict();

export const AddChainRequestParams = z
	.object({
		url: z.string().url(),
		name: z.string(),
		slug: NetworkId,
	})
	.strict();

// Params
export const RequestWithContext = z
	.object({
		context: z.record(z.any()).default({}).optional(),
	})
	.strict();
export const AccountsRequestParamsSchema = RequestWithContext.extend({
	method: z.literal("mina_accounts"),
}).strict();
export const RequestAccountsRequestParamsSchema = RequestWithContext.extend({
	method: z.literal("mina_requestAccounts"),
}).strict();
export const NetworkIdRequestParamsSchema = RequestWithContext.extend({
	method: z.literal("mina_networkId"),
}).strict();
export const ChainInformationRequestParamsSchema = RequestWithContext.extend({
	method: z.literal("mina_requestNetwork"),
}).strict();
export const GetBalanceRequestParamsSchema = RequestWithContext.extend({
	method: z.literal("mina_getBalance"),
}).strict();
export const SignRequestParamsSchema = RequestWithContext.extend({
	method: z.literal("mina_sign"),
	params: z.array(z.string()),
}).strict();
export const SignFieldsRequestParamsSchema = RequestWithContext.extend({
	method: z.literal("mina_signFields"),
	params: z.array(z.array(FieldSchema)),
}).strict();
export const SignTransactionRequestParamsSchema = RequestWithContext.extend({
	method: z.literal("mina_signTransaction"),
	params: z.array(z.union([TransactionPayloadSchema, ZkAppCommandPayload])),
}).strict();
export const SendTransactionRequestParamsSchema = RequestWithContext.extend({
	method: z.literal("mina_sendTransaction"),
	params: TypedSendableSchema,
}).strict();
export const CreateNullifierRequestParamsSchema = RequestWithContext.extend({
	method: z.literal("mina_createNullifier"),
	params: z.array(z.array(FieldSchema)),
}).strict();
export const SwitchChainRequestParamsSchema = RequestWithContext.extend({
	method: z.literal("mina_switchChain"),
	params: z.array(z.string()),
}).strict();
export const AddChainRequestParamsSchema = RequestWithContext.extend({
	method: z.literal("mina_addChain"),
	params: z.array(AddChainRequestParams),
}).strict();
export const SetStateRequestParamsSchema = RequestWithContext.extend({
	method: z.literal("mina_setState"),
	params: z.array(JsonSchema),
}).strict();
export const GetStateRequestParamsSchema = RequestWithContext.extend({
	method: z.literal("mina_getState"),
	params: z.array(JsonSchema),
}).strict();
export const StorePrivateCredentialRequestParamsSchema =
	RequestWithContext.extend({
		method: z.literal("mina_storePrivateCredential"),
		// biome-ignore lint/suspicious/noExplicitAny: nested types from mina-credentials
		params: z.array(StoredCredentialSchema as z.ZodType<any>),
	}).strict();
export const PresentationRequestParamsSchema = RequestWithContext.extend({
	method: z.literal("mina_requestPresentation"),
	params: z.array(
		z
			.object({
				// biome-ignore lint/suspicious/noExplicitAny: nested types from mina-credentials
				presentationRequest: PresentationRequestSchema as z.ZodType<any>,
				zkAppAccount: zkAppAccountSchema.optional(),
			})
			.strict(),
	),
}).strict();

// Returns
export const AccountsRequestReturnSchema = z
	.object({
		method: z.literal("mina_accounts"),
		result: z.array(PublicKeySchema),
	})
	.strict();
export const RequestAccountsRequestReturnSchema = z
	.object({
		method: z.literal("mina_requestAccounts"),
		result: z.array(PublicKeySchema),
	})
	.strict();
export const NetworkIdRequestReturnSchema = z
	.object({
		method: z.literal("mina_networkId"),
		result: NetworkId,
	})
	.strict();
export const ChainInformationRequestReturnSchema = z
	.object({
		method: z.literal("mina_requestNetwork"),
		result: AddChainRequestParams,
	})
	.strict();
export const GetBalanceRequestReturnSchema = z
	.object({
		method: z.literal("mina_getBalance"),
		result: z.string(),
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
export const SetStateRequestReturnSchema = z
	.object({
		method: z.literal("mina_setState"),
		result: z.object({ success: z.boolean() }),
	})
	.strict();
export const GetStateRequestReturnSchema = z
	.object({
		method: z.literal("mina_getState"),
		result: JsonSchema,
	})
	.strict();
export const StorePrivateCredentialReturnSchema = z
	.object({
		method: z.literal("mina_storePrivateCredential"),
		result: z.object({ success: z.boolean() }).strict(),
	})
	.strict();
export const PresentationRequestReturnSchema = z
	.object({
		method: z.literal("mina_requestPresentation"),
		result: z.object({ presentation: z.string() }).strict(),
	})
	.strict();

export const RpcReturnTypesUnion = z.discriminatedUnion("method", [
	AccountsRequestReturnSchema,
	RequestAccountsRequestReturnSchema,
	NetworkIdRequestReturnSchema,
	ChainInformationRequestReturnSchema,
	GetBalanceRequestReturnSchema,
	SignRequestReturnSchema,
	SignFieldsRequestReturnSchema,
	SignTransactionRequestReturnSchema,
	SendTransactionRequestReturnSchema,
	CreateNullifierRequestReturnSchema,
	SwitchChainRequestReturnSchema,
	AddChainRequestReturnSchema,
	SetStateRequestReturnSchema,
	GetStateRequestReturnSchema,
	StorePrivateCredentialReturnSchema,
	PresentationRequestReturnSchema,
]);

export const ProviderRequestParamsUnion = z.discriminatedUnion("method", [
	AccountsRequestParamsSchema,
	RequestAccountsRequestParamsSchema,
	NetworkIdRequestParamsSchema,
	ChainInformationRequestParamsSchema,
	GetBalanceRequestParamsSchema,
	SignRequestParamsSchema,
	SignFieldsRequestParamsSchema,
	SignTransactionRequestParamsSchema,
	SendTransactionRequestParamsSchema,
	CreateNullifierRequestParamsSchema,
	SwitchChainRequestParamsSchema,
	AddChainRequestParamsSchema,
	SetStateRequestParamsSchema,
	GetStateRequestParamsSchema,
	StorePrivateCredentialRequestParamsSchema,
	PresentationRequestParamsSchema,
]);
export type RpcReturnTypesUnionType = z.infer<typeof RpcReturnTypesUnion>;
export type ResultType<M extends string> = {
	jsonrpc: "2.0";
	result: Extract<RpcReturnTypesUnionType, { method: M }>["result"];
};

export const NetworkIdCallbackSchema = z
	.function()
	.args(z.object({ networkId: z.string() }))
	.returns(z.void());

// TODO: Add missing deconstruction types to listeners
export const ConnectedListenerSchema = z
	.function()
	.args(z.literal("connected"), NetworkIdCallbackSchema)
	.returns(z.void());
export const DisconnectedListenerSchema = z
	.function()
	.args(z.literal("disconnected"), z.function())
	.returns(z.void());
export const ChainChangedListenerSchema = z
	.function()
	.args(z.literal("chainChanged"), NetworkIdCallbackSchema)
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

export const MinaProviderInfoSchema = z
	.object({
		icon: z.string().startsWith("data:image/"),
		name: z.string(),
		rdns: z.string(),
		slug: z.string(),
	})
	.strict();
