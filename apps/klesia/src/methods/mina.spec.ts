import { expect, it } from "bun:test";
import { mina } from "./mina";

const TEST_PKEY = "B62qkYa1o6Mj6uTTjDQCob7FYZspuhkm4RRQhgJg9j4koEBWiSrTQrS";

it("should return transactions count", async () => {
	const result = await mina.getTransactionCount({ publicKey: TEST_PKEY });
	expect(result).toBeGreaterThan(0);
});

it("should return balance", async () => {
	const result = await mina.getBalance({ publicKey: TEST_PKEY });
	expect(BigInt(result)).toBeGreaterThan(0);
});

it("should return block hash", async () => {
	const result = await mina.blockHash();
	expect(result.length).toBeGreaterThan(0);
});

it("should return chain id", async () => {
	const result = await mina.chainId();
	expect(result.length).toBeGreaterThan(0);
});
