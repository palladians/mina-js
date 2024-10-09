import { z } from "zod";

// Helper schemas
const PublicKey = z.string();
const Signature = z.string();
const Field = z.string();
const TokenId = z.string();
const UInt32 = z.number().int();
const UInt64 = z.number().int();
const BooleanSchema = z.boolean();
const AuthRequired = z.enum([
	"None",
	"Proof",
	"Signature",
	"Either",
	"Impossible",
]);
const Sign = z.enum(["Positive", "Negative"]);
const Memo = z.string();
const ZkappProof = z.string();

// Complex nested schemas
const VerificationKeyWithHashInput = z.object({
	data: z.string(),
	hash: Field,
});

const PermissionsInput = z.object({
	editState: AuthRequired,
	access: AuthRequired,
	send: AuthRequired,
	receive: AuthRequired,
	setDelegate: AuthRequired,
	setPermissions: AuthRequired,
	setVerificationKey: z.object({
		auth: AuthRequired,
		txnVersion: UInt32,
	}),
	setZkappUri: AuthRequired,
	editActionState: AuthRequired,
	setTokenSymbol: AuthRequired,
	incrementNonce: AuthRequired,
	setVotingFor: AuthRequired,
	setTiming: AuthRequired,
});

const TimingInput = z.object({
	initialMinimumBalance: UInt64,
	cliffTime: UInt32,
	cliffAmount: UInt64,
	vestingPeriod: UInt32,
	vestingIncrement: UInt64,
});

const AccountUpdateModificationInput = z.object({
	appState: z.array(Field).optional(),
	delegate: PublicKey.optional(),
	verificationKey: VerificationKeyWithHashInput.optional(),
	permissions: PermissionsInput.optional(),
	zkappUri: z.string().optional(),
	tokenSymbol: z.string().optional(),
	timing: TimingInput.optional(),
	votingFor: Field.optional(),
});

const BalanceChangeInput = z.object({
	magnitude: UInt64,
	sgn: Sign,
});

const CurrencyAmountIntervalInput = z.object({
	lower: UInt64,
	upper: UInt64,
});

const LengthIntervalInput = z.object({
	lower: UInt32,
	upper: UInt32,
});

const GlobalSlotSinceGenesisIntervalInput = z.object({
	lower: UInt32,
	upper: UInt32,
});

const EpochLedgerPreconditionInput = z.object({
	hash: Field.optional(),
	totalCurrency: CurrencyAmountIntervalInput.optional(),
});

const EpochDataPreconditionInput = z.object({
	ledger: EpochLedgerPreconditionInput,
	seed: Field.optional(),
	startCheckpoint: Field.optional(),
	lockCheckpoint: Field.optional(),
	epochLength: LengthIntervalInput.optional(),
});

const NetworkPreconditionInput = z.object({
	snarkedLedgerHash: Field.optional(),
	blockchainLength: LengthIntervalInput.optional(),
	minWindowDensity: LengthIntervalInput.optional(),
	totalCurrency: CurrencyAmountIntervalInput.optional(),
	globalSlotSinceGenesis: GlobalSlotSinceGenesisIntervalInput.optional(),
	stakingEpochData: EpochDataPreconditionInput,
	nextEpochData: EpochDataPreconditionInput,
});

const AccountPreconditionInput = z.object({
	balance: CurrencyAmountIntervalInput.optional(),
	nonce: LengthIntervalInput.optional(),
	receiptChainHash: Field.optional(),
	delegate: PublicKey.optional(),
	state: z.array(Field),
	actionState: Field.optional(),
	provedState: BooleanSchema.optional(),
	isNew: BooleanSchema.optional(),
});

const PreconditionsInput = z.object({
	network: NetworkPreconditionInput,
	account: AccountPreconditionInput,
	validWhile: GlobalSlotSinceGenesisIntervalInput.optional(),
});

const MayUseTokenInput = z.object({
	parentsOwnToken: BooleanSchema,
	inheritFromParent: BooleanSchema,
});

const AuthorizationKindStructuredInput = z.object({
	isSigned: BooleanSchema,
	isProved: BooleanSchema,
	verificationKeyHash: Field,
});

const AccountUpdateBodyInput = z.object({
	publicKey: PublicKey,
	tokenId: TokenId,
	update: AccountUpdateModificationInput,
	balanceChange: BalanceChangeInput,
	incrementNonce: BooleanSchema,
	events: z.array(z.array(Field)),
	actions: z.array(z.array(Field)),
	callData: Field,
	callDepth: z.number().int(),
	preconditions: PreconditionsInput,
	useFullCommitment: BooleanSchema,
	implicitAccountCreationFee: BooleanSchema,
	mayUseToken: MayUseTokenInput,
	authorizationKind: AuthorizationKindStructuredInput,
});

const ControlInput = z.object({
	proof: ZkappProof.optional(),
	signature: Signature.optional(),
});

const ZkappAccountUpdateInput = z.object({
	body: AccountUpdateBodyInput,
	authorization: ControlInput,
});

const FeePayerBodyInput = z.object({
	publicKey: PublicKey,
	fee: UInt64,
	validUntil: UInt32.optional(),
	nonce: UInt32,
});

const ZkappFeePayerInput = z.object({
	body: FeePayerBodyInput,
	authorization: Signature,
});

const ZkappCommandInput = z.object({
	feePayer: ZkappFeePayerInput,
	accountUpdates: z.array(ZkappAccountUpdateInput),
	memo: Memo,
});

export const SendZkappInput = z.object({
	zkappCommand: ZkappCommandInput,
});
