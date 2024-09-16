import type { z } from "zod";
import type {
	MinaProviderInfoSchema,
	ProviderListenerSchema,
	ProviderRequestParamsUnion,
	ProviderRpcErrorSchema,
	ResultType,
} from "./validation";

export type MinaProviderDetail = {
	info: MinaProviderInfo;
	provider: MinaProviderClient;
};

export type MinaProviderInfo = z.infer<typeof MinaProviderInfoSchema>;

export interface MinaAnnounceProviderEvent
	extends CustomEvent<MinaProviderDetail> {
	type: "mina:announceProvider";
}

export interface MinaRequestProviderEvent extends Event {
	type: "mina:requestProvider";
}

export type ProviderRpcError = z.infer<typeof ProviderRpcErrorSchema> & Error;

export type ProviderRpcEvent =
	| "connect"
	| "disconnect"
	| "chainChanged"
	| "accountsChanged"
	| "mina_message";

export type ProviderListener = z.infer<typeof ProviderListenerSchema>;

export type ProviderRequestParams = z.infer<typeof ProviderRequestParamsUnion>;

export type MinaProviderRequest = <M extends string>(
	args: Extract<ProviderRequestParams, { method: M }>,
) => Promise<ResultType<M>>;

export type MinaProviderClient = {
	request: MinaProviderRequest;
	on: ProviderListener;
	removeListener: ProviderListener;
};
