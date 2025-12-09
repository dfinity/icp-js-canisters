---
title: _SERVICE
editUrl: false
next: true
prev: true
---

Defined in: packages/canisters/declarations/nns/governance.d.ts:1290

## Properties

### claim_gtc_neurons

> **claim_gtc_neurons**: `ActorMethod`\<\[`Principal`, [`NeuronId`](NeuronId.md)[]\], [`Result`](../type-aliases/Result.md)\>

Defined in: packages/canisters/declarations/nns/governance.d.ts:1291

---

### claim_or_refresh_neuron_from_account

> **claim_or_refresh_neuron_from_account**: `ActorMethod`\<\[[`ClaimOrRefreshNeuronFromAccount`](ClaimOrRefreshNeuronFromAccount.md)\], [`ClaimOrRefreshNeuronFromAccountResponse`](ClaimOrRefreshNeuronFromAccountResponse.md)\>

Defined in: packages/canisters/declarations/nns/governance.d.ts:1292

---

### get_build_metadata

> **get_build_metadata**: `ActorMethod`\<\[\], `string`\>

Defined in: packages/canisters/declarations/nns/governance.d.ts:1296

---

### get_full_neuron

> **get_full_neuron**: `ActorMethod`\<\[`bigint`\], [`Result_2`](../type-aliases/Result_2.md)\>

Defined in: packages/canisters/declarations/nns/governance.d.ts:1297

---

### get_full_neuron_by_id_or_subaccount

> **get_full_neuron_by_id_or_subaccount**: `ActorMethod`\<\[[`NeuronIdOrSubaccount`](../type-aliases/NeuronIdOrSubaccount.md)\], [`Result_2`](../type-aliases/Result_2.md)\>

Defined in: packages/canisters/declarations/nns/governance.d.ts:1298

---

### get_latest_reward_event

> **get_latest_reward_event**: `ActorMethod`\<\[\], [`RewardEvent`](RewardEvent.md)\>

Defined in: packages/canisters/declarations/nns/governance.d.ts:1302

---

### get_metrics

> **get_metrics**: `ActorMethod`\<\[\], [`Result_3`](../type-aliases/Result_3.md)\>

Defined in: packages/canisters/declarations/nns/governance.d.ts:1303

---

### get_monthly_node_provider_rewards

> **get_monthly_node_provider_rewards**: `ActorMethod`\<\[\], [`Result_4`](../type-aliases/Result_4.md)\>

Defined in: packages/canisters/declarations/nns/governance.d.ts:1304

---

### get_most_recent_monthly_node_provider_rewards

> **get_most_recent_monthly_node_provider_rewards**: `ActorMethod`\<\[\], \[\] \| \[[`MonthlyNodeProviderRewards`](MonthlyNodeProviderRewards.md)\]\>

Defined in: packages/canisters/declarations/nns/governance.d.ts:1305

---

### get_network_economics_parameters

> **get_network_economics_parameters**: `ActorMethod`\<\[\], [`NetworkEconomics`](NetworkEconomics.md)\>

Defined in: packages/canisters/declarations/nns/governance.d.ts:1309

---

### get_neuron_ids

> **get_neuron_ids**: `ActorMethod`\<\[\], `BigUint64Array`\<`ArrayBufferLike`\>\>

Defined in: packages/canisters/declarations/nns/governance.d.ts:1310

---

### get_neuron_index

> **get_neuron_index**: `ActorMethod`\<\[[`GetNeuronIndexRequest`](GetNeuronIndexRequest.md)\], [`GetNeuronIndexResult`](../type-aliases/GetNeuronIndexResult.md)\>

Defined in: packages/canisters/declarations/nns/governance.d.ts:1311

---

### get_neuron_info

> **get_neuron_info**: `ActorMethod`\<\[`bigint`\], [`Result_5`](../type-aliases/Result_5.md)\>

Defined in: packages/canisters/declarations/nns/governance.d.ts:1312

---

### get_neuron_info_by_id_or_subaccount

> **get_neuron_info_by_id_or_subaccount**: `ActorMethod`\<\[[`NeuronIdOrSubaccount`](../type-aliases/NeuronIdOrSubaccount.md)\], [`Result_5`](../type-aliases/Result_5.md)\>

Defined in: packages/canisters/declarations/nns/governance.d.ts:1313

---

### get_neurons_fund_audit_info

> **get_neurons_fund_audit_info**: `ActorMethod`\<\[[`GetNeuronsFundAuditInfoRequest`](GetNeuronsFundAuditInfoRequest.md)\], [`GetNeuronsFundAuditInfoResponse`](GetNeuronsFundAuditInfoResponse.md)\>

Defined in: packages/canisters/declarations/nns/governance.d.ts:1317

---

### get_node_provider_by_caller

