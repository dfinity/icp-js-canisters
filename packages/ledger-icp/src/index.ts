// Reexport * because we cannot do otherwise for backwards compatibility as the all DID types of the index were exposed
export type * from "@icp-sdk/canisters/ledger/icp";

import type { IcpLedgerDid } from "@icp-sdk/canisters/ledger/icp";

export type Icrc1Account = IcpLedgerDid.Account;
export type Icrc1ApproveError = IcpLedgerDid.ApproveError;
export type Icrc1BlockIndex = IcpLedgerDid.Icrc1BlockIndex;
export type Icrc1SubAccount = IcpLedgerDid.SubAccount;
export type Icrc1Timestamp = IcpLedgerDid.Icrc1Timestamp;
export type Icrc1Tokens = IcpLedgerDid.Icrc1Tokens;
export type Icrc1TransferError = IcpLedgerDid.Icrc1TransferError;
export type Icrc1TransferResult = IcpLedgerDid.Icrc1TransferResult;
export type Icrc2ApproveResult = IcpLedgerDid.ApproveResult;
export type Icrc2TransferFromError = IcpLedgerDid.TransferFromError;
export type Icrc2TransferFromResult = IcpLedgerDid.TransferFromResult;
export type Value = IcpLedgerDid.Value;

/**
 * @deprecated Use "@icp-sdk/canisters/ledger/icp" directly instead
 */
export * from "@icp-sdk/canisters/ledger/icp";
