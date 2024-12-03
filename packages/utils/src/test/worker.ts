import { createRpcHandler } from "../worker-rpc";

const { messageHandler } = createRpcHandler({
	methods: {
		ping: async () => "pong",
	},
});

self.onmessage = messageHandler;
