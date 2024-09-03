import { expect, it } from "bun:test";
import { createClient } from "./client";

it("fetches transaction count", async () => {
	const client = createClient({ network: "devnet" });
	const { result } = await client.request({
		method: "mina_getTransactionCount",
		params: ["B62qkYa1o6Mj6uTTjDQCob7FYZspuhkm4RRQhgJg9j4koEBWiSrTQrS"],
	});
	expect(result).toBeGreaterThan(0);
});
