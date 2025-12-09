---
title: TopicToFollow
editUrl: false
next: true
prev: true
---

> **TopicToFollow** = \{ `Kyc`: `null`; \} \| \{ `ServiceNervousSystemManagement`: `null`; \} \| \{ `ApiBoundaryNodeManagement`: `null`; \} \| \{ `ApplicationCanisterManagement`: `null`; \} \| \{ `SubnetRental`: `null`; \} \| \{ `NeuronManagement`: `null`; \} \| \{ `NodeProviderRewards`: `null`; \} \| \{ `SubnetManagement`: `null`; \} \| \{ `ExchangeRate`: `null`; \} \| \{ `CatchAll`: `null`; \} \| \{ `NodeAdmin`: `null`; \} \| \{ `IcOsVersionElection`: `null`; \} \| \{ `ProtocolCanisterManagement`: `null`; \} \| \{ `NetworkEconomics`: `null`; \} \| \{ `IcOsVersionDeployment`: `null`; \} \| \{ `ParticipantManagement`: `null`; \} \| \{ `Governance`: `null`; \} \| \{ `SnsAndCommunityFund`: `null`; \}

Defined in: packages/canisters/declarations/nns/governance_test.d.ts:1206

A topic that can be followed. It is almost the same as the topic on the
proposal, except that the `CatchAll` is a special value and following on this
`topic` will let the neuron follow the votes on all topics except for
Governance and SnsAndCommunityFund.
