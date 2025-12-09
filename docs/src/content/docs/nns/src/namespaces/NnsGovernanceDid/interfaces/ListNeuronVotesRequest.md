---
title: ListNeuronVotesRequest
editUrl: false
next: true
prev: true
---

Defined in: packages/canisters/declarations/nns/governance.d.ts:422

## Properties

### before_proposal

> **before_proposal**: \[\] \| \[[`ProposalId`](ProposalId.md)\]

Defined in: packages/canisters/declarations/nns/governance.d.ts:427

Only fetch the voting history for proposal whose id `< before_proposal`. This can be used as a
pagination token - pass the minimum proposal id as `before_proposal` for the next page.

---

### limit

> **limit**: \[\] \| \[`bigint`\]

Defined in: packages/canisters/declarations/nns/governance.d.ts:432

The maximum number of votes to fetch. The maximum number allowed is 500, and 500 will be used
if is set as either null or > 500.

---

### neuron_id

> **neuron_id**: \[\] \| \[[`NeuronId`](NeuronId.md)\]

Defined in: packages/canisters/declarations/nns/governance.d.ts:437

The neuron id for which the voting history will be returned. Currently, the voting history is
only recorded for known neurons.
