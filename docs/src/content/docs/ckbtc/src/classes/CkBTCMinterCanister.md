---
title: CkBTCMinterCanister
editUrl: false
next: true
prev: true
---

Defined in: packages/canisters/ckbtc/minter.canister.d.ts:6

Legacy re-export for backward compatibility.

## Deprecated

Use "@icp-sdk/canisters/ckbtc" directly instead

## Extends

- `Canister`\<[`_SERVICE`](../namespaces/CkBtcMinterDid/interfaces/SERVICE.md)\>

## Constructors

### Constructor

> `protected` **new CkBTCMinterCanister**(`id`, `service`, `certifiedService`): `CkBtcMinterCanister`

Defined in: packages/utils/dist/services/canister.d.ts:7

#### Parameters

##### id

`Principal`

##### service

[`_SERVICE`](../namespaces/CkBtcMinterDid/interfaces/SERVICE.md)

##### certifiedService

[`_SERVICE`](../namespaces/CkBtcMinterDid/interfaces/SERVICE.md)

#### Returns

`CkBtcMinterCanister`

#### Inherited from

`Canister<CkBtcMinterService>.constructor`

## Properties

### ~~caller()~~

> `protected` **caller**: (`__namedParameters`) => [`_SERVICE`](../namespaces/CkBtcMinterDid/interfaces/SERVICE.md)

Defined in: packages/utils/dist/services/canister.d.ts:9

#### Parameters

##### \_\_namedParameters

`QueryParams`

#### Returns

[`_SERVICE`](../namespaces/CkBtcMinterDid/interfaces/SERVICE.md)

#### Inherited from

`Canister.caller`

---

### ~~certifiedService~~

> `protected` `readonly` **certifiedService**: [`_SERVICE`](../namespaces/CkBtcMinterDid/interfaces/SERVICE.md)

Defined in: packages/utils/dist/services/canister.d.ts:6

#### Inherited from

`Canister.certifiedService`

---

### ~~estimateWithdrawalFee()~~

> **estimateWithdrawalFee**: (`params`) => `Promise`\<[`EstimateWithdrawalFee`](../interfaces/EstimateWithdrawalFee.md)\>

Defined in: packages/canisters/ckbtc/minter.canister.d.ts:103

Returns an estimation of the user's fee (in Satoshi) for a retrieve_btc request based on the current status of the Bitcoin network and the fee related to the minter.

#### Parameters

##### params

[`EstimateWithdrawalFeeParams`](../type-aliases/EstimateWithdrawalFeeParams.md)

The parameters to estimate the fee.

#### Returns

`Promise`\<[`EstimateWithdrawalFee`](../interfaces/EstimateWithdrawalFee.md)\>

---

### ~~getBtcAddress()~~

> **getBtcAddress**: (`params`) => `Promise`\<`string`\>

Defined in: packages/canisters/ckbtc/minter.canister.d.ts:18

Returns a BTC address for a given account.

Note: an update call is required by the Minter canister.

#### Parameters

##### params

[`MinterParams`](../type-aliases/MinterParams.md)

The parameters for which a BTC address should be resolved.

#### Returns

`Promise`\<`string`\>

The BTC address of the given account.

---

### ~~getKnownUtxos()~~

> **getKnownUtxos**: (`params`) => `Promise`\<[`Utxo`](../namespaces/CkBtcMinterDid/interfaces/Utxo.md)[]\>

Defined in: packages/canisters/ckbtc/minter.canister.d.ts:119

Returns UTXOs of the given account known by the minter.

#### Parameters

##### params

[`GetKnownUtxosParams`](../type-aliases/GetKnownUtxosParams.md)

The parameters for which the known utxos should be resolved.

#### Returns

`Promise`\<[`Utxo`](../namespaces/CkBtcMinterDid/interfaces/Utxo.md)[]\>

The known utxos (with no guarantee in the ordering).

---

### ~~getMinterInfo()~~

> **getMinterInfo**: (`params`) => `Promise`\<[`MinterInfo`](../namespaces/CkBtcMinterDid/interfaces/MinterInfo.md)\>

Defined in: packages/canisters/ckbtc/minter.canister.d.ts:110

Returns internal minter parameters such as the minimal amount to retrieve BTC, minimal number of confirmations or KYT fee.

#### Parameters

##### params

`QueryParams`

The parameters to get the minter info.

#### Returns

`Promise`\<[`MinterInfo`](../namespaces/CkBtcMinterDid/interfaces/MinterInfo.md)\>

---

### ~~getWithdrawalAccount()~~

> **getWithdrawalAccount**: () => `Promise`\<[`Account`](../namespaces/CkBtcMinterDid/interfaces/Account.md)\>

Defined in: packages/canisters/ckbtc/minter.canister.d.ts:35

Returns the account to which the caller should deposit ckBTC before withdrawing BTC using the [retrieveBtc] endpoint.

#### Returns

`Promise`\<[`Account`](../namespaces/CkBtcMinterDid/interfaces/Account.md)\>

The account to which ckBTC needs to be transferred. Provide corresponding information to map an Icrc1 account.

---

### ~~retrieveBtc()~~

