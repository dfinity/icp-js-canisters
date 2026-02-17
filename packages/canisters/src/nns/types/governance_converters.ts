import type { DerEncodedPublicKey } from "@icp-sdk/core/agent";
import type { Principal } from "@icp-sdk/core/principal";
import type { NnsGovernanceDid } from "../../declarations";
import type { AccountIdentifierHex } from "../../ledger/icp";
import type {
  CanisterAction,
  CanisterInstallMode,
  LogVisibility,
  NeuronState,
  NeuronType,
  NeuronVisibility,
  ProposalRewardStatus,
  ProposalStatus,
  Topic,
  Vote,
} from "../enums/governance.enums";
import type {
  CanisterIdString,
  E8s,
  NeuronId,
  Option,
  PrincipalString,
} from "./common";

export type Action =
  | { RegisterKnownNeuron: KnownNeuron }
  | { DeregisterKnownNeuron: DeregisterKnownNeuron }
  | {
      ExecuteNnsFunction: ExecuteNnsFunction;
    }
  | { CreateServiceNervousSystem: CreateServiceNervousSystem }
  | { ManageNeuron: ManageNeuron }
  | { InstallCode: InstallCode }
  | { StopOrStartCanister: StopOrStartCanister }
  | { UpdateCanisterSettings: UpdateCanisterSettings }
  | { FulfillSubnetRentalRequest: FulfillSubnetRentalRequest }
  | { BlessAlternativeGuestOsVersion: BlessAlternativeGuestOsVersion }
  | { ApproveGenesisKyc: ApproveGenesisKyc }
  | { ManageNetworkEconomics: NetworkEconomics }
  | { RewardNodeProvider: RewardNodeProvider }
  | { RewardNodeProviders: RewardNodeProviders }
  | { AddOrRemoveNodeProvider: AddOrRemoveNodeProvider }
  | { SetDefaultFollowees: SetDefaultFollowees }
  | { Motion: Motion }
  | { SetSnsTokenSwapOpenTimeWindow: SetSnsTokenSwapOpenTimeWindow }
  | { OpenSnsTokenSwap: OpenSnsTokenSwap }
  | { TakeCanisterSnapshot: TakeCanisterSnapshot }
  | { LoadCanisterSnapshot: LoadCanisterSnapshot };
export type ProposalActionRequest =
  | { RegisterKnownNeuron: KnownNeuron }
  | { DeregisterKnownNeuron: DeregisterKnownNeuron }
  | {
      ExecuteNnsFunction: ExecuteNnsFunction;
    }
  | { CreateServiceNervousSystem: CreateServiceNervousSystem }
  | { ManageNeuron: ManageNeuronRequest }
  | { InstallCode: InstallCodeRequest }
  | { StopOrStartCanister: StopOrStartCanister }
  | { UpdateCanisterSettings: UpdateCanisterSettings }
  | { BlessAlternativeGuestOsVersion: BlessAlternativeGuestOsVersion }
  | { ApproveGenesisKyc: ApproveGenesisKyc }
  | { ManageNetworkEconomics: NetworkEconomics }
  | { RewardNodeProvider: RewardNodeProvider }
  | { RewardNodeProviders: RewardNodeProviders }
  | { AddOrRemoveNodeProvider: AddOrRemoveNodeProvider }
  | { Motion: Motion }
  | { TakeCanisterSnapshot: TakeCanisterSnapshot }
  | { LoadCanisterSnapshot: LoadCanisterSnapshot };
export interface AddHotKey {
  newHotKey: Option<PrincipalString>;
}
export interface AddOrRemoveNodeProvider {
  change: Option<Change>;
}
export interface ApproveGenesisKyc {
  principals: Array<PrincipalString>;
}
export type AuthzChangeOp =
  | { Authorize: { addSelf: boolean } }
  | { Deauthorize: null };
export interface Ballot {
  neuronId: bigint;
  vote: Vote;
  votingPower: bigint;
}
export interface BallotInfo {
  vote: Vote;
  proposalId: Option<ProposalId>;
}
export type By =
  | { NeuronIdOrSubaccount: Record<string, never> }
  | { MemoAndController: ClaimOrRefreshNeuronFromAccount }
  | { Memo: bigint };
