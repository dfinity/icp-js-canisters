---
title: ListNeurons
editUrl: false
next: true
prev: true
---

Defined in: packages/canisters/declarations/nns/governance_test.d.ts:459

Parameters of the list_neurons method.

## Properties

### include_empty_neurons_readable_by_caller

> **include_empty_neurons_readable_by_caller**: \[\] \| \[`boolean`\]

Defined in: packages/canisters/declarations/nns/governance_test.d.ts:475

Only has an effect when include_neurons_readable_by_caller.

---

### include_neurons_readable_by_caller

> **include_neurons_readable_by_caller**: `boolean`

Defined in: packages/canisters/declarations/nns/governance_test.d.ts:477

---

### include_public_neurons_in_full_neurons

> **include_public_neurons_in_full_neurons**: \[\] \| \[`boolean`\]

Defined in: packages/canisters/declarations/nns/governance_test.d.ts:466

When a public neuron is a member of the result set, include it in the
full_neurons field (of ListNeuronsResponse). This does not affect which
neurons are part of the result set.

---

### neuron_ids

> **neuron_ids**: `BigUint64Array`

Defined in: packages/canisters/declarations/nns/governance_test.d.ts:470

These fields select neurons to be in the result set.

---

### neuron_subaccounts

> **neuron_subaccounts**: \[\] \| \[[`NeuronSubaccount`](NeuronSubaccount.md)[]\]

Defined in: packages/canisters/declarations/nns/governance_test.d.ts:476

---

### page_number

> **page_number**: \[\] \| \[`bigint`\]

Defined in: packages/canisters/declarations/nns/governance_test.d.ts:471

---

### page_size

> **page_size**: \[\] \| \[`bigint`\]

Defined in: packages/canisters/declarations/nns/governance_test.d.ts:460
