import { expect, it } from "bun:test";

import MinaSigner from "mina-signer";
import type { ZkappCommand } from "mina-signer/dist/node/mina-signer/src/types";
import { Test } from ".";
import { toMinaSignerFormat, toNodeApiFormat } from "./format-mina-signer.ts";
import type { ZkAppCommandTransactionInput } from "./types.ts";
import { ZkAppCommandTransactionInputSchema } from "./validation.ts";

const zkAppCommandTransactionInput: ZkAppCommandTransactionInput = {
	feePayer: {
		publicKey: "B62qmWKtvNQTtUqo1LxfEEDLyWMg59cp6U7c4uDC7aqgaCEijSc3Hx5",
		fee: "500000000",
		nonce: "80",
	},
	zkappCommand: {
		feePayer: {
			body: {
				publicKey: "B62qmWKtvNQTtUqo1LxfEEDLyWMg59cp6U7c4uDC7aqgaCEijSc3Hx5",
				fee: "500000000",
				nonce: "80",
			},
			authorization: "AAAA",
		},
		accountUpdates: [
			{
				body: {
					publicKey: "B62qjDnppFhY5tsEmLbCDRniCoJcYqLmHpEeXVfwM4Ej18uJFhTrmBb",
					tokenId: "wSHV2S4qX9jFsLjQo8r1BsMLH2ZRKsZx6EJd1sbozGPieEC4Jf",
					update: {
						appState: [null, "99", null, null, null, null, null, null],
						delegate: null,
						verificationKey: null,
						permissions: null,
						zkappUri: null,
						tokenSymbol: null,
						timing: null,
						votingFor: null,
					},
					balanceChange: { magnitude: "0", sgn: "Positive" },
					incrementNonce: false,
					events: [],
					actions: [],
					callData:
						"10800487342181823963815989160381594655240621259804937200329423578747504677917",
					callDepth: 0,
					preconditions: {
						network: {
							snarkedLedgerHash: null,
							blockchainLength: null,
							minWindowDensity: null,
							totalCurrency: null,
							globalSlotSinceGenesis: null,
							stakingEpochData: {
								ledger: { hash: null, totalCurrency: null },
								seed: null,
								startCheckpoint: null,
								lockCheckpoint: null,
								epochLength: null,
							},
							nextEpochData: {
								ledger: { hash: null, totalCurrency: null },
								seed: null,
								startCheckpoint: null,
								lockCheckpoint: null,
								epochLength: null,
							},
						},
						account: {
							balance: null,
							nonce: null,
							receiptChainHash: null,
							delegate: null,
							state: [
								"16116219678327627588418069644712109297153469885195699368844152027463492597061",
								"98",
								null,
								null,
								null,
								null,
								null,
								null,
							],
							actionState: null,
							provedState: null,
							isNew: null,
						},
						validWhile: null,
					},
					useFullCommitment: false,
					implicitAccountCreationFee: false,
					mayUseToken: { parentsOwnToken: false, inheritFromParent: false },
					authorizationKind: {
						isSigned: false,
						isProved: true,
						verificationKeyHash:
							"11750353713893815297158950840448218779998732873007487372019852701410593771174",
					},
				},
				authorization: {
					proof: "PPPP==",
				},
			},
		],
		memo: "E4YM2vTHhWEg66xpj52JErHUBU4pZ1yageL4TVDDpTTSsv8mK6YaH",
	},
};

const zkAppCommandMinaSignerFormat: ZkappCommand = {
	feePayer: {
		feePayer: "B62qmWKtvNQTtUqo1LxfEEDLyWMg59cp6U7c4uDC7aqgaCEijSc3Hx5",
		fee: "500000000",
		nonce: "80",
	},
	zkappCommand: {
		feePayer: {
			body: {
				publicKey: "B62qmWKtvNQTtUqo1LxfEEDLyWMg59cp6U7c4uDC7aqgaCEijSc3Hx5",
				fee: "500000000",
				nonce: "80",
				validUntil: null,
			},
			authorization: "AAAA",
		},
		accountUpdates: [
			{
				body: {
					publicKey: "B62qjDnppFhY5tsEmLbCDRniCoJcYqLmHpEeXVfwM4Ej18uJFhTrmBb",
					tokenId: "wSHV2S4qX9jFsLjQo8r1BsMLH2ZRKsZx6EJd1sbozGPieEC4Jf",
					update: {
						appState: [null, "99", null, null, null, null, null, null],
						delegate: null,
						verificationKey: null,
						permissions: null,
						zkappUri: null,
						tokenSymbol: null,
						timing: null,
						votingFor: null,
					},
					balanceChange: { magnitude: "0", sgn: "Positive" },
					incrementNonce: false,
					events: [],
					actions: [],
					callData:
						"10800487342181823963815989160381594655240621259804937200329423578747504677917",
					callDepth: 0,
					preconditions: {
						network: {
							snarkedLedgerHash: null,
							blockchainLength: null,
							minWindowDensity: null,
							totalCurrency: null,
							globalSlotSinceGenesis: null,
							stakingEpochData: {
								ledger: { hash: null, totalCurrency: null },
								seed: null,
								startCheckpoint: null,
								lockCheckpoint: null,
								epochLength: null,
							},
							nextEpochData: {
								ledger: { hash: null, totalCurrency: null },
								seed: null,
								startCheckpoint: null,
								lockCheckpoint: null,
								epochLength: null,
							},
						},
						account: {
							balance: null,
							nonce: null,
							receiptChainHash: null,
							delegate: null,
							state: [
								"16116219678327627588418069644712109297153469885195699368844152027463492597061",
								"98",
								null,
								null,
								null,
								null,
								null,
								null,
							],
							actionState: null,
							provedState: null,
							isNew: null,
						},
						validWhile: null,
					},
					useFullCommitment: false,
					implicitAccountCreationFee: false,
					mayUseToken: { parentsOwnToken: false, inheritFromParent: false },
					authorizationKind: {
						isSigned: false,
						isProved: true,
						verificationKeyHash:
							"11750353713893815297158950840448218779998732873007487372019852701410593771174",
					},
				},
				authorization: {
					proof: "PPPP==",
					signature: null,
				},
			},
		],
		memo: "E4YM2vTHhWEg66xpj52JErHUBU4pZ1yageL4TVDDpTTSsv8mK6YaH",
	},
};

it("converts zkappCommand to MinaSigner format", () => {
	const privateKey = Test.accounts[0].privateKey;
	const client = new MinaSigner({ network: "mainnet" });
	expect(() => {
		client.signTransaction(
			toMinaSignerFormat(zkAppCommandTransactionInput),
			privateKey,
		);
	}).not.toThrow();
});

it("converts zkappCommand to NodeApi format", () => {
	expect(() => {
		ZkAppCommandTransactionInputSchema.parse(
			toNodeApiFormat(zkAppCommandMinaSignerFormat),
		);
	}).not.toThrow();
});