export interface CanisterAuthzInfo {
  methodsAuthz: Array<MethodAuthzInfo>;
}
export type Change = { ToRemove: NodeProvider } | { ToAdd: NodeProvider };
export interface ClaimOrRefresh {
  by: Option<By>;
}
export interface ClaimOrRefreshNeuronFromAccount {
  controller: Option<Principal>;
  memo: bigint;
}
export interface ClaimOrRefreshNeuronRequest {
  neuronId: NeuronId;
  by: Option<By>;
}
export type Command =
  | { Spawn: Spawn }
  | { Split: Split }
  | { Follow: Follow }
  | { ClaimOrRefresh: ClaimOrRefresh }
  | { Configure: Configure }
  | { RegisterVote: RegisterVote }
  | { Merge: Merge }
  | { DisburseToNeuron: DisburseToNeuron }
  | { SetFollowing: SetFollowing }
  | { MergeMaturity: MergeMaturity }
  | { StakeMaturity: StakeMaturity }
  | { MakeProposal: Proposal }
  | { Disburse: Disburse }
  | { RefreshVotingPower: RefreshVotingPower }
  | { DisburseMaturity: DisburseMaturity };
// Command_1
export type ManageNeuronCommandRequest =
  | { Spawn: Spawn }
  | { Split: Split }
  | { Follow: Follow }
  | { ClaimOrRefresh: ClaimOrRefresh }
  | { Configure: Configure }
  | { RegisterVote: RegisterVote }
  | { Merge: Merge }
  | { DisburseToNeuron: DisburseToNeuron }
  | { SetFollowing: SetFollowing }
  | { MergeMaturity: MergeMaturity }
  | { StakeMaturity: StakeMaturity }
  | { MakeProposal: MakeProposalRequest }
  | { Disburse: Disburse }
  | { DisburseMaturity: DisburseMaturity };
export interface Configure {
  operation: Option<Operation>;
}
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface RefreshVotingPower {
  // Intentionally left blank.
}
export interface Disburse {
  toAccountId: Option<AccountIdentifierHex>;
  amount: Option<E8s>;
}
export interface DisburseResponse {
  transferBlockHeight: bigint;
}
export interface DisburseToNeuron {
  dissolveDelaySeconds: bigint;
  kycVerified: boolean;
  amount: E8s;
  newController: Option<PrincipalString>;
  nonce: bigint;
}
export interface FolloweesForTopic {
  topic: Topic;
  followees: Array<NeuronId>;
}
export interface SetFollowing {
  topicFollowing: Array<FolloweesForTopic>;
}
export type DissolveState =
  | { DissolveDelaySeconds: bigint }
  | { WhenDissolvedTimestampSeconds: bigint };
export interface ExecuteNnsFunction {
  nnsFunctionId: number;
  payloadBytes?: ArrayBuffer;
}
export interface Follow {
  topic: Topic;
  followees: Array<NeuronId>;
}
export interface Followees {
  topic: Topic;
  followees: Array<NeuronId>;
}

export interface Account {
  owner: Option<Principal>;
  subaccount: Option<Array<number>>;
}
export interface DisburseMaturity {
  toAccount: Option<Account>;
  toAccountIdentifier: Option<AccountIdentifierHex>;
  percentageToDisburse: number;
}

export interface MaturityDisbursement {
  timestampOfDisbursementSeconds: Option<bigint>;
  amountE8s: Option<bigint>;
  accountToDisburseTo: Option<Account>;
  accountIdentifierToDisburseTo: Option<AccountIdentifierHex>;
  finalizeDisbursementTimestampSeconds: Option<bigint>;
}

