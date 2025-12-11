// Source: https://github.com/dfinity/ic/blob/master/rs/sns/governance/proto/ic_sns_governance/pb/v1/governance.proto
export enum SnsNeuronPermissionType {
  NEURON_PERMISSION_TYPE_UNSPECIFIED = 0,

  // The principal has permission to configure the neuron's dissolve state. This includes
  // start dissolving, stop dissolving, and increasing the dissolve delay for the neuron.
  NEURON_PERMISSION_TYPE_CONFIGURE_DISSOLVE_STATE = 1,

  // The principal has permission to add additional principals to modify the neuron.
  // The nervous system parameter `NervousSystemParameters::neuron_grantable_permissions`
  // determines the maximum set of privileges that a principal can grant to another principal in
  // the given SNS.
  NEURON_PERMISSION_TYPE_MANAGE_PRINCIPALS = 2,

  // The principal has permission to submit proposals on behalf of the neuron.
  // Submitting proposals can change a neuron's stake and thus this
  // is potentially a balance changing operation.
  NEURON_PERMISSION_TYPE_SUBMIT_PROPOSAL = 3,

  // The principal has permission to vote and follow other neurons on behalf of the neuron.
  NEURON_PERMISSION_TYPE_VOTE = 4,

  // The principal has permission to disburse the neuron.
  NEURON_PERMISSION_TYPE_DISBURSE = 5,

  // The principal has permission to split the neuron.
  NEURON_PERMISSION_TYPE_SPLIT = 6,

  // The principal has permission to merge the neuron's maturity into
  // the neuron's stake.
  /**
   * @deprecated
   */
  NEURON_PERMISSION_TYPE_MERGE_MATURITY = 7,

  // The principal has permission to disburse the neuron's maturity to a
  // given ledger account.
  NEURON_PERMISSION_TYPE_DISBURSE_MATURITY = 8,

  // The principal has permission to stake the neuron's maturity.
  NEURON_PERMISSION_TYPE_STAKE_MATURITY = 9,

  // The principal has permission to grant/revoke permission to vote and submit
  // proposals on behalf of the neuron to other principals.
  NEURON_PERMISSION_TYPE_MANAGE_VOTING_PERMISSION = 10,
}

export enum SnsProposalRewardStatus {
  PROPOSAL_REWARD_STATUS_UNSPECIFIED = 0,

  // The proposal still accepts votes, for the purpose of
  // voting rewards. This implies nothing on the
  // ProposalDecisionStatus, i.e., a proposal can be decided
  // due to an absolute majority being in favor or against it,
  // but other neuron holders can still cast their vote to get rewards.
  PROPOSAL_REWARD_STATUS_ACCEPT_VOTES = 1,

  // The proposal no longer accepts votes. It is due to settle
  // rewards at the next reward event.
  PROPOSAL_REWARD_STATUS_READY_TO_SETTLE = 2,

  // The proposal has been taken into account in a reward event, i.e.,
  // the associated rewards have been settled.
  PROPOSAL_REWARD_STATUS_SETTLED = 3,
}

export enum SnsProposalDecisionStatus {
  PROPOSAL_DECISION_STATUS_UNSPECIFIED = 0,

  // The proposal is open for voting and a decision (adopt/reject) has yet to be made.
  PROPOSAL_DECISION_STATUS_OPEN = 1,

  // The proposal has been rejected.
  PROPOSAL_DECISION_STATUS_REJECTED = 2,

  // The proposal has been adopted but either execution has not yet started
  // or it has started but its outcome is not yet known.
  PROPOSAL_DECISION_STATUS_ADOPTED = 3,

  // The proposal was adopted and successfully executed.
  PROPOSAL_DECISION_STATUS_EXECUTED = 4,

  // The proposal was adopted, but execution failed.
  PROPOSAL_DECISION_STATUS_FAILED = 5,
}

export enum SnsVote {
  Unspecified = 0,
  Yes = 1,
  No = 2,
}
