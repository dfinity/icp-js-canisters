import {
  assertNever,
  fromNullable,
  jsonReplacer,
  toNullable,
} from "@dfinity/utils";
import type {
  Account,
  Action as ActionCandid,
  AdvanceSnsTargetVersion as AdvanceSnsTargetVersionCandid,
  ChunkedCanisterWasm as ChunkedCanisterWasmCandid,
  Command,
  ExecuteExtensionOperation as ExecuteExtensionOperationCandid,
  ExtensionOperationArg as ExtensionOperationArgCandid,
  ExtensionUpgradeArg as ExtensionUpgradeArgCandid,
  FunctionType as FunctionTypeCandid,
  GenericNervousSystemFunction as GenericNervousSystemFunctionCandid,
  ListProposals,
  ManageDappCanisterSettings as ManageDappCanisterSettingsCandid,
  ManageLedgerParameters as ManageLedgerParametersCandid,
  ManageNeuron,
  ManageSnsMetadata as ManageSnsMetadataCandid,
  MintSnsTokens as MintSnsTokensCandid,
  NervousSystemFunction as NervousSystemFunctionCandid,
  NervousSystemParameters as NervousSystemParametersCandid,
  NeuronId,
  Operation,
  PreciseValue as PreciseValueCandid,
  RegisterExtension as RegisterExtensionCandid,
  SnsVersion as SnsVersionCandid,
  TransferSnsTreasuryFunds as TransferSnsTreasuryFundsCandid,
  UpgradeExtension as UpgradeExtensionCandid,
  UpgradeSnsControlledCanister as UpgradeSnsControlledCanisterCandid,
  VotingRewardsParameters as VotingRewardsParametersCandid,
  Wasm as WasmCandid,
} from "../../declarations/sns/governance";
import type { IcrcAccount } from "../../ledger/icrc";
import { DEFAULT_PROPOSALS_LIMIT } from "../constants/governance.constants";
import type {
  Action,
  AdvanceSnsTargetVersion,
  ChunkedCanisterWasm,
  ExecuteExtensionOperation,
  ExtensionOperationArg,
  ExtensionUpgradeArg,
  FunctionType,
  GenericNervousSystemFunction,
  ManageDappCanisterSettings,
  ManageLedgerParameters,
  ManageSnsMetadata,
  MintSnsTokens,
  NervousSystemFunction,
  NervousSystemParameters,
  PreciseValue,
  RegisterExtension,
  SnsVersion,
  TransferSnsTreasuryFunds,
  UpgradeExtension,
  UpgradeSnsControlledCanister,
  VotingRewardsParameters,
  Wasm,
} from "../types/actions";
import type {
  SnsClaimOrRefreshArgs,
  SnsDisburseNeuronParams,
  SnsIncreaseDissolveDelayParams,
  SnsListProposalsParams,
  SnsNeuronAutoStakeMaturityParams,
  SnsNeuronDisburseMaturityParams,
  SnsNeuronPermissionsParams,
  SnsNeuronStakeMaturityParams,
  SnsRegisterVoteParams,
  SnsSetDissolveTimestampParams,
  SnsSetFollowingParams,
  SnsSetTopicFollowees,
  SnsSplitNeuronParams,
} from "../types/governance.params";

// Helper for building `ManageNeuron` structure
const toManageNeuronCommand = ({
  neuronId: { id },
  command,
}: {
  neuronId: NeuronId;
  command: Command;
}): ManageNeuron => ({
  subaccount: id,
  command: [command],
});

// Helper for building `ManageNeuron` structure for type `Operation` commands
const toManageNeuronConfigureCommand = ({
  neuronId,
  operation,
}: {
  neuronId: NeuronId;
  operation: Operation;
}): ManageNeuron =>
  toManageNeuronCommand({
    neuronId,
    command: {
      Configure: {
        operation: [operation],
      },
    },
  });

export const toCandidAccount = ({
  owner,
  subaccount,
}: IcrcAccount): Account => ({
  owner: toNullable(owner),
  subaccount: subaccount === undefined ? [] : toNullable({ subaccount }),
});