export interface IncreaseDissolveDelay {
  additionalDissolveDelaySeconds: number;
}
export interface KnownNeuron {
  id: NeuronId;
  name: string;
  description: Option<string>;
  links: Option<Array<string>>;
  committed_topics: Option<Array<[] | [NnsGovernanceDid.TopicToFollow]>>;
}
export interface DeregisterKnownNeuron {
  id: Option<NeuronId>;
}
export interface SetDissolveTimestamp {
  dissolveTimestampSeconds: bigint;
}
export interface ChangeAutoStakeMaturity {
  requestedSettingForAutoStakeMaturity: boolean;
}
export interface SetVisibility {
  visibility: Option<NeuronVisibility>;
}
export interface ListProposalsRequest {
  // Limit on the number of [ProposalInfo] to return. If no value is
  // specified, or if a value greater than 100 is specified, 100
  // will be used.
  limit: number;

  // If specified, only return proposals that are stricty earlier than
  // the specified proposal according to the proposal ID. If not
  // specified, start with the most recent proposal.
  beforeProposal: Option<ProposalId>;

  // Include proposals that have a reward status in this list (see
  // [ProposalRewardStatus] for more information). If this list is
  // empty, no restriction is applied. For example, many users listing
  // proposals will only be interested in proposals for which they can
  // receive voting rewards, i.e., with reward status
  // PROPOSAL_REWARD_STATUS_ACCEPT_VOTES.
  includeRewardStatus: Array<ProposalRewardStatus>;

  // Exclude proposals with a topic in this list. This is particularly
  // useful to exclude proposals on the topics TOPIC_EXCHANGE_RATE and
  // TOPIC_KYC which most users are not likely to be interested in
  // seeing
  excludeTopic: Array<Topic>;

  // Include all ManageNeuron proposals regardless of the visibility of the
  // proposal to the caller principal. Note that exclude_topic is still
  // respected even when this option is set to true.
  includeAllManageNeuronProposals: boolean;

  // Include proposals that have a status in this list (see
  // [ProposalStatus] for more information). If this list is empty, no
  // restriction is applied.
  includeStatus: Array<ProposalStatus>;

  // Omits "large fields" from the response. Currently only omits the
  // `logo` and `token_logo` field of CreateServiceNervousSystem proposals. This
  // is useful to improve download times and to ensure that the response to the
  // request doesn't exceed the message size limit.
  omitLargeFields?: boolean;

  // Whether to include self-describing proposal actions in the response.
  returnSelfDescribingAction?: boolean;
}
export interface ListProposalsResponse {
  proposals: Array<ProposalInfo>;
}
export interface MakeProposalResponse {
  proposalId: ProposalId;
}
export interface ManageNeuron {
  id: Option<NeuronId>;
  command: Option<Command>;
  neuronIdOrSubaccount: Option<NeuronIdOrSubaccount>;
}
export interface ManageNeuronRequest {
  id: Option<NeuronId>;
  command: Option<ManageNeuronCommandRequest>;
  neuronIdOrSubaccount: Option<NeuronIdOrSubaccount>;
}
export interface InstallCode {
  argHash: string;
  wasmModuleHash: string;
  skipStoppingBeforeInstalling: Option<boolean>;
  canisterId: Option<PrincipalString>;
  installMode: Option<CanisterInstallMode>;
}
export interface InstallCodeRequest {
  arg: ArrayBuffer;
  wasmModule: ArrayBuffer;
  skipStoppingBeforeInstalling: Option<boolean>;
  canisterId: Option<PrincipalString>;
  installMode: Option<CanisterInstallMode>;
}
export interface StopOrStartCanister {
  canisterId: Option<PrincipalString>;
  action: Option<CanisterAction>;
}
export interface CanisterSettings {
  freezingThreshold: Option<bigint>;
  controllers: Option<Array<PrincipalString>>;
  logVisibility: Option<LogVisibility>;
  wasmMemoryLimit: Option<bigint>;
  memoryAllocation: Option<bigint>;
  computeAllocation: Option<bigint>;
  wasmMemoryThreshold: Option<bigint>;
}
export interface UpdateCanisterSettings {
  canisterId: Option<PrincipalString>;
  settings: Option<CanisterSettings>;
}
export interface FulfillSubnetRentalRequest {
  user: Option<Principal>;
  replicaVersionId: Option<string>;
  nodeIds: Array<Principal> | undefined;
}
export interface GuestLaunchMeasurementMetadata {
  kernelCmdline: Option<string>;
}
export interface GuestLaunchMeasurement {
  metadata: Option<GuestLaunchMeasurementMetadata>;
  /**
   * SEV-SNP measurement (48 bytes).
   */
  measurement: Option<Uint8Array>;
}
export interface GuestLaunchMeasurements {
  guestLaunchMeasurements: Option<Array<GuestLaunchMeasurement>>;
}
export interface BlessAlternativeGuestOsVersion {
  rootfsHash: Option<string>;
  chipIds: Option<Array<Uint8Array>>;
  baseGuestLaunchMeasurements: Option<GuestLaunchMeasurements>;
}

