import { serve } from "@hono/node-server";
import { z } from "@hono/zod-openapi";
import { api } from "./";

serve(
	{ fetch: api.fetch, port: z.coerce.number().parse(process.env.PORT ?? 3000) },
	(info) => {
		console.log(`Listening on http://localhost:${info.port}`);
	},
);
