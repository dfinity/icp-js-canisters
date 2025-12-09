---
title: _SERVICE
editUrl: false
next: true
prev: true
---

Defined in: packages/canisters/declarations/nns/governance.d.ts:1290

## Properties

### claim\_gtc\_neurons

> **claim\_gtc\_neurons**: `ActorMethod`\<\[`Principal`, [`NeuronId`](NeuronId.md)[]\], [`Result`](../type-aliases/Result.md)\>

Defined in: packages/canisters/declarations/nns/governance.d.ts:1291

***

### claim\_or\_refresh\_neuron\_from\_account

> **claim\_or\_refresh\_neuron\_from\_account**: `ActorMethod`\<\[[`ClaimOrRefreshNeuronFromAccount`](ClaimOrRefreshNeuronFromAccount.md)\], [`ClaimOrRefreshNeuronFromAccountResponse`](ClaimOrRefreshNeuronFromAccountResponse.md)\>

Defined in: packages/canisters/declarations/nns/governance.d.ts:1292

***

### get\_build\_metadata

> **get\_build\_metadata**: `ActorMethod`\<\[\], `string`\>

Defined in: packages/canisters/declarations/nns/governance.d.ts:1296

***

### get\_full\_neuron

> **get\_full\_neuron**: `ActorMethod`\<\[`bigint`\], [`Result_2`](../type-aliases/Result_2.md)\>

Defined in: packages/canisters/declarations/nns/governance.d.ts:1297

***

### get\_full\_neuron\_by\_id\_or\_subaccount

> **get\_full\_neuron\_by\_id\_or\_subaccount**: `ActorMethod`\<\[[`NeuronIdOrSubaccount`](../type-aliases/NeuronIdOrSubaccount.md)\], [`Result_2`](../type-aliases/Result_2.md)\>

Defined in: packages/canisters/declarations/nns/governance.d.ts:1298

***

### get\_latest\_reward\_event

> **get\_latest\_reward\_event**: `ActorMethod`\<\[\], [`RewardEvent`](RewardEvent.md)\>

Defined in: packages/canisters/declarations/nns/governance.d.ts:1302

***

### get\_metrics

> **get\_metrics**: `ActorMethod`\<\[\], [`Result_3`](../type-aliases/Result_3.md)\>

Defined in: packages/canisters/declarations/nns/governance.d.ts:1303

***

### get\_monthly\_node\_provider\_rewards

> **get\_monthly\_node\_provider\_rewards**: `ActorMethod`\<\[\], [`Result_4`](../type-aliases/Result_4.md)\>

Defined in: packages/canisters/declarations/nns/governance.d.ts:1304

***

### get\_most\_recent\_monthly\_node\_provider\_rewards

> **get\_most\_recent\_monthly\_node\_provider\_rewards**: `ActorMethod`\<\[\], \[\] \| \[[`MonthlyNodeProviderRewards`](MonthlyNodeProviderRewards.md)\]\>

Defined in: packages/canisters/declarations/nns/governance.d.ts:1305

***

### get\_network\_economics\_parameters

> **get\_network\_economics\_parameters**: `ActorMethod`\<\[\], [`NetworkEconomics`](NetworkEconomics.md)\>

Defined in: packages/canisters/declarations/nns/governance.d.ts:1309

***

### get\_neuron\_ids

> **get\_neuron\_ids**: `ActorMethod`\<\[\], `BigUint64Array`\<`ArrayBufferLike`\>\>

Defined in: packages/canisters/declarations/nns/governance.d.ts:1310

***

### get\_neuron\_index

> **get\_neuron\_index**: `ActorMethod`\<\[[`GetNeuronIndexRequest`](GetNeuronIndexRequest.md)\], [`GetNeuronIndexResult`](../type-aliases/GetNeuronIndexResult.md)\>

Defined in: packages/canisters/declarations/nns/governance.d.ts:1311

***

### get\_neuron\_info

> **get\_neuron\_info**: `ActorMethod`\<\[`bigint`\], [`Result_5`](../type-aliases/Result_5.md)\>

Defined in: packages/canisters/declarations/nns/governance.d.ts:1312

***

### get\_neuron\_info\_by\_id\_or\_subaccount

> **get\_neuron\_info\_by\_id\_or\_subaccount**: `ActorMethod`\<\[[`NeuronIdOrSubaccount`](../type-aliases/NeuronIdOrSubaccount.md)\], [`Result_5`](../type-aliases/Result_5.md)\>

Defined in: packages/canisters/declarations/nns/governance.d.ts:1313

***

### get\_neurons\_fund\_audit\_info

> **get\_neurons\_fund\_audit\_info**: `ActorMethod`\<\[[`GetNeuronsFundAuditInfoRequest`](GetNeuronsFundAuditInfoRequest.md)\], [`GetNeuronsFundAuditInfoResponse`](GetNeuronsFundAuditInfoResponse.md)\>

Defined in: packages/canisters/declarations/nns/governance.d.ts:1317

***

### get\_node\_provider\_by\_caller

