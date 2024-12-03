import { expect, it } from "bun:test";
import { Test } from "@mina-js/utils";
import { privateKeyToAccount } from "./private-key-to-account";

it("matches default values", () => {
	const account = privateKeyToAccount({
		privateKey: Test.accounts[0].privateKey,
	});
	expect(account).toMatchSnapshot();
});

it("signs a message", async () => {
	const account = privateKeyToAccount({
		privateKey: Test.accounts[0].privateKey,
	});
	const message = "hello world";
	const signedMessage = await account.signMessage({ message });
	expect(signedMessage).toMatchSnapshot();
});

it("signs a transaction", async () => {
	const account = privateKeyToAccount({
		privateKey: Test.accounts[0].privateKey,
	});
	const transaction = {
		nonce: "1",
		from: "B62qmWKtvNQTtUqo1LxfEEDLyWMg59cp6U7c4uDC7aqgaCEijSc3Hx5",
		to: "B62qmWKtvNQTtUqo1LxfEEDLyWMg59cp6U7c4uDC7aqgaCEijSc3Hx5",
		amount: "3000000000",
		fee: "100000000",
	};
	const signedTransaction = await account.signTransaction({ transaction });
	expect(signedTransaction).toMatchSnapshot();
});

it("signs a zkapp command", async () => {
	const account = privateKeyToAccount({
		privateKey: Test.accounts[0].privateKey,
	});
	const command = {
		zkappCommand: {
			accountUpdates: [],
			memo: "E4YM2vTHhWEg66xpj52JErHUBU4pZ1yageL4TVDDpTTSsv8mK6YaH",
			feePayer: {
				body: {
					publicKey: "B62qmWKtvNQTtUqo1LxfEEDLyWMg59cp6U7c4uDC7aqgaCEijSc3Hx5",
					fee: "100000000",
					validUntil: "100000",
					nonce: "1",
				},
				authorization: "",
			},
		},
		feePayer: {
			feePayer: "B62qmWKtvNQTtUqo1LxfEEDLyWMg59cp6U7c4uDC7aqgaCEijSc3Hx5",
			fee: "100000000",
			nonce: "0",
			memo: "Test",
		},
	};
	const signedTransaction = await account.signTransaction({ command });
	expect(signedTransaction).toMatchSnapshot();
});

it("creates a nullifier", async () => {
	const account = privateKeyToAccount({
		privateKey: Test.accounts[0].privateKey,
	});
	const message = [1n, 2n, 3n];
	const nullifier = await account.createNullifier({
		message: message.map((el) => el.toString()),
	});
	expect(typeof nullifier.private.c).toBe("string");
});

it("signs fields", async () => {
	const account = privateKeyToAccount({
		privateKey: Test.accounts[0].privateKey,
	});
	const fields = [1n, 2n, 3n];
	const signedFields = await account.signFields({
		fields: fields.map((el) => el.toString()),
	});
	expect(signedFields).toMatchSnapshot();
});
