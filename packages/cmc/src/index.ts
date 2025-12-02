/**
 * @module api/cmc
 */

import type {CmcDid} from "@icp-sdk/canisters/cmc";

export type Cycles = CmcDid.Cycles;
export type NotifyCreateCanisterArg = CmcDid.NotifyCreateCanisterArg;
export type NotifyTopUpArg = CmcDid.NotifyTopUpArg;
export type SubnetTypesToSubnetsResponse = CmcDid.SubnetTypesToSubnetsResponse;

export { CMCCanister } from "@icp-sdk/canisters/cmc";
export {
  RefundedError,
  InvalidaTransactionError,
  CMCError,
  ProcessingError,
  TransactionTooOldError,
  throwNotifyError
} from "@icp-sdk/canisters/cmc";