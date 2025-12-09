import { AccountIdentifier } from "../account_identifier";
import type { AccountIdentifierHex } from "../types/common";
import type { AccountIdentifierParam } from "../types/ledger.params";

export const paramToAccountIdentifier = (
  param: AccountIdentifierParam,
): AccountIdentifier =>
  param instanceof AccountIdentifier ? param : AccountIdentifier.fromHex(param);

export const paramToAccountIdentifierHex = (
  param: AccountIdentifierParam,
): AccountIdentifierHex =>
  param instanceof AccountIdentifier ? param.toHex() : param;
