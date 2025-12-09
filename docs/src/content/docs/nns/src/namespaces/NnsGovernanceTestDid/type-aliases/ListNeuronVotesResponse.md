---
title: ListNeuronVotesResponse
editUrl: false
next: true
prev: true
---

> **ListNeuronVotesResponse** = \{ `Ok`: \{ `all_finalized_before_proposal`: \[\] \| \[[`ProposalId`](../interfaces/ProposalId.md)\]; `votes`: \[\] \| \[[`NeuronVote`](../interfaces/NeuronVote.md)[]\]; \}; \} \| \{ `Err`: [`GovernanceError`](../interfaces/GovernanceError.md); \}

Defined in: packages/canisters/declarations/nns/governance_test.d.ts:439
