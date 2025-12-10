import type { NnsGovernanceDid, SnsWasmDid } from "@icp-sdk/canisters/nns";

export type RewardEvent = NnsGovernanceDid.RewardEvent;
export type DeployedSns = SnsWasmDid.DeployedSns;

/**
 * @deprecated Use "@icp-sdk/canisters/nns" directly instead
 */
export * from "@icp-sdk/canisters/nns";

/**
 * Legacy re-export for backward compatibility.
 * @deprecated Use "@icp-sdk/canisters/nns" directly instead
 */
export {
  NnsGenesisTokenCanister as GenesisTokenCanister,
  NnsGovernanceCanister as GovernanceCanister,
  NnsGovernanceTestCanister as GovernanceTestCanister,
  type NnsGovernanceCanisterOptions as GovernanceCanisterOptions,
} from "@icp-sdk/canisters/nns";