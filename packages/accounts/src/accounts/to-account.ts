import { type PublicKey, PublicKeySchema } from "@mina-js/utils";
import type {
	AccountSource,
	CustomSource,
	JsonRpcAccount,
	LocalAccount,
} from "../types";

type GetAccountReturnType<accountSource extends AccountSource> =
	| (accountSource extends PublicKey ? JsonRpcAccount : never)
	| (accountSource extends CustomSource ? LocalAccount : never);

/**
 * @description Creates an Account from a custom signing implementation.
 * @returns A Local Account.
 */
export function toAccount<accountSource extends AccountSource>(
	source: accountSource,
): GetAccountReturnType<accountSource> {
	if (typeof source === "string") {
		const publicKey = PublicKeySchema.parse(source);
		return {
			publicKey,
			type: "json-rpc",
		} as GetAccountReturnType<accountSource>;
	}
	const publicKey = PublicKeySchema.parse(source.publicKey);
	return {
		publicKey,
		signMessage: source.signMessage,
		signTransaction: source.signTransaction,
		createNullifier: source.createNullifier,
		signFields: source.signFields,
		source: "custom",
		type: "local",
	} as GetAccountReturnType<accountSource>;
}