export interface TakeCanisterSnapshot {
  replaceSnapshot: Option<Uint8Array>;
  canisterId: Option<PrincipalString>;
}

export interface LoadCanisterSnapshot {
  canisterId: Option<PrincipalString>;
  snapshotId: Option<Uint8Array>;
}
export interface Merge {
  sourceNeuronId: Option<NeuronId>;
}
export interface MergeRequest {
  sourceNeuronId: NeuronId;
  targetNeuronId: NeuronId;
}
export interface StakeMaturity {
  percentageToStake: Option<number>;
}
export interface MergeMaturity {
  percentageToMerge: number;
}
export interface MergeMaturityRequest {
  neuronId: NeuronId;
  percentageToMerge: number;
}
export interface MergeMaturityResponse {
  mergedMaturityE8s: bigint;
  newStakeE8s: bigint;
}
export interface MethodAuthzChange {
  principal: Option<PrincipalString>;
  methodName: string;
  canister: CanisterIdString;
  operation: AuthzChangeOp;
}
export interface MethodAuthzInfo {
  methodName: string;
  principalIds: Array<ArrayBuffer>;
}
export interface Motion {
  motionText: string;
}
export interface OpenSnsTokenSwap {
  communityFundInvestmentE8s: Option<bigint>;
  targetSwapCanisterId: Option<Principal>;
  params: Option<{
    minParticipantIcpE8s: bigint;
    maxIcpE8s: bigint;
    swapDueTimestampSeconds: bigint;
    minParticipants: number;
    snsTokenE8s: bigint;
    maxParticipantIcpE8s: bigint;
    minIcpE8s: bigint;
    saleDelaySeconds: Option<bigint>;
    neuronBasketConstructionParameters: Option<{
      // Keep snake case to avoid having to convert back and forth.
      dissolve_delay_interval_seconds: bigint;
      count: bigint;
    }>;
    maxDirectParticipationIcpE8s: Option<bigint>;
    minDirectParticipationIcpE8s: Option<bigint>;
  }>;
}
export interface SetSnsTokenSwapOpenTimeWindow {
  request: Option<{
    openTimeWindow: Option<{
      startTimestampSeconds: bigint;
      endTimestampSeconds: bigint;
    }>;
  }>;
  swapCanisterId: Option<string>;
}
export interface NetworkEconomics {
  neuronMinimumStake: E8s;
  maxProposalsToKeepPerTopic: number;
  neuronManagementFeePerProposal: E8s;
  rejectCost: E8s;
  transactionFee: E8s;
  neuronSpawnDissolveDelaySeconds: bigint;
  minimumIcpXdrRate: bigint;
  maximumNodeProviderRewards: bigint;
  neuronsFundEconomics: Option<NeuronsFundEconomics>;
  votingPowerEconomics: Option<VotingPowerEconomics>;
}
export interface VotingPowerEconomics {
  startReducingVotingPowerAfterSeconds: Option<bigint>;
  neuronMinimumDissolveDelayToVoteSeconds: Option<bigint>;
  clearFollowingAfterSeconds: Option<bigint>;
}
export interface NeuronsFundEconomics {
  maximumIcpXdrRate: Option<Percentage>;
  neuronsFundMatchedFundingCurveCoefficients: Option<NeuronsFundMatchedFundingCurveCoefficients>;
  maxTheoreticalNeuronsFundParticipationAmountXdr: Option<Decimal>;
  minimumIcpXdrRate: Option<Percentage>;
}
export interface NeuronsFundMatchedFundingCurveCoefficients {
  contributionThresholdXdr: Option<Decimal>;
  oneThirdParticipationMilestoneXdr: Option<Decimal>;
  fullParticipationMilestoneXdr: Option<Decimal>;
}
export interface Decimal {
  humanReadable: Option<string>;
}
export interface Neuron {
  id: Option<NeuronId>;
  neuronType: Option<NeuronType>;
  stakedMaturityE8sEquivalent: Option<bigint>;
  controller: Option<PrincipalString>;
  recentBallots: Array<BallotInfo>;
  kycVerified: boolean;
  notForProfit: boolean;
  cachedNeuronStake: E8s;
  createdTimestampSeconds: bigint;
  autoStakeMaturity: Option<boolean>;
  maturityE8sEquivalent: bigint;
  agingSinceTimestampSeconds: bigint;
  spawnAtTimesSeconds: Option<bigint>;
  neuronFees: E8s;
  hotKeys: Array<PrincipalString>;
  accountIdentifier: AccountIdentifierHex;
  joinedCommunityFundTimestampSeconds: Option<bigint>;
  maturityDisbursementsInProgress: Option<Array<MaturityDisbursement>>;
  dissolveState: Option<DissolveState>;
  followees: Array<Followees>;
  visibility: Option<NeuronVisibility>;
  votingPowerRefreshedTimestampSeconds: Option<bigint>;
  potentialVotingPower: Option<bigint>;
  decidingVotingPower: Option<bigint>;
}
export type NeuronIdOrSubaccount =
  | { Subaccount: Array<number> }
  | { NeuronId: NeuronId };
