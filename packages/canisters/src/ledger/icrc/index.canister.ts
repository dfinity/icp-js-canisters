import { Canister, createServices, type QueryParams } from "@dfinity/utils";
import type { Principal } from "@icp-sdk/core/principal";
import {
  type IcrcIndexDid,
  type IcrcIndexService,
  idlFactoryCertifiedIcrcIndex,
  idlFactoryIcrcIndex,
} from "../../declarations";
import { toGetTransactionsArgs } from "./converters/index.converters";
import { IndexError } from "./errors/index.errors";
import type { IcrcLedgerCanisterOptions } from "./types/canister.options";
import type { GetAccountTransactionsParams } from "./types/index.params";

export class IcrcIndexCanister extends Canister<IcrcIndexService> {
  static create(options: IcrcLedgerCanisterOptions<IcrcIndexService>) {
    const { service, certifiedService, canisterId } =
      createServices<IcrcIndexService>({
        options,
        idlFactory: idlFactoryIcrcIndex,
        certifiedIdlFactory: idlFactoryCertifiedIcrcIndex,
      });

    return new IcrcIndexCanister(canisterId, service, certifiedService);
  }

  /**
   * Get the transactions of an account
   *
   * Always certified.
   * `get_account_transactions` needs to be called with an update
   * because the index canisters makes a call to the ledger canister to get the transaction data.
   * Index Canister only holds the transactions ids in state, not the whole transaction data.
   */
  getTransactions = async (
    params: GetAccountTransactionsParams,
  ): Promise<IcrcIndexDid.GetTransactions> => {
    const response = await this.caller({
      certified: true,
    }).get_account_transactions(toGetTransactionsArgs(params));

    if ("Err" in response) {
      throw new IndexError(response.Err.message);
    }

    return response.Ok;
  };

  /**
   * Returns the ledger canister ID related to the index canister.
   */
  ledgerId = (params: QueryParams): Promise<Principal> => {
    const { ledger_id } = this.caller(params);
    return ledger_id();
  };
}
