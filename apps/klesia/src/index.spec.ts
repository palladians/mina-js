import { expect, it } from "bun:test";
import { testClient } from "hono/testing";
import { klesiaRpcRoute } from "./";

const client = testClient(klesiaRpcRoute);

it("returns result for mina_getTransactionCount", async () => {
	const response = await client.api.$post({
		json: {
			method: "mina_getTransactionCount",
			params: ["B62qkYa1o6Mj6uTTjDQCob7FYZspuhkm4RRQhgJg9j4koEBWiSrTQrS"],
		},
	});
	const { result } = (await response.json()) as { result: string };
	expect(BigInt(result)).toBeGreaterThan(0);
});

it("returns result for mina_getBalance", async () => {
	const response = await client.api.$post({
		json: {
			method: "mina_getBalance",
			params: ["B62qkYa1o6Mj6uTTjDQCob7FYZspuhkm4RRQhgJg9j4koEBWiSrTQrS"],
		},
	});
	const { result } = (await response.json()) as { result: string };
	expect(BigInt(String(result))).toBeGreaterThan(0);
});

it("returns result for mina_blockHash", async () => {
	const response = await client.api.$post({
		json: { method: "mina_blockHash" },
	});
	const { result } = (await response.json()) as { result: string };
	expect(result.length).toBeGreaterThan(0);
});

it("returns result for mina_chainId", async () => {
	const response = await client.api.$post({
		json: { method: "mina_chainId" },
	});
	const { result } = (await response.json()) as { result: string };
	expect(result.length).toBeGreaterThan(0);
});

it("returns result for mina_getAccount", async () => {
	const response = await client.api.$post({
		json: {
			method: "mina_getAccount",
			params: ["B62qkYa1o6Mj6uTTjDQCob7FYZspuhkm4RRQhgJg9j4koEBWiSrTQrS"],
		},
	});
	// biome-ignore lint/suspicious/noExplicitAny: TODO
	const { result } = (await response.json()) as any;
	expect(BigInt(result.nonce)).toBeGreaterThanOrEqual(0);
	expect(BigInt(result.balance)).toBeGreaterThanOrEqual(0);
});
