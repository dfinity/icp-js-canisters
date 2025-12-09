---
title: Neuron
editUrl: false
next: true
prev: true
---

Defined in: packages/canisters/declarations/nns/governance.d.ts:657

## Properties

### account

> **account**: `Uint8Array`

Defined in: packages/canisters/declarations/nns/governance.d.ts:731

***

### aging\_since\_timestamp\_seconds

> **aging\_since\_timestamp\_seconds**: `bigint`

Defined in: packages/canisters/declarations/nns/governance.d.ts:729

***

### auto\_stake\_maturity

> **auto\_stake\_maturity**: \[\] \| \[`boolean`\]

Defined in: packages/canisters/declarations/nns/governance.d.ts:728

***

### cached\_neuron\_stake\_e8s

> **cached\_neuron\_stake\_e8s**: `bigint`

Defined in: packages/canisters/declarations/nns/governance.d.ts:726

***

### controller

> **controller**: \[\] \| \[`Principal`\]

Defined in: packages/canisters/declarations/nns/governance.d.ts:660

***

### created\_timestamp\_seconds

> **created\_timestamp\_seconds**: `bigint`

Defined in: packages/canisters/declarations/nns/governance.d.ts:727

***

### deciding\_voting\_power

> **deciding\_voting\_power**: \[\] \| \[`bigint`\]

Defined in: packages/canisters/declarations/nns/governance.d.ts:725

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

***

### dissolve\_state

> **dissolve\_state**: \[\] \| \[[`DissolveState`](../type-aliases/DissolveState.md)\]

Defined in: packages/canisters/declarations/nns/governance.d.ts:738

***

### followees

> **followees**: \[`number`, [`Followees`](Followees.md)\][]

Defined in: packages/canisters/declarations/nns/governance.d.ts:739

***

### hot\_keys

> **hot\_keys**: `Principal`[]

Defined in: packages/canisters/declarations/nns/governance.d.ts:730

***

### id

> **id**: \[\] \| \[[`NeuronId`](NeuronId.md)\]

Defined in: packages/canisters/declarations/nns/governance.d.ts:658

***

### joined\_community\_fund\_timestamp\_seconds

> **joined\_community\_fund\_timestamp\_seconds**: \[\] \| \[`bigint`\]

Defined in: packages/canisters/declarations/nns/governance.d.ts:732

***

### known\_neuron\_data

> **known\_neuron\_data**: \[\] \| \[[`KnownNeuronData`](KnownNeuronData.md)\]

Defined in: packages/canisters/declarations/nns/governance.d.ts:743

***

### kyc\_verified

> **kyc\_verified**: `boolean`

Defined in: packages/canisters/declarations/nns/governance.d.ts:663

***

### maturity\_disbursements\_in\_progress

> **maturity\_disbursements\_in\_progress**: \[\] \| \[[`MaturityDisbursement`](MaturityDisbursement.md)[]\]

Defined in: packages/canisters/declarations/nns/governance.d.ts:737

The maturity disbursements in progress, i.e. the disbursements that are initiated but not
finalized. The finalization happens 7 days after the disbursement is initiated.

***

### maturity\_e8s\_equivalent

> **maturity\_e8s\_equivalent**: `bigint`

Defined in: packages/canisters/declarations/nns/governance.d.ts:687

***

### neuron\_fees\_e8s

> **neuron\_fees\_e8s**: `bigint`

Defined in: packages/canisters/declarations/nns/governance.d.ts:740

***

### neuron\_type

> **neuron\_type**: \[\] \| \[`number`\]

Defined in: packages/canisters/declarations/nns/governance.d.ts:685

***

### not\_for\_profit

> **not\_for\_profit**: `boolean`

Defined in: packages/canisters/declarations/nns/governance.d.ts:686

***

### potential\_voting\_power

> **potential\_voting\_power**: \[\] \| \[`bigint`\]

Defined in: packages/canisters/declarations/nns/governance.d.ts:684

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

***

### recent\_ballots

> **recent\_ballots**: [`BallotInfo`](BallotInfo.md)[]

Defined in: packages/canisters/declarations/nns/governance.d.ts:661

***

### spawn\_at\_timestamp\_seconds

> **spawn\_at\_timestamp\_seconds**: \[\] \| \[`bigint`\]

Defined in: packages/canisters/declarations/nns/governance.d.ts:744

***

### staked\_maturity\_e8s\_equivalent

> **staked\_maturity\_e8s\_equivalent**: \[\] \| \[`bigint`\]

Defined in: packages/canisters/declarations/nns/governance.d.ts:659

***

### transfer

> **transfer**: \[\] \| \[[`NeuronStakeTransfer`](NeuronStakeTransfer.md)\]

Defined in: packages/canisters/declarations/nns/governance.d.ts:742

***

### visibility

> **visibility**: \[\] \| \[`number`\]

Defined in: packages/canisters/declarations/nns/governance.d.ts:741

***

### voting\_power\_refreshed\_timestamp\_seconds

> **voting\_power\_refreshed\_timestamp\_seconds**: \[\] \| \[`bigint`\]

Defined in: packages/canisters/declarations/nns/governance.d.ts:662
