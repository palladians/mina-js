import { describe, expect, it } from "bun:test";
import { privateKeyToAccount, toAccount } from "@mina-js/accounts";
import { Test } from "@mina-js/utils";
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

	it("returns balance", async () => {
		const account = toAccount(PUBLIC_KEY);
		const client = createWalletClient({
			account,
			network: "devnet",
			providerSource: "klesia",
		});
		const balance = await client.getBalance();
		expect(BigInt(balance)).toBeGreaterThanOrEqual(0);
	});

	it("returns transaction count", async () => {
		const account = toAccount(PUBLIC_KEY);
		const client = createWalletClient({
			account,
			network: "devnet",
			providerSource: "klesia",
		});
		const transactionCount = await client.getTransactionCount();
		expect(BigInt(transactionCount)).toBeGreaterThanOrEqual(0);
	});

	it("returns network id", async () => {
		const account = toAccount(PUBLIC_KEY);
		const client = createWalletClient({
			account,
			network: "devnet",
			providerSource: "klesia",
		});
		const networkId = await client.getNetworkId();
		expect(networkId.length).toBeGreaterThan(0);
	});
});

describe("local source", () => {
	it("signs a message", async () => {
		const account = privateKeyToAccount({
			privateKey: Test.accounts[0].privateKey,
		});
		const client = createWalletClient({ account, network: "devnet" });
		const signature = await client.signMessage({ message: "hello" });
		expect(signature.data).toEqual("hello");
	});

	it("fills missing transaction fields", async () => {
		const account = privateKeyToAccount({
			privateKey: Test.accounts[0].privateKey,
		});
		const client = createWalletClient({ account, network: "devnet" });
		const transaction = await client.prepareTransactionRequest({
			from: PUBLIC_KEY,
			to: PUBLIC_KEY,
			amount: "1000000000",
		});
		expect(transaction.fee).toBeDefined();
		expect(transaction.nonce).toBeDefined();
	});
});
