import type {
  SnsGovernanceDid,
  SnsRootDid,
  SnsSwapDid,
} from "@icp-sdk/canisters/sns";

export type SnsAccount = SnsGovernanceDid.Account;
export type SnsAction = SnsGovernanceDid.Action;
export type SnsBallot = SnsGovernanceDid.Ballot;
export type SnsDefaultFollowees = SnsGovernanceDid.DefaultFollowees;
export type SnsDisburseMaturityInProgress =
  SnsGovernanceDid.DisburseMaturityInProgress;
export type SnsFollowee = SnsGovernanceDid.Followee;
export type SnsFolloweesForTopic = SnsGovernanceDid.FolloweesForTopic;
export type SnsFunctionType = SnsGovernanceDid.FunctionType;
export type SnsGetMetadataResponse = SnsGovernanceDid.GetMetadataResponse;
export type SnsGetMetricsResponse = SnsGovernanceDid.GetMetricsResponse;
export type SnsListNervousSystemFunctionsResponse =
  SnsGovernanceDid.ListNervousSystemFunctionsResponse;
export type SnsListProposalsResponse = SnsGovernanceDid.ListProposalsResponse;
export type SnsListTopicsResponse = SnsGovernanceDid.ListTopicsResponse;
export type SnsManageNeuron = SnsGovernanceDid.ManageNeuron;
export type SnsManageNeuronResponse = SnsGovernanceDid.ManageNeuronResponse;
export type SnsNervousSystemFunction = SnsGovernanceDid.NervousSystemFunction;
export type SnsNervousSystemParameters =
  SnsGovernanceDid.NervousSystemParameters;
export type SnsNeuron = SnsGovernanceDid.Neuron;
export type SnsNeuronId = SnsGovernanceDid.NeuronId;
export type SnsNeuronPermission = SnsGovernanceDid.NeuronPermission;
export type SnsNeuronPermissionList = SnsGovernanceDid.NeuronPermissionList;
export type SnsPercentage = SnsGovernanceDid.Percentage;
export type SnsProposalData = SnsGovernanceDid.ProposalData;
export type SnsProposalId = SnsGovernanceDid.ProposalId;
export type SnsRewardEvent = SnsGovernanceDid.RewardEvent;
export type SnsTally = SnsGovernanceDid.Tally;
export type SnsTopic = SnsGovernanceDid.Topic;
export type SnsTopicInfo = SnsGovernanceDid.TopicInfo;
export type SnsVotingRewardsParameters =
  SnsGovernanceDid.VotingRewardsParameters;
export type TransferSnsTreasuryFunds =
  SnsGovernanceDid.TransferSnsTreasuryFunds;

export type SnsCanisterStatus = SnsRootDid.CanisterStatusResultV2;

export type CfParticipant = SnsSwapDid.CfParticipant;
export type SnsFinalizeSwapResponse = SnsSwapDid.FinalizeSwapResponse;
export type SnsGetAutoFinalizationStatusResponse =
  SnsSwapDid.GetAutoFinalizationStatusResponse;
export type SnsGetBuyerStateRequest = SnsSwapDid.GetBuyerStateRequest;
export type SnsGetBuyerStateResponse = SnsSwapDid.GetBuyerStateResponse;
export type SnsGetDerivedStateResponse = SnsSwapDid.GetDerivedStateResponse;
export type SnsGetInitResponse = SnsSwapDid.GetInitResponse;
export type SnsGetLifecycleResponse = SnsSwapDid.GetLifecycleResponse;
export type SnsGetSaleParametersResponse = SnsSwapDid.GetSaleParametersResponse;
export type SnsInvalidUserAmount = SnsSwapDid.InvalidUserAmount;
export type SnsNeuronRecipe = SnsSwapDid.SnsNeuronRecipe;
export type SnsNeuronsFundParticipationConstraints =
  SnsSwapDid.NeuronsFundParticipationConstraints;
export type SnsParams = SnsSwapDid.Params;
export type SnsRefreshBuyerTokensResponse =
  SnsSwapDid.RefreshBuyerTokensResponse;
export type SnsSwap = SnsSwapDid.Swap;
export type SnsSwapBuyerState = SnsSwapDid.BuyerState;
export type SnsSwapDerivedState = SnsSwapDid.DerivedState;
export type SnsSwapInit = SnsSwapDid.Init;
export type SnsSwapTicket = SnsSwapDid.Ticket;
export type SnsTransferableAmount = SnsSwapDid.TransferableAmount;

/**
 * @deprecated Use "@icp-sdk/canisters/sns" directly instead
 */
export * from "@icp-sdk/canisters/sns";
