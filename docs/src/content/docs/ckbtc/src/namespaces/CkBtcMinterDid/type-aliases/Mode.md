---
title: Mode
editUrl: false
next: true
prev: true
---

> **Mode** = \{ `RestrictedTo`: `Principal`[]; \} \| \{ `DepositsRestrictedTo`: `Principal`[]; \} \| \{ `ReadOnly`: `null`; \} \| \{ `GeneralAvailability`: `null`; \}

Defined in: packages/canisters/declarations/ckbtc/minter.d.ts:274

## Type Declaration

\{ `RestrictedTo`: `Principal`[]; \}

### RestrictedTo

> **RestrictedTo**: `Principal`[]

Only specified principals can modify minter's state.

\{ `DepositsRestrictedTo`: `Principal`[]; \}

### DepositsRestrictedTo

> **DepositsRestrictedTo**: `Principal`[]

Only specified principals can convert BTC to ckBTC.

\{ `ReadOnly`: `null`; \}

### ReadOnly

> **ReadOnly**: `null`

The minter does not allow any state modifications.

\{ `GeneralAvailability`: `null`; \}

### GeneralAvailability

> **GeneralAvailability**: `null`

Anyone can interact with the minter.
