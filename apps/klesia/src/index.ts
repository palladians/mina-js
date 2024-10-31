import { getConnInfo } from "@hono/node-server/conninfo";
import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import { PublicKeySchema } from "@mina-js/utils";
import { rateLimiter } from "hono-rate-limiter";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { nanoid } from "nanoid";
import { match } from "ts-pattern";
import mainDocs from "../docs/index.txt";
import rpcDocs from "../docs/rpc.txt";
import { mina } from "./methods/mina";
import { RpcMethod, RpcMethodSchema, RpcResponseSchema } from "./schema";
import { buildResponse } from "./utils/build-response";

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
		limit: 10,
	}),
);
api.use("/api", cors({ origin: "*" }));

api.doc("/api/openapi", {
	openapi: "3.0.0",
	info: {
		version: "1.0.0",
		title: "Klesia RPC",
		description: mainDocs,
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

export const klesiaRpcRoute = api.openapi(rpcRoute, async ({ req, json }) => {
	const body = req.valid("json");
	return match(body)
		.with(
			{ method: RpcMethod.enum.mina_getTransactionCount },
			async ({ params }) => {
				const [publicKey] = params;
				const result = await mina.getTransactionCount({
					publicKey: PublicKeySchema.parse(publicKey),
				});
				return json(
					buildResponse({
						result,
					}),
					200,
				);
			},
		)
		.with({ method: RpcMethod.enum.mina_getBalance }, async ({ params }) => {
			const [publicKey] = params;
			const result = await mina.getBalance({
				publicKey: PublicKeySchema.parse(publicKey),
			});
			return json(buildResponse({ result }), 200);
		})
		.with({ method: RpcMethod.enum.mina_blockHash }, async () => {
			if (process.env.MINA_NETWORK === "zeko_devnet") {
				return json(
					buildResponse({
						error: {
							code: -32600,
							message: "Network not supported.",
						},
					}),
					200,
				);
			}
			const result = await mina.blockHash();
			return json(buildResponse({ result }), 200);
		})
		.with({ method: RpcMethod.enum.mina_chainId }, async () => {
			const result = await mina.chainId();
			return json(buildResponse({ result }), 200);
		})
		.with(
			{ method: RpcMethod.enum.mina_sendTransaction },
			async ({ params }) => {
				const [signedTransaction, type] = params;
				const result = await mina.sendTransaction({ signedTransaction, type });
				return json(
					buildResponse({
						result,
					}),
					200,
				);
			},
		)
		.with({ method: RpcMethod.enum.mina_getAccount }, async ({ params }) => {
			const [publicKey] = params;
			const result = await mina.getAccount({
				publicKey: PublicKeySchema.parse(publicKey),
			});
			return json(buildResponse({ result }), 200);
		})
		.exhaustive();
});

export type KlesiaRpc = typeof klesiaRpcRoute;
export {
	KlesiaNetwork,
	RpcMethod,
	type RpcMethodType,
	type RpcResponseType,
	type RpcErrorType,
} from "./schema";
