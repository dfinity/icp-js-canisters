---
title: GetUtxosParams
editUrl: false
next: true
prev: true
---

> **GetUtxosParams** = `Omit`\<[`get_utxos_request`](../namespaces/BitcoinDid/interfaces/get_utxos_request.md), `"network"` \| `"filter"`\> & `object` & `Omit`\<`QueryParams`, `"certified"`\>

Defined in: packages/canisters/ckbtc/types/bitcoin.params.d.ts:4

## Type Declaration

### filter?

> `optional` **filter**: \{ `page`: `Uint8Array`; \} \| \{ `minConfirmations`: `number`; \}

### network

> **network**: [`BitcoinNetwork`](BitcoinNetwork.md)
