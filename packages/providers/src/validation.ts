import {
	CreateNullifierParamsSchema,
	NullifierSchema,
	PublicKeySchema,
	SendTransactionParamsSchema,
	SignFieldsParamsSchema,
	SignMessageParamsSchema,
	SignTransactionParamsSchema,
	SignedFieldsSchema,
	SignedMessageSchema,
	SignedTransactionSchema,
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

export const AccountsRequestSchema = z
	.function()
	.args(z.object({ method: z.literal("mina_accounts") }))
	.returns(z.promise(z.array(PublicKeySchema)));
export const ChainIdRequestSchema = z
	.function()
	.args(z.object({ method: z.literal("mina_chainId") }))
	.returns(z.promise(z.string()));
export const ChainInformationRequestSchema = z
	.function()
	.args(z.object({ method: z.literal("mina_chainInformation") }))
	.returns(z.promise(z.object({ url: z.string(), name: z.string() })));
export const GetBalanceRequestSchema = z
	.function()
	.args(z.object({ method: z.literal("mina_getBalance") }))
	.returns(z.promise(z.number()));
export const SignRequestSchema = z
	.function()
	.args(
		z.object({
			method: z.literal("mina_sign"),
			params: SignMessageParamsSchema,
		}),
	)
	.returns(z.promise(SignedMessageSchema));
export const SignFieldsRequestSchema = z
	.function()
	.args(
		z.object({
			method: z.literal("mina_signFields"),
			params: SignFieldsParamsSchema,
		}),
	)
	.returns(z.promise(SignedFieldsSchema));
export const SignTransactionRequestSchema = z
	.function()
	.args(
		z.object({
			method: z.literal("mina_signTransaction"),
			params: SignTransactionParamsSchema,
		}),
	)
	.returns(z.promise(SignedTransactionSchema));
export const SendTransactionRequestSchema = z
	.function()
	.args(
		z.object({
			method: z.literal("mina_sendTransaction"),
			params: SendTransactionParamsSchema,
		}),
	)
	.returns(z.promise(TransactionReceiptSchema));
export const CreateNullifierRequestSchema = z
	.function()
	.args(
		z.object({
			method: z.literal("mina_createNullifier"),
			params: CreateNullifierParamsSchema,
		}),
	)
	.returns(z.promise(NullifierSchema));
export const SwitchChainRequestSchema = z
	.function()
	.args(
		z.object({
			method: z.literal("mina_switchChain"),
			params: SwitchChainRequestParams,
		}),
	)
	.returns(z.promise(z.string()));
export const AddChainRequestSchema = z
	.function()
	.args(
		z.object({
			method: z.literal("mina_addChain"),
			params: AddChainRequestParams,
		}),
	)
	.returns(z.promise(z.string()));

export const ProviderRequestSchema = z.union([
	AccountsRequestSchema,
	ChainIdRequestSchema,
	ChainInformationRequestSchema,
	GetBalanceRequestSchema,
	SignRequestSchema,
	SignFieldsRequestSchema,
	SignTransactionRequestSchema,
	SendTransactionRequestSchema,
	CreateNullifierRequestSchema,
	SwitchChainRequestSchema,
	AddChainRequestSchema,
]);

export const ChainIdCallbackSchema = z
	.function()
	.args(z.object({ chainId: z.string() }))
	.returns(z.void());

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
	z.object({
		code: z.literal(4001),
		message: z.literal("User Rejected Request"),
	}),
	z.object({
		code: z.literal(4100),
		message: z.literal("Unauthorized"),
	}),
	z.object({
		code: z.literal(4200),
		message: z.literal("Unsupported Method"),
	}),
	z.object({
		code: z.literal(4900),
		message: z.literal("Disconnected"),
	}),
	z.object({
		code: z.literal(4901),
		message: z.literal("Chain Disconnected"),
	}),
]);

export const MinaProviderInfoSchema = z.object({
	icon: z.string().startsWith("data:image/"),
	name: z.string(),
	rdns: z.string(),
	slug: z.string(),
});

export const MinaProviderClientSchema = z.object({
	request: ProviderRequestSchema,
	on: ProviderListenerSchema,
	removeListener: ProviderListenerSchema,
});

export const MinaProviderDetailSchema = z.object({
	info: MinaProviderInfoSchema,
	provider: MinaProviderClientSchema,
});
