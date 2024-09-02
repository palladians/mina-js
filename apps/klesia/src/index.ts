import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import { PublicKeySchema } from "@mina-js/shared";
import { apiReference } from "@scalar/hono-api-reference";
import { rateLimiter } from "hono-rate-limiter";
import { getConnInfo } from "hono/bun";
import { logger } from "hono/logger";
import { nanoid } from "nanoid";
import { match } from "ts-pattern";
import rpcDocs from "./docs.md" with { type: "text" };
import { mina } from "./methods/mina";
import { RpcMethodSchema, RpcResponseSchema } from "./schema";
import { buildResponse } from "./utils/build-response";

const api = new OpenAPIHono();

api.use(logger());
api.use(
	rateLimiter({
		keyGenerator: (c) => getConnInfo(c).remote.address ?? nanoid(),
		limit: 10,
	}),
);

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
	description: rpcDocs,
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

api.get("/", ({ redirect }) => redirect("/api", 301));

api.openapi(rpcRoute, async ({ req, json }) => {
	const body = req.valid("json");
	return match(body)
		.with({ method: "mina_getTransactionCount" }, async ({ params }) => {
			const [publicKey] = params;
			const result = await mina.getTransactionCount({
				publicKey: PublicKeySchema.parse(publicKey),
			});
			return json(buildResponse(result), 200);
		})
		.with({ method: "mina_getBalance" }, async ({ params }) => {
			const [publicKey] = params;
			const result = await mina.getBalance({
				publicKey: PublicKeySchema.parse(publicKey),
			});
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
		theme: "deepSpace",
	}),
);

export default api;
