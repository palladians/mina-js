import { expect, it } from "bun:test";
import { mnemonic } from "../test/constants";
import { mnemonicToAccount } from "./mnemonic-to-account";

it("matches the snapshot", () => {
	const mnemonicAccount = mnemonicToAccount(mnemonic);
	expect(mnemonicAccount).toMatchSnapshot();
});
