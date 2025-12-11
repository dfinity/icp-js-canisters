import { toNullable } from "@dfinity/utils";
import type { IcrcIndexDid } from "../../../declarations";
import type {
  GetIndexAccountTransactionsParams,
  ListSubaccountsParams,
} from "../types/index-ng.params";
import { toCandidAccount } from "./converters";

export const toGetTransactionsArgs = ({
  account,
  max_results,
  start,
}: Omit<
  GetIndexAccountTransactionsParams,
  "certified"
>): IcrcIndexDid.GetAccountTransactionsArgs => ({
  account: toCandidAccount(account),
  max_results,
  start: toNullable(start),
});

export const toListSubaccountsParams = ({
  owner,
  start,
}: ListSubaccountsParams): IcrcIndexDid.ListSubaccountsArgs => ({
  owner,
  start: toNullable(start),
});
