import type { QueryParams } from "@dfinity/utils";
import type { IcrcIndexDid, IcrcLedgerDid } from "../../../declarations";
import type { IcrcAccount } from "./ledger.responses";

export type GetIndexAccountTransactionsParams = {
  max_results: bigint;
  start?: IcrcIndexDid.BlockIndex;
  account: IcrcAccount;
} & QueryParams;

export type ListSubaccountsParams = {
  start?: IcrcLedgerDid.Subaccount;
} & Pick<IcrcAccount, "owner"> &
  QueryParams;