export interface NeuronInfo {
  neuronId: NeuronId;
  dissolveDelaySeconds: bigint;
  recentBallots: Array<BallotInfo>;
  neuronType: Option<NeuronType>;
  createdTimestampSeconds: bigint;
  state: NeuronState;
  joinedCommunityFundTimestampSeconds: Option<bigint>;
  retrievedAtTimestampSeconds: bigint;
  votingPower: bigint;
  votingPowerRefreshedTimestampSeconds: Option<bigint>;
  decidingVotingPower: Option<bigint>;
  potentialVotingPower: Option<bigint>;
  ageSeconds: bigint;
  fullNeuron: Option<Neuron>;
  visibility: Option<NeuronVisibility>;
}

export interface NodeProvider {
  id: Option<PrincipalString>;
  rewardAccount: Option<AccountIdentifierHex>;
}
export type Operation =
  | { RemoveHotKey: RemoveHotKey }
  | { AddHotKey: AddHotKey }
  | { StopDissolving: Record<string, never> }
  | { StartDissolving: Record<string, never> }
  | { IncreaseDissolveDelay: IncreaseDissolveDelay }
  | { JoinCommunityFund: Record<string, never> }
  | { LeaveCommunityFund: Record<string, never> }
  | { SetDissolveTimestamp: SetDissolveTimestamp }
  | { ChangeAutoStakeMaturity: ChangeAutoStakeMaturity }
  | { SetVisibility: SetVisibility };
export interface SelfDescribingProposalAction {
  typeDescription: Option<string>;
  typeName: Option<string>;
  value: Option<SelfDescribingValue>;
}

export type SelfDescribingValue =
  | { Int: bigint }
  | { Map: Array<[string, SelfDescribingValue]> }
  | { Nat: bigint }
  | { Blob: Uint8Array }
  | { Bool: boolean }
  | { Null: null }
  | { Text: string }
  | { Array: Array<SelfDescribingValue> };

export interface Proposal {
  title: Option<string>;
  url: string;
  action: Option<Action>;
  summary: string;
  selfDescribingAction: Option<SelfDescribingProposalAction>;
}
export type ProposalId = bigint;

