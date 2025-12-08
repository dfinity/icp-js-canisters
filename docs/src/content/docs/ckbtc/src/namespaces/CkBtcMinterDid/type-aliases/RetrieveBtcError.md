---
title: RetrieveBtcError
editUrl: false
next: true
prev: true
---

> **RetrieveBtcError** = \{ `MalformedAddress`: `string`; \} \| \{ `GenericError`: \{ `error_code`: `bigint`; `error_message`: `string`; \}; \} \| \{ `TemporarilyUnavailable`: `string`; \} \| \{ `AlreadyProcessing`: `null`; \} \| \{ `AmountTooLow`: `bigint`; \} \| \{ `InsufficientFunds`: \{ `balance`: `bigint`; \}; \}

Defined in: packages/canisters/declarations/ckbtc/minter.d.ts:342

## Type Declaration

\{ `MalformedAddress`: `string`; \}

### MalformedAddress

> **MalformedAddress**: `string`

The minter failed to parse the destination address.

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

The minter is already processing another retrieval request for the same
principal.

\{ `AmountTooLow`: `bigint`; \}

### AmountTooLow

> **AmountTooLow**: `bigint`

The withdrawal amount is too low.
The payload contains the minimal withdrawal amount.

\{ `InsufficientFunds`: \{ `balance`: `bigint`; \}; \}

### InsufficientFunds

> **InsufficientFunds**: `object`

The ckBTC balance of the withdrawal account is too low.

#### InsufficientFunds.balance

> **balance**: `bigint`
