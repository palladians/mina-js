import { expect, it } from "bun:test";
import { english } from ".";
import { generateMnemonic } from "./generate-mnemonic";

it("generates 12 word mnemonic", () => {
	const mnemonic = generateMnemonic(english);
	expect(mnemonic.split(" ").length).toBe(12);
});
