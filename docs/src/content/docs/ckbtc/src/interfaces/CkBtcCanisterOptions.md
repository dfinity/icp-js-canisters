---
title: CkBtcCanisterOptions
editUrl: false
next: true
prev: true
---

Defined in: packages/canisters/ckbtc/types/canister.options.d.ts:3

## Extends

- `Omit`\<`CanisterOptions`\<`T`\>, `"canisterId"`\>

## Type Parameters

### T

`T`

## Properties

### agent?

> `optional` **agent**: `Agent`

Defined in: packages/utils/dist/types/canister.options.d.ts:4

#### Inherited from

[`GovernanceCanisterOptions`](../../../api/nns/interfaces/GovernanceCanisterOptions.md).[`agent`](../../../api/nns/interfaces/GovernanceCanisterOptions.md#agent)

***

### canisterId

> **canisterId**: `Principal`

Defined in: packages/canisters/ckbtc/types/canister.options.d.ts:4

***

### certifiedServiceOverride?

> `optional` **certifiedServiceOverride**: `ActorSubclass`\<`T`\>

Defined in: packages/utils/dist/types/canister.options.d.ts:7

#### Inherited from

`Omit.certifiedServiceOverride`

***

### serviceOverride?

> `optional` **serviceOverride**: `ActorSubclass`\<`T`\>

Defined in: packages/utils/dist/types/canister.options.d.ts:6

#### Inherited from

`Omit.serviceOverride`
