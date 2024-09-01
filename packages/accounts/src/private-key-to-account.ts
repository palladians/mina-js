import MinaSigner from "mina-signer";

/**
 * @description Creates an Account from a private key.
 *
 * @returns A Private Key Account.
 */
export function privateKeyToAccount(privateKey: string): PrivateKeyAccount {
	const client = new MinaSigner({ network: "mainnet" });
	const publicKey = client.derivePublicKey(privateKey);
	const account = toAccount({
		publicKey,
		async signMessage({ message }) {
			return signMessage({ message, privateKey });
		},
		async signTransaction({ transaction }) {
			return signTransaction({ privateKey, transaction });
		},
		async createNullifier({ message }) {
			return createNullifier({ message, privateKey });
		},
		async signFields({ fields }) {
			return signFields({ fields, privateKey });
		},
	});

	return {
		...account,
		publicKey,
		source: "privateKey",
	} as PrivateKeyAccount;
}
