import { sha256 } from "@noble/hashes/sha256";
import { bytesToHex } from "@noble/hashes/utils";
import { base58check } from "@scure/base";
import {
	type HDAccount,
	type HDKey,
	type HDOptions,
	MinaKeyConst,
} from "../types";
import {
	type PrivateKeyToAccountParams,
	privateKeyToAccount,
} from "./private-key-to-account";

export type HDKeyToAccountOptions = HDOptions &
	Partial<PrivateKeyToAccountParams>;

/**
 * @description Creates an Account from a HD Key.
 *
 * @returns A HD Account.
 */
export function hdKeyToAccount(
	hdKey_: HDKey,
	{
		accountIndex = 0,
		addressIndex = 0,
		changeIndex = 0,
		path,
		...options
	}: HDKeyToAccountOptions = {},
): HDAccount {
	const childNode = hdKey_.derive(
		path ||
			`m/${MinaKeyConst.PURPOSE}'/${MinaKeyConst.MINA_COIN_TYPE}'/${accountIndex}'/${changeIndex}/${addressIndex}`,
	);
	if (!childNode.privateKey) throw new Error("Private key not found");
	const childPrivateKeyArray = new Uint8Array(childNode.privateKey);
	childPrivateKeyArray[0] &= 0x3f;
	const childPrivateKey = childPrivateKeyArray.reverse();
	const privateKeyHex = `5a01${bytesToHex(childPrivateKey)}`;
	if (!privateKeyHex) throw new Error("Private key is empty");
	if (!privateKeyHex.match(/.{1,2}/g))
		throw new Error("Failed to split privateKeyHex into bytes");
	const privateKeyBytes = new Uint8Array(
		privateKeyHex.match(/.{1,2}/g)?.map((byte) => Number.parseInt(byte, 16)) ||
			[],
	);
	const account = privateKeyToAccount({
		...options,
		privateKey: base58check(sha256).encode(privateKeyBytes),
	});
	return {
		...account,
		getHdKey: () => childNode,
		source: "hd",
	};
}
