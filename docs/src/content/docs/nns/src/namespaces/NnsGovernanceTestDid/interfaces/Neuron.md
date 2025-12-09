---
title: Neuron
editUrl: false
next: true
prev: true
---

Defined in: packages/canisters/declarations/nns/governance_test.d.ts:657

## Properties

### account

> **account**: `Uint8Array`

Defined in: packages/canisters/declarations/nns/governance_test.d.ts:731

---

### aging_since_timestamp_seconds

> **aging_since_timestamp_seconds**: `bigint`

Defined in: packages/canisters/declarations/nns/governance_test.d.ts:729

---

### auto_stake_maturity

> **auto_stake_maturity**: \[\] \| \[`boolean`\]

Defined in: packages/canisters/declarations/nns/governance_test.d.ts:728

---

### cached_neuron_stake_e8s

> **cached_neuron_stake_e8s**: `bigint`

Defined in: packages/canisters/declarations/nns/governance_test.d.ts:726

---

### controller

> **controller**: \[\] \| \[`Principal`\]

Defined in: packages/canisters/declarations/nns/governance_test.d.ts:660

---

### created_timestamp_seconds

> **created_timestamp_seconds**: `bigint`

Defined in: packages/canisters/declarations/nns/governance_test.d.ts:727

---

### deciding_voting_power

> **deciding_voting_power**: \[\] \| \[`bigint`\]

Defined in: packages/canisters/declarations/nns/governance_test.d.ts:725

The amount of "sway" this neuron has when voting on proposals.

When a proposal is created, each eligible neuron gets a "blank" ballot. The
amount of voting power in that ballot is set to the neuron's deciding
voting power at the time of proposal creation. There are two ways that a
proposal can become decided:

1. Early: Either more than half of the total voting power in the ballots
   votes in favor (then the proposal is approved), or at least half of the
   votal voting power in the ballots votes against (then, the proposal is
   rejected).

2. The proposal's voting deadline is reached. At that point, if there is
   more voting power in favor than against, and at least 3% of the total
   voting power voted in favor, then the proposal is approved. Otherwise, it
   is rejected.

If a neuron regularly refreshes its voting power, this has the same value
as potential_voting_power. Actions that cause a refresh are as follows:

1. voting directly (not via following)
2. set following
3. refresh voting power

(All of these actions are performed via the manage_neuron method.)

However, if a neuron has not refreshed in a "long" time, this will be less
than potential voting power. See VotingPowerEconomics. As a further result
of less deciding voting power, not only does it have less influence on the
outcome of proposals, the neuron receives less voting rewards (when it
votes indirectly via following).

For details, see https://dashboard.internetcomputer.org/proposal/132411.

Per NNS policy, this is opt. Nevertheless, it will never be null.

---

### dissolve_state

> **dissolve_state**: \[\] \| \[[`DissolveState`](../type-aliases/DissolveState.md)\]

Defined in: packages/canisters/declarations/nns/governance_test.d.ts:738

---

### followees

> **followees**: \[`number`, [`Followees`](Followees.md)\][]

Defined in: packages/canisters/declarations/nns/governance_test.d.ts:739

---

### hot_keys

> **hot_keys**: `Principal`[]

Defined in: packages/canisters/declarations/nns/governance_test.d.ts:730

---

### id

> **id**: \[\] \| \[[`NeuronId`](NeuronId.md)\]

Defined in: packages/canisters/declarations/nns/governance_test.d.ts:658

---

### joined_community_fund_timestamp_seconds

> **joined_community_fund_timestamp_seconds**: \[\] \| \[`bigint`\]

Defined in: packages/canisters/declarations/nns/governance_test.d.ts:732

---

### known_neuron_data

> **known_neuron_data**: \[\] \| \[[`KnownNeuronData`](KnownNeuronData.md)\]

Defined in: packages/canisters/declarations/nns/governance_test.d.ts:743

---

### kyc_verified

> **kyc_verified**: `boolean`

Defined in: packages/canisters/declarations/nns/governance_test.d.ts:663

---

### maturity_disbursements_in_progress

> **maturity_disbursements_in_progress**: \[\] \| \[[`MaturityDisbursement`](MaturityDisbursement.md)[]\]

Defined in: packages/canisters/declarations/nns/governance_test.d.ts:737

The maturity disbursements in progress, i.e. the disbursements that are initiated but not
finalized. The finalization happens 7 days after the disbursement is initiated.

---

### maturity_e8s_equivalent

> **maturity_e8s_equivalent**: `bigint`

Defined in: packages/canisters/declarations/nns/governance_test.d.ts:687

---

### neuron_fees_e8s

> **neuron_fees_e8s**: `bigint`

Defined in: packages/canisters/declarations/nns/governance_test.d.ts:740

---

### neuron_type

> **neuron_type**: \[\] \| \[`number`\]

Defined in: packages/canisters/declarations/nns/governance_test.d.ts:685

---

### not_for_profit

> **not_for_profit**: `boolean`

Defined in: packages/canisters/declarations/nns/governance_test.d.ts:686

---

### potential_voting_power

> **potential_voting_power**: \[\] \| \[`bigint`\]

Defined in: packages/canisters/declarations/nns/governance_test.d.ts:684

The amount of "sway" this neuron can have if it refreshes its voting power
frequently enough.

Unlike deciding_voting_power, this does NOT take refreshing into account.
Rather, this only takes three factors into account:

1. (Net) staked amount - This is the "base" of a neuron's voting power.
   This primarily consists of the neuron's ICP balance.

2. Age - Neurons with more age have more voting power (all else being
   equal).

3. Dissolve delay - Neurons with longer dissolve delay have more voting
   power (all else being equal). Neurons with a dissolve delay of less
   than six months are not eligible to vote. Therefore, such neurons
   are considered to have 0 voting power.

Per NNS policy, this is opt. Nevertheless, it will never be null.

---

### recent_ballots

> **recent_ballots**: [`BallotInfo`](BallotInfo.md)[]

Defined in: packages/canisters/declarations/nns/governance_test.d.ts:661

---

### spawn_at_timestamp_seconds

> **spawn_at_timestamp_seconds**: \[\] \| \[`bigint`\]

Defined in: packages/canisters/declarations/nns/governance_test.d.ts:744

---

### staked_maturity_e8s_equivalent

> **staked_maturity_e8s_equivalent**: \[\] \| \[`bigint`\]

Defined in: packages/canisters/declarations/nns/governance_test.d.ts:659

---

### transfer

> **transfer**: \[\] \| \[[`NeuronStakeTransfer`](NeuronStakeTransfer.md)\]

Defined in: packages/canisters/declarations/nns/governance_test.d.ts:742

---

### visibility

> **visibility**: \[\] \| \[`number`\]

Defined in: packages/canisters/declarations/nns/governance_test.d.ts:741

---

### voting_power_refreshed_timestamp_seconds

> **voting_power_refreshed_timestamp_seconds**: \[\] \| \[`bigint`\]

Defined in: packages/canisters/declarations/nns/governance_test.d.ts:662
