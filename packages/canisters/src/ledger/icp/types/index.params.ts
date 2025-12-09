import type { QueryParams } from "@dfinity/utils";
import type { AccountIdentifierParam } from "./ledger.params";

export type GetTransactionsParams = {
  maxResults: bigint;
  start?: bigint;
  accountIdentifier: AccountIdentifierParam;
} & QueryParams;