export interface ProposalInfo {
  id: Option<ProposalId>;
  ballots: Array<Ballot>;
  rejectCost: E8s;
  proposalTimestampSeconds: bigint;
  rewardEventRound: bigint;
  failedTimestampSeconds: bigint;
  decidedTimestampSeconds: bigint;
  deadlineTimestampSeconds: Option<bigint>;
  latestTally: Option<Tally>;
  proposal: Option<Proposal>;
  proposer: Option<NeuronId>;
  executedTimestampSeconds: bigint;
  topic: Topic;
  status: ProposalStatus;
  rewardStatus: ProposalRewardStatus;
  totalPotentialVotingPower: Option<bigint>;
}

export interface RegisterVote {
  vote: Vote;
  proposal: Option<ProposalId>;
}
export interface RemoveHotKey {
  hotKeyToRemove: Option<PrincipalString>;
}
export type RewardMode =
  | { RewardToNeuron: RewardToNeuron }
  | { RewardToAccount: RewardToAccount };
export interface RewardNodeProviders {
  useRegistryDerivedRewards: boolean | undefined;
  rewards: Array<RewardNodeProvider>;
}
export interface RewardToAccount {
  toAccount: Option<AccountIdentifierHex>;
}
export interface RewardToNeuron {
  dissolveDelaySeconds: bigint;
}

export interface ClaimNeuronRequest {
  publicKey: DerEncodedPublicKey;
  nonce: bigint;
  dissolveDelayInSecs: bigint;
}

export interface RewardNodeProvider {
  nodeProvider: Option<NodeProvider>;
  rewardMode: Option<RewardMode>;
  amountE8s: bigint;
}
export interface SetDefaultFollowees {
  defaultFollowees: Array<Followees>;
}
export interface Spawn {
  newController: Option<PrincipalString>;
  percentageToSpawn: number | undefined;
}

export interface Split {
  amount: E8s;
  memo: Option<bigint>;
}
export interface Tally {
  no: bigint;
  yes: bigint;
  total: bigint;
  timestampSeconds: bigint;
}

export interface AddHotKeyRequest {
  neuronId: NeuronId;
  principal: PrincipalString;
}

export interface RemoveHotKeyRequest {
  neuronId: NeuronId;
  principal: PrincipalString;
}

export interface StartDissolvingRequest {
  neuronId: NeuronId;
}

export interface StopDissolvingRequest {
  neuronId: NeuronId;
}

export interface IncreaseDissolveDelayRequest {
  neuronId: NeuronId;
  additionalDissolveDelaySeconds: number;
}

export interface FollowRequest {
  neuronId: NeuronId;
  topic: Topic;
  followees: Array<NeuronId>;
}

export interface RegisterVoteRequest {
  neuronId: NeuronId;
  vote: Vote;
  proposal: ProposalId;
}

export interface SpawnRequest {
  neuronId: NeuronId;
  newController: Option<PrincipalString>;
  percentageToSpawn?: number;
}

export interface SplitRequest {
  neuronId: NeuronId;
  amount: E8s;
}

export interface DisburseRequest {
  neuronId: NeuronId;
  toAccountId?: AccountIdentifierHex;
  amount?: E8s;
}

export interface DisburseToNeuronRequest {
  neuronId: NeuronId;
  dissolveDelaySeconds: bigint;
  kycVerified: boolean;
  amount: E8s;
  newController: Option<PrincipalString>;
  nonce: bigint;
}

export interface JoinCommunityFundRequest {
  neuronId: NeuronId;
}

export interface MakeProposalRequest {
  neuronId: NeuronId;
  title: Option<string>;
  url: string;
  summary: string;
  action: ProposalActionRequest;
}

export interface MakeMotionProposalRequest {
  neuronId: NeuronId;
  title: Option<string>;
  url: string;
  text: string;
  summary: string;
}

export interface MakeNetworkEconomicsProposalRequest {
  neuronId: NeuronId;
  title: Option<string>;
  summary: string;
  url: string;
  networkEconomics: NetworkEconomics;
}

export interface MakeRewardNodeProviderProposalRequest {
  neuronId: NeuronId;
  title: Option<string>;
  summary: string;
  url: string;
  nodeProvider: PrincipalString;
  amount: E8s;
  rewardMode: Option<RewardMode>;
}

