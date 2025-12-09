---
title: NeuronInfo
editUrl: false
next: true
prev: true
---

Defined in: packages/canisters/declarations/nns/governance_test.d.ts:782

A limit view of Neuron that allows some aspects of all neurons to be read by
anyone (i.e. without having to be the neuron's controller nor one of its
hotkeys).

As such, the meaning of each field in this type is generally the same as the
one of the same (or at least similar) name in Neuron.

## Properties

### age_seconds

> **age_seconds**: `bigint`

Defined in: packages/canisters/declarations/nns/governance_test.d.ts:814

---

### created_timestamp_seconds

> **created_timestamp_seconds**: `bigint`

Defined in: packages/canisters/declarations/nns/governance_test.d.ts:790

---

### deciding_voting_power

> **deciding_voting_power**: \[\] \| \[`bigint`\]

Defined in: packages/canisters/declarations/nns/governance_test.d.ts:789

---

### dissolve_delay_seconds

> **dissolve_delay_seconds**: `bigint`

Defined in: packages/canisters/declarations/nns/governance_test.d.ts:784

---

### id

> **id**: \[\] \| \[[`NeuronId`](NeuronId.md)\]

Defined in: packages/canisters/declarations/nns/governance_test.d.ts:783

---

### joined_community_fund_timestamp_seconds

> **joined_community_fund_timestamp_seconds**: \[\] \| \[`bigint`\]

Defined in: packages/canisters/declarations/nns/governance_test.d.ts:800

---

### known_neuron_data

> **known_neuron_data**: \[\] \| \[[`KnownNeuronData`](KnownNeuronData.md)\]

Defined in: packages/canisters/declarations/nns/governance_test.d.ts:803

---

### neuron_type

> **neuron_type**: \[\] \| \[`number`\]

Defined in: packages/canisters/declarations/nns/governance_test.d.ts:788

---

### potential_voting_power

> **potential_voting_power**: \[\] \| \[`bigint`\]

Defined in: packages/canisters/declarations/nns/governance_test.d.ts:787

---

### recent_ballots

> **recent_ballots**: [`BallotInfo`](BallotInfo.md)[]

Defined in: packages/canisters/declarations/nns/governance_test.d.ts:785

---

### retrieved_at_timestamp_seconds

> **retrieved_at_timestamp_seconds**: `bigint`

Defined in: packages/canisters/declarations/nns/governance_test.d.ts:801

---

### stake_e8s

> **stake_e8s**: `bigint`

Defined in: packages/canisters/declarations/nns/governance_test.d.ts:799

The amount of ICP (and staked maturity) locked in this neuron.

This is the foundation of the neuron's voting power.

cached_neuron_stake_e8s - neuron_fees_e8s + staked_maturity_e8s_equivalent

---

### state

> **state**: `number`

Defined in: packages/canisters/declarations/nns/governance_test.d.ts:791

---

### visibility

> **visibility**: \[\] \| \[`number`\]

Defined in: packages/canisters/declarations/nns/governance_test.d.ts:802

---

### voting_power

> **voting_power**: `bigint`

Defined in: packages/canisters/declarations/nns/governance_test.d.ts:813

Deprecated. Use either deciding_voting_power or potential_voting_power
instead. Has the same value as deciding_voting_power.

Previously, if a neuron had < 6 months dissolve delay (making it ineligible
to vote), this would not get set to 0 (zero). That was pretty confusing.
Now that this is set to deciding_voting_power, this actually does get
zeroed out.

---

### voting_power_refreshed_timestamp_seconds

> **voting_power_refreshed_timestamp_seconds**: \[\] \| \[`bigint`\]

Defined in: packages/canisters/declarations/nns/governance_test.d.ts:786