export const toAddPermissionsRequest = ({
  neuronId,
  permissions,
  principal,
}: SnsNeuronPermissionsParams): ManageNeuron =>
  toManageNeuronCommand({
    neuronId,
    command: {
      AddNeuronPermissions: {
        permissions_to_add: [{ permissions: Int32Array.from(permissions) }],
        principal_id: [principal],
      },
    },
  });

export const toRemovePermissionsRequest = ({
  neuronId,
  permissions,
  principal,
}: SnsNeuronPermissionsParams): ManageNeuron =>
  toManageNeuronCommand({
    neuronId,
    command: {
      RemoveNeuronPermissions: {
        permissions_to_remove: [{ permissions: Int32Array.from(permissions) }],
        principal_id: [principal],
      },
    },
  });

export const toSplitNeuronRequest = ({
  neuronId,
  memo,
  amount: amount_e8s,
}: SnsSplitNeuronParams): ManageNeuron =>
  toManageNeuronCommand({
    neuronId,
    command: {
      Split: {
        memo,
        amount_e8s,
      },
    },
  });

export const toDisburseNeuronRequest = ({
  neuronId,
  amount,
  toAccount,
}: SnsDisburseNeuronParams): ManageNeuron =>
  toManageNeuronCommand({
    neuronId,
    command: {
      Disburse: {
        // currently there is a main account only support
        to_account:
          toAccount === undefined ? [] : toNullable(toCandidAccount(toAccount)),
        amount:
          amount === undefined
            ? []
            : [
                {
                  e8s: amount,
                },
              ],
      },
    },
  });

export const toStartDissolvingNeuronRequest = (
  neuronId: NeuronId,
): ManageNeuron =>
  toManageNeuronConfigureCommand({
    neuronId,
    operation: { StartDissolving: {} },
  });

export const toStopDissolvingNeuronRequest = (
  neuronId: NeuronId,
): ManageNeuron =>
  toManageNeuronConfigureCommand({
    neuronId,
    operation: { StopDissolving: {} },
  });

export const toStakeMaturityRequest = ({
  neuronId,
  percentageToStake,
}: SnsNeuronStakeMaturityParams): ManageNeuron =>
  toManageNeuronCommand({
    neuronId,
    command: {
      StakeMaturity: {
        percentage_to_stake: toNullable(percentageToStake),
      },
    },
  });

export const toDisburseMaturityRequest = ({
  neuronId,
  percentageToDisburse,
  toAccount,
}: SnsNeuronDisburseMaturityParams): ManageNeuron =>
  toManageNeuronCommand({
    neuronId,
    command: {
      DisburseMaturity: {
        // currently there is a main account only support
        to_account:
          toAccount === undefined ? [] : toNullable(toCandidAccount(toAccount)),
        percentage_to_disburse: percentageToDisburse,
      },
    },
  });

export const toAutoStakeMaturityNeuronRequest = ({
  neuronId,
  autoStake: requested_setting_for_auto_stake_maturity,
}: SnsNeuronAutoStakeMaturityParams): ManageNeuron =>
  toManageNeuronConfigureCommand({
    neuronId,
    operation: {
      ChangeAutoStakeMaturity: {
        requested_setting_for_auto_stake_maturity,
      },
    },
  });

export const toSetDissolveTimestampRequest = ({
  neuronId,
  dissolveTimestampSeconds,
}: SnsSetDissolveTimestampParams): ManageNeuron =>
  toManageNeuronConfigureCommand({
    neuronId,
    operation: {
      SetDissolveTimestamp: {
        dissolve_timestamp_seconds: dissolveTimestampSeconds,
      },
    },
  });

export const toIncreaseDissolveDelayRequest = ({
  neuronId,
  additionalDissolveDelaySeconds,
}: SnsIncreaseDissolveDelayParams): ManageNeuron =>
  toManageNeuronConfigureCommand({
    neuronId,
    operation: {
      IncreaseDissolveDelay: {
        additional_dissolve_delay_seconds: additionalDissolveDelaySeconds,
      },
    },
  });

export const toFollowRequest = ({
  neuronId,
  functionId,
  followees,
}: SnsSetTopicFollowees): ManageNeuron => ({
  subaccount: neuronId.id,
  command: [
    {
      Follow: {
        function_id: functionId,
        followees,
      },
    },
  ],
});

