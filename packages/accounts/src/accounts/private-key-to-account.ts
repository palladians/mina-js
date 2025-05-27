import {
	NullifierSchema,
	SignedFieldsSchema,
	SignedMessageSchema,
	SignedTransactionSchema,
} from "@mina-js/utils";
import MinaSigner from "mina-signer";
import type { ZkappCommand } from "mina-signer/dist/node/mina-signer/src/types";
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
			const signablePayload: ZkappCommand = {
				...signable.command,
				zkappCommand: {
					...signable.command.zkappCommand,
					feePayer: {
						...signable.command.zkappCommand.feePayer,
						body: {
							...signable.command.zkappCommand.feePayer.body,
							validUntil:
								signable.command.zkappCommand.feePayer.body.validUntil ?? null,
						},
					},
					accountUpdates: signable.command.zkappCommand.accountUpdates.map(
						(au) => ({
							...au,
							authorization: {
								...au.authorization,
								proof: au.authorization.proof ?? null,
								signature: au.authorization.signature ?? null,
							},
						}),
					),
				},
				feePayer: {
					...signable.command.feePayer,
					feePayer: signable.command.feePayer.publicKey,
				},
			};
			const signed = client.signTransaction(signablePayload, privateKey);
			return SignedTransactionSchema.parse({
				...signed,
				data: {
					...signed.data,
					feePayer: {
						publicKey: signed.data.feePayer.feePayer,
						fee: signed.data.feePayer.fee,
						validUntil: signed.data.feePayer.validUntil,
						nonce: signed.data.feePayer.nonce,
					},
				},
			});
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
