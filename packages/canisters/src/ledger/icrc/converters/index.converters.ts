import { toNullable } from "@dfinity/utils";
import type { IcrcIndexNgDid } from "../../../declarations";
import type {
  GetIndexNgAccountTransactionsParams,
  ListSubaccountsParams,
} from "../types/index-ng.params";
import { toCandidAccount } from "./converters";

export const toGetTransactionsArgs = ({
  account,
  max_results,
  start,
}: Omit<
  GetIndexNgAccountTransactionsParams,
  "certified"
>): IcrcIndexNgDid.GetAccountTransactionsArgs => ({
  account: toCandidAccount(account),
  max_results,
  start: toNullable(start),
});

export const toListSubaccountsParams = ({
  owner,
  start,
}: ListSubaccountsParams): IcrcIndexNgDid.ListSubaccountsArgs => ({
  owner,
  start: toNullable(start),
});