export interface MakeSetDefaultFolloweesProposalRequest {
  neuronId: NeuronId;
  title: Option<string>;
  summary: string;
  url: string;
  followees: Array<Followees>;
}

export interface MakeExecuteNnsFunctionProposalRequest {
  neuronId: NeuronId;
  title: Option<string>;
  summary: string;
  url: string;
  nnsFunction: number;
  payload: ArrayBuffer;
}

export interface ListNodeProvidersResponse {
  nodeProviders: NodeProvider[];
}

export interface Percentage {
  basisPoints: Option<bigint>;
}

export interface Duration {
  seconds: Option<bigint>;
}

export interface GlobalTimeOfDay {
  secondsAfterUtcMidnight: Option<bigint>;
}

export interface Countries {
  isoCodes: Array<string>;
}

export interface Tokens {
  e8s: Option<bigint>;
}

export interface Image {
  base64Encoding: Option<string>;
}

export interface LedgerParameters {
  transactionFee: Option<Tokens>;
  tokenSymbol: Option<string>;
  tokenLogo: Option<Image>;
  tokenName: Option<string>;
}

export interface VotingRewardParameters {
  rewardRateTransitionDuration: Option<Duration>;
  initialRewardRate: Option<Percentage>;
  finalRewardRate: Option<Percentage>;
}

export interface GovernanceParameters {
  neuronMaximumDissolveDelayBonus: Option<Percentage>;
  neuronMaximumAgeForAgeBonus: Option<Duration>;
  neuronMaximumDissolveDelay: Option<Duration>;
  neuronMinimumDissolveDelayToVote: Option<Duration>;
  neuronMaximumAgeBonus: Option<Percentage>;
  neuronMinimumStake: Option<Tokens>;
  proposalWaitForQuietDeadlineIncrease: Option<Duration>;
  proposalInitialVotingPeriod: Option<Duration>;
  proposalRejectionFee: Option<Tokens>;
  votingRewardParameters: Option<VotingRewardParameters>;
  customProposalCriticality: Option<CustomProposalCriticality>;
}

export interface CustomProposalCriticality {
  additionalCriticalNativeActionIds: Option<Array<bigint>>;
}

export interface NeuronBasketConstructionParameters {
  dissolveDelayInterval: Option<Duration>;
  count: Option<bigint>;
}
export interface SwapParameters {
  minimumParticipants: Option<bigint>;
  duration: Option<Duration>;
  neuronBasketConstructionParameters: Option<NeuronBasketConstructionParameters>;
  confirmationText: Option<string>;
  maximumParticipantIcp: Option<Tokens>;
  neuronsFundInvestmentIcp: Option<Tokens>;
  minimumIcp: Option<Tokens>;
  minimumParticipantIcp: Option<Tokens>;
  startTime: Option<GlobalTimeOfDay>;
  maximumIcp: Option<Tokens>;
  restrictedCountries: Option<Countries>;
  maxDirectParticipationIcp: Option<Tokens>;
  minDirectParticipationIcp: Option<Tokens>;
  neuronsFundParticipation: Option<boolean>;
}

export interface SwapDistribution {
  total: Option<Tokens>;
}

export interface NeuronDistribution {
  controller: Option<PrincipalString>;
  dissolveDelay: Option<Duration>;
  memo: Option<bigint>;
  vestingPeriod: Option<Duration>;
  stake: Option<Tokens>;
}

export interface DeveloperDistribution {
  developerNeurons: Array<NeuronDistribution>;
}

export interface InitialTokenDistribution {
  treasuryDistribution: Option<SwapDistribution>;
  developerDistribution: Option<DeveloperDistribution>;
  swapDistribution: Option<SwapDistribution>;
}

export interface CreateServiceNervousSystem {
  url: Option<string>;
  governanceParameters: Option<GovernanceParameters>;
  fallbackControllerPrincipalIds: Array<PrincipalString>;
  logo: Option<Image>;
  name: Option<string>;
  ledgerParameters: Option<LedgerParameters>;
  description: Option<string>;
  dappCanisters: Array<CanisterIdString>;
  swapParameters: Option<SwapParameters>;
  initialTokenDistribution: Option<InitialTokenDistribution>;
}

