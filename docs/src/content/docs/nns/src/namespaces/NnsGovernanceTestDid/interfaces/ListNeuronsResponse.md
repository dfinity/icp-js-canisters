---
title: ListNeuronsResponse
editUrl: false
next: true
prev: true
---

Defined in: packages/canisters/declarations/nns/governance_test.d.ts:482

Output of the list_neurons method.

## Properties

### full_neurons

> **full_neurons**: [`Neuron`](Neuron.md)[]

Defined in: packages/canisters/declarations/nns/governance_test.d.ts:495

If the caller has the necessary special privileges (or the neuron is
public, and the request sets include_public_neurons_in_full_neurons to
true), then all the information about the neurons in the result set is made
available here.

---

### neuron_infos

> **neuron_infos**: \[`bigint`, [`NeuronInfo`](NeuronInfo.md)\][]

Defined in: packages/canisters/declarations/nns/governance_test.d.ts:488

Per the NeuronInfo type, this is a redacted view of the neurons in the
result set consisting of information that require no special privileges to
view.

---

### total_pages_available

> **total_pages_available**: \[\] \| \[`bigint`\]

Defined in: packages/canisters/declarations/nns/governance_test.d.ts:496
