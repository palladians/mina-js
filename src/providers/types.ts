import type {
	AddChainData,
	CreateNullifierData,
	SendTransactionData,
	SignFieldsData,
	SignMessageData,
	SignTransactionData,
	SwitchChainData,
} from "./validation";

// biome-ignore lint/suspicious/noExplicitAny: Deal with it.
type TODO = any;

export type Address = `b62${string}`;

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

export interface EIP6963RequestProviderEvent extends Event {
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

// Return types
type SignedMessage = {
	publicKey: string;
	data: string;
	signature: {
		field: string;
		scalar: string;
	};
};

type SignedFieldsData = {
	data: (string | number)[];
	publicKey: string;
	signature: string;
};

// Request variants
export type AccountsRequest = (args: {
	method: "mina_accounts";
}) => Promise<Address[]>;

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
	params: SignMessageData;
}) => Promise<SignedMessage>;

export type SignFieldsRequest = (args: {
	method: "mina_signFields";
	params: SignFieldsData;
}) => Promise<SignedFieldsData>;

export type SignTransactionRequest = (args: {
	method: "mina_signTransaction";
	params: SignTransactionData;
}) => Promise<TODO>;

export type SendTransactionRequest = (args: {
	method: "mina_sendTransaction";
	params: SendTransactionData;
}) => Promise<TODO>;

export type CreateNullifierRequest = (args: {
	method: "mina_createNullifier";
	params: CreateNullifierData;
}) => Promise<TODO>;

export type SwitchChainRequest = (args: {
	method: "mina_switchChain";
	params: SwitchChainData;
}) => Promise<TODO>;

export type AddChainRequest = (args: {
	method: "mina_addChain";
	params: AddChainData;
}) => Promise<TODO>;

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
	callback: (params: { accounts: Address[] }) => void,
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
	addListener: ProviderListener;
	removeListener: ProviderListener;
};
