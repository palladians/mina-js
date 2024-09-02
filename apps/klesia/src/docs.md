# Klesia RPC

Klesia RPC is a JSON-RPC 2.0 wrapper over common Mina Protocol tools and services. The intention is to provide an outstanding Developer Experience for Mina Protocol's zkApp Developers.

## Methods

### mina_getTransactionCount

Returns the number of transactions sent from an address. Usually you may want to use this number to determine the nonce for the next transaction.

#### Parameters

Array of strings:
- `publicKey` - Address to check for transaction count.

---

### mina_getBalance

Returns the balance of the account of given address.

#### Parameters

Array of strings:
- `publicKey` - Address to check for transaction count.

---

### mina_blockHash

Returns the hash of the most recent block.

---

### mina_chainId

Returns the currently configured chain ID.

---

### mina_sendTransaction

Broadcasts a signed transaction to the network.

#### Parameters

Array of strings:
- `input` - Signed transaction or zkApp input.
- `type` - Transaction type. Can be `payment`, `delegation`, or `zkapp`.
