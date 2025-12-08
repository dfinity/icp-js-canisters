---
title: RetrieveBtcStatusV2
editUrl: false
next: true
prev: true
---

> **RetrieveBtcStatusV2** = \{ `Signing`: `null`; \} \| \{ `Confirmed`: \{ `txid`: `Uint8Array`; \}; \} \| \{ `Sending`: \{ `txid`: `Uint8Array`; \}; \} \| \{ `AmountTooLow`: `null`; \} \| \{ `WillReimburse`: [`ReimbursementRequest`](../interfaces/ReimbursementRequest.md); \} \| \{ `Unknown`: `null`; \} \| \{ `Submitted`: \{ `txid`: `Uint8Array`; \}; \} \| \{ `Reimbursed`: [`ReimbursedDeposit`](../interfaces/ReimbursedDeposit.md); \} \| \{ `Pending`: `null`; \}

Defined in: packages/canisters/declarations/ckbtc/minter.d.ts:440

## Type Declaration

\{ `Signing`: `null`; \}

### Signing

> **Signing**: `null`

The minter is obtaining all required ECDSA signatures on the
Bitcoin transaction for this request.

\{ `Confirmed`: \{ `txid`: `Uint8Array`; \}; \}

### Confirmed

> **Confirmed**: `object`

The minter received enough confirmations for the Bitcoin
transaction for this request. The payload contains the
identifier of the transaction on the Bitcoin network.

#### Confirmed.txid

> **txid**: `Uint8Array`

\{ `Sending`: \{ `txid`: `Uint8Array`; \}; \}

### Sending

> **Sending**: `object`

The minter signed the transaction and is waiting for a reply
from the Bitcoin canister.

#### Sending.txid

> **txid**: `Uint8Array`

\{ `AmountTooLow`: `null`; \}

### AmountTooLow

> **AmountTooLow**: `null`

The amount was too low to cover the transaction fees.

\{ `WillReimburse`: [`ReimbursementRequest`](../interfaces/ReimbursementRequest.md); \}

### WillReimburse

> **WillReimburse**: [`ReimbursementRequest`](../interfaces/ReimbursementRequest.md)

/ The minter will try to reimburse this transaction.

\{ `Unknown`: `null`; \}

### Unknown

> **Unknown**: `null`

The minter does not have any information on the specified
retrieval request. It can be that nobody submitted the
request or the minter pruned the relevant information from the
history to save space.

\{ `Submitted`: \{ `txid`: `Uint8Array`; \}; \}

### Submitted

> **Submitted**: `object`

The minter sent a transaction for the retrieve request.
The payload contains the identifier of the transaction on the Bitcoin network.

#### Submitted.txid

> **txid**: `Uint8Array`

\{ `Reimbursed`: [`ReimbursedDeposit`](../interfaces/ReimbursedDeposit.md); \}

### Reimbursed

> **Reimbursed**: [`ReimbursedDeposit`](../interfaces/ReimbursedDeposit.md)

/ The retrieve Bitcoin request has been reimbursed.

\{ `Pending`: `null`; \}

### Pending

> **Pending**: `null`

The minter did not send a Bitcoin transaction for this request yet.
