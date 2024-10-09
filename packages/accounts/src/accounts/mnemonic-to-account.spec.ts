import { expect, it } from "bun:test";
import { Test } from "@mina-js/utils";
import { mnemonicToAccount } from "./mnemonic-to-account";

it("matches the snapshot", () => {
	const mnemonicAccount = mnemonicToAccount({ mnemonic: Test.mnemonic });
	expect(mnemonicAccount).toMatchSnapshot();
});
