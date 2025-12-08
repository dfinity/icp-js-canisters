---
title: MinterInfo
editUrl: false
next: true
prev: true
---

Defined in: packages/canisters/declarations/ckbtc/minter.d.ts:262

## Properties

### kyt\_fee

> **kyt\_fee**: `bigint`

Defined in: packages/canisters/declarations/ckbtc/minter.d.ts:272

The same as `check_fee`, but the old name is kept here to be backward compatible.

***

### min\_confirmations

> **min\_confirmations**: `number`

Defined in: packages/canisters/declarations/ckbtc/minter.d.ts:268

***

### retrieve\_btc\_min\_amount

> **retrieve\_btc\_min\_amount**: `bigint`

Defined in: packages/canisters/declarations/ckbtc/minter.d.ts:267

This amount is based on the `retrieve_btc_min_amount` setting during canister
initialization or upgrades, but may vary according to current network fees.
