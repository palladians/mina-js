import { getConnInfo } from "@hono/node-server/conninfo";
import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import {
	KlesiaRpcMethodSchema,
	KlesiaRpcResponseSchema,
} from "@mina-js/klesia-utils";
import { handleJsonRpcRequest } from "@mina-js/klesia-utils";
import { rateLimiter } from "hono-rate-limiter";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { nanoid } from "nanoid";
import { getNodeApiUrl } from "./utils/node";

export const api = new OpenAPIHono();

api.use(logger());
api.use(
	rateLimiter({
		skip: (c) =>
			process.env.NODE_ENV === "test" ||
			c.req.path !== "/api" ||
			c.req.method !== "POST",
		keyGenerator: (c) =>
			c.req.header("x-forwarded-for") ??
			getConnInfo(c).remote.address ??
			nanoid(),
		limit: 100,
	}),
);
api.use("/api", cors({ origin: "*" }));

api.doc("/api/openapi", {
	openapi: "3.0.0",
	info: {
		version: "1.0.0",
		title: "Klesia RPC",
	},
});

const rpcRoute = createRoute({
	method: "post",
	path: "/api",
	request: {
		body: {
			content: { "application/json": { schema: KlesiaRpcMethodSchema } },
		},
	},
	responses: {
		200: {
			content: {
				"application/json": {
					schema: KlesiaRpcResponseSchema,
				},
			},
			description: "JSON-RPC response.",
		},
	},
});

export const klesiaRpcRoute = api.openapi(rpcRoute, async ({ req, json }) => {
	return json(
		await handleJsonRpcRequest(getNodeApiUrl(), await req.json()),
		200,
	);
});

export type KlesiaRpc = typeof klesiaRpcRoute;
