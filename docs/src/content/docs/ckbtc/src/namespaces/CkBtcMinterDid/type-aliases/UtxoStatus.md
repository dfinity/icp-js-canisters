---
title: UtxoStatus
editUrl: false
next: true
prev: true
---

> **UtxoStatus** = \{ `ValueTooSmall`: [`Utxo`](../interfaces/Utxo.md); \} \| \{ `Tainted`: [`Utxo`](../interfaces/Utxo.md); \} \| \{ `Minted`: \{ `block_index`: `bigint`; `minted_amount`: `bigint`; `utxo`: [`Utxo`](../interfaces/Utxo.md); \}; \} \| \{ `Checked`: [`Utxo`](../interfaces/Utxo.md); \}

Defined in: packages/canisters/declarations/ckbtc/minter.d.ts:668

The result of an [update_balance] call.

## Type Declaration

\{ `ValueTooSmall`: [`Utxo`](../interfaces/Utxo.md); \}

### ValueTooSmall

> **ValueTooSmall**: [`Utxo`](../interfaces/Utxo.md)

The minter ignored this UTXO because UTXO's value is too small to pay
the check fees.

\{ `Tainted`: [`Utxo`](../interfaces/Utxo.md); \}

### Tainted

> **Tainted**: [`Utxo`](../interfaces/Utxo.md)

The Bitcoin checker considered this UTXO to be tainted.

\{ `Minted`: \{ `block_index`: `bigint`; `minted_amount`: `bigint`; `utxo`: [`Utxo`](../interfaces/Utxo.md); \}; \}

### Minted

> **Minted**: `object`

The UTXO passed the Bitcoin check, and ckBTC has been minted.

#### Minted.block_index

> **block_index**: `bigint`

#### Minted.minted_amount

> **minted_amount**: `bigint`

#### Minted.utxo

> **utxo**: [`Utxo`](../interfaces/Utxo.md)

\{ `Checked`: [`Utxo`](../interfaces/Utxo.md); \}

### Checked

> **Checked**: [`Utxo`](../interfaces/Utxo.md)

The UTXO passed the Bitcoin check, but the minter failed to mint ckBTC
because the Ledger was unavailable. Retrying the [update_balance] call
should eventually advance the UTXO to the [Minted] state.
