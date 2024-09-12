import { HDKey } from "@scure/bip32";
import { mnemonicToSeedSync } from "@scure/bip39";

import type { Simplify } from "type-fest";
import type { HDAccount } from "../types";
import {
	type HDKeyToAccountOptions,
	hdKeyToAccount,
} from "./hd-key-to-account.js";

export type MnemonicToAccountOptions = Simplify<
	{ mnemonic: string } & Partial<HDKeyToAccountOptions>
>;

/**
 * @description Creates an Account from a mnemonic phrase.
 *
 * @returns A HD Account.
 */
export function mnemonicToAccount({
	mnemonic,
	...opts
}: MnemonicToAccountOptions): HDAccount {
	const seed = mnemonicToSeedSync(mnemonic);
	return hdKeyToAccount({ ...opts, hdKey: HDKey.fromMasterSeed(seed) });
}
