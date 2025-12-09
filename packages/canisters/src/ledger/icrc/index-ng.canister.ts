import { createServices, type QueryParams } from "@dfinity/utils";
import type { Principal } from "@icp-sdk/core/principal";
import type { SubAccount } from "../../declarations/ledger-icrc/icrc_index";
import type {
  GetTransactions,
  _SERVICE as IcrcIndexNgService,
  Status,
} from "../../declarations/ledger-icrc/icrc_index-ng";
import { idlFactory as certifiedIdlFactory } from "../../declarations/ledger-icrc/icrc_index-ng.certified.idl";
import { idlFactory } from "../../declarations/ledger-icrc/icrc_index-ng.idl";
import { IcrcCanister } from "./canister";
import {
  toGetTransactionsArgs,
  toListSubaccountsParams,
} from "./converters/index.converters";
import { IndexError } from "./errors/index.errors";
import type { IcrcLedgerCanisterOptions } from "./types/canister.options";
import type {
  GetIndexNgAccountTransactionsParams,
  ListSubaccountsParams,
} from "./types/index-ng.params";

export class IcrcIndexNgCanister extends IcrcCanister<IcrcIndexNgService> {
  static create(options: IcrcLedgerCanisterOptions<IcrcIndexNgService>) {
    const { service, certifiedService, canisterId } =
      createServices<IcrcIndexNgService>({
        options,
        idlFactory,
        certifiedIdlFactory,
      });

    return new IcrcIndexNgCanister(canisterId, service, certifiedService);
  }

  /**
   * Get the transactions of an account
   *
   * Always certified.
   * `get_account_transactions` needs to be called with an update
   * because the index canisters makes a call to the ledger canister to get the transaction data.
   * Index Canister only holds the transactions ids in state, not the whole transaction data.
   */
  /**
   * Get the transactions of an account.
   *
   * @param {GetAccountTransactionsParams} params The parameters to get the transactions of an account.
   * @returns {Promise<GetTransactions>} The list of transactions and further related information of the given account.
   */
  getTransactions = async ({
    certified,
    ...rest
  }: GetIndexNgAccountTransactionsParams): Promise<GetTransactions> => {
    const response = await this.caller({
      certified,
    }).get_account_transactions(toGetTransactionsArgs(rest));

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

  /**
   * Returns the status of the index canister.
   *
   * @param {QueryParams} params The parameters to get the status of the index canister.
   * @returns {Promise<Status>} The status of the index canister.
   */
  status = (params: QueryParams): Promise<Status> =>
    this.caller(params).status();

  /**
   * Returns the list of subaccounts for a given owner.
   *
   * @param {ListSubaccountsParams} params The parameters to get the list of subaccounts.
   * @returns {Promise<Array<SubAccount>>} The list of subaccounts.
   */
  listSubaccounts = ({
    certified,
    ...rest
  }: ListSubaccountsParams): Promise<Array<SubAccount>> =>
    this.caller({ certified }).list_subaccounts(toListSubaccountsParams(rest));
}
