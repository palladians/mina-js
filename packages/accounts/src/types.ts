import type {
	Nullifier,
	PublicKey,
	SignedFields,
	SignedMessage,
	SignedTransaction,
} from "@mina-js/shared";
import type { HDKey } from "@scure/bip32";
import type { Simplify } from "type-fest";
import type { z } from "zod";
import type {
	CreateNullifierParamsSchema,
	SignFieldsParamsSchema,
	SignMessageParamsSchema,
	SignTransactionParamsSchema,
} from "./validation";

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

export type Account<publicKey extends PublicKey = PublicKey> =
	| JsonRpcAccount<publicKey>
	| LocalAccount<publicKey>;

export type PrivateKeyAccount = Simplify<LocalAccount<"privateKey">>;

export type { HDKey };

/**
 * Parameter types
 */
export type SignFieldsParams = z.infer<typeof SignFieldsParamsSchema>;
export type SignMessageParams = z.infer<typeof SignMessageParamsSchema>;
export type CreateNullifierParams = z.infer<typeof CreateNullifierParamsSchema>;
export type SignTransactionParams = z.infer<typeof SignTransactionParamsSchema>;

/**
 * Signer methods
 */
export type SignFields = (params: SignFieldsParams) => Promise<SignedFields>;
export type SignMessage = (params: SignMessageParams) => Promise<SignedMessage>;
export type CreateNullifier = (
	params: CreateNullifierParams,
) => Promise<Nullifier>;
export type SignTransaction = (
	params: SignTransactionParams,
) => Promise<SignedTransaction>;
