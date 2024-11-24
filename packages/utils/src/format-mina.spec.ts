import { expect, it } from "bun:test";

import { formatMina } from "./format-mina";

it("converts micro-Mina to Mina", () => {
	const result = formatMina(5_000_000_000n);
	expect(result).toEqual("5");
});
