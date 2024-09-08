import { SignedTransactionSchema } from "@mina-js/shared";
import { gql } from "@urql/core";
import { match } from "ts-pattern";
import { getNodeClient } from "../utils/node";

const getTransactionCount = async ({ publicKey }: { publicKey: string }) => {
	const client = getNodeClient();
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
};

const getBalance = async ({ publicKey }: { publicKey: string }) => {
	const client = getNodeClient();
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

const chainId = async () => {
	const client = getNodeClient();
	const { data } = await client.query(
		gql`
      query {
        daemonStatus {
          chainId
        }
      }
    `,
		{},
	);
	return data.daemonStatus.chainId;
};

const sendTransaction = async ({
	signedTransaction,
	type,
}: {
	// biome-ignore lint/suspicious/noExplicitAny: TODO
	signedTransaction: any;
	type: "payment" | "delegation" | "zkapp";
}) => {
	const client = getNodeClient();
	return match(type)
		.with("payment", async () => {
			const { signature, data: input } =
				SignedTransactionSchema.parse(signedTransaction);
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
			const { signature, data: input } =
				SignedTransactionSchema.parse(signedTransaction);
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
				{ input: signedTransaction },
			);
			return data.sendZkapp.zkapp.hash;
		})
		.exhaustive();
};

const getAccount = async ({ publicKey }: { publicKey: string }) => {
	const client = getNodeClient();
	const { data } = await client.query(
		gql`
      query {
        account(publicKey: $publicKey) {
          nonce
          balance {
            total
          }
        }
      }
    `,
		{ publicKey },
	);
	return {
		nonce: data.account.nonce,
		balance: data.account.balance.total,
	};
};

export const mina = {
	getTransactionCount,
	getBalance,
	blockHash,
	chainId,
	sendTransaction,
	getAccount,
};
