---
title: ineligibleNeurons
editUrl: false
next: true
prev: true
---

> `const` **ineligibleNeurons**: (`{ neurons, proposal, }`) => [`NeuronInfo`](../interfaces/NeuronInfo.md)[]

Defined in: packages/canisters/nns/utils/neurons.utils.d.ts:16

Filter the neurons that are ineligible to vote to a proposal.

This feature needs the ballots of the proposal to contains accurate data.
If the proposal has settled, as the ballots of the proposal are emptied for archive purpose, the function might return a list of ineligible neurons that are actually neurons that have not voted but would have been eligible.

Long story short, check the status of the proposal before using this function.

## Parameters

### \{ neurons, proposal, \}

#### neurons

[`NeuronInfo`](../interfaces/NeuronInfo.md)[]

#### proposal

[`ProposalInfo`](../interfaces/ProposalInfo.md)

## Returns

[`NeuronInfo`](../interfaces/NeuronInfo.md)[]