> **get\_node\_provider\_by\_caller**: `ActorMethod`\<\[`null`\], [`Result_7`](../type-aliases/Result_7.md)\>

Defined in: packages/canisters/declarations/nns/governance.d.ts:1321

***

### get\_pending\_proposals

> **get\_pending\_proposals**: `ActorMethod`\<\[\[\] \| \[[`GetPendingProposalsRequest`](GetPendingProposalsRequest.md)\]\], [`ProposalInfo`](ProposalInfo.md)[]\>

Defined in: packages/canisters/declarations/nns/governance.d.ts:1322

***

### get\_proposal\_info

> **get\_proposal\_info**: `ActorMethod`\<\[`bigint`\], \[\] \| \[[`ProposalInfo`](ProposalInfo.md)\]\>

Defined in: packages/canisters/declarations/nns/governance.d.ts:1326

***

### get\_restore\_aging\_summary

> **get\_restore\_aging\_summary**: `ActorMethod`\<\[\], [`RestoreAgingSummary`](RestoreAgingSummary.md)\>

Defined in: packages/canisters/declarations/nns/governance.d.ts:1327

***

### list\_known\_neurons

> **list\_known\_neurons**: `ActorMethod`\<\[\], [`ListKnownNeuronsResponse`](ListKnownNeuronsResponse.md)\>

Defined in: packages/canisters/declarations/nns/governance.d.ts:1328

***

### list\_neuron\_votes

> **list\_neuron\_votes**: `ActorMethod`\<\[[`ListNeuronVotesRequest`](ListNeuronVotesRequest.md)\], [`ListNeuronVotesResponse`](../type-aliases/ListNeuronVotesResponse.md)\>

Defined in: packages/canisters/declarations/nns/governance.d.ts:1329

***

### list\_neurons

> **list\_neurons**: `ActorMethod`\<\[[`ListNeurons`](ListNeurons.md)\], [`ListNeuronsResponse`](ListNeuronsResponse.md)\>

Defined in: packages/canisters/declarations/nns/governance.d.ts:1333

***

### list\_node\_provider\_rewards

> **list\_node\_provider\_rewards**: `ActorMethod`\<\[[`ListNodeProviderRewardsRequest`](ListNodeProviderRewardsRequest.md)\], [`ListNodeProviderRewardsResponse`](ListNodeProviderRewardsResponse.md)\>

Defined in: packages/canisters/declarations/nns/governance.d.ts:1334

***

### list\_node\_providers

> **list\_node\_providers**: `ActorMethod`\<\[\], [`ListNodeProvidersResponse`](ListNodeProvidersResponse.md)\>

Defined in: packages/canisters/declarations/nns/governance.d.ts:1338

***

### list\_proposals

> **list\_proposals**: `ActorMethod`\<\[[`ListProposalInfoRequest`](ListProposalInfoRequest.md)\], [`ListProposalInfoResponse`](ListProposalInfoResponse.md)\>

Defined in: packages/canisters/declarations/nns/governance.d.ts:1339

***

### manage\_neuron

> **manage\_neuron**: `ActorMethod`\<\[[`ManageNeuronRequest`](ManageNeuronRequest.md)\], [`ManageNeuronResponse`](ManageNeuronResponse.md)\>

Defined in: packages/canisters/declarations/nns/governance.d.ts:1343

***

### settle\_community\_fund\_participation

> **settle\_community\_fund\_participation**: `ActorMethod`\<\[[`SettleCommunityFundParticipation`](SettleCommunityFundParticipation.md)\], [`Result`](../type-aliases/Result.md)\>

Defined in: packages/canisters/declarations/nns/governance.d.ts:1344

***

### settle\_neurons\_fund\_participation

> **settle\_neurons\_fund\_participation**: `ActorMethod`\<\[[`SettleNeuronsFundParticipationRequest`](SettleNeuronsFundParticipationRequest.md)\], [`SettleNeuronsFundParticipationResponse`](SettleNeuronsFundParticipationResponse.md)\>

Defined in: packages/canisters/declarations/nns/governance.d.ts:1348

***

### simulate\_manage\_neuron

> **simulate\_manage\_neuron**: `ActorMethod`\<\[[`ManageNeuronRequest`](ManageNeuronRequest.md)\], [`ManageNeuronResponse`](ManageNeuronResponse.md)\>

Defined in: packages/canisters/declarations/nns/governance.d.ts:1352

***

### transfer\_gtc\_neuron

> **transfer\_gtc\_neuron**: `ActorMethod`\<\[[`NeuronId`](NeuronId.md), [`NeuronId`](NeuronId.md)\], [`Result`](../type-aliases/Result.md)\>

Defined in: packages/canisters/declarations/nns/governance.d.ts:1356

***

### update\_node\_provider

> **update\_node\_provider**: `ActorMethod`\<\[[`UpdateNodeProvider`](UpdateNodeProvider.md)\], [`Result`](../type-aliases/Result.md)\>

Defined in: packages/canisters/declarations/nns/governance.d.ts:1357
