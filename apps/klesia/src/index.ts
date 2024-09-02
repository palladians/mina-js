import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import { apiReference } from "@scalar/hono-api-reference";
import { logger } from "hono/logger";
import { match } from "ts-pattern";
import { mina } from "./methods/mina";
import { RpcMethodSchema, RpcResponseSchema } from "./schema";
import { buildResponse } from "./utils/build-response";
import { PublicKeySchema } from "@mina-js/shared";

const api = new OpenAPIHono();

api.use(logger());

api.doc("/api/openapi", {
	openapi: "3.0.0",
	info: {
		version: "1.0.0",
		title: "Klesia API",
	},
});

const rpcRoute = createRoute({
	method: "post",
	path: "/api",
	request: {
		body: { content: { "application/json": { schema: RpcMethodSchema } } },
	},
	responses: {
		200: {
			content: {
				"application/json": {
					schema: RpcResponseSchema,
				},
			},
			description: "JSON-RPC response.",
		},
	},
});

api.openapi(rpcRoute, async ({ req, json }) => {
	const body = req.valid("json");
	return match(body)
		.with({ method: "mina_getTransactionCount" }, async ({ params }) => {
			const [publicKey] = params;
			const result = await mina.getTransactionCount({ publicKey: PublicKeySchema.parse(publicKey) });
			return json(buildResponse(result), 200);
		})
		.with({ method: "mina_getBalance" }, async ({ params }) => {
			const [publicKey] = params;
			const result = await mina.getBalance({ publicKey: PublicKeySchema.parse(publicKey) });
			return json(buildResponse(result), 200);
		})
		.with({ method: "mina_blockHash" }, async () => {
			const result = await mina.blockHash();
			return json(buildResponse(result), 200);
		})
		.with({ method: "mina_chainId" }, async () => {
			const result = await mina.chainId();
			return json(buildResponse(result), 200);
		})
		.with({ method: "mina_sendTransaction" }, async ({ params }) => {
			const [signedTransaction, type] = params;
			const result = await mina.sendTransaction({ signedTransaction, type });
			return json(buildResponse(result), 200);
		})
		.exhaustive();
});

api.get(
	"/api",
	apiReference({
		spec: {
			url: "/api/openapi",
		},
	}),
);

export default api;
