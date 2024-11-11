import { createStore } from "@mina-js/connect";
import { useLocalStorage, useObjectState } from "@uidotdev/usehooks";
import { clsx } from "clsx";
import { useState, useSyncExternalStore } from "react";

const store = createStore();

const sampleCredential = {
	version: "v0",
	witness: {
		type: "simple",
		issuer: {
			_type: "PublicKey",
			value: "B62qqMxueXzenrchT5CKC5eCSmfcbHic9wJd9GEdHVcd9uCWrjPJjHS",
		},
		issuerSignature: {
			_type: "Signature",
			value: {
				r: "27355434072539307953235904941558417174103383443074165997458891331674091021280",
				s: "22156398191479529717864137276005168653180340733374387165875910835098679659803",
			},
		},
	},
	credential: {
		owner: {
			_type: "PublicKey",
			value: "B62qqCMx9YvvjhMFVcRXBqHtAbjWWUhyA9HmgpYCehLHTGKgXsxiZpz",
		},
		data: {
			age: {
				_type: "Field",
				value: "25",
			},
		},
	},
};

export const TestZkApp = () => {
	const [currentProvider, setCurrentProvider] = useLocalStorage(
		"minajs:provider",
		"",
	);
	const [message, setMessage] = useState("A message to sign");
	const [fields, setFields] = useState('["1", "2", "3"]');
	const [credentialInput, setCredentialInput] = useState(
		JSON.stringify(sampleCredential, null, 2),
	);
	const [transactionBody, setTransactionBody] = useObjectState({
		to: "B62qnVUL6A53E4ZaGd3qbTr6RCtEZYTu3kTijVrrquNpPo4d3MuJ3nb",
		amount: "3000000000",
		fee: "100000000",
		memo: "Hello from MinaJS!",
		nonce: "0",
	});
	const [results, setResults] = useObjectState({
		mina_accounts: "",
		mina_networkId: "",
		mina_getBalance: "",
		mina_sign: "",
		mina_signFields: "",
		mina_signTransaction: "",
		mina_switchChain: "",
		mina_storePrivateCredential: "",
	});
	const providers = useSyncExternalStore(store.subscribe, store.getProviders);
	const provider = providers.find(
		(p) => p.info.slug === currentProvider,
	)?.provider;

	const storePrivateCredential = async () => {
		if (!provider) return;
		try {
			const parsedCredential = JSON.parse(credentialInput);
			const { result } = await provider.request({
				method: "mina_storePrivateCredential",
				params: [parsedCredential],
			});
			setResults(() => ({
				mina_storePrivateCredential: JSON.stringify(result, null, 2),
			}));
		} catch (error) {
			setResults(() => ({
				mina_storePrivateCredential: `Error: ${error.message}`,
			}));
		}
	};

	const fetchAccounts = async () => {
		if (!provider) return;
		const { result } = await provider.request({
			method: "mina_accounts",
		});
		setResults(() => ({ mina_accounts: JSON.stringify(result) }));
	};
	const fetchRequestAccounts = async () => {
		if (!provider) return;
		const { result } = await provider.request({
			method: "mina_requestAccounts",
		});
		setResults(() => ({ mina_accounts: JSON.stringify(result) }));
	};
	const fetchNetworkId = async () => {
		if (!provider) return;
		const { result } = await provider.request({
			method: "mina_networkId",
		});
		setResults(() => ({ mina_networkId: result }));
	};
	const fetchBalance = async () => {
		if (!provider) return;
		const { result } = await provider.request({
			method: "mina_getBalance",
		});
		setResults(() => ({ mina_getBalance: result }));
	};
	const signMessage = async () => {
		if (!provider) return;
		const { result } = await provider.request({
			method: "mina_sign",
			params: [message],
		});
		setResults(() => ({ mina_sign: JSON.stringify(result, undefined, "\t") }));
	};
	const signFields = async () => {
		if (!provider) return;
		const parsedFields = JSON.parse(fields);
		const { result } = await provider.request({
			method: "mina_signFields",
			params: [parsedFields],
		});
		setResults(() => ({
			mina_signFields: JSON.stringify(result, undefined, "\t"),
		}));
	};
	const createNullifier = async () => {
		if (!provider) return;
		const parsedFields = JSON.parse(fields);
		const { result } = await provider.request({
			method: "mina_createNullifier",
			params: [parsedFields],
		});
		setResults(() => ({
			mina_signFields: JSON.stringify(result, undefined, "\t"),
		}));
	};
	const signTransaction = async () => {
		if (!provider) return;
		const { result: accounts } = await provider.request({
			method: "mina_accounts",
		});
		const transaction = {
			...transactionBody,
			from: accounts[0],
		};
		const { result } = await provider.request({
			method: "mina_signTransaction",
			params: [{ transaction }],
		});
		setResults(() => ({
			mina_signTransaction: JSON.stringify(result, undefined, "\t"),
		}));
	};
	const signZkAppCommand = async () => {
		if (!provider) return;
		const { result: accounts } = await provider.request({
			method: "mina_accounts",
		});
		const command = {
			zkappCommand: {
				accountUpdates: [],
				memo: "E4YM2vTHhWEg66xpj52JErHUBU4pZ1yageL4TVDDpTTSsv8mK6YaH",
				feePayer: {
					body: {
						publicKey: accounts[0],
						fee: "100000000",
						validUntil: "100000",
						nonce: "1",
					},
					authorization: "",
				},
			},
			feePayer: {
				feePayer: accounts[0],
				fee: transactionBody.fee,
				nonce: transactionBody.nonce,
				memo: transactionBody.memo,
			},
		};
		const { result } = await provider.request({
			method: "mina_signTransaction",
			params: [{ command }],
		});
		setResults(() => ({
			mina_signTransaction: JSON.stringify(result, undefined, "\t"),
		}));
	};
	const switchChain = async (networkId: string) => {
		if (!provider) return;
		const { result } = await provider.request({
			method: "mina_switchChain",
			params: [networkId],
		});
		setResults(() => ({ mina_switchChain: result }));
	};
	return (
		<main className="flex flex-col gap-8">
			<h1 className="text-3xl font-bold">Test zkApp</h1>
			<section className="card bg-neutral">
				<div className="card-body gap-4">
					<h2 className="card-title">Available Wallets</h2>
					<ul className="list-none">
						{providers.map((provider) => {
							const active = currentProvider === provider.info.slug;
							return (
								<li
									key={provider.info.slug}
									className="flex items-center gap-8"
								>
									<img
										src={provider.info.icon}
										alt={provider.info.name}
										className="w-8 h-8"
									/>
									<h3 className="flex-1 text-lg">{provider.info.name}</h3>
									<button
										type="button"
										className={clsx(
											"btn",
											active ? "btn-neutral" : "btn-secondary",
										)}
										onClick={() => setCurrentProvider(provider.info.slug)}
									>
										{active ? "Connected" : "Connect"}
									</button>
								</li>
							);
						})}
					</ul>
				</div>
			</section>
			<section className="card bg-neutral">
				<div className="card-body gap-4">
					<h2 className="card-title">Queries</h2>
					<div className="flex flex-col gap-2">
						<label>mina_accounts / mina_requestAccounts</label>
						<div className="flex justify-between items-center gap-4">
							<input
								value={results.mina_accounts}
								className="input input-bordered flex-1"
							/>
							<button
								type="button"
								className="btn btn-primary"
								onClick={fetchAccounts}
							>
								Get Accounts
							</button>
							<button
								type="button"
								className="btn btn-primary"
								onClick={fetchRequestAccounts}
							>
								Request Accounts
							</button>
						</div>
						<label>mina_getBalance</label>
						<div className="flex justify-between items-center gap-4">
							<input
								value={results.mina_getBalance}
								className="input input-bordered flex-1"
							/>
							<button
								type="button"
								className="btn btn-primary"
								onClick={fetchBalance}
							>
								Get Balance
							</button>
						</div>
					</div>
				</div>
			</section>
			<section className="card bg-neutral">
				<div className="card-body gap-4">
					<h2 className="card-title">Network</h2>
					<div className="flex flex-col gap-2">
						<label>mina_networkId</label>
						<div className="flex justify-between items-center gap-4">
							<input
								value={results.mina_networkId}
								className="input input-bordered flex-1"
							/>
							<button
								type="button"
								className="btn btn-primary"
								onClick={fetchNetworkId}
							>
								Get Network ID
							</button>
						</div>
						<label>mina_switchChain</label>
						<div className="flex items-center gap-4">
							<button
								type="button"
								className="btn btn-primary"
								onClick={() => switchChain("mina:devnet")}
							>
								Switch to Devnet
							</button>
							<button
								type="button"
								className="btn btn-primary"
								onClick={() => switchChain("mina:mainnet")}
							>
								Switch to Mainnet
							</button>
						</div>
					</div>
				</div>
			</section>
			<section className="card bg-neutral">
				<div className="card-body gap-4">
					<h2 className="card-title">Sign Message</h2>
					<div className="flex flex-col gap-2">
						<label>mina_sign</label>
						<div className="flex justify-between items-center gap-4">
							<input
								value={message}
								onChange={(event) => setMessage(event.target.value)}
								className="input input-bordered flex-1"
							/>
							<button
								type="button"
								className="btn btn-primary"
								onClick={signMessage}
							>
								Sign Message
							</button>
						</div>
						<label>Result</label>
						<textarea
							value={results.mina_sign}
							className="textarea textarea-bordered h-48 resize-none"
						/>
					</div>
				</div>
			</section>
			<section className="card bg-neutral">
				<div className="card-body gap-4">
					<h2 className="card-title">Sign Fields / Create Nullifier</h2>
					<p>mina_signFields / mina_createNullifier</p>
					<div className="flex flex-col gap-2">
						<div className="flex justify-between items-center gap-4">
							<input
								value={fields}
								onChange={(event) => setFields(event.target.value)}
								className="input input-bordered flex-1"
							/>
							<button
								type="button"
								className="btn btn-primary"
								onClick={signFields}
							>
								Sign Fields
							</button>
							<button
								type="button"
								className="btn btn-primary"
								onClick={createNullifier}
							>
								Create Nullifier
							</button>
						</div>
						<label>Result</label>
						<textarea
							value={results.mina_signFields}
							className="textarea textarea-bordered h-48 resize-none"
						/>
					</div>
				</div>
			</section>
			<section className="card bg-neutral">
				<div className="card-body gap-4">
					<h2 className="card-title">Sign Transaction</h2>
					<p>mina_signTransaction</p>
					<div className="flex flex-col gap-2">
						<label>To</label>
						<input
							value={transactionBody.to}
							onChange={(event) =>
								setTransactionBody(() => ({ to: event.target.value }))
							}
							className="input input-bordered"
						/>
						<label>Amount</label>
						<input
							value={transactionBody.amount}
							onChange={(event) =>
								setTransactionBody(() => ({ amount: event.target.value }))
							}
							className="input input-bordered"
						/>
						<label>Fee</label>
						<input
							value={transactionBody.fee}
							onChange={(event) =>
								setTransactionBody(() => ({ fee: event.target.value }))
							}
							className="input input-bordered"
						/>
						<label>Memo</label>
						<input
							value={transactionBody.memo}
							onChange={(event) =>
								setTransactionBody(() => ({ memo: event.target.value }))
							}
							className="input input-bordered"
						/>
						<label>Nonce</label>
						<input
							value={transactionBody.nonce}
							onChange={(event) =>
								setTransactionBody(() => ({ nonce: event.target.value }))
							}
							className="input input-bordered"
						/>
					</div>
					<div className="flex gap-4">
						<button
							type="button"
							className="btn btn-primary flex-1"
							onClick={signTransaction}
						>
							Sign Transaction
						</button>
						<button
							type="button"
							className="btn btn-primary flex-1"
							onClick={signZkAppCommand}
						>
							Sign ZK App Command
						</button>
					</div>
					<div className="flex flex-col gap-2">
						<label>Result</label>
						<textarea
							value={results.mina_signTransaction}
							className="textarea textarea-bordered h-48 resize-none"
						/>
					</div>
				</div>
			</section>
			<section className="card bg-neutral">
				<div className="card-body gap-4">
					<h2 className="card-title">Store Private Credential</h2>
					<p>mina_storePrivateCredential</p>
					<div className="flex flex-col gap-2">
						<div className="flex flex-col gap-4">
							<textarea
								value={credentialInput}
								onChange={(event) => setCredentialInput(event.target.value)}
								className="textarea textarea-bordered h-48 font-mono text-sm"
								placeholder="Enter credential JSON..."
							/>
							<button
								type="button"
								className="btn btn-primary"
								onClick={storePrivateCredential}
							>
								Store Private Credential
							</button>
						</div>
						<label>Result</label>
						<textarea
							value={results.mina_storePrivateCredential}
							readOnly
							className="textarea textarea-bordered h-24 resize-none font-mono"
						/>
					</div>
				</div>
			</section>
		</main>
	);
};
