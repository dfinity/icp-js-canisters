---
title: SuspendedReason
editUrl: false
next: true
prev: true
---

> **SuspendedReason** = \{ `ValueTooSmall`: `null`; \} \| \{ `Quarantined`: `null`; \}

Defined in: packages/canisters/declarations/ckbtc/minter.d.ts:563

## Type Declaration

\{ `ValueTooSmall`: `null`; \}

### ValueTooSmall

> **ValueTooSmall**: `null`

The minter ignored this UTXO because UTXO's value is too small to pay
the check fees.

\{ `Quarantined`: `null`; \}

### Quarantined

> **Quarantined**: `null`

The Bitcoin checker considered this UTXO to be tainted.
