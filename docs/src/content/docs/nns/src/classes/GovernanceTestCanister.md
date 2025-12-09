---
title: GovernanceTestCanister
editUrl: false
next: true
prev: true
---

Defined in: packages/canisters/nns/governance_test.canister.d.ts:4

## Methods

### updateNeuron()

> **updateNeuron**(`neuron`): `Promise`\<\[\] \| \[[`GovernanceError`](../namespaces/NnsGovernanceTestDid/interfaces/GovernanceError.md)\]\>

Defined in: packages/canisters/nns/governance_test.canister.d.ts:14

Test method to update fields of a neuron.

Only available in the governance test canister.

#### Parameters

##### neuron

[`Neuron`](../interfaces/Neuron.md)

#### Returns

`Promise`\<\[\] \| \[[`GovernanceError`](../namespaces/NnsGovernanceTestDid/interfaces/GovernanceError.md)\]\>

---

### create()

> `static` **create**(`options?`): `GovernanceTestCanister`

Defined in: packages/canisters/nns/governance_test.canister.d.ts:8

#### Parameters

##### options?

`CanisterOptions`\<[`_SERVICE`](../namespaces/NnsGovernanceTestDid/interfaces/SERVICE.md)\>

#### Returns

`GovernanceTestCanister`
