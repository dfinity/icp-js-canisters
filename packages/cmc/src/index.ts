import type { CmcDid } from "@icp-sdk/canisters/cmc";

export type Cycles = CmcDid.Cycles;
export type NotifyCreateCanisterArg = CmcDid.NotifyCreateCanisterArg;
export type NotifyTopUpArg = CmcDid.NotifyTopUpArg;
export type SubnetTypesToSubnetsResponse = CmcDid.SubnetTypesToSubnetsResponse;

/**
 * @deprecated Use "@icp-sdk/canisters/cmc" directly instead
 */
export * from "@icp-sdk/canisters/cmc";

/**
 * Legacy re-export for backward compatibility.
 * @deprecated Use "@icp-sdk/canisters/cmc" directly instead
 */
export {
  CmcCanister as CMCCanister,
  CmcError as CMCError,
} from "@icp-sdk/canisters/cmc";
