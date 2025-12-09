---
title: NeuronInfo
editUrl: false
next: true
prev: true
---

Defined in: packages/canisters/declarations/nns/governance.d.ts:782

A limit view of Neuron that allows some aspects of all neurons to be read by
anyone (i.e. without having to be the neuron's controller nor one of its
hotkeys).

As such, the meaning of each field in this type is generally the same as the
one of the same (or at least similar) name in Neuron.

## Properties

### age\_seconds

> **age\_seconds**: `bigint`

Defined in: packages/canisters/declarations/nns/governance.d.ts:814

***

### created\_timestamp\_seconds

> **created\_timestamp\_seconds**: `bigint`

Defined in: packages/canisters/declarations/nns/governance.d.ts:790

***

### deciding\_voting\_power

> **deciding\_voting\_power**: \[\] \| \[`bigint`\]

Defined in: packages/canisters/declarations/nns/governance.d.ts:789

***

### dissolve\_delay\_seconds

> **dissolve\_delay\_seconds**: `bigint`

Defined in: packages/canisters/declarations/nns/governance.d.ts:784

***

### id

> **id**: \[\] \| \[[`NeuronId`](NeuronId.md)\]

Defined in: packages/canisters/declarations/nns/governance.d.ts:783

***

### joined\_community\_fund\_timestamp\_seconds

> **joined\_community\_fund\_timestamp\_seconds**: \[\] \| \[`bigint`\]

Defined in: packages/canisters/declarations/nns/governance.d.ts:800

***

### known\_neuron\_data

> **known\_neuron\_data**: \[\] \| \[[`KnownNeuronData`](KnownNeuronData.md)\]

Defined in: packages/canisters/declarations/nns/governance.d.ts:803

***

### neuron\_type

> **neuron\_type**: \[\] \| \[`number`\]

Defined in: packages/canisters/declarations/nns/governance.d.ts:788

***

### potential\_voting\_power

> **potential\_voting\_power**: \[\] \| \[`bigint`\]

Defined in: packages/canisters/declarations/nns/governance.d.ts:787

***

### recent\_ballots

> **recent\_ballots**: [`BallotInfo`](BallotInfo.md)[]

Defined in: packages/canisters/declarations/nns/governance.d.ts:785

***

### retrieved\_at\_timestamp\_seconds

> **retrieved\_at\_timestamp\_seconds**: `bigint`

Defined in: packages/canisters/declarations/nns/governance.d.ts:801

***

### stake\_e8s

> **stake\_e8s**: `bigint`

Defined in: packages/canisters/declarations/nns/governance.d.ts:799

The amount of ICP (and staked maturity) locked in this neuron.

This is the foundation of the neuron's voting power.

cached_neuron_stake_e8s - neuron_fees_e8s + staked_maturity_e8s_equivalent

***

### state

> **state**: `number`

Defined in: packages/canisters/declarations/nns/governance.d.ts:791

***

### visibility

> **visibility**: \[\] \| \[`number`\]

Defined in: packages/canisters/declarations/nns/governance.d.ts:802

***

### voting\_power

> **voting\_power**: `bigint`

Defined in: packages/canisters/declarations/nns/governance.d.ts:813

Deprecated. Use either deciding_voting_power or potential_voting_power
instead. Has the same value as deciding_voting_power.

Previously, if a neuron had < 6 months dissolve delay (making it ineligible
to vote), this would not get set to 0 (zero). That was pretty confusing.
Now that this is set to deciding_voting_power, this actually does get
zeroed out.

***

### voting\_power\_refreshed\_timestamp\_seconds

> **voting\_power\_refreshed\_timestamp\_seconds**: \[\] \| \[`bigint`\]

Defined in: packages/canisters/declarations/nns/governance.d.ts:786
