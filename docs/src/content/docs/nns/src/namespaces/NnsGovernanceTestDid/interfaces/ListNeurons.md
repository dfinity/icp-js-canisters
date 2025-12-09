---
title: ListNeurons
editUrl: false
next: true
prev: true
---

Defined in: packages/canisters/declarations/nns/governance\_test.d.ts:459

Parameters of the list_neurons method.

## Properties

### include\_empty\_neurons\_readable\_by\_caller

> **include\_empty\_neurons\_readable\_by\_caller**: \[\] \| \[`boolean`\]

Defined in: packages/canisters/declarations/nns/governance\_test.d.ts:475

Only has an effect when include_neurons_readable_by_caller.

***

### include\_neurons\_readable\_by\_caller

> **include\_neurons\_readable\_by\_caller**: `boolean`

Defined in: packages/canisters/declarations/nns/governance\_test.d.ts:477

***

### include\_public\_neurons\_in\_full\_neurons

> **include\_public\_neurons\_in\_full\_neurons**: \[\] \| \[`boolean`\]

Defined in: packages/canisters/declarations/nns/governance\_test.d.ts:466

When a public neuron is a member of the result set, include it in the
full_neurons field (of ListNeuronsResponse). This does not affect which
neurons are part of the result set.

***

### neuron\_ids

> **neuron\_ids**: `BigUint64Array`

Defined in: packages/canisters/declarations/nns/governance\_test.d.ts:470

These fields select neurons to be in the result set.

***

### neuron\_subaccounts

> **neuron\_subaccounts**: \[\] \| \[[`NeuronSubaccount`](NeuronSubaccount.md)[]\]

Defined in: packages/canisters/declarations/nns/governance\_test.d.ts:476

***

### page\_number

> **page\_number**: \[\] \| \[`bigint`\]

Defined in: packages/canisters/declarations/nns/governance\_test.d.ts:471

***

### page\_size

> **page\_size**: \[\] \| \[`bigint`\]

Defined in: packages/canisters/declarations/nns/governance\_test.d.ts:460
