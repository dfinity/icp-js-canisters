---
title: ListNeuronsResponse
editUrl: false
next: true
prev: true
---

Defined in: packages/canisters/declarations/nns/governance\_test.d.ts:482

Output of the list_neurons method.

## Properties

### full\_neurons

> **full\_neurons**: [`Neuron`](Neuron.md)[]

Defined in: packages/canisters/declarations/nns/governance\_test.d.ts:495

If the caller has the necessary special privileges (or the neuron is
public, and the request sets include_public_neurons_in_full_neurons to
true), then all the information about the neurons in the result set is made
available here.

***

### neuron\_infos

> **neuron\_infos**: \[`bigint`, [`NeuronInfo`](NeuronInfo.md)\][]

Defined in: packages/canisters/declarations/nns/governance\_test.d.ts:488

Per the NeuronInfo type, this is a redacted view of the neurons in the
result set consisting of information that require no special privileges to
view.

***

### total\_pages\_available

> **total\_pages\_available**: \[\] \| \[`bigint`\]

Defined in: packages/canisters/declarations/nns/governance\_test.d.ts:496
