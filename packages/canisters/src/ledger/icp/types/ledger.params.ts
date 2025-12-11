import type { QueryParams } from "@dfinity/utils";
import type { AccountIdentifier } from "../account_identifier";
import type { AccountIdentifierHex } from "./common";

export type AccountIdentifierParam = AccountIdentifier | AccountIdentifierHex;

export type AccountBalanceParams = {
  accountIdentifier: AccountIdentifierParam;
} & QueryParams;
