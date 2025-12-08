import { Canister, createServices } from "@dfinity/utils";
import type {
  _SERVICE as BitcoinService,
  get_utxos_response,
  satoshi,
} from "../declarations/ckbtc/bitcoin";
import { idlFactory as certifiedIdlFactory } from "../declarations/ckbtc/bitcoin.certified.idl";
import { idlFactory } from "../declarations/ckbtc/bitcoin.idl";
import {
  toGetBalanceParams,
  toGetUtxosParams,
  type GetBalanceParams,
  type GetUtxosParams,
} from "./types/bitcoin.params";
import type { CkBtcCanisterOptions } from "./types/canister.options";

export class BitcoinCanister extends Canister<BitcoinService> {
  static create(options: CkBtcCanisterOptions<BitcoinService>) {
    const { service, certifiedService, canisterId } =
      createServices<BitcoinService>({
        options,
        idlFactory,
        certifiedIdlFactory,
      });

    return new BitcoinCanister(canisterId, service, certifiedService);
  }

  /**
   * Given a `get_utxos_request`, which must specify a Bitcoin address and a Bitcoin network (`mainnet`, `testnet` or `regtest`), the function returns all unspent transaction outputs (UTXOs) associated with the provided address in the specified Bitcoin network based on the current view of the Bitcoin blockchain available to the Bitcoin component.
   *
   * ⚠️ Note that this method does not support certified calls because only canisters are allowed to get UTXOs via update calls.
   *
   * @link https://internetcomputer.org/docs/current/references/ic-interface-spec#ic-bitcoin_get_utxos
   *
   * @param {Object} params
   * @param {BitcoinNetwork} params.network Tesnet or mainnet.
   * @param {Object} params.filter The optional filter parameter can be used to restrict the set of returned UTXOs, either providing a minimum number of confirmations or a page reference when pagination is used for addresses with many UTXOs.
   * @param {string} params.address A Bitcoin address.
   * @returns {Promise<bitcoin_get_utxos_result>} The UTXOs are returned sorted by block height in descending order.
   */
  getUtxosQuery = ({
    ...params
  }: GetUtxosParams): Promise<get_utxos_response> => {
    const { bitcoin_get_utxos_query } = this.caller({
      certified: false,
    });
    return bitcoin_get_utxos_query(toGetUtxosParams(params));
  };

  /**
   * Given a `get_balance_request`, which must specify a Bitcoin address and a Bitcoin network (`mainnet`, `testnet` or `regtest`), the function returns the current balance of this address in `Satoshi` (10^8 Satoshi = 1 Bitcoin) in the specified Bitcoin network.
   *
   * ⚠️ Note that this method does not support certified calls because only canisters are allowed to get Bitcoin balance via update calls.
   *
   * @link https://internetcomputer.org/docs/current/references/ic-interface-spec#ic-bitcoin_get_balance
   *
   * @param {Object} params
   * @param {BitcoinNetwork} params.network Tesnet or mainnet.
   * @param {Object} params.min_confirmations The optional filter parameter can be used to limit the set of considered UTXOs for the calculation of the balance to those with at least the provided number of confirmations in the same manner as for the `bitcoin_get_utxos` call.
   * @param {string} params.address A Bitcoin address.
   * @returns {Promise<satoshi>} The balance is returned in `Satoshi` (10^8 Satoshi = 1 Bitcoin).
   */
  getBalanceQuery = ({ ...params }: GetBalanceParams): Promise<satoshi> => {
    const { bitcoin_get_balance_query } = this.caller({
      certified: false,
    });
    return bitcoin_get_balance_query(toGetBalanceParams(params));
  };
}
