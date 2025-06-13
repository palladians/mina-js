import type { ZkappCommand } from "mina-signer/dist/node/mina-signer/src/types";
import type { ZkAppCommandTransactionInput } from "./types";
import { ZkAppCommandTransactionInputSchema } from "./validation.ts";

/**
 *  Converts the zkappCommand from the format accepted by the Mina Node's
 *  GraphQL endpoint to the format accepted by mina-signer.
 */
export function toMinaSignerFormat(zkappCommand: ZkAppCommandTransactionInput) {
	const { publicKey, ...feePayerRest } = zkappCommand.feePayer;
	return {
		...zkappCommand,
		feePayer: {
			...feePayerRest,
			feePayer: publicKey,
		},
	} as ZkappCommand;
}

/**
 *  Converts the zkappCommand from the format accepted by mina-signer
 *  to the format accepted by the Mina Node's GraphQL endpoint.
 */
export function toNodeApiFormat(zkappCommand: ZkappCommand) {
	const { feePayer: publicKey, memo, ...feePayerRest } = zkappCommand.feePayer;
	return ZkAppCommandTransactionInputSchema.parse({
		...zkappCommand,
		feePayer: {
			...feePayerRest,
			publicKey,
		},
	});
}
