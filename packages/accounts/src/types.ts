export type CustomSource = {
	publicKey: string;
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
