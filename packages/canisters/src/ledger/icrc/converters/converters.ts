import { fromNullable, nonNullish, toNullable } from "@dfinity/utils";
import type { IcrcLedgerDid } from "../../../declarations";
import type { IcrcAccount } from "../types/ledger.responses";

/**
 * Converts a Candid Account object to an IcrcAccount, effectively transforming nullable properties into nullish ones.
 *
 * @param {Account} - The Candid Account object to convert.
 * @return {IcrcAccount} - The converted IcrcAccount object.
 */
export const fromCandidAccount = ({
  owner,
  subaccount: nullableSubaccount,
}: IcrcLedgerDid.Account): IcrcAccount => {
  const subaccount = fromNullable(nullableSubaccount);

  return {
    owner,
    ...(nonNullish(subaccount) ? { subaccount } : {}),
  };
};

/**
 * Converts an IcrcAccount to a Candid Account object, effectively transforming nullish properties into nullable ones.
 *
 * @param {IcrcAccount} - The IcrcAccount object to convert.
 * @return {Account} - The converted Candid Account object.
 */
export const toCandidAccount = ({
  owner,
  subaccount,
}: IcrcAccount): IcrcLedgerDid.Account => ({
  owner,
  subaccount: toNullable(subaccount),
});
