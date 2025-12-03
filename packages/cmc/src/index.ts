/**
 * @module api/cmc
 */

import type { CmcDid } from "@icp-sdk/canisters/cmc";

export type Cycles = CmcDid.Cycles;
export type NotifyCreateCanisterArg = CmcDid.NotifyCreateCanisterArg;
export type NotifyTopUpArg = CmcDid.NotifyTopUpArg;
export type SubnetTypesToSubnetsResponse = CmcDid.SubnetTypesToSubnetsResponse;

export * from "@icp-sdk/canisters/cmc";
