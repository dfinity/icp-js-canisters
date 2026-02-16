import type { Principal } from "@icp-sdk/core/principal";
import type { SnsGovernanceDid } from "../../declarations";
import type { Option } from "./common";

export type Action =
  | {
      ManageNervousSystemParameters: NervousSystemParameters;
    }
  | { AddGenericNervousSystemFunction: NervousSystemFunction }
  | { AdvanceSnsTargetVersion: AdvanceSnsTargetVersion }
  | { ExecuteExtensionOperation: ExecuteExtensionOperation }
  | { UpgradeExtension: UpgradeExtension }
  | { MintSnsTokens: MintSnsTokens }
  | { ManageLedgerParameters: ManageLedgerParameters }
  | { ManageDappCanisterSettings: ManageDappCanisterSettings }
  | { SetTopicsForCustomProposals: SetTopicsForCustomProposals }
  | { RemoveGenericNervousSystemFunction: bigint }
  | { UpgradeSnsToNextVersion: Record<string, never> }
  | { RegisterDappCanisters: SnsGovernanceDid.RegisterDappCanisters }
  | { RegisterExtension: RegisterExtension }
  | { TransferSnsTreasuryFunds: TransferSnsTreasuryFunds }
  | { UpgradeSnsControlledCanister: UpgradeSnsControlledCanister }
  | { DeregisterDappCanisters: SnsGovernanceDid.DeregisterDappCanisters }
  | { Unspecified: Record<string, never> }
  | { ManageSnsMetadata: ManageSnsMetadata }
  | {
      ExecuteGenericNervousSystemFunction: SnsGovernanceDid.ExecuteGenericNervousSystemFunction;
    }
  | { Motion: SnsGovernanceDid.Motion };

export interface NervousSystemParameters {
  default_followees: Option<SnsGovernanceDid.DefaultFollowees>;
  max_dissolve_delay_seconds: Option<bigint>;
  max_dissolve_delay_bonus_percentage: Option<bigint>;
  max_followees_per_function: Option<bigint>;
  neuron_claimer_permissions: Option<SnsGovernanceDid.NeuronPermissionList>;
  neuron_minimum_stake_e8s: Option<bigint>;
  max_neuron_age_for_age_bonus: Option<bigint>;
  initial_voting_period_seconds: Option<bigint>;
  neuron_minimum_dissolve_delay_to_vote_seconds: Option<bigint>;
  reject_cost_e8s: Option<bigint>;
  max_proposals_to_keep_per_action: Option<number>;
  wait_for_quiet_deadline_increase_seconds: Option<bigint>;
  max_number_of_neurons: Option<bigint>;
  transaction_fee_e8s: Option<bigint>;
  max_number_of_proposals_with_ballots: Option<bigint>;
  max_age_bonus_percentage: Option<bigint>;
  neuron_grantable_permissions: Option<SnsGovernanceDid.NeuronPermissionList>;
  voting_rewards_parameters: Option<VotingRewardsParameters>;
  max_number_of_principals_per_neuron: Option<bigint>;
  automatically_advance_target_version: Option<boolean>;
  custom_proposal_criticality: Option<SnsGovernanceDid.CustomProposalCriticality>;
}

export interface VotingRewardsParameters {
  final_reward_rate_basis_points: Option<bigint>;
  initial_reward_rate_basis_points: Option<bigint>;
  reward_rate_transition_duration_seconds: Option<bigint>;
  round_duration_seconds: Option<bigint>;
}

export interface NervousSystemFunction {
  id: bigint;
  name: string;
  description: Option<string>;
  function_type: Option<FunctionType>;
}

export interface SetTopicsForCustomProposals {
  custom_function_id_to_topic: Array<[bigint, SnsGovernanceDid.Topic]>;
}

export type FunctionType =
  | { NativeNervousSystemFunction: Record<string, never> }
  | { GenericNervousSystemFunction: GenericNervousSystemFunction };

export interface GenericNervousSystemFunction {
  validator_canister_id: Option<Principal>;
  target_canister_id: Option<Principal>;
  validator_method_name: Option<string>;
  target_method_name: Option<string>;
  topic: Option<SnsGovernanceDid.Topic>;
}

export interface ExecuteExtensionOperation {
  extension_canister_id: Option<Principal>;
  operation_name: Option<string>;
  operation_arg: Option<ExtensionOperationArg>;
}

export interface AdvanceSnsTargetVersion {
  new_target: Option<SnsVersion>;
}

export interface SnsVersion {
  archive_wasm_hash: Option<Uint8Array | number[]>;
  root_wasm_hash: Option<Uint8Array | number[]>;
  swap_wasm_hash: Option<Uint8Array | number[]>;
  ledger_wasm_hash: Option<Uint8Array | number[]>;
  governance_wasm_hash: Option<Uint8Array | number[]>;
  index_wasm_hash: Option<Uint8Array | number[]>;
}

export interface MintSnsTokens {
  to_principal: Option<Principal>;
  to_subaccount: Option<SnsGovernanceDid.Subaccount>;
  memo: Option<bigint>;
  amount_e8s: Option<bigint>;
}

export type PreciseValue =
  | { Int: bigint }
  | { Map: Array<[string, PreciseValue]> }
  | { Nat: bigint }
  | { Blob: Uint8Array | number[] }
  | { Bool: boolean }
  | { Text: string }
  | { Array: PreciseValue[] };

export interface ExtensionOperationArg {
  value: Option<PreciseValue>;
}

export type Wasm =
  | { Chunked: ChunkedCanisterWasm }
  | { Bytes: Uint8Array | number[] };

export interface UpgradeExtension {
  extension_canister_id: Option<Principal>;
  wasm: Option<Wasm>;
  canister_upgrade_arg: Option<ExtensionUpgradeArg>;
}

export interface ExtensionUpgradeArg {
  value: Option<PreciseValue>;
}

export interface ManageDappCanisterSettings {
  freezing_threshold: Option<bigint>;
  wasm_memory_threshold: Option<bigint>;
  canister_ids: Principal[];
  reserved_cycles_limit: Option<bigint>;
  log_visibility: Option<number>;
  wasm_memory_limit: Option<bigint>;
  memory_allocation: Option<bigint>;
  compute_allocation: Option<bigint>;
}

export interface ManageLedgerParameters {
  token_symbol: Option<string>;
  transfer_fee: Option<bigint>;
  token_logo: Option<string>;
  token_name: Option<string>;
}

export interface TransferSnsTreasuryFunds {
  from_treasury: number;
  to_principal: Option<Principal>;
  to_subaccount: Option<SnsGovernanceDid.Subaccount>;
  memo: Option<bigint>;
  amount_e8s: bigint;
}

export interface ChunkedCanisterWasm {
  wasm_module_hash: Uint8Array | number[];
  store_canister_id: Option<Principal>;
  chunk_hashes_list: Array<Uint8Array | number[]>;
}

export interface UpgradeSnsControlledCanister {
  new_canister_wasm: Uint8Array | number[];
  chunked_canister_wasm: Option<ChunkedCanisterWasm>;
  canister_id: Option<Principal>;
  canister_upgrade_arg: Option<Uint8Array | number[]>;
  mode: Option<number>;
}
export interface ManageSnsMetadata {
  url: Option<string>;
  logo: Option<string>;
  name: Option<string>;
  description: Option<string>;
}

export interface RegisterExtension {
  chunked_canister_wasm: Option<ChunkedCanisterWasm>;
  extension_init: Option<SnsGovernanceDid.ExtensionInit>;
}