export interface NeuronSubsetMetrics {
  totalMaturityE8sEquivalent: Option<bigint>;
  maturityE8sEquivalentBuckets: Array<[bigint, bigint]>;
  votingPowerBuckets: Array<[bigint, bigint]>;
  totalStakedE8s: Option<bigint>;
  count: Option<bigint>;
  decidingVotingPowerBuckets: Array<[bigint, bigint]>;
  totalStakedMaturityE8sEquivalent: Option<bigint>;
  totalPotentialVotingPower: Option<bigint>;
  totalDecidingVotingPower: Option<bigint>;
  stakedMaturityE8sEquivalentBuckets: Array<[bigint, bigint]>;
  stakedE8sBuckets: Array<[bigint, bigint]>;
  totalVotingPower: Option<bigint>;
  potentialVotingPowerBuckets: Array<[bigint, bigint]>;
  countBuckets: Array<[bigint, bigint]>;
}

export interface GovernanceCachedMetrics {
  totalMaturityE8sEquivalent: bigint;
  notDissolvingNeuronsE8sBuckets: Array<[bigint, number]>;
  dissolvingNeuronsStakedMaturityE8sEquivalentSum: bigint;
  garbageCollectableNeuronsCount: bigint;
  dissolvingNeuronsStakedMaturityE8sEquivalentBuckets: Array<[bigint, number]>;
  neuronsWithInvalidStakeCount: bigint;
  notDissolvingNeuronsCountBuckets: Array<[bigint, bigint]>;
  ectNeuronCount: bigint;
  totalSupplyIcp: bigint;
  neuronsWithLessThan6MonthsDissolveDelayCount: bigint;
  dissolvedNeuronsCount: bigint;
  communityFundTotalMaturityE8sEquivalent: bigint;
  totalStakedE8sSeed: bigint;
  totalStakedMaturityE8sEquivalentEct: bigint;
  totalStakedE8s: bigint;
  fullyLostVotingPowerNeuronSubsetMetrics: Option<NeuronSubsetMetrics>;
  notDissolvingNeuronsCount: bigint;
  totalLockedE8s: bigint;
  neuronsFundTotalActiveNeurons: bigint;
  totalVotingPowerNonSelfAuthenticatingController: Option<bigint>;
  totalStakedMaturityE8sEquivalent: bigint;
  notDissolvingNeuronsE8sBucketsEct: Array<[bigint, number]>;
  spawningNeuronsCount: bigint;
  decliningVotingPowerNeuronSubsetMetrics: Option<NeuronSubsetMetrics>;
  totalStakedE8sEct: bigint;
  notDissolvingNeuronsStakedMaturityE8sEquivalentSum: bigint;
  dissolvedNeuronsE8s: bigint;
  totalStakedE8sNonSelfAuthenticatingController: Option<bigint>;
  dissolvingNeuronsE8sBucketsSeed: Array<[bigint, number]>;
  neuronsWithLessThan6MonthsDissolveDelayE8s: bigint;
  notDissolvingNeuronsStakedMaturityE8sEquivalentBuckets: Array<
    [bigint, number]
  >;
  dissolvingNeuronsCountBuckets: Array<[bigint, bigint]>;
  dissolvingNeuronsE8sBucketsEct: Array<[bigint, number]>;
  nonSelfAuthenticatingControllerNeuronSubsetMetrics: Option<NeuronSubsetMetrics>;
  dissolvingNeuronsCount: bigint;
  dissolvingNeuronsE8sBuckets: Array<[bigint, number]>;
  totalStakedMaturityE8sEquivalentSeed: bigint;
  communityFundTotalStakedE8s: bigint;
  notDissolvingNeuronsE8sBucketsSeed: Array<[bigint, number]>;
  publicNeuronSubsetMetrics: Option<NeuronSubsetMetrics>;
  timestampSeconds: bigint;
  seedNeuronCount: bigint;
}
