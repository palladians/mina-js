import type { KlesiaRpc } from "@mina-js/klesia";
import { hc } from "hono/client";
import { match } from "ts-pattern";
import { z } from "zod";

const NetworkMatcher = z.enum(["mainnet", "devnet"]);

export const createClient = ({
	network,
}: { network: "mainnet" | "devnet" }) => {
	return match(NetworkMatcher.parse(network))
		.with("devnet", () =>
			hc<KlesiaRpc>("https://devnet.klesia.palladians.xyz/api"),
		)
		.with("mainnet", () =>
			hc<KlesiaRpc>("https://mainnet.klesia.palladians.xyz/api"),
		)
		.exhaustive();
};
