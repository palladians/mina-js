import { expect, it } from "bun:test";
import { createClient } from "./client";

it("fetches transaction count", async () => {
	const client = createClient({ network: "devnet" });
	const count = await client.request<"mina_getTransactionCount">({
		method: "mina_getTransactionCount",
		params: ["B62qkYa1o6Mj6uTTjDQCob7FYZspuhkm4RRQhgJg9j4koEBWiSrTQrS"],
	});
	expect(BigInt(count)).toBeGreaterThan(0);
});
