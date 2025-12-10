import type {
  IcrcIndexNgDid,
  IcrcLedgerDid,
} from "@icp-sdk/canisters/ledger/icrc";

export type Icrc3Value = IcrcLedgerDid.ICRC3Value;
export type IcrcAllowance = IcrcLedgerDid.Allowance;
export type IcrcApproveError = IcrcLedgerDid.ApproveError;
export type IcrcBlockIndex = IcrcLedgerDid.BlockIndex;
export type IcrcCandidAccount = IcrcLedgerDid.Account;
export type IcrcGetBlocksArgs = IcrcLedgerDid.GetBlocksArgs;
export type IcrcGetBlocksResult = IcrcLedgerDid.GetBlocksResult;
export type IcrcStandardRecord = IcrcLedgerDid.StandardRecord;
export type IcrcSubaccount = IcrcLedgerDid.Subaccount;
export type IcrcTimestamp = IcrcLedgerDid.Timestamp;
export type IcrcTokens = IcrcLedgerDid.Tokens;
export type IcrcTransferArg = IcrcLedgerDid.TransferArg;
export type IcrcTransferFromError = IcrcLedgerDid.TransferFromError;
export type IcrcTransferVariantError = IcrcLedgerDid.TransferError;
export type IcrcValue = IcrcLedgerDid.Value;

export type IcrcIndexNgGetTransactions = IcrcIndexNgDid.GetTransactions;
export type IcrcIndexNgTransaction = IcrcIndexNgDid.Transaction;
export type IcrcIndexNgTransactionWithId = IcrcIndexNgDid.TransactionWithId;
export type IcrcNgStatus = IcrcIndexNgDid.Status;
export type IcrcNgTxId = IcrcIndexNgDid.BlockIndex;

/**
 * @deprecated Use "@icp-sdk/canisters/ledger/icrc" directly instead
 */
export * from "@icp-sdk/canisters/ledger/icrc";
