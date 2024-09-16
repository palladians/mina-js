import type { z } from "zod";
import type {
	MinaProviderDetailSchema,
	MinaProviderInfoSchema,
	ProviderListenerSchema,
	ProviderRequestParamsSchema,
	ProviderRpcErrorSchema,
	ResultType,
} from "./validation";

export type MinaProviderDetail = z.infer<typeof MinaProviderDetailSchema>;

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

export type MinaProviderRequest = <M extends string>(
	args: Extract<M, z.infer<typeof ProviderRequestParamsSchema>>,
) => Promise<ResultType<M>>;

// export type MinaProviderClient = z.infer<typeof MinaProviderClientSchema>;
export type MinaProviderClient = {
	request: MinaProviderRequest;
	on: ProviderListener;
	removeListener: ProviderListener;
};
