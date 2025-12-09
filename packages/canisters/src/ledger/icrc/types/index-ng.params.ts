import type { QueryParams } from "@dfinity/utils";
import type { Subaccount } from "../../../declarations/ledger-icrc/icrc_ledger";
import type { IcrcNgTxId } from "./index-ng.types";
import type { IcrcAccount } from "./ledger.responses";

export type GetIndexNgAccountTransactionsParams = {
  max_results: bigint;
  start?: IcrcNgTxId;
  account: IcrcAccount;
} & QueryParams;

export type ListSubaccountsParams = {
  start?: Subaccount;
} & Pick<IcrcAccount, "owner"> &
  QueryParams;