> **get_node_provider_by_caller**: `ActorMethod`\<\[`null`\], [`Result_7`](../type-aliases/Result_7.md)\>

Defined in: packages/canisters/declarations/nns/governance.d.ts:1321

---

### get_pending_proposals

> **get_pending_proposals**: `ActorMethod`\<\[\[\] \| \[[`GetPendingProposalsRequest`](GetPendingProposalsRequest.md)\]\], [`ProposalInfo`](ProposalInfo.md)[]\>

Defined in: packages/canisters/declarations/nns/governance.d.ts:1322

---

### get_proposal_info

> **get_proposal_info**: `ActorMethod`\<\[`bigint`\], \[\] \| \[[`ProposalInfo`](ProposalInfo.md)\]\>

Defined in: packages/canisters/declarations/nns/governance.d.ts:1326

---

### get_restore_aging_summary

> **get_restore_aging_summary**: `ActorMethod`\<\[\], [`RestoreAgingSummary`](RestoreAgingSummary.md)\>

Defined in: packages/canisters/declarations/nns/governance.d.ts:1327

---

### list_known_neurons

> **list_known_neurons**: `ActorMethod`\<\[\], [`ListKnownNeuronsResponse`](ListKnownNeuronsResponse.md)\>

Defined in: packages/canisters/declarations/nns/governance.d.ts:1328

---

### list_neuron_votes

> **list_neuron_votes**: `ActorMethod`\<\[[`ListNeuronVotesRequest`](ListNeuronVotesRequest.md)\], [`ListNeuronVotesResponse`](../type-aliases/ListNeuronVotesResponse.md)\>

Defined in: packages/canisters/declarations/nns/governance.d.ts:1329

---

### list_neurons

> **list_neurons**: `ActorMethod`\<\[[`ListNeurons`](ListNeurons.md)\], [`ListNeuronsResponse`](ListNeuronsResponse.md)\>

Defined in: packages/canisters/declarations/nns/governance.d.ts:1333

---

### list_node_provider_rewards

> **list_node_provider_rewards**: `ActorMethod`\<\[[`ListNodeProviderRewardsRequest`](ListNodeProviderRewardsRequest.md)\], [`ListNodeProviderRewardsResponse`](ListNodeProviderRewardsResponse.md)\>

Defined in: packages/canisters/declarations/nns/governance.d.ts:1334

---

### list_node_providers

> **list_node_providers**: `ActorMethod`\<\[\], [`ListNodeProvidersResponse`](ListNodeProvidersResponse.md)\>

Defined in: packages/canisters/declarations/nns/governance.d.ts:1338

---

### list_proposals

> **list_proposals**: `ActorMethod`\<\[[`ListProposalInfoRequest`](ListProposalInfoRequest.md)\], [`ListProposalInfoResponse`](ListProposalInfoResponse.md)\>

Defined in: packages/canisters/declarations/nns/governance.d.ts:1339

---

### manage_neuron

> **manage_neuron**: `ActorMethod`\<\[[`ManageNeuronRequest`](ManageNeuronRequest.md)\], [`ManageNeuronResponse`](ManageNeuronResponse.md)\>

Defined in: packages/canisters/declarations/nns/governance.d.ts:1343

---

### settle_community_fund_participation

> **settle_community_fund_participation**: `ActorMethod`\<\[[`SettleCommunityFundParticipation`](SettleCommunityFundParticipation.md)\], [`Result`](../type-aliases/Result.md)\>

Defined in: packages/canisters/declarations/nns/governance.d.ts:1344

---

### settle_neurons_fund_participation

> **settle_neurons_fund_participation**: `ActorMethod`\<\[[`SettleNeuronsFundParticipationRequest`](SettleNeuronsFundParticipationRequest.md)\], [`SettleNeuronsFundParticipationResponse`](SettleNeuronsFundParticipationResponse.md)\>

Defined in: packages/canisters/declarations/nns/governance.d.ts:1348

---

### simulate_manage_neuron

> **simulate_manage_neuron**: `ActorMethod`\<\[[`ManageNeuronRequest`](ManageNeuronRequest.md)\], [`ManageNeuronResponse`](ManageNeuronResponse.md)\>

Defined in: packages/canisters/declarations/nns/governance.d.ts:1352

---

### transfer_gtc_neuron

> **transfer_gtc_neuron**: `ActorMethod`\<\[[`NeuronId`](NeuronId.md), [`NeuronId`](NeuronId.md)\], [`Result`](../type-aliases/Result.md)\>

Defined in: packages/canisters/declarations/nns/governance.d.ts:1356

---

### update_node_provider

> **update_node_provider**: `ActorMethod`\<\[[`UpdateNodeProvider`](UpdateNodeProvider.md)\], [`Result`](../type-aliases/Result.md)\>

Defined in: packages/canisters/declarations/nns/governance.d.ts:1357
