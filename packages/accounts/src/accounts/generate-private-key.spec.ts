import { expect, it } from "bun:test";
import { generatePrivateKey } from "./generate-private-key";

it("returns a string", () => {
	const privateKey = generatePrivateKey();
	expect(typeof privateKey).toBe("string");
});

it("has a length of 64 characters", () => {
	const privateKey = generatePrivateKey();
	expect(privateKey.length).toBe(52);
});
