---
title: UpgradeArgs
editUrl: false
next: true
prev: true
---

Defined in: packages/canisters/declarations/ckbtc/minter.d.ts:620

The upgrade parameters of the minter canister.

## Properties

### btc\_checker\_principal

> **btc\_checker\_principal**: \[\] \| \[`Principal`\]

Defined in: packages/canisters/declarations/ckbtc/minter.d.ts:649

/ The principal of the Bitcoin checker canister.

***

### check\_fee

> **check\_fee**: \[\] \| \[`bigint`\]

Defined in: packages/canisters/declarations/ckbtc/minter.d.ts:645

/ The fee per Bitcoin check.

***

### get\_utxos\_cache\_expiration\_seconds

> **get\_utxos\_cache\_expiration\_seconds**: \[\] \| \[`bigint`\]

Defined in: packages/canisters/declarations/ckbtc/minter.d.ts:624

/ The expiration duration (in seconds) for cached entries in the get_utxos cache.

***

### kyt\_fee

> **kyt\_fee**: \[\] \| \[`bigint`\]

Defined in: packages/canisters/declarations/ckbtc/minter.d.ts:658

/ The fee paid per check by the KYT canister (deprecated, use check_fee instead).

***

### kyt\_principal

> **kyt\_principal**: \[\] \| \[`Principal`\]

Defined in: packages/canisters/declarations/ckbtc/minter.d.ts:628

/ The canister id of the KYT canister (deprecated, use btc_checker_principal instead).

***

### max\_time\_in\_queue\_nanos

> **max\_time\_in\_queue\_nanos**: \[\] \| \[`bigint`\]

Defined in: packages/canisters/declarations/ckbtc/minter.d.ts:641

/ Maximum time in nanoseconds that a transaction should spend in the queue
/ before being sent.

***

### min\_confirmations

> **min\_confirmations**: \[\] \| \[`number`\]

Defined in: packages/canisters/declarations/ckbtc/minter.d.ts:654

/ The minimum number of confirmations required for the minter to
/ accept a Bitcoin transaction.

***

### mode

> **mode**: \[\] \| \[[`Mode`](../type-aliases/Mode.md)\]

Defined in: packages/canisters/declarations/ckbtc/minter.d.ts:632

/ If set, overrides the current minter's operation mode.

***

### retrieve\_btc\_min\_amount

> **retrieve\_btc\_min\_amount**: \[\] \| \[`bigint`\]

Defined in: packages/canisters/declarations/ckbtc/minter.d.ts:636

The minimal amount of ckBTC that the minter converts to BTC.
