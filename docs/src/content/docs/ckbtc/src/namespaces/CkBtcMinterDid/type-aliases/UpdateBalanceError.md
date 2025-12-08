---
title: UpdateBalanceError
editUrl: false
next: true
prev: true
---

> **UpdateBalanceError** = \{ `GenericError`: \{ `error_code`: `bigint`; `error_message`: `string`; \}; \} \| \{ `TemporarilyUnavailable`: `string`; \} \| \{ `AlreadyProcessing`: `null`; \} \| \{ `NoNewUtxos`: \{ `current_confirmations`: \[\] \| \[`number`\]; `pending_utxos`: \[\] \| \[[`PendingUtxo`](../interfaces/PendingUtxo.md)[]\]; `required_confirmations`: `number`; `suspended_utxos`: \[\] \| \[[`SuspendedUtxo`](../interfaces/SuspendedUtxo.md)[]\]; \}; \}

Defined in: packages/canisters/declarations/ckbtc/minter.d.ts:586

## Type Declaration

\{ `GenericError`: \{ `error_code`: `bigint`; `error_message`: `string`; \}; \}

### GenericError

> **GenericError**: `object`

A generic error reserved for future extensions.

#### GenericError.error\_code

> **error\_code**: `bigint`

#### GenericError.error\_message

> **error\_message**: `string`

\{ `TemporarilyUnavailable`: `string`; \}

### TemporarilyUnavailable

> **TemporarilyUnavailable**: `string`

The minter is overloaded, retry the request.
The payload contains a human-readable message explaining what caused the unavailability.

\{ `AlreadyProcessing`: `null`; \}

### AlreadyProcessing

> **AlreadyProcessing**: `null`

The minter is already processing another update balance request for the caller.

\{ `NoNewUtxos`: \{ `current_confirmations`: \[\] \| \[`number`\]; `pending_utxos`: \[\] \| \[[`PendingUtxo`](../interfaces/PendingUtxo.md)[]\]; `required_confirmations`: `number`; `suspended_utxos`: \[\] \| \[[`SuspendedUtxo`](../interfaces/SuspendedUtxo.md)[]\]; \}; \}

### NoNewUtxos

> **NoNewUtxos**: `object`

There are no new UTXOs to process.

#### NoNewUtxos.current\_confirmations

> **current\_confirmations**: \[\] \| \[`number`\]

#### NoNewUtxos.pending\_utxos

> **pending\_utxos**: \[\] \| \[[`PendingUtxo`](../interfaces/PendingUtxo.md)[]\]

#### NoNewUtxos.required\_confirmations

> **required\_confirmations**: `number`

#### NoNewUtxos.suspended\_utxos

> **suspended\_utxos**: \[\] \| \[[`SuspendedUtxo`](../interfaces/SuspendedUtxo.md)[]\]