export const toSetFollowingRequest = ({
  neuronId,
  topicFollowing,
}: SnsSetFollowingParams): ManageNeuron => ({
  subaccount: neuronId.id,
  command: [
    {
      SetFollowing: {
        topic_following: topicFollowing.map(({ topic, followees }) => ({
          topic: [topic],
          followees: followees.map(({ neuronId, alias }) => ({
            neuron_id: toNullable(neuronId),
            alias: toNullable(alias),
          })),
        })),
      },
    },
  ],
});

export const toRegisterVoteRequest = ({
  neuronId,
  proposalId,
  vote,
}: SnsRegisterVoteParams): ManageNeuron => ({
  subaccount: neuronId.id,
  command: [
    {
      RegisterVote: {
        vote,
        proposal: [proposalId],
      },
    },
  ],
});

export const toClaimOrRefreshRequest = ({
  subaccount,
  memo,
  controller,
}: SnsClaimOrRefreshArgs): ManageNeuron => ({
  subaccount,
  command: [
    {
      ClaimOrRefresh: {
        by: [
          // If memo is not passed, we consider it a neuronId request because the memo is mandatory for MemoAndController
          memo === undefined
            ? { NeuronId: {} }
            : {
                MemoAndController: { memo, controller: toNullable(controller) },
              },
        ],
      },
    },
  ],
});

export const toListProposalRequest = ({
  excludeType,
  beforeProposal,
  includeRewardStatus,
  includeStatus,
  limit,
  includeTopics,
}: SnsListProposalsParams): ListProposals => ({
  exclude_type: BigUint64Array.from(excludeType ?? []),
  before_proposal: toNullable(beforeProposal),
  include_reward_status: Int32Array.from(includeRewardStatus ?? []),
  include_status: Int32Array.from(includeStatus ?? []),
  limit: limit ?? DEFAULT_PROPOSALS_LIMIT,
  include_topics: toNullable(
    includeTopics?.map((topic) => ({
      topic: toNullable(topic),
    })) ?? [],
  ),
});

export const fromCandidAction = (action: ActionCandid): Action => {
  if ("ManageNervousSystemParameters" in action) {
    return {
      ManageNervousSystemParameters: convertNervousSystemParams(
        action.ManageNervousSystemParameters,
      ),
    };
  }

  if ("AdvanceSnsTargetVersion" in action) {
    return {
      AdvanceSnsTargetVersion: convertAdvanceSnsTargetVersion(
        action.AdvanceSnsTargetVersion,
      ),
    };
  }

  if ("AddGenericNervousSystemFunction" in action) {
    return {
      AddGenericNervousSystemFunction: convertNervousSystemFunction(
        action.AddGenericNervousSystemFunction,
      ),
    };
  }

  if ("ManageDappCanisterSettings" in action) {
    return {
      ManageDappCanisterSettings: convertManageDappCanisterSettings(
        action.ManageDappCanisterSettings,
      ),
    };
  }

  if ("ManageLedgerParameters" in action) {
    return {
      ManageLedgerParameters: convertManageLedgerParameters(
        action.ManageLedgerParameters,
      ),
    };
  }

  if ("ExecuteExtensionOperation" in action) {
    return {
      ExecuteExtensionOperation: convertExecuteExtensionOperation(
        action.ExecuteExtensionOperation,
      ),
    };
  }

  if ("UpgradeExtension" in action) {
    return {
      UpgradeExtension: convertUpgradeExtension(action.UpgradeExtension),
    };
  }

  if ("SetTopicsForCustomProposals" in action) {
    return {
      SetTopicsForCustomProposals: action.SetTopicsForCustomProposals,
    };
  }

  if ("RegisterExtension" in action) {
    return {
      RegisterExtension: convertRegisterExtension(action.RegisterExtension),
    };
  }

  if ("RemoveGenericNervousSystemFunction" in action) {
    return {
      RemoveGenericNervousSystemFunction:
        action.RemoveGenericNervousSystemFunction,
    };
  }

  if ("UpgradeSnsToNextVersion" in action) {
    return { UpgradeSnsToNextVersion: action.UpgradeSnsToNextVersion };
  }

  if ("RegisterDappCanisters" in action) {
    return { RegisterDappCanisters: action.RegisterDappCanisters };
  }

  if ("TransferSnsTreasuryFunds" in action) {
    return {
      TransferSnsTreasuryFunds: convertTransferSnsTreasuryFunds(
        action.TransferSnsTreasuryFunds,
      ),
    };
  }

  if ("UpgradeSnsControlledCanister" in action) {
    return {
      UpgradeSnsControlledCanister: convertUpgradeSnsControlledCanister(
        action.UpgradeSnsControlledCanister,
      ),
    };
  }

  if ("DeregisterDappCanisters" in action) {
    return { DeregisterDappCanisters: action.DeregisterDappCanisters };
  }

  if ("MintSnsTokens" in action) {
    return {
      MintSnsTokens: convertMintSnsTokens(action.MintSnsTokens),
    };
  }

  if ("Unspecified" in action) {
    return { Unspecified: action.Unspecified };
  }

  if ("ManageSnsMetadata" in action) {
    return {
      ManageSnsMetadata: convertManageSnsMetadata(action.ManageSnsMetadata),
    };
  }

  if ("ExecuteGenericNervousSystemFunction" in action) {
    return {
      ExecuteGenericNervousSystemFunction:
        action.ExecuteGenericNervousSystemFunction,
    };
  }

  if ("Motion" in action) {
    return { Motion: action.Motion };
  }

  assertNever(action, `Unknown action type ${JSON.stringify(action)}`);
};

