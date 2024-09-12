import { describe, expect, it } from "bun:test";
import { hex } from "@scure/base";
import { HDKey } from "..";
import { hdKeyToAccount } from "./hd-key-to-account";

const hdKey = HDKey.fromMasterSeed(
	hex.decode(
		"59eabf9e91adfc40f7529e619fd9a7b47d41621715c27ce699da9a3a741536f377c405e496c91361ff3d65de1bb60f52c0add214d186ea0721151bee914e55fb",
	),
);

it("matches the snapshot", () => {
	const hdAccount = hdKeyToAccount(hdKey);
	expect(hdAccount).toMatchSnapshot();
});

describe("args: addressIndex", () => {
	Array.from({ length: 10 }).forEach((_, index) => {
		it(`derives addressIndex: ${index}`, () => {
			const account = hdKeyToAccount(hdKey, {
				addressIndex: index,
			});
			expect(account.publicKey.length).toEqual(55);
			expect(account.publicKey).toStartWith("B62");
		});
	});
});

describe("args: path", () => {
	Array.from({ length: 10 }).forEach((_, index) => {
		it(`derives path: m/44'/12586'/0'/0/${index}`, () => {
			const account = hdKeyToAccount(hdKey, {
				path: `m/44'/12586'/0'/0/${index}`,
			});
			expect(account.publicKey.length).toEqual(55);
			expect(account.publicKey).toStartWith("B62");
		});
	});
});

it("derives with accountIndex", () => {
	const hdAccount = hdKeyToAccount(hdKey, { accountIndex: 1 }).publicKey;
	expect(hdAccount).toMatchSnapshot();
});

it("derives with changeIndex", () => {
	const hdAccount = hdKeyToAccount(hdKey, { changeIndex: 1 }).publicKey;
	expect(hdAccount).toMatchSnapshot();
});

it("signs a message", async () => {
	const account = hdKeyToAccount(hdKey);
	const signature = await account.signMessage({ message: "hello word" });
	expect(signature).toMatchSnapshot();
});
