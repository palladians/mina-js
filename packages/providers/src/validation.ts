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
} from "@mina-js/utils";
import { z } from "zod";

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

// Private Credentials: Serialized Schemas

const SerializedValueSchema = z
	.object({
		_type: z.string(),
		value: JsonSchema,
	})
	.strict();

const SerializedTypeSchema = z
	.object({
		_type: z.string(),
	})
	.strict();

const SerializedFieldSchema = z
	.object({
		_type: z.literal("Field"),
		value: z.string(),
	})
	.strict();

const SerializedPublicKeySchema = z
	.object({
		_type: z.literal("PublicKey"),
		value: z.string(),
	})
	.strict();

const SerializedPublicKeyTypeSchema = z
	.object({
		_type: z.literal("PublicKey"),
	})
	.strict();

const SerializedSignatureSchema = z
	.object({
		_type: z.literal("Signature"),
		value: z.object({
			r: z.string(),
			s: z.string(),
		}),
	})
	.strict();

// Private Credentials: Witness Schemas

const SimpleWitnessSchema = z
	.object({
		type: z.literal("simple"),
		issuer: SerializedPublicKeySchema,
		issuerSignature: SerializedSignatureSchema,
	})
	.strict();

const RecursiveWitnessSchema = z
	.object({
		type: z.literal("recursive"),
		vk: z
			.object({
				data: z.string(),
				hash: SerializedFieldSchema,
			})
			.strict(),
		proof: z
			.object({
				_type: z.literal("Proof"),
				value: z
					.object({
						publicInput: JsonSchema,
						publicOutput: JsonSchema,
						maxProofsVerified: z.number().min(0).max(2),
						proof: z.string(),
					})
					.strict(),
			})
			.strict(),
	})
	.strict();

const UnsignedWitnessSchema = z
	.object({
		type: z.literal("unsigned"),
	})
	.strict();

const WitnessSchema = z.discriminatedUnion("type", [
	SimpleWitnessSchema,
	RecursiveWitnessSchema,
	UnsignedWitnessSchema,
]);

// Private Credentials: Credential Schemas

const SimpleCredentialSchema = z
	.object({
		owner: SerializedPublicKeySchema,
		data: z.record(SerializedValueSchema),
	})
	.strict();

const StructCredentialSchema = z
	.object({
		_type: z.literal("Struct"),
		properties: z
			.object({
				owner: SerializedPublicKeyTypeSchema,
				data: JsonSchema,
			})
			.strict(),
		value: z
			.object({
				owner: PublicKeySchema,
				data: JsonSchema,
			})
			.strict(),
	})
	.strict();

// Private Credentials: Stored Credential Schema

export const StoredCredentialSchema = z
	.object({
		version: z.literal("v0"),
		witness: WitnessSchema,
		metadata: JsonSchema.optional(),
		credential: z.union([SimpleCredentialSchema, StructCredentialSchema]),
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
		params: z.array(StoredCredentialSchema),
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
