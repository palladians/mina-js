// import MinaSigner from "mina-signer";

// /**
//  * @description Creates an Account from a private key.
//  *
//  * @returns A Private Key Account.
//  */
// export function privateKeyToAccount(privateKey: string): PrivateKeyAccount {
// 	const client = new MinaSigner({ network: "mainnet" });
// 	const publicKey = client.derivePublicKey(privateKey);
// 	const account = toAccount({
// 		publicKey,
// 		async sign({ hash }) {
// 			return sign({ hash, privateKey, to: "hex" });
// 		},
// 		async signMessage({ message }) {
// 			return signMessage({ message, privateKey });
// 		},
// 		async signTransaction(transaction, { serializer } = {}) {
// 			return signTransaction({ privateKey, transaction, serializer });
// 		},
// 		async signTypedData(typedData) {
// 			return signTypedData({ ...typedData, privateKey });
// 		},
// 	});

// 	return {
// 		...account,
// 		publicKey,
// 		source: "privateKey",
// 	} as PrivateKeyAccount;
// }
