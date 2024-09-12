import type {
	CreateNullifier,
	PublicKey,
	SignFields,
	SignMessage,
	SignTransaction,
} from "@mina-js/shared";
import type { HDKey } from "@scure/bip32";
import type { Simplify } from "type-fest";

export enum MinaKeyConst {
	PURPOSE = 44,
	MINA_COIN_TYPE = 12586,
}

export type HDOptions =
	| {
			/** The account index to use in the path (`"m/44'/12586'/${accountIndex}'/0/0"`). */
			accountIndex?: number | undefined;
			/** The address index to use in the path (`"m/44'/12586'/0'/0/${addressIndex}"`). */
			addressIndex?: number | undefined;
			/** The change index to use in the path (`"m/44'/12586'/0'/${changeIndex}/0"`). */
			changeIndex?: number | undefined;
			path?: undefined;
	  }
	| {
			accountIndex?: undefined;
			addressIndex?: undefined;
			changeIndex?: undefined;
			/** The HD path. */
			path: `m/${MinaKeyConst.PURPOSE}'/${MinaKeyConst.MINA_COIN_TYPE}'/${string}`;
	  };

export type CustomSource = {
	publicKey: string;
	signMessage: SignMessage;
	signTransaction: SignTransaction;
	createNullifier: CreateNullifier;
	signFields: SignFields;
};

export type JsonRpcAccount<publicKey extends PublicKey = PublicKey> = {
	publicKey: publicKey;
	type: "json-rpc";
};

export type AccountSource = PublicKey | CustomSource;

export type LocalAccount<source extends string = string> = Simplify<
	CustomSource & {
		publicKey: string;
		source: source;
		type: "local";
	}
>;

export type HDAccount = Simplify<
	LocalAccount<"hd"> & {
		getHdKey(): HDKey;
	}
>;

export type PrivateKeyAccount = Simplify<LocalAccount<"privateKey">>;

export type { HDKey };
