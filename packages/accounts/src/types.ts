import type {
	CreateNullifier,
	SignFields,
	SignMessage,
	SignTransaction,
} from "@mina-js/shared";

export type CustomSource = {
	publicKey: string;
	signMessage: SignMessage;
	signTransaction: SignTransaction;
	createNullifier: CreateNullifier;
	signFields: SignFields;
};

export type LocalAccount<source extends string = string> = CustomSource & {
	publicKey: string;
	source: source;
	type: "local";
};

// export type PrivateKeyAccount = Prettify<
//   LocalAccount<'privateKey'> & {
//     // TODO(v3): This will be redundant.
//     sign: NonNullable<CustomSource['sign']>
//   }
