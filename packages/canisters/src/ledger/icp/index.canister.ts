import {
  Canister,
  createServices,
  toNullable,
  type CanisterOptions,
} from "@dfinity/utils";
import {
  idlFactoryCertifiedIcpIndex,
  idlFactoryIcpIndex,
  type IcpIndexDid,
  type IcpIndexService,
} from "../../declarations";
import { MAINNET_INDEX_CANISTER_ID } from "./constants/canister_ids";
import { IndexError } from "./errors/index.errors";
import type { GetTransactionsParams } from "./types/index.params";
import type { AccountBalanceParams } from "./types/ledger.params";
import { paramToAccountIdentifierHex } from "./utils/params.utils";

export class IndexCanister extends Canister<IcpIndexService> {
  static create({
    canisterId: optionsCanisterId,
    ...options
  }: CanisterOptions<IcpIndexService>) {
    const { service, certifiedService, canisterId } =
      createServices<IcpIndexService>({
        options: {
          ...options,
          canisterId: optionsCanisterId ?? MAINNET_INDEX_CANISTER_ID,
        },
        idlFactory: idlFactoryIcpIndex,
        certifiedIdlFactory: idlFactoryCertifiedIcpIndex,
      });

    return new IndexCanister(canisterId, service, certifiedService);
  }

  /**
   * Returns the balance of the specified account identifier.
   *
   * @param {AccountBalanceParams} params The parameters to get the balance of an account.
   * @param {AccountIdentifierParam} params.accountIdentifier The account identifier provided either as hex string or as an AccountIdentifier.
   * @param {boolean} params.certified query or update call.
   * @returns {Promise<bigint>} The balance of the given account.
   */
  accountBalance = ({
    certified,
    accountIdentifier,
  }: AccountBalanceParams): Promise<bigint> =>
    this.caller({ certified }).get_account_identifier_balance(
      paramToAccountIdentifierHex(accountIdentifier),
    );

  /**
   * Returns the transactions and balance of an ICP account.
   *
   * @param {GetTransactionsParams} params The parameters to get the transactions.
   * @param {boolean} params.certified query or update call.
   * @param {AccountIdentifierParam} params.accountIdentifier The account identifier provided either as hex string or as an AccountIdentifier.
   * @param {bigint} params.start If set then the results will start from the next most recent transaction id after start (start won't be included). If not provided, then the results will start from the most recent transaction id.
   * @param {bigint} params.maxResults Maximum number of transactions to fetch.
   * @returns {Promise<GetAccountIdentifierTransactionsResponse>} The transactions, balance and the transaction id of the oldest transaction the account has.
   * @throws {@link IndexError}
   */
  getTransactions = async ({
    certified,
    accountIdentifier,
    start,
    maxResults: max_results,
  }: GetTransactionsParams): Promise<IcpIndexDid.GetAccountIdentifierTransactionsResponse> => {
    const response = await this.caller({
      certified,
    }).get_account_identifier_transactions({
      account_identifier: paramToAccountIdentifierHex(accountIdentifier),
      start: toNullable(start),
      max_results,
    });

    if ("Err" in response) {
      throw new IndexError(response.Err.message);
    }

    return response.Ok;
  };
}
