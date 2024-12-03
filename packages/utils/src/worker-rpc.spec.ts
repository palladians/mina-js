import { beforeAll, describe, expect, it, mock } from "bun:test";
import { createRpc, createRpcHandler } from "./worker-rpc";

describe("Worker RPC", () => {
	let worker: Worker;

	beforeAll(() => {
		worker = new Worker(new URL("./test/worker.ts", import.meta.url));
	});

	it("creates RPC handler", async () => {
		const mockedHandler = mock(async () => "pong");
		const { messageHandler } = createRpcHandler({
			methods: {
				ping: mockedHandler,
			},
		});
		await messageHandler(
			new MessageEvent("message", { data: { method: "ping", params: [] } }),
		);
		expect(mockedHandler).toHaveBeenCalled();
	});

	it("exchanges messages with Web Worker", async () => {
		const rpc = createRpc({ worker });
		const response = await rpc.request({ method: "ping", params: [] });
		expect(response.result).toBe("pong");
	});

	it("calls non-existing method", async () => {
		const rpc = createRpc({ worker });
		expect(rpc.request({ method: "pang", params: [] })).rejects.toThrow();
	});
});