const convertManageSnsMetadata = (
  params: ManageSnsMetadataCandid,
): ManageSnsMetadata => ({
  url: fromNullable(params.url),
  logo: fromNullable(params.logo),
  name: fromNullable(params.name),
  description: fromNullable(params.description),
});

const convertManageLedgerParameters = (
  params: ManageLedgerParametersCandid,
): ManageLedgerParameters => ({
  token_symbol: fromNullable(params.token_symbol),
  transfer_fee: fromNullable(params.transfer_fee),
  token_logo: fromNullable(params.token_logo),
  token_name: fromNullable(params.token_name),
});

const convertAdvanceSnsTargetVersion = (
  params: AdvanceSnsTargetVersionCandid,
): AdvanceSnsTargetVersion => ({
  new_target: convertSnsVersion(fromNullable(params.new_target)),
});

const convertManageDappCanisterSettings = (
  params: ManageDappCanisterSettingsCandid,
): ManageDappCanisterSettings => ({
  freezing_threshold: fromNullable(params.freezing_threshold),
  wasm_memory_threshold: fromNullable(params.wasm_memory_threshold),
  canister_ids: params.canister_ids,
  reserved_cycles_limit: fromNullable(params.reserved_cycles_limit),
  log_visibility: fromNullable(params.log_visibility),
  wasm_memory_limit: fromNullable(params.wasm_memory_limit),
  memory_allocation: fromNullable(params.memory_allocation),
  compute_allocation: fromNullable(params.compute_allocation),
});

const convertExecuteExtensionOperation = (
  params: ExecuteExtensionOperationCandid,
): ExecuteExtensionOperation => ({
  extension_canister_id: fromNullable(params.extension_canister_id),
  operation_name: fromNullable(params.operation_name),
  operation_arg: convertExtensionOperationArg(
    fromNullable(params.operation_arg),
  ),
});

const convertUpgradeExtension = (
  params: UpgradeExtensionCandid,
): UpgradeExtension => ({
  extension_canister_id: fromNullable(params.extension_canister_id),
  wasm: convertWasm(fromNullable(params.wasm)),
  canister_upgrade_arg: convertExtensionUpgradeArg(
    fromNullable(params.canister_upgrade_arg),
  ),
});

const convertChunkedCanisterWasm = (
  params: ChunkedCanisterWasmCandid,
): ChunkedCanisterWasm => ({
  wasm_module_hash: params.wasm_module_hash,
  store_canister_id: fromNullable(params.store_canister_id),
  chunk_hashes_list: params.chunk_hashes_list,
});

const convertExtensionOperationArg = (
  params: ExtensionOperationArgCandid | undefined,
): ExtensionOperationArg | undefined =>
  convertExtensionArg(params) as ExtensionOperationArg | undefined;

