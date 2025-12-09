import type {
  IcrcAccount,
  IcrcSubaccount,
  IcrcTokens,
} from "@dfinity/ledger-icrc";
import type { QueryParams } from "@dfinity/utils";
import type { Principal } from "@icp-sdk/core/principal";
import type {
  SnsGovernanceDid
} from "../../declarations";
import type {
  SnsNeuronPermissionType,
  SnsProposalDecisionStatus,
  SnsProposalRewardStatus,
  SnsVote,
} from "../enums/governance.enums";
import type { E8s } from "./common";

/**
 * The parameters available to list Sns neurons
 */
export interface SnsListNeuronsParams extends QueryParams {
  /** Scope the query to a particular principal */
  principal?: Principal | undefined;
  /** The maximum number of neurons returned by the method `list_neurons` */
  limit?: number;
  /** Index the search to returns a list that starts after specified neuron id */
  beforeNeuronId?: SnsGovernanceDid.NeuronId;
}

/**
 * The parameters available to list Sns proposals
 */
export interface SnsListProposalsParams extends QueryParams {
  // A list of proposal reward statuses, specifying that only proposals that
  // that have one of the define reward statuses should be included
  // in the list.
  // If this list is empty, no restriction is applied.
  includeRewardStatus?: SnsProposalRewardStatus[];
  // The proposal ID specifying which proposals to return.
  // This should be set to the last proposal of the previously returned page and
  // will not be included in the current page.
  beforeProposal?: SnsGovernanceDid.ProposalId;
  // Limit the number of Proposals returned in each page, from 1 to 100.
  // If a value outside of this range is provided, 100 will be used.
  limit?: number;
  // A list of proposal types, specifying that proposals of the given
  // types should be excluded in this list.
  excludeType?: bigint[];
  // A list of proposal decision statuses, specifying that only proposals
  // that have one of the define decision statuses should be included
  // in the list.
  // If this list is empty, no restriction is applied.
  includeStatus?: SnsProposalDecisionStatus[];

  // A list of proposal topics, specifying that only proposals
  // that have one of the defined topics should be included
  // in the list.
  // If this list is empty, no restriction is applied.
  // If there is null, then proposals without a topic are included.
  // Ref: https://github.com/dfinity/ic/blob/23abac5891de0ebde5c49c0fe91a1aab39c6241f/rs/sns/governance/api/src/ic_sns_governance.pb.v1.rs#L2140
  includeTopics?: Array<SnsGovernanceDid.Topic | null>;
}

export type SnsListTopicsParams = QueryParams;

/**
 * The parameters to get an sns proposal
 */
export interface SnsGetProposalParams extends QueryParams {
  proposalId: SnsGovernanceDid.ProposalId;
}

/**
 * The parameters to get a Sns neuron
 */
export interface SnsGetNeuronParams extends QueryParams {
  neuronId: SnsGovernanceDid.NeuronId;
}

export interface SnsStakeNeuronParams extends Omit<QueryParams, "certified"> {
  stakeE8s: IcrcTokens;
  source: IcrcAccount;
  controller: Principal;
  // Same as createdAt from ledger's TransferParams
  createdAt?: bigint;
  fee?: bigint;
}

export interface SnsIncreaseStakeNeuronParams extends Omit<QueryParams, "certified"> {
  stakeE8s: IcrcTokens;
  source: IcrcAccount;
  neuronId: SnsGovernanceDid.NeuronId;
}

// Type to transform to a ClaimOrRefresh command
export interface SnsClaimOrRefreshArgs extends Omit<QueryParams, "certified"> {
  subaccount: Uint8Array;
  memo?: bigint;
  controller?: Principal;
}

/**
 * General neuron management request parameter interface
 */
interface SnsNeuronManagementParams extends Omit<QueryParams, "certified"> {
  neuronId: SnsGovernanceDid.NeuronId;
}

/**
 * The parameters to add permissions to a neuron
 */
export interface SnsNeuronPermissionsParams extends SnsNeuronManagementParams {
  principal: Principal;
  permissions: SnsNeuronPermissionType[];
}

/**
 * The parameters to split a neuron
 */
export interface SnsSplitNeuronParams extends SnsNeuronManagementParams {
  amount: E8s;
  memo: bigint;
}

/**
 * The parameters to disburse a neuron
 */
export interface SnsDisburseNeuronParams extends SnsNeuronManagementParams {
  amount?: E8s;
  toAccount?: IcrcAccount;
}

/**
 * The parameters to set dissolve timestamp
 */
export interface SnsSetDissolveTimestampParams extends SnsNeuronManagementParams {
  dissolveTimestampSeconds: bigint;
}

/**
 * The parameters to increase dissolve delay
 */
export interface SnsIncreaseDissolveDelayParams extends SnsNeuronManagementParams {
  additionalDissolveDelaySeconds: number;
}

/**
 * The parameters to follow by ns-function
 */
export interface SnsSetTopicFollowees extends SnsNeuronManagementParams {
  functionId: bigint;
  followees: SnsGovernanceDid.NeuronId[];
}

/**
 * The parameters to follow by topic
 */
export interface SnsSetFollowingParams extends SnsNeuronManagementParams {
  topicFollowing: Array<{
    topic: SnsGovernanceDid.Topic;
    followees: Array<{
      neuronId: SnsGovernanceDid.NeuronId;
      alias?: string;
    }>;
  }>;
}

/**
 * The parameters to register vote
 */
export interface SnsRegisterVoteParams extends SnsNeuronManagementParams {
  vote: SnsVote;
  proposalId: SnsGovernanceDid.ProposalId;
}

/**
 * The parameters to claim a neuron
 */
export interface SnsClaimNeuronParams {
  memo: bigint;
  controller: Principal;
  subaccount: IcrcSubaccount;
}

/**
 * The parameters to stake maturity of a neuron
 */
export interface SnsNeuronStakeMaturityParams extends SnsNeuronManagementParams {
  percentageToStake?: number;
}

/**
 * The parameters to disburse maturity of a neuron
 */
export interface SnsNeuronDisburseMaturityParams extends SnsNeuronManagementParams {
  toAccount?: IcrcAccount;
  percentageToDisburse: number;
}

/**
 * The parameters to toggle auto stake maturity of a neuron
 */
export interface SnsNeuronAutoStakeMaturityParams extends SnsNeuronManagementParams {
  autoStake: boolean;
}
