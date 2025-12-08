---
title: UpgradeArgs
editUrl: false
next: true
prev: true
---

Defined in: packages/canisters/declarations/ckbtc/minter.d.ts:620

The upgrade parameters of the minter canister.

## Properties

### btc_checker_principal

> **btc_checker_principal**: \[\] \| \[`Principal`\]

Defined in: packages/canisters/declarations/ckbtc/minter.d.ts:649

/ The principal of the Bitcoin checker canister.

---

### check_fee

> **check_fee**: \[\] \| \[`bigint`\]

Defined in: packages/canisters/declarations/ckbtc/minter.d.ts:645

/ The fee per Bitcoin check.

---

### get_utxos_cache_expiration_seconds

> **get_utxos_cache_expiration_seconds**: \[\] \| \[`bigint`\]

Defined in: packages/canisters/declarations/ckbtc/minter.d.ts:624

/ The expiration duration (in seconds) for cached entries in the get_utxos cache.

---

### kyt_fee

> **kyt_fee**: \[\] \| \[`bigint`\]

Defined in: packages/canisters/declarations/ckbtc/minter.d.ts:658

/ The fee paid per check by the KYT canister (deprecated, use check_fee instead).

---

### kyt_principal

> **kyt_principal**: \[\] \| \[`Principal`\]

Defined in: packages/canisters/declarations/ckbtc/minter.d.ts:628

/ The canister id of the KYT canister (deprecated, use btc_checker_principal instead).

---

### max_time_in_queue_nanos

> **max_time_in_queue_nanos**: \[\] \| \[`bigint`\]

Defined in: packages/canisters/declarations/ckbtc/minter.d.ts:641

/ Maximum time in nanoseconds that a transaction should spend in the queue
/ before being sent.

---

### min_confirmations

> **min_confirmations**: \[\] \| \[`number`\]

Defined in: packages/canisters/declarations/ckbtc/minter.d.ts:654

/ The minimum number of confirmations required for the minter to
/ accept a Bitcoin transaction.

---

### mode

> **mode**: \[\] \| \[[`Mode`](../type-aliases/Mode.md)\]

Defined in: packages/canisters/declarations/ckbtc/minter.d.ts:632

/ If set, overrides the current minter's operation mode.

---

### retrieve_btc_min_amount

> **retrieve_btc_min_amount**: \[\] \| \[`bigint`\]

Defined in: packages/canisters/declarations/ckbtc/minter.d.ts:636

The minimal amount of ckBTC that the minter converts to BTC.
