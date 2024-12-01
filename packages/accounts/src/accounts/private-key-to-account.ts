import {
	NullifierSchema,
	SignedFieldsSchema,
	SignedMessageSchema,
	SignedTransactionSchema,
} from "@mina-js/utils";
import MinaSigner from "mina-signer";
import type { PrivateKeyAccount } from "../types";
import { toAccount } from "./to-account";

export type PrivateKeyToAccountParams = {
	privateKey: string;
	network?: "mainnet" | "testnet";
};

/**
 * @description Creates an Account from a private key.
 *
 * @returns A Private Key Account.
 */
export function privateKeyToAccount({
	privateKey,
	network = "mainnet",
}: PrivateKeyToAccountParams): PrivateKeyAccount {
	const client = new MinaSigner({ network });
	const publicKey = client.derivePublicKey(privateKey);
	const account = toAccount({
		publicKey,
		async signMessage({ message }) {
			return SignedMessageSchema.parse(client.signMessage(message, privateKey));
		},
		async signTransaction(signable) {
			if ("transaction" in signable) {
				return SignedTransactionSchema.parse(
					client.signTransaction(signable.transaction, privateKey),
				);
			}
			return SignedTransactionSchema.parse(
				client.signTransaction(signable.command as never, privateKey),
			);
		},
		async createNullifier({ message }) {
			return NullifierSchema.parse(
				client.createNullifier(
					message.map((el) => BigInt(el)),
					privateKey,
				),
			);
		},
		async signFields({ fields }) {
			return SignedFieldsSchema.parse(
				client.signFields(
					fields.map((el) => BigInt(el)),
					privateKey,
				),
			);
		},
	});

	return {
		...account,
		source: "privateKey",
	} as PrivateKeyAccount;
}
