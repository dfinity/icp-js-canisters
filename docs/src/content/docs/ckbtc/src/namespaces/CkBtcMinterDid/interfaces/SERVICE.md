---
title: _SERVICE
editUrl: false
next: true
prev: true
---

Defined in: packages/canisters/declarations/ckbtc/minter.d.ts:711

## Properties

### estimate\_withdrawal\_fee

> **estimate\_withdrawal\_fee**: `ActorMethod`\<\[\{ `amount`: \[\] \| \[`bigint`\]; \}\], \{ `bitcoin_fee`: `bigint`; `minter_fee`: `bigint`; \}\>

Defined in: packages/canisters/declarations/ckbtc/minter.d.ts:716

/ Returns an estimate of the user's fee (in Satoshi) for a
/ retrieve_btc request based on the current status of the Bitcoin network.

***

### get\_btc\_address

> **get\_btc\_address**: `ActorMethod`\<\[\{ `owner`: \[\] \| \[`Principal`\]; `subaccount`: \[\] \| \[`Uint8Array`\<`ArrayBufferLike`\>\]; \}\], `string`\>

Defined in: packages/canisters/declarations/ckbtc/minter.d.ts:728

Returns the Bitcoin address to which the owner should send BTC
before converting the amount to ckBTC using the [update_balance]
endpoint.

If the owner is not set, it defaults to the caller's principal.
The resolved owner must be a non-anonymous principal.

***

### get\_canister\_status

> **get\_canister\_status**: `ActorMethod`\<\[\], [`CanisterStatusResponse`](CanisterStatusResponse.md)\>

Defined in: packages/canisters/declarations/ckbtc/minter.d.ts:732

***

### get\_deposit\_fee

> **get\_deposit\_fee**: `ActorMethod`\<\[\], `bigint`\>

Defined in: packages/canisters/declarations/ckbtc/minter.d.ts:736

/ Returns the fee that the minter will charge for a bitcoin deposit.

***

### get\_events

> **get\_events**: `ActorMethod`\<\[\{ `length`: `bigint`; `start`: `bigint`; \}\], [`Event`](Event.md)[]\>

Defined in: packages/canisters/declarations/ckbtc/minter.d.ts:748

The minter keeps track of all state modifications in an internal event log.

This method returns a list of events in the specified range.
The minter can return fewer events than requested. The result is
an empty vector if the start position is greater than the total
number of events.

NOTE: this method exists for debugging purposes.
The ckBTC minter authors do not guarantee backward compatibility for this method.

***

### get\_known\_utxos

> **get\_known\_utxos**: `ActorMethod`\<\[\{ `owner`: \[\] \| \[`Principal`\]; `subaccount`: \[\] \| \[`Uint8Array`\<`ArrayBufferLike`\>\]; \}\], [`Utxo`](Utxo.md)[]\>

Defined in: packages/canisters/declarations/ckbtc/minter.d.ts:755

Returns UTXOs of the given account known by the minter (with no
guarantee in the ordering of the returned values).

If the owner is not set, it defaults to the caller's principal.

***

### get\_minter\_info

> **get\_minter\_info**: `ActorMethod`\<\[\], [`MinterInfo`](MinterInfo.md)\>

Defined in: packages/canisters/declarations/ckbtc/minter.d.ts:763

Section "Minter Information" {{{
Returns internal minter parameters.

***

### get\_withdrawal\_account

> **get\_withdrawal\_account**: `ActorMethod`\<\[\], [`Account`](Account.md)\>

Defined in: packages/canisters/declarations/ckbtc/minter.d.ts:768

Returns the account to which the caller should deposit ckBTC
before withdrawing BTC using the [retrieve_btc] endpoint.

***

### retrieve\_btc

> **retrieve\_btc**: `ActorMethod`\<\[[`RetrieveBtcArgs`](RetrieveBtcArgs.md)\], \{ `Ok`: [`RetrieveBtcOk`](RetrieveBtcOk.md); \} \| \{ `Err`: [`RetrieveBtcError`](../type-aliases/RetrieveBtcError.md); \}\>

Defined in: packages/canisters/declarations/ckbtc/minter.d.ts:784

Submits a request to convert ckBTC to BTC.


The BTC retrieval process is slow.  Instead of
synchronously waiting for a BTC transaction to settle, this
method returns a request ([block_index]) that the caller can use
to query the request status.

# Preconditions

* The caller deposited the requested amount in ckBTC to the account
that the [get_withdrawal_account] endpoint returns.

***

### retrieve\_btc\_status

> **retrieve\_btc\_status**: `ActorMethod`\<\[\{ `block_index`: `bigint`; \}\], [`RetrieveBtcStatus`](../type-aliases/RetrieveBtcStatus.md)\>

Defined in: packages/canisters/declarations/ckbtc/minter.d.ts:792

/ [deprecated] Returns the status of a withdrawal request.
/ You should use retrieve_btc_status_v2 to retrieve the status of your withdrawal request.

***

### retrieve\_btc\_status\_v2

> **retrieve\_btc\_status\_v2**: `ActorMethod`\<\[\{ `block_index`: `bigint`; \}\], [`RetrieveBtcStatusV2`](../type-aliases/RetrieveBtcStatusV2.md)\>

Defined in: packages/canisters/declarations/ckbtc/minter.d.ts:799

/ Returns the status of a withdrawal request request using the RetrieveBtcStatusV2 type.

***

### retrieve\_btc\_status\_v2\_by\_account

> **retrieve\_btc\_status\_v2\_by\_account**: `ActorMethod`\<\[\[\] \| \[[`Account`](Account.md)\]\], `object`[]\>

Defined in: packages/canisters/declarations/ckbtc/minter.d.ts:811

Returns the withdrawal statues by account.

# Note
The _v2_ part indicates that you get a response in line with the retrieve_btc_status_v2 endpoint,
i.e., you get a vector of RetrieveBtcStatusV2 and not RetrieveBtcStatus.

***

### retrieve\_btc\_with\_approval

> **retrieve\_btc\_with\_approval**: `ActorMethod`\<\[[`RetrieveBtcWithApprovalArgs`](RetrieveBtcWithApprovalArgs.md)\], \{ `Ok`: [`RetrieveBtcOk`](RetrieveBtcOk.md); \} \| \{ `Err`: [`RetrieveBtcWithApprovalError`](../type-aliases/RetrieveBtcWithApprovalError.md); \}\>

Defined in: packages/canisters/declarations/ckbtc/minter.d.ts:830

Submits a request to convert ckBTC to BTC.

# Note

The BTC retrieval process is slow.  Instead of
synchronously waiting for a BTC transaction to settle, this
method returns a request ([block_index]) that the caller can use
to query the request status.

# Preconditions

* The caller allowed the minter's principal to spend its funds
using [icrc2_approve] on the ckBTC ledger.

***

### update\_balance

> **update\_balance**: `ActorMethod`\<\[\{ `owner`: \[\] \| \[`Principal`\]; `subaccount`: \[\] \| \[`Uint8Array`\<`ArrayBufferLike`\>\]; \}\], \{ `Ok`: [`UtxoStatus`](../type-aliases/UtxoStatus.md)[]; \} \| \{ `Err`: [`UpdateBalanceError`](../type-aliases/UpdateBalanceError.md); \}\>

Defined in: packages/canisters/declarations/ckbtc/minter.d.ts:844

Mints ckBTC for newly deposited UTXOs.

If the owner is not set, it defaults to the caller's principal.

# Preconditions

* The owner deposited some BTC to the address that the
[get_btc_address] endpoint returns.
