export const sampleCredential = {
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

export const sampleCredential1 = {
	version: "v0",
	witness: { type: "unsigned" },
	credential: {
		owner: {
			_type: "PublicKey",
			value: "B62qiVGZQdBJJrxnzhvqp7LKe6jDiFcpU3cF5xHoZof5Pz9qiL85KLx",
		},
		data: {
			age: { _type: "Field", value: "42" },
			name: {
				_type: "Bytes",
				value:
					"416c696365000000000000000000000000000000000000000000000000000000",
			},
		},
	},
};

export const sampleCredential2 = {
	version: "v0",
	witness: {
		type: "simple",
		issuer: {
			_type: "PublicKey",
			value: "B62qqRryvaLH99vsPx6kL8cuWFq2AZZsDjaQftab4hpGA5Du3Jju6kP",
		},
		issuerSignature: {
			_type: "Signature",
			value: {
				r: "18608032094363426526383612175861105396636219252290095846645842383039012234860",
				s: "16614231870158121751259974049410646935461628042855821394498854808344556066615",
			},
		},
	},
	credential: {
		owner: {
			_type: "PublicKey",
			value: "B62qqBvUfKppzx3omv5g9YSooRuqA3YVG5zq4j33tN2THA6tGc7JUij",
		},
		data: {
			age: { _type: "Field", value: "18" },
			name: {
				_type: "Bytes",
				value:
					"416c696365000000000000000000000000000000000000000000000000000000",
			},
		},
	},
};

export const sampleCredential3 = {
	version: "v0",
	witness: {
		type: "simple",
		issuer: {
			_type: "PublicKey",
			value: "B62qipmSo9Bju1XPtHfH8ukLWSMgur6e2xiUcfzbqwKEMdzSfQNbfbS",
		},
		issuerSignature: {
			_type: "Signature",
			value: {
				r: "15369596967930537948249866433896467790855310091967164859503093172192059176638",
				s: "18498891580394813079080734274552796309574738769075217343428610783674309728163",
			},
		},
	},
	credential: {
		owner: {
			_type: "PublicKey",
			value: "B62qrVPwPbeogxQKzPcV5dTSTmNo39g1T2hAM19cJ5Dtwk1p4STmKAE",
		},
		data: {
			age: { _type: "Field", value: "18" },
			name: {
				_type: "Bytes",
				value:
					"416c696365000000000000000000000000000000000000000000000000000000",
			},
		},
	},
};

export const samplePresentationRequest = {
	type: "zk-app",
	spec: {
		inputs: {
			data: {
				type: "credential",
				credentialType: "simple",
				witness: {
					type: { type: "Constant", value: "simple" },
					issuer: { _type: "PublicKey" },
					issuerSignature: { _type: "Signature" },
				},
				data: {
					person: {
						age: { _type: "Field" },
						name: { _type: "Bytes", size: 32 },
					},
					points: { _type: "Field" },
				},
			},
			targetAge: { type: "claim", data: { _type: "Field" } },
			targetPoints: { type: "claim", data: { _type: "Field" } },
		},
		logic: {
			assert: {
				type: "and",
				inputs: [
					{
						type: "equals",
						left: {
							type: "property",
							key: "age",
							inner: {
								type: "property",
								key: "person",
								inner: {
									type: "property",
									key: "data",
									inner: {
										type: "property",
										key: "data",
										inner: { type: "root" },
									},
								},
							},
						},
						right: {
							type: "property",
							key: "targetAge",
							inner: { type: "root" },
						},
					},
					{
						type: "equals",
						left: {
							type: "property",
							key: "points",
							inner: {
								type: "property",
								key: "data",
								inner: {
									type: "property",
									key: "data",
									inner: { type: "root" },
								},
							},
						},
						right: {
							type: "property",
							key: "targetPoints",
							inner: { type: "root" },
						},
					},
				],
			},
			outputClaim: {
				type: "property",
				key: "name",
				inner: {
					type: "property",
					key: "person",
					inner: {
						type: "property",
						key: "data",
						inner: { type: "property", key: "data", inner: { type: "root" } },
					},
				},
			},
		},
	},
	claims: {
		targetAge: { _type: "Field", value: "25" },
		targetPoints: { _type: "Field", value: "100" },
	},
	inputContext: {
		type: "zk-app",
		serverNonce: {
			_type: "Field",
			value:
				"13282950667393837968514931367603124110006503770513488711847457500412027340795",
		},
		action: { _type: "Field", value: "123" },
	},
};

export const samplePresentationRequest1 = {
	type: "https",
	spec: {
		inputs: {
			signedData: {
				type: "credential",
				credentialType: "simple",
				witness: {
					type: { type: "Constant", value: "simple" },
					issuer: { _type: "PublicKey" },
					issuerSignature: { _type: "Signature" },
				},
				data: { age: { _type: "Field" }, name: { _type: "Bytes", size: 32 } },
			},
			targetAge: { type: "claim", data: { _type: "Field" } },
			targetName: {
				type: "constant",
				data: { _type: "Bytes", size: 32 },
				value:
					"416c696365000000000000000000000000000000000000000000000000000000",
			},
		},
		logic: {
			assert: {
				type: "and",
				inputs: [
					{
						type: "equals",
						left: {
							type: "property",
							key: "age",
							inner: {
								type: "property",
								key: "data",
								inner: {
									type: "property",
									key: "signedData",
									inner: { type: "root" },
								},
							},
						},
						right: {
							type: "property",
							key: "targetAge",
							inner: { type: "root" },
						},
					},
					{
						type: "equals",
						left: {
							type: "property",
							key: "name",
							inner: {
								type: "property",
								key: "data",
								inner: {
									type: "property",
									key: "signedData",
									inner: { type: "root" },
								},
							},
						},
						right: {
							type: "property",
							key: "targetName",
							inner: { type: "root" },
						},
					},
				],
			},
			outputClaim: {
				type: "property",
				key: "age",
				inner: {
					type: "property",
					key: "data",
					inner: {
						type: "property",
						key: "signedData",
						inner: { type: "root" },
					},
				},
			},
		},
	},
	claims: { targetAge: { _type: "Field", value: "18" } },
	inputContext: {
		type: "https",
		serverNonce: {
			_type: "Field",
			value:
				"4343919140832211358170758874350867217600871707216240107166052913905177631127",
		},
		action: "POST /api/verify",
	},
};
