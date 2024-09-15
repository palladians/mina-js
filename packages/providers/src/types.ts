import type {
	CreateNullifierParams,
	Nullifier,
	PublicKey,
	SendTransactionParams,
	SignFieldsParams,
	SignMessageParams,
	SignTransactionParams,
	SignedFields,
	SignedMessage,
	SignedTransaction,
	TransactionReceipt,
} from "@mina-js/shared";
import type { AddChainData, SwitchChainData } from "./validation";

export type MinaProviderDetail = {
	info: MinaProviderInfo;
	provider: MinaProviderClient;
};

export type MinaProviderInfo = {
	icon: `data:image/${string}`;
	name: string;
	rdns: string;
	slug: string;
};

export interface MinaAnnounceProviderEvent
	extends CustomEvent<MinaProviderDetail> {
	type: "mina:announceProvider";
}

export interface MinaRequestProviderEvent extends Event {
	type: "mina:requestProvider";
}

export type ProviderRpcError = (
	| { message: "User Rejected Request"; code: 4001 }
	| { message: "Unauthorized"; code: 4100 }
	| { message: "Unsupported Method"; code: 4200 }
	| { message: "Disconnected"; code: 4900 }
	| { message: "Chain Disconnected"; code: 4901 }
) &
	Error;

export type ProviderRpcEvent =
	| "connect"
	| "disconnect"
	| "chainChanged"
	| "accountsChanged"
	| "mina_message";

// Request variants
export type AccountsRequest = (args: {
	method: "mina_accounts";
}) => Promise<PublicKey[]>;

export type ChainIdRequest = (args: {
	method: "mina_chainId";
}) => Promise<string>;

export type ChainInformationRequest = (args: {
	method: "mina_chainInformation";
}) => Promise<{ url: string; name: string }>;

export type GetBalanceRequest = (args: {
	method: "mina_getBalance";
}) => Promise<number>;

export type SignRequest = (args: {
	method: "mina_sign";
	params: SignMessageParams;
}) => Promise<SignedMessage>;

export type SignFieldsRequest = (args: {
	method: "mina_signFields";
	params: SignFieldsParams;
}) => Promise<SignedFields>;

export type SignTransactionRequest = (args: {
	method: "mina_signTransaction";
	params: SignTransactionParams;
}) => Promise<SignedTransaction>;

export type SendTransactionRequest = (args: {
	method: "mina_sendTransaction";
	params: SendTransactionParams;
}) => Promise<TransactionReceipt>;

export type CreateNullifierRequest = (args: {
	method: "mina_createNullifier";
	params: CreateNullifierParams;
}) => Promise<Nullifier>;

export type SwitchChainRequest = (args: {
	method: "mina_switchChain";
	params: SwitchChainData;
}) => Promise<string>;

export type AddChainRequest = (args: {
	method: "mina_addChain";
	params: AddChainData;
}) => Promise<string>;

export type ProviderRequest =
	| AccountsRequest
	| ChainIdRequest
	| ChainInformationRequest
	| GetBalanceRequest
	| SignRequest
	| SignFieldsRequest
	| SignTransactionRequest
	| SendTransactionRequest
	| CreateNullifierRequest
	| SwitchChainRequest
	| AddChainRequest;

export type ConnectedListener = (
	event: "connected",
	callback: (params: { chainId: string }) => void,
) => void;

export type DisconnectedListener = (
	event: "disconnected",
	callback: (params: { error: ProviderRpcError }) => void,
) => void;

export type ChainChangedListener = (
	event: "chainChanged",
	callback: (params: { chainId: string }) => void,
) => void;

export type AccountsChangedListener = (
	event: "accountsChanged",
	callback: (params: { accounts: PublicKey[] }) => void,
) => void;

export type MessageListener = (
	event: "mina_message",
	callback: (params: { type: string; data: unknown }) => void,
) => void;

export type ProviderListener =
	| ConnectedListener
	| DisconnectedListener
	| ChainChangedListener
	| AccountsChangedListener
	| MessageListener;

export type MinaProviderClient = {
	request: ProviderRequest;
	on: ProviderListener;
	removeListener: ProviderListener;
};
