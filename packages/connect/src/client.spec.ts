import { describe, expect, it } from "bun:test";
import { privateKeyToAccount } from "@mina-js/accounts";
import { toAccount } from "@mina-js/accounts";
import { Test } from "@mina-js/shared";
import { createWalletClient } from "./client";

const PUBLIC_KEY = "B62qmWKtvNQTtUqo1LxfEEDLyWMg59cp6U7c4uDC7aqgaCEijSc3Hx5";

it("matches snapshot of local source", async () => {
	const account = privateKeyToAccount({
		privateKey: Test.accounts[0].privateKey,
	});
	const client = createWalletClient({ account, network: "devnet" });
	expect(client).toMatchSnapshot();
});

it("matches snapshot of json-rpc source", async () => {
	const account = toAccount(PUBLIC_KEY);
	const client = createWalletClient({ account, network: "devnet" });
	expect(client).toMatchSnapshot();
});

describe("json-rpc source", () => {
	it("returns accounts", async () => {
		const account = toAccount(PUBLIC_KEY);
		const client = createWalletClient({
			account,
			network: "devnet",
			providerSource: "klesia",
		});
		const accounts = await client.getAccounts();
		expect(accounts[0]).toEqual(PUBLIC_KEY);
	});

	// it('returns balance', async () => {
	//   const account = toAccount(PUBLIC_KEY)
	//   const client = createWalletClient({ account, network: 'devnet', providerSource: 'klesia' })
	//   const balance = await client.getBalance()
	//   console.log(balance)
	//   expect(balance).toBeGreaterThanOrEqual(0)
	// })
});