> **retrieveBtc**: (`params`) => `Promise`\<[`RetrieveBtcOk`](../namespaces/CkBtcMinterDid/interfaces/RetrieveBtcOk.md)\>

Defined in: packages/canisters/ckbtc/minter.canister.d.ts:52

Submits a request to convert ckBTC to BTC.

Note:

The BTC retrieval process is slow. Instead of synchronously waiting for a BTC transaction to settle, this method returns a request ([block_index]) that the caller can use to query the request status.

Preconditions:

The caller deposited the requested amount in ckBTC to the account that the [getWithdrawalAccount] endpoint returns.

#### Parameters

##### params

[`RetrieveBtcParams`](../type-aliases/RetrieveBtcParams.md)

The parameters are the bitcoin address and amount to convert.

#### Returns

`Promise`\<[`RetrieveBtcOk`](../namespaces/CkBtcMinterDid/interfaces/RetrieveBtcOk.md)\>

The result or the operation.

---

### ~~retrieveBtcStatus()~~

> **retrieveBtcStatus**: (`transactionId`) => `Promise`\<[`RetrieveBtcStatus`](../namespaces/CkBtcMinterDid/type-aliases/RetrieveBtcStatus.md)\>

Defined in: packages/canisters/ckbtc/minter.canister.d.ts:84

Returns the status of a specific BTC withdrawal based on the transaction ID
of the corresponding burn transaction.

#### Parameters

##### transactionId

The ID of the corresponding burn transaction.

###### certified

`boolean`

###### transactionId

`bigint`

#### Returns

`Promise`\<[`RetrieveBtcStatus`](../namespaces/CkBtcMinterDid/type-aliases/RetrieveBtcStatus.md)\>

The status of the BTC retrieval request.

---

### ~~retrieveBtcStatusV2ByAccount()~~

> **retrieveBtcStatusV2ByAccount**: (`certified`) => `Promise`\<[`RetrieveBtcStatusV2WithId`](../interfaces/RetrieveBtcStatusV2WithId.md)[]\>

Defined in: packages/canisters/ckbtc/minter.canister.d.ts:95

Returns the status of all BTC withdrawals for an account.

#### Parameters

##### certified

[`RetrieveBtcStatusV2ByAccountParams`](../type-aliases/RetrieveBtcStatusV2ByAccountParams.md)

query or update call

#### Returns

`Promise`\<[`RetrieveBtcStatusV2WithId`](../interfaces/RetrieveBtcStatusV2WithId.md)[]\>

The statuses of the BTC retrieval requests.

---

### ~~retrieveBtcWithApproval()~~

> **retrieveBtcWithApproval**: (`__namedParameters`) => `Promise`\<[`RetrieveBtcOk`](../namespaces/CkBtcMinterDid/interfaces/RetrieveBtcOk.md)\>

Defined in: packages/canisters/ckbtc/minter.canister.d.ts:71

Submits a request to convert ckBTC to BTC after making an ICRC-2 approval.

The BTC retrieval process is slow. Instead of synchronously waiting for a BTC transaction to settle, this method returns a request ([block_index]) that the caller can use to query the request status.

# Preconditions

The caller allowed the minter's principal to spend its funds using
[icrc2_approve] on the ckBTC ledger.

#### Parameters

##### \_\_namedParameters

###### address

`string`

###### amount

`bigint`

###### fromSubaccount?

`Uint8Array`\<`ArrayBufferLike`\>

#### Returns

`Promise`\<[`RetrieveBtcOk`](../namespaces/CkBtcMinterDid/interfaces/RetrieveBtcOk.md)\>

The result or the operation.

---

### ~~service~~

> `protected` `readonly` **service**: [`_SERVICE`](../namespaces/CkBtcMinterDid/interfaces/SERVICE.md)

Defined in: packages/utils/dist/services/canister.d.ts:5

#### Inherited from

`Canister.service`

---

### ~~updateBalance()~~

> **updateBalance**: (`params`) => `Promise`\<[`UpdateBalanceOk`](../type-aliases/UpdateBalanceOk.md)\>

Defined in: packages/canisters/ckbtc/minter.canister.d.ts:29

Notify the minter about the bitcoin transfer.

Upon successful notification, new ckBTC should be available on the targeted address.

#### Parameters

##### params

[`MinterParams`](../type-aliases/MinterParams.md)

The parameters are the address to which bitcoin where transferred.

#### Returns

`Promise`\<[`UpdateBalanceOk`](../type-aliases/UpdateBalanceOk.md)\>

The result of the balance update.

## Accessors

### ~~canisterId~~

#### Get Signature

> **get** **canisterId**(): `Principal`

Defined in: packages/utils/dist/services/canister.d.ts:8

##### Returns

`Principal`

#### Inherited from

`Canister.canisterId`

## Methods

### ~~create()~~

> `static` **create**(`options`): `CkBtcMinterCanister`

Defined in: packages/canisters/ckbtc/minter.canister.d.ts:7

#### Parameters

##### options

[`CkBtcCanisterOptions`](../interfaces/CkBtcCanisterOptions.md)\<[`_SERVICE`](../namespaces/CkBtcMinterDid/interfaces/SERVICE.md)\>

#### Returns

`CkBtcMinterCanister`
