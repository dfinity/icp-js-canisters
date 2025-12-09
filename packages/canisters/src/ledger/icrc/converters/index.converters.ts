import { toNullable } from "@dfinity/utils";
import type { GetAccountTransactionsArgs } from "../../../declarations/ledger-icrc/icrc_index";
import type { ListSubaccountsArgs } from "../../../declarations/ledger-icrc/icrc_index-ng";
import type { ListSubaccountsParams } from "../types/index-ng.params";
import type { GetAccountTransactionsParams } from "../types/index.params";
import { toCandidAccount } from "./converters";

export const toGetTransactionsArgs = ({
  account,
  max_results,
  start,
}: GetAccountTransactionsParams): GetAccountTransactionsArgs => ({
  account: toCandidAccount(account),
  max_results,
  start: toNullable(start),
});

export const toListSubaccountsParams = ({
  owner,
  start,
}: ListSubaccountsParams): ListSubaccountsArgs => ({
  owner,
  start: toNullable(start),
});
