import {
	SendTransactionBodySchema,
	SendZkAppBodySchema,
	type Sendable,
} from "@mina-js/utils";
import { type Client, gql } from "@urql/core";
import { match } from "ts-pattern";

export const PRIORITY = {
	low: 0.25,
	medium: 0.5,
	high: 0.75,
} as Record<string, number>;

export const mina = (client: Client) => {
	const getTransactionCount = async ({ publicKey }: { publicKey: string }) => {
		try {
			const { data } = await client.query(
				gql`
                    query {
                        account(publicKey: $publicKey) {
                            nonce
                        }
                    }
                `,
				{ publicKey },
			);
			return data.account.nonce;
		} catch {
			return "0";
		}
	};

	const getBalance = async ({
		publicKey,
		tokenId,
	}: { publicKey: string; tokenId: string }) => {
		try {
			const { data } = await client.query(
				gql`
                    query {
                        account(publicKey: $publicKey, token: $tokenId) {
                            balance {
                                total
                            }
                        }
                    }
                `,
				{ publicKey, tokenId },
			);
			return data.account.balance.total;
		} catch {
			return "0";
		}
	};

	const blockHash = async () => {
		const { data } = await client.query(
			gql`
                query {
                    daemonStatus {
                        stateHash
                    }
                }
            `,
			{},
		);
		return data.daemonStatus.stateHash;
	};

	const networkId = async () => {
		const { data } = await client.query(
			gql`
                query {
                    networkID
                }
            `,
			{},
		);
		return data.networkID === "mina:testnet" ? "mina:devnet" : data.networkID;
	};

	const sendTransaction = async ({
		signedTransaction,
		type,
	}: {
		signedTransaction: Sendable;
		type: "payment" | "delegation" | "zkapp";
	}) => {
		return match(type)
			.with("payment", async () => {
				const { signature, input } =
					SendTransactionBodySchema.parse(signedTransaction);
				const { data } = await client.mutation(
					gql`
                    mutation {
                        sendPayment(signature: $signature, input: $input) {
                            payment {
                                hash
                            }
                        }
                    }
                `,
					{ signature, input },
				);
				return data.sendPayment.payment.hash;
			})
			.with("delegation", async () => {
				const { signature, input } =
					SendTransactionBodySchema.parse(signedTransaction);
				const { data } = await client.mutation(
					gql`
                    mutation {
                        sendDelegation(signature: $signature, input: $input) {
                            delegation {
                                hash
                            }
                        }
                    }
                `,
					{ signature, input },
				);
				return data.sendDelegation.delegation.hash;
			})
			.with("zkapp", async () => {
				const { input } = SendZkAppBodySchema.parse(signedTransaction);
				const { data } = await client.mutation(
					gql`
                    mutation {
                        sendZkapp(input: $input) {
                            zkapp {
                                hash
                            }
                        }
                    }
                `,
					{ input },
				);
				return data.sendZkapp.zkapp.hash;
			})
			.exhaustive();
	};

	const getAccount = async ({
		publicKey,
		tokenId,
	}: { publicKey: string; tokenId: string }) => {
		try {
			const { data } = await client.query(
				gql`
                    query {
                        account(publicKey: $publicKey, token: $tokenId) {
                            publicKey
                            token
                            nonce
                            balance {
                                total
                            }
                            tokenSymbol
                            receiptChainHash
                            timing {
                                initialMinimumBalance
                                cliffTime
                                cliffAmount
                                vestingPeriod
                                vestingIncrement
                            }
                            permissions {
                                editState
                                access
                                send
                                receive
                                setDelegate
                                setPermissions
                                setVerificationKey {
                                    auth
                                    txnVersion
                                }
                                setZkappUri
                                editActionState
                                setTokenSymbol
                                incrementNonce
                                setVotingFor
                                setTiming
                            }
                            delegateAccount { publicKey }
                            votingFor
                            zkappState
                            verificationKey {
                                verificationKey
                                hash
                            }
                            actionState
                            provedState
                            zkappUri
                        }
                    }
                `,
				{ publicKey, tokenId },
			);
			return data.account;
		} catch {
			return {
				nonce: "0",
				balance: {
					total: "0",
				},
			};
		}
	};

	return {
		getTransactionCount,
		getBalance,
		blockHash,
		networkId,
		sendTransaction,
		getAccount,
	};
};
