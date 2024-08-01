import Client from "mina-signer";

/**
 * @description Generates a random private key.
 *
 * @returns A randomly generated private key.
 */
export function generatePrivateKey(): string {
	const client = new Client({ network: "mainnet" });
	return client.genKeys().privateKey;
}
