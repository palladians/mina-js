import { expect, it } from "bun:test";
import { z } from "zod";
import { getNodeClient } from "../node";
import { mina } from "./mina";

const TEST_PKEY = "B62qkYa1o6Mj6uTTjDQCob7FYZspuhkm4RRQhgJg9j4koEBWiSrTQrS";

const client = getNodeClient(
	z.string().parse("https://api.minascan.io/node/devnet/v1/graphql"),
);

it("should return transactions count", async () => {
	const result = await mina(client).getTransactionCount({
		publicKey: TEST_PKEY,
	});
	expect(BigInt(result)).toBeGreaterThan(0);
});

it("should return balance", async () => {
	const result = await mina(client).getBalance({
		publicKey: TEST_PKEY,
		tokenId: "1",
	});
	expect(BigInt(result)).toBeGreaterThan(0);
});

it("should return block hash", async () => {
	const result = await mina(client).blockHash();
	expect(result.length).toBeGreaterThan(0);
});

it("should return network id", async () => {
	const result = await mina(client).networkId();
	expect(result.length).toBeGreaterThan(0);
});

it("should get account info", async () => {
	const result = await mina(client).getAccount({
		publicKey: TEST_PKEY,
		tokenId: "1",
	});
	expect(BigInt(result.nonce)).toBeGreaterThanOrEqual(0);
	expect(BigInt(result.balance.total)).toBeGreaterThanOrEqual(0);
});
