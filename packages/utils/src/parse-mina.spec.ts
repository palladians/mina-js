import { expect, it } from "bun:test";

import { parseMina } from "./parse-mina";

it("converts Mina to micro-Mina", () => {
	const result = parseMina("5");
	expect(result).toEqual(5_000_000_000n);
});
