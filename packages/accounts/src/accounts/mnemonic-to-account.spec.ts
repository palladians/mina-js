import { expect, it } from "bun:test";
import { Test } from "@mina-js/shared";
import { mnemonicToAccount } from "./mnemonic-to-account";

it("matches the snapshot", () => {
	const mnemonicAccount = mnemonicToAccount({ mnemonic: Test.mnemonic });
	expect(mnemonicAccount).toMatchSnapshot();
});
