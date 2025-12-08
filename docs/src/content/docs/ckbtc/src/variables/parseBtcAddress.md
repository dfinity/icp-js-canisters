---
title: parseBtcAddress
editUrl: false
next: true
prev: true
---

> `const` **parseBtcAddress**: (`{ address, network, }`) => [`BtcAddressInfo`](../interfaces/BtcAddressInfo.md)

Defined in: packages/canisters/ckbtc/utils/btc.utils.d.ts:13

Parse a Bitcoin address.

Parse implementation follows strategy implemented in [Minter canister](https://github.com/dfinity/ic/blob/a8da3aa23dc6f8f4708cb0cb8edce84c5bd8f225/rs/bitcoin/ckbtc/minter/src/address.rs#L54).

Credits: Parts of JavaScript code and test values from [bitcoin-address-validation](https://github.com/ruigomeseu/bitcoin-address-validation).

## Parameters

### \{ address, network, \}

[`BtcAddress`](../interfaces/BtcAddress.md)

## Returns

[`BtcAddressInfo`](../interfaces/BtcAddressInfo.md)
