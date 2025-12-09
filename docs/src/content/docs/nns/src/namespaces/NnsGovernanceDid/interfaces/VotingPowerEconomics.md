---
title: VotingPowerEconomics
editUrl: false
next: true
prev: true
---

Defined in: packages/canisters/declarations/nns/governance.d.ts:1244

Parameters that affect the voting power of neurons.

## Properties

### clear\_following\_after\_seconds

> **clear\_following\_after\_seconds**: \[\] \| \[`bigint`\]

Defined in: packages/canisters/declarations/nns/governance.d.ts:1276

After a neuron has experienced voting power reduction for this amount of
time, a couple of things happen:

1. Deciding voting power reaches 0.

2. Its following on topics other than NeuronManagement are cleared.

Initially, set to 1/12 years.

***

### neuron\_minimum\_dissolve\_delay\_to\_vote\_seconds

> **neuron\_minimum\_dissolve\_delay\_to\_vote\_seconds**: \[\] \| \[`bigint`\]

Defined in: packages/canisters/declarations/nns/governance.d.ts:1265

The minimum dissolve delay a neuron must have in order to be eligible to vote.

Neurons with a dissolve delay lower than this threshold will not have
voting power, even if they are otherwise active.

This value is an essential part of the staking mechanism, promoting
long-term alignment with the network's governance.

***

### start\_reducing\_voting\_power\_after\_seconds

> **start\_reducing\_voting\_power\_after\_seconds**: \[\] \| \[`bigint`\]

Defined in: packages/canisters/declarations/nns/governance.d.ts:1255

If a neuron has not "refreshed" its voting power after this amount of time,
its deciding voting power starts decreasing linearly. See also
clear_following_after_seconds.

For explanation of what "refresh" means in this context, see
https://dashboard.internetcomputer.org/proposal/132411

Initially, set to 0.5 years. (The nominal length of a year is 365.25 days).
