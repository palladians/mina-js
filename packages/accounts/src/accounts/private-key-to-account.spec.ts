import { expect, it } from "bun:test";
import { accounts } from "../test/constants";
import { privateKeyToAccount } from "./private-key-to-account";

it("matches default values", () => {
	const account = privateKeyToAccount({ privateKey: accounts[0].privateKey });
	expect(account).toMatchSnapshot();
});

it("signs a message", async () => {
	const account = privateKeyToAccount({ privateKey: accounts[0].privateKey });
	const message = "hello world";
	const signedMessage = await account.signMessage({ message });
	expect(signedMessage).toMatchSnapshot();
});

it("signs a transaction", async () => {
	const account = privateKeyToAccount({ privateKey: accounts[0].privateKey });
	const transaction = {
		nonce: 1n,
		from: "B62qmWKtvNQTtUqo1LxfEEDLyWMg59cp6U7c4uDC7aqgaCEijSc3Hx5",
		to: "B62qmWKtvNQTtUqo1LxfEEDLyWMg59cp6U7c4uDC7aqgaCEijSc3Hx5",
		amount: 3000000000n,
		fee: 100000000n,
	};
	const signedTransaction = await account.signTransaction({ transaction });
	expect(signedTransaction).toMatchSnapshot();
});

it("creates a nullifier", async () => {
	const account = privateKeyToAccount({ privateKey: accounts[0].privateKey });
	const message = [1n, 2n, 3n];
	const nullifier = await account.createNullifier({ message });
	expect(typeof nullifier.private.c).toBe("bigint");
});

it("signs fields", async () => {
	const account = privateKeyToAccount({ privateKey: accounts[0].privateKey });
	const fields = [1n, 2n, 3n];
	const signedFields = await account.signFields({ fields });
	expect(signedFields).toMatchSnapshot();
});
