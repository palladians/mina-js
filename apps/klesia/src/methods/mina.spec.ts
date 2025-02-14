import { expect, it } from "bun:test";
import { mina } from "./mina";

const TEST_PKEY = "B62qkYa1o6Mj6uTTjDQCob7FYZspuhkm4RRQhgJg9j4koEBWiSrTQrS";

it("should return transactions count", async () => {
	const result = await mina.getTransactionCount({ publicKey: TEST_PKEY });
	expect(BigInt(result)).toBeGreaterThan(0);
});

it("should return balance", async () => {
	const result = await mina.getBalance({ publicKey: TEST_PKEY });
	expect(BigInt(result)).toBeGreaterThan(0);
});

it("should return block hash", async () => {
	const result = await mina.blockHash();
	expect(result.length).toBeGreaterThan(0);
});

it("should return network id", async () => {
	const result = await mina.networkId();
	expect(result.length).toBeGreaterThan(0);
});

it("should get account info", async () => {
	const result = await mina.getAccount({ publicKey: TEST_PKEY });
	expect(BigInt(result.nonce)).toBeGreaterThanOrEqual(0);
	expect(BigInt(result.balance.total)).toBeGreaterThanOrEqual(0);
});