const convertExtensionUpgradeArg = (
  params: ExtensionUpgradeArgCandid | undefined,
): ExtensionUpgradeArg | undefined =>
  convertExtensionArg(params) as ExtensionUpgradeArg | undefined;

const convertExtensionArg = (
  params: ExtensionOperationArgCandid | ExtensionUpgradeArgCandid | undefined,
):
  | {
      value: PreciseValue | undefined;
    }
  | undefined => {
  if (params === undefined) {
    return undefined;
  }

  const preciseValue = fromNullable(params.value);

  return {
    value:
      preciseValue === undefined
        ? undefined
        : convertPreciseValue(preciseValue),
  };
};

const convertPreciseValue = (value: PreciseValueCandid): PreciseValue => {
  if ("Int" in value) {
    return { Int: value.Int };
  }

  if ("Nat" in value) {
    return { Nat: value.Nat };
  }

  if ("Blob" in value) {
    return { Blob: value.Blob };
  }

  if ("Bool" in value) {
    return { Bool: value.Bool };
  }

  if ("Text" in value) {
    return { Text: value.Text };
  }

  if ("Array" in value) {
    return {
      Array: value.Array.map(convertPreciseValue),
    };
  }

  if ("Map" in value) {
    return {
      Map: value.Map.map(([key, val]) => [key, convertPreciseValue(val)]),
    };
  }

  assertNever(
    value,
    `Unknown PreciseValue ${JSON.stringify(value, jsonReplacer)}`,
  );
};

const convertWasm = (params: WasmCandid | undefined): Wasm | undefined => {
  if (params === undefined) {
    return undefined;
  }

  if ("Chunked" in params) {
    return {
      Chunked: convertChunkedCanisterWasm(params.Chunked),
    };
  }

  if ("Bytes" in params) {
    return { Bytes: params.Bytes };
  }

  assertNever(
    params,
    `Unknown Wasm type ${JSON.stringify(params, jsonReplacer)}`,
  );
};

const convertUpgradeSnsControlledCanister = (
  params: UpgradeSnsControlledCanisterCandid,
): UpgradeSnsControlledCanister => ({
  new_canister_wasm: params.new_canister_wasm,
  chunked_canister_wasm:
    params.chunked_canister_wasm?.[0] !== undefined
      ? convertChunkedCanisterWasm(params.chunked_canister_wasm[0])
      : undefined,
  canister_id: fromNullable(params.canister_id),
  canister_upgrade_arg: fromNullable(params.canister_upgrade_arg),
  mode: fromNullable(params.mode),
});

const convertTransferSnsTreasuryFunds = (
  params: TransferSnsTreasuryFundsCandid,
): TransferSnsTreasuryFunds => ({
  from_treasury: params.from_treasury,
  to_principal: fromNullable(params.to_principal),
  to_subaccount: fromNullable(params.to_subaccount),
  memo: fromNullable(params.memo),
  amount_e8s: params.amount_e8s,
});

const convertMintSnsTokens = (params: MintSnsTokensCandid): MintSnsTokens => ({
  to_principal: fromNullable(params.to_principal),
  to_subaccount: fromNullable(params.to_subaccount),
  memo: fromNullable(params.memo),
  amount_e8s: fromNullable(params.amount_e8s),
});

const convertSnsVersion = (
  params: SnsVersionCandid | undefined,
): SnsVersion | undefined => {
  if (params === undefined) {
    return undefined;
  }

  return {
    archive_wasm_hash: fromNullable(params.archive_wasm_hash),
    root_wasm_hash: fromNullable(params.root_wasm_hash),
    swap_wasm_hash: fromNullable(params.swap_wasm_hash),
    ledger_wasm_hash: fromNullable(params.ledger_wasm_hash),
    governance_wasm_hash: fromNullable(params.governance_wasm_hash),
    index_wasm_hash: fromNullable(params.index_wasm_hash),
  };
};

const convertGenericNervousSystemFunction = (
  params: GenericNervousSystemFunctionCandid,
): GenericNervousSystemFunction => ({
  validator_canister_id: fromNullable(params.validator_canister_id),
  target_canister_id: fromNullable(params.target_canister_id),
  validator_method_name: fromNullable(params.validator_method_name),
  target_method_name: fromNullable(params.target_method_name),
  topic: fromNullable(params.topic),
});

