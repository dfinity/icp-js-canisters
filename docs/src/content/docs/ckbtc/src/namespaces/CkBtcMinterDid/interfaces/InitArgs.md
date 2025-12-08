---
title: InitArgs
editUrl: false
next: true
prev: true
---

Defined in: packages/canisters/declarations/ckbtc/minter.d.ts:189

The initialization parameters of the minter canister.

## Properties

### btc\_checker\_principal

> **btc\_checker\_principal**: \[\] \| \[`Principal`\]

Defined in: packages/canisters/declarations/ckbtc/minter.d.ts:233

/ The canister id of the Bitcoin checker canister.

***

### btc\_network

> **btc\_network**: [`BtcNetwork`](../type-aliases/BtcNetwork.md)

Defined in: packages/canisters/declarations/ckbtc/minter.d.ts:225

The minter will interact with this Bitcoin network.

***

### check\_fee

> **check\_fee**: \[\] \| \[`bigint`\]

Defined in: packages/canisters/declarations/ckbtc/minter.d.ts:229

/ The fee paid per Bitcoin check.

***

### ecdsa\_key\_name

> **ecdsa\_key\_name**: `string`

Defined in: packages/canisters/declarations/ckbtc/minter.d.ts:202

The name of the ECDSA key to use.
E.g., "dfx_test_key" on the local replica.

***

### get\_utxos\_cache\_expiration\_seconds

> **get\_utxos\_cache\_expiration\_seconds**: \[\] \| \[`bigint`\]

Defined in: packages/canisters/declarations/ckbtc/minter.d.ts:193

/ The expiration duration (in seconds) for cached entries in the get_utxos cache.

***

### kyt\_fee

> **kyt\_fee**: \[\] \| \[`bigint`\]

Defined in: packages/canisters/declarations/ckbtc/minter.d.ts:242

/ The fee paid per check by the KYT canister (deprecated, use check_fee instead).

***

### kyt\_principal

> **kyt\_principal**: \[\] \| \[`Principal`\]

Defined in: packages/canisters/declarations/ckbtc/minter.d.ts:197

/ The canister id of the KYT canister (deprecated, use btc_checker_principal instead).

***

### ledger\_id

> **ledger\_id**: `Principal`

Defined in: packages/canisters/declarations/ckbtc/minter.d.ts:216

The principal of the ledger that handles ckBTC transfers.
The default account of the ckBTC minter must be configured as
the minting account of the ledger.

***

### max\_time\_in\_queue\_nanos

> **max\_time\_in\_queue\_nanos**: `bigint`

Defined in: packages/canisters/declarations/ckbtc/minter.d.ts:221

/ Maximum time in nanoseconds that a transaction should spend in the queue
/ before being sent.

***

### min\_confirmations

> **min\_confirmations**: \[\] \| \[`number`\]

Defined in: packages/canisters/declarations/ckbtc/minter.d.ts:238

/ The minimum number of confirmations required for the minter to
/ accept a Bitcoin transaction.

***

### mode

> **mode**: [`Mode`](../type-aliases/Mode.md)

Defined in: packages/canisters/declarations/ckbtc/minter.d.ts:206

/ The minter's operation mode.

***

### retrieve\_btc\_min\_amount

> **retrieve\_btc\_min\_amount**: `bigint`

Defined in: packages/canisters/declarations/ckbtc/minter.d.ts:210

The minimal amount of ckBTC that can be converted to BTC.
