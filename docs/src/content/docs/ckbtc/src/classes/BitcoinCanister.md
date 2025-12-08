---
title: BitcoinCanister
editUrl: false
next: true
prev: true
---

Defined in: packages/canisters/ckbtc/bitcoin.canister.d.ts:5

## Extends

- `Canister`\<[`_SERVICE`](../namespaces/BitcoinDid/interfaces/SERVICE.md)\>

## Constructors

### Constructor

> `protected` **new BitcoinCanister**(`id`, `service`, `certifiedService`): `BitcoinCanister`

Defined in: packages/utils/dist/services/canister.d.ts:7

#### Parameters

##### id

`Principal`

##### service

[`_SERVICE`](../namespaces/BitcoinDid/interfaces/SERVICE.md)

##### certifiedService

[`_SERVICE`](../namespaces/BitcoinDid/interfaces/SERVICE.md)

#### Returns

`BitcoinCanister`

#### Inherited from

`Canister<BitcoinService>.constructor`

## Properties

### caller()

> `protected` **caller**: (`__namedParameters`) => [`_SERVICE`](../namespaces/BitcoinDid/interfaces/SERVICE.md)

Defined in: packages/utils/dist/services/canister.d.ts:9

#### Parameters

##### \_\_namedParameters

`QueryParams`

#### Returns

[`_SERVICE`](../namespaces/BitcoinDid/interfaces/SERVICE.md)

#### Inherited from

`Canister.caller`

***

### certifiedService

> `protected` `readonly` **certifiedService**: [`_SERVICE`](../namespaces/BitcoinDid/interfaces/SERVICE.md)

Defined in: packages/utils/dist/services/canister.d.ts:6

#### Inherited from

`Canister.certifiedService`

***

### getBalanceQuery()

> **getBalanceQuery**: (`params`) => `Promise`\<`bigint`\>

Defined in: packages/canisters/ckbtc/bitcoin.canister.d.ts:34

Given a `get_balance_request`, which must specify a Bitcoin address and a Bitcoin network (`mainnet`, `testnet` or `regtest`), the function returns the current balance of this address in `Satoshi` (10^8 Satoshi = 1 Bitcoin) in the specified Bitcoin network.

⚠️ Note that this method does not support certified calls because only canisters are allowed to get Bitcoin balance via update calls.

#### Parameters

##### params

[`GetBalanceParams`](../type-aliases/GetBalanceParams.md)

#### Returns

`Promise`\<`bigint`\>

The balance is returned in `Satoshi` (10^8 Satoshi = 1 Bitcoin).

#### Link

https://internetcomputer.org/docs/current/references/ic-interface-spec#ic-bitcoin_get_balance

***

### getUtxosQuery()

> **getUtxosQuery**: (`params`) => `Promise`\<[`get_utxos_response`](../namespaces/BitcoinDid/interfaces/get_utxos_response.md)\>

Defined in: packages/canisters/ckbtc/bitcoin.canister.d.ts:20

Given a `get_utxos_request`, which must specify a Bitcoin address and a Bitcoin network (`mainnet`, `testnet` or `regtest`), the function returns all unspent transaction outputs (UTXOs) associated with the provided address in the specified Bitcoin network based on the current view of the Bitcoin blockchain available to the Bitcoin component.

⚠️ Note that this method does not support certified calls because only canisters are allowed to get UTXOs via update calls.

#### Parameters

##### params

[`GetUtxosParams`](../type-aliases/GetUtxosParams.md)

#### Returns

`Promise`\<[`get_utxos_response`](../namespaces/BitcoinDid/interfaces/get_utxos_response.md)\>

The UTXOs are returned sorted by block height in descending order.

#### Link

https://internetcomputer.org/docs/current/references/ic-interface-spec#ic-bitcoin_get_utxos

***

### service

> `protected` `readonly` **service**: [`_SERVICE`](../namespaces/BitcoinDid/interfaces/SERVICE.md)

Defined in: packages/utils/dist/services/canister.d.ts:5

#### Inherited from

`Canister.service`

## Accessors

### canisterId

#### Get Signature

> **get** **canisterId**(): `Principal`

Defined in: packages/utils/dist/services/canister.d.ts:8

##### Returns

`Principal`

#### Inherited from

`Canister.canisterId`

## Methods

### create()

> `static` **create**(`options`): `BitcoinCanister`

Defined in: packages/canisters/ckbtc/bitcoin.canister.d.ts:6

#### Parameters

##### options

[`CkBtcCanisterOptions`](../interfaces/CkBtcCanisterOptions.md)\<[`_SERVICE`](../namespaces/BitcoinDid/interfaces/SERVICE.md)\>

#### Returns

`BitcoinCanister`
