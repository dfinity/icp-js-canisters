import type { QueryParams } from "@dfinity/utils";
import type { IcrcIndexNgDid, IcrcLedgerDid } from "../../../declarations";
import type { IcrcAccount } from "./ledger.responses";

export type GetIndexNgAccountTransactionsParams = {
  max_results: bigint;
  start?: IcrcIndexNgDid.BlockIndex;
  account: IcrcAccount;
} & QueryParams;

export type ListSubaccountsParams = {
  start?: IcrcLedgerDid.Subaccount;
} & Pick<IcrcAccount, "owner"> &
  QueryParams;
