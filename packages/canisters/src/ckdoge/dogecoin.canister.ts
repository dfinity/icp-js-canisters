import { Canister, createServices } from "@dfinity/utils";
import {
  idlFactoryCertifiedDogecoin,
  idlFactoryDogecoin,
  type DogecoinDid,
  type DogecoinService,
} from "../declarations";
import type { CkDogeCanisterOptions } from "./types/canister.options";
import {
  toGetBalanceParams,
  toGetUtxosParams,
  type GetBalanceParams,
  type GetUtxosParams,
} from "./types/dogecoin.params";

export class DogecoinCanister extends Canister<DogecoinService> {
  static create(options: CkDogeCanisterOptions<DogecoinService>) {
    const { service, certifiedService, canisterId } =
      createServices<DogecoinService>({
        options,
        idlFactory: idlFactoryDogecoin,
        certifiedIdlFactory: idlFactoryCertifiedDogecoin,
      });

    return new DogecoinCanister(canisterId, service, certifiedService);
  }

  /**
   * Given a `get_utxos_request`, which must specify a Dogecoin address and a Dogecoin network (`mainnet` or `regtest`), the function returns all unspent transaction outputs (UTXOs) associated with the provided address in the specified Dogecoin network based on the current view of the Dogecoin blockchain available to the Dogecoin component.
   *
   * ⚠️ Note that this method does not support certified calls because only canisters are allowed to get UTXOs via update calls.
   *
   *
   * @param {Object} params
   * @param {DogecoinNetwork} params.network Regtest or mainnet.
   * @param {Object} params.filter The optional filter parameter can be used to restrict the set of returned UTXOs, either providing a minimum number of confirmations or a page reference when pagination is used for addresses with many UTXOs.
   * @param {string} params.address A Dogecoin address.
   * @returns {Promise<get_utxos_response>} The UTXOs are returned sorted by block height in descending order.
   */
  getUtxosQuery = ({
    ...params
  }: GetUtxosParams): Promise<DogecoinDid.get_utxos_response> => {
    const { dogecoin_get_utxos_query } = this.caller({
      certified: false,
    });
    return dogecoin_get_utxos_query(toGetUtxosParams(params));
  };

  /**
   * Given a `get_balance_request`, which must specify a Dogecoin address and a Dogecoin network (`mainnet` or `regtest`), the function returns the current balance of this address in `koinu` (10^8 koinu = 1 Dogecoin) in the specified Dogecoin network.
   *
   * ⚠️ Note that this method does not support certified calls because only canisters are allowed to get Dogecoin balance via update calls.
   *
   * @param {Object} params
   * @param {DogecoinNetwork} params.network Regtest or mainnet.
   * @param {Object} params.min_confirmations The optional filter parameter can be used to limit the set of considered UTXOs for the calculation of the balance to those with at least the provided number of confirmations in the same manner as for the `dogecoin_get_utxos` call.
   * @param {string} params.address A Dogecoin address.
   * @returns {Promise<koinu>} The balance is returned in `koinu` (10^8 koinu = 1 Dogecoin).
   */
  getBalanceQuery = ({
    ...params
  }: GetBalanceParams): Promise<DogecoinDid.koinu> => {
    const { dogecoin_get_balance_query } = this.caller({
      certified: false,
    });
    return dogecoin_get_balance_query(toGetBalanceParams(params));
  };
}
