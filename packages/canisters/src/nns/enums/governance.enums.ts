// The Candid files are generated from Proto. That's why the enums are currently lost in the conversion process.
// These enums are used to map back numbers provided by the backend through the Candid declaration.
// We use Pascal case for consistency reason.
//
// Proto source: https://github.com/dfinity/ic/blob/master/rs/nns/governance/proto/ic_nns_governance/pb/v1/governance.proto

export enum NeuronState {
  Unspecified = 0,
  Locked = 1,
  Dissolving = 2,
  Dissolved = 3,
  Spawning = 4,
}

export enum Topic {
  Unspecified = 0,
  NeuronManagement = 1,
  ExchangeRate = 2,
  NetworkEconomics = 3,
  Governance = 4,
  NodeAdmin = 5,
  ParticipantManagement = 6,
  SubnetManagement = 7,
  NetworkCanisterManagement = 8,
  Kyc = 9,
  NodeProviderRewards = 10,
  /**
   * @deprecated
   */
  SnsDecentralizationSale = 11,
  IcOsVersionDeployment = 12,
  IcOsVersionElection = 13,
  SnsAndCommunityFund = 14,
  ApiBoundaryNodeManagement = 15,
  SubnetRental = 16,
  ProtocolCanisterManagement = 17,
  ServiceNervousSystemManagement = 18,
}

// The proposal status, with respect to reward distribution.
// See also ProposalStatus.
export enum ProposalRewardStatus {
  Unknown = 0,

  // The proposal still accept votes, for the purpose of
  // vote rewards. This implies nothing on the ProposalStatus.
  AcceptVotes = 1,

  // The proposal no longer accepts votes. It is due to settle
  // at the next reward event.
  ReadyToSettle = 2,

  // The proposal has been taken into account in a reward event.
  Settled = 3,

  // The proposal is not eligible to be taken into account in a reward event.
  Ineligible = 4,
}

// The proposal status, with respect to decision making and execution.
// See also ProposalRewardStatus.
export enum ProposalStatus {
  Unknown = 0,

  // A decision (accept/reject) has yet to be made.
  Open = 1,

  // The proposal has been rejected.
  Rejected = 2,

  // The proposal has been accepted. At this time, either execution
  // as not yet started, or it has but the outcome is not yet known.
  Accepted = 3,

  // The proposal was accepted and successfully executed.
  Executed = 4,

  // The proposal was accepted, but execution failed.
  Failed = 5,
}

export enum Vote {
  Unspecified = 0,
  Yes = 1,
  No = 2,
}

export enum NnsFunction {
  Unspecified = 0,
  CreateSubnet = 1,
  AddNodeToSubnet = 2,
  NnsCanisterInstall = 3,
  NnsCanisterUpgrade = 4,
  BlessReplicaVersion = 5,
  RecoverSubnet = 6,
  UpdateConfigOfSubnet = 7,
  AssignNoid = 8,
  NnsRootUpgrade = 9,
  IcpXdrConversionRate = 10,
  DeployGuestosToAllSubnetNodes = 11,
  ClearProvisionalWhitelist = 12,
  RemoveNodesFromSubnet = 13,
  SetAuthorizedSubnetworks = 14,
  SetFirewallConfig = 15,
  UpdateNodeOperatorConfig = 16,
  StopOrStartNnsCanister = 17,
  RemoveNodes = 18,
  UninstallCode = 19,
  UpdateNodeRewardsTable = 20,
  AddOrRemoveDataCenters = 21,
  UpdateUnassignedNodesConfig = 22,
  RemoveNodeOperators = 23,
  RerouteCanisterRanges = 24,
  AddFirewallRules = 25,
  RemoveFirewallRules = 26,
  UpdateFirewallRules = 27,
  PrepareCanisterMigration = 28,
  CompleteCanisterMigration = 29,
  AddSnsWasm = 30,
  ChangeSubnetMembership = 31,
  UpdateSubnetType = 32,
  ChangeSubnetTypeAssignment = 33,
  UpdateSnsWasmSnsSubnetIds = 34,
  UpdateAllowedPrincipals = 35,
  RetireReplicaVersion = 36,
  InsertSnsWasmUpgradePathEntries = 37,
  ReviseElectedGuestosVersions = 38,
  BitcoinSetConfig = 39,
  UpdateElectedHostosVersions = 40,
  UpdateNodesHostosVersion = 41,
  HardResetNnsRootToVersion = 42,
  AddApiBoundaryNodes = 43,
  RemoveApiBoundaryNodes = 44,
  /**
   * @deprecated
   */
  UpdateApiBoundaryNodeDomain = 45,
  UpdateApiBoundaryNodesVersion = 46,
  DeployGuestosToSomeApiBoundaryNodes = 47,
  DeployGuestosToAllUnassignedNodes = 48,
  UpdateSshReadOnlyAccessForAllUnassignedNodes = 49,
  ReviseElectedHostosVersions = 50,
  DeployHostosToSomeNodes = 51,
  SubnetRentalRequest = 52,
  PauseCanisterMigrations = 53,
  UnpauseCanisterMigrations = 54,
  SetSubnetOperationalLevel = 55,
}

// Reference: https://github.com/dfinity/ic/blob/f4b2e28525ae9b030bd9edfc982e796417db2b80/rs/nns/governance/src/gen/ic_nns_governance.pb.v1.rs#L3286-L3287
export enum NeuronType {
  // Placeholder value due to the proto3 requirement for a zero default.
  // This is an invalid type; neurons should not be assigned this value.
  Unspecified = 0,
  // Represents neurons initially created for Seed accounts in the
  // Genesis Token Canister, or those descended from such neurons.
  Seed = 1,
  // Represents neurons initially created for Early Contributor Token (ECT)
  // accounts in the Genesis Token Canister, or those descended from such neurons.
  Ect = 2,
}

// Reference: https://github.com/dfinity/ic/blob/3b3ffedc6aa481fd9b92eefaf46beded9e51a344/rs/nns/governance/src/gen/ic_nns_governance.pb.v1.rs#L2506-L2512
export enum LogVisibility {
  Unspecified = 0,
  /// The log is visible to the controllers of the dapp canister.
  Controllers = 1,
  /// The log is visible to the public.
  Public = 2,
}

// Reference: https://github.com/dfinity/ic/blob/3b3ffedc6aa481fd9b92eefaf46beded9e51a344/rs/nns/governance/src/gen/ic_nns_governance.pb.v1.rs#L2419-L2423
export enum CanisterAction {
  Unspecified = 0,
  // Stop a canister.
  Stop = 1,
  // Start a canister.
  Start = 2,
}

// Reference: https://github.com/dfinity/ic/blob/3b3ffedc6aa481fd9b92eefaf46beded9e51a344/rs/nns/governance/src/gen/ic_nns_governance.pb.v1.rs#L3929-L3958
export enum NeuronVisibility {
  Unspecified = 0,
  Private = 1,
  Public = 2,
}

// Reference: https://github.com/dfinity/ic/blob/3b3ffedc6aa481fd9b92eefaf46beded9e51a344/rs/nns/governance/src/gen/ic_nns_governance.pb.v1.rs#L2354-L2359
export enum CanisterInstallMode {
  Unspecified = 0,
  Install = 1,
  Reinstall = 2,
  Upgrade = 3,
}
