import { Canister, toNullable } from "@dfinity/utils";
import type { IcrcLedgerDid } from "../../declarations";
import type { IcrcCanisterService } from "./types/canister.types";
import type { BalanceParams } from "./types/ledger.params";

export abstract class IcrcCanister<
  T extends IcrcCanisterService,
> extends Canister<T> {
  /**
   * Returns the balance for a given account provided as owner and with optional subaccount.
   *
   * @param {BalanceParams} params The parameters to get the balance of an account.
   * @returns {Promise<Tokens>} The balance of the given account.
   */
  balance = (params: BalanceParams): Promise<IcrcLedgerDid.Tokens> =>
    this.caller({ certified: params.certified }).icrc1_balance_of({
      owner: params.owner,
      subaccount: toNullable(params.subaccount),
    });
}
