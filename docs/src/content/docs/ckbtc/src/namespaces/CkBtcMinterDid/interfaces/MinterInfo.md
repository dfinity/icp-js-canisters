---
title: MinterInfo
editUrl: false
next: true
prev: true
---

Defined in: packages/canisters/declarations/ckbtc/minter.d.ts:262

## Properties

### kyt_fee

> **kyt_fee**: `bigint`

Defined in: packages/canisters/declarations/ckbtc/minter.d.ts:272

The same as `check_fee`, but the old name is kept here to be backward compatible.

---

### min_confirmations

> **min_confirmations**: `number`

Defined in: packages/canisters/declarations/ckbtc/minter.d.ts:268

---

### retrieve_btc_min_amount

> **retrieve_btc_min_amount**: `bigint`

Defined in: packages/canisters/declarations/ckbtc/minter.d.ts:267

This amount is based on the `retrieve_btc_min_amount` setting during canister
initialization or upgrades, but may vary according to current network fees.
