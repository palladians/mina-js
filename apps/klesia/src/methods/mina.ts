import {
	SendTransactionBodySchema,
	SendZkAppBodySchema,
	type Sendable,
} from "@mina-js/utils";
import { gql } from "@urql/core";
import { match } from "ts-pattern";
import { getNodeClient } from "../utils/node";

export const PRIORITY = {
	low: 0.25,
	medium: 0.5,
	high: 0.75,
} as Record<string, number>;

const getTransactionCount = async ({ publicKey }: { publicKey: string }) => {
	const client = getNodeClient();
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

const getBalance = async ({ publicKey }: { publicKey: string }) => {
	const client = getNodeClient();
	try {
		const { data } = await client.query(
			gql`
        query {
          account(publicKey: $publicKey) {
            balance {
              total
            }
          }
        }
      `,
			{ publicKey },
		);
		return data.account.balance.total;
	} catch {
		return "0";
	}
};

const blockHash = async () => {
	const client = getNodeClient();
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
	const client = getNodeClient();
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
	const client = getNodeClient();
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

const getAccount = async ({ publicKey }: { publicKey: string }) => {
	const client = getNodeClient();
	try {
		const { data } = await client.query(
			gql`
      query {
        account(publicKey: $publicKey) {
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
			{ publicKey },
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

export const mina = {
	getTransactionCount,
	getBalance,
	blockHash,
	networkId,
	sendTransaction,
	getAccount,
};
