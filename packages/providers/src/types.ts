import type { z } from "zod";
import type {
	MinaProviderClientSchema,
	MinaProviderDetailSchema,
	MinaProviderInfoSchema,
	ProviderListenerSchema,
	ProviderRequestSchema,
	ProviderRpcErrorSchema,
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

export type ProviderRequest = z.infer<typeof ProviderRequestSchema>;

export type ProviderListener = z.infer<typeof ProviderListenerSchema>;

export type MinaProviderClient = z.infer<typeof MinaProviderClientSchema>;