const convertFunctionType = (
  params: FunctionTypeCandid | undefined,
): FunctionType | undefined => {
  if (params === undefined) {
    return undefined;
  }

  if ("NativeNervousSystemFunction" in params) {
    return { NativeNervousSystemFunction: params.NativeNervousSystemFunction };
  }

  if ("GenericNervousSystemFunction" in params) {
    return {
      GenericNervousSystemFunction: convertGenericNervousSystemFunction(
        params.GenericNervousSystemFunction,
      ),
    };
  }

  assertNever(params, `Unknown FunctionType ${JSON.stringify(params)}`);
};

const convertNervousSystemFunction = (
  params: NervousSystemFunctionCandid,
): NervousSystemFunction => ({
  id: params.id,
  name: params.name,
  description: fromNullable(params.description),
  function_type: convertFunctionType(fromNullable(params.function_type)),
});

const convertVotingRewardsParameters = (
  params: VotingRewardsParametersCandid | undefined,
): VotingRewardsParameters | undefined =>
  params && {
    final_reward_rate_basis_points: fromNullable(
      params.final_reward_rate_basis_points,
    ),
    initial_reward_rate_basis_points: fromNullable(
      params.initial_reward_rate_basis_points,
    ),
    reward_rate_transition_duration_seconds: fromNullable(
      params.reward_rate_transition_duration_seconds,
    ),
    round_duration_seconds: fromNullable(params.round_duration_seconds),
  };

const convertNervousSystemParams = (
  params: NervousSystemParametersCandid,
): NervousSystemParameters => ({
  default_followees: fromNullable(params.default_followees),
  max_dissolve_delay_seconds: fromNullable(params.max_dissolve_delay_seconds),
  max_dissolve_delay_bonus_percentage: fromNullable(
    params.max_dissolve_delay_bonus_percentage,
  ),
  max_followees_per_function: fromNullable(params.max_followees_per_function),
  neuron_claimer_permissions: fromNullable(params.neuron_claimer_permissions),
  neuron_minimum_stake_e8s: fromNullable(params.neuron_minimum_stake_e8s),
  max_neuron_age_for_age_bonus: fromNullable(
    params.max_neuron_age_for_age_bonus,
  ),
  initial_voting_period_seconds: fromNullable(
    params.initial_voting_period_seconds,
  ),
  neuron_minimum_dissolve_delay_to_vote_seconds: fromNullable(
    params.neuron_minimum_dissolve_delay_to_vote_seconds,
  ),
  reject_cost_e8s: fromNullable(params.reject_cost_e8s),
  max_proposals_to_keep_per_action: fromNullable(
    params.max_proposals_to_keep_per_action,
  ),
  wait_for_quiet_deadline_increase_seconds: fromNullable(
    params.wait_for_quiet_deadline_increase_seconds,
  ),
  max_number_of_neurons: fromNullable(params.max_number_of_neurons),
  transaction_fee_e8s: fromNullable(params.transaction_fee_e8s),
  max_number_of_proposals_with_ballots: fromNullable(
    params.max_number_of_proposals_with_ballots,
  ),
  max_age_bonus_percentage: fromNullable(params.max_age_bonus_percentage),
  neuron_grantable_permissions: fromNullable(
    params.neuron_grantable_permissions,
  ),
  voting_rewards_parameters: convertVotingRewardsParameters(
    fromNullable(params.voting_rewards_parameters),
  ),
  max_number_of_principals_per_neuron: fromNullable(
    params.max_number_of_principals_per_neuron,
  ),
  automatically_advance_target_version: fromNullable(
    params.automatically_advance_target_version,
  ),
});

const convertRegisterExtension = (
  params: RegisterExtensionCandid,
): RegisterExtension => ({
  chunked_canister_wasm:
    params.chunked_canister_wasm?.[0] !== undefined
      ? convertChunkedCanisterWasm(params.chunked_canister_wasm[0])
      : undefined,
  extension_init: fromNullable(params.extension_init),
});
