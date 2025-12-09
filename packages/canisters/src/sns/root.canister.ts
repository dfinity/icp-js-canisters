import { Canister, createServices } from "@dfinity/utils";
import type {
  ListSnsCanistersResponse,
  _SERVICE as SnsRootService,
} from "../declarations/sns/root";
import { idlFactory as certifiedIdlFactory } from "../declarations/sns/root.certified.idl";
import { idlFactory } from "../declarations/sns/root.idl";
import type { SnsCanisterOptions } from "./types/canister.options";

export class SnsRootCanister extends Canister<SnsRootService> {
  static create(options: SnsCanisterOptions<SnsRootService>) {
    const { service, certifiedService, canisterId } =
      createServices<SnsRootService>({
        options,
        idlFactory,
        certifiedIdlFactory,
      });

    return new SnsRootCanister(canisterId, service, certifiedService);
  }

  /**
   * List the canisters that are part of the Sns.
   *
   * Source code: https://github.com/dfinity/ic/blob/master/rs/sns/root/src/lib.rs
   *
   * @param {Object} params
   * @param {boolean} [params.certified=true] - Query or update calls
   *
   * @returns {ListSnsCanistersResponse} - A list of canisters ('root' | 'governance' | 'ledger' | 'dapps' | 'swap' | 'archives')
   */
  listSnsCanisters = ({
    certified = true,
  }: {
    certified?: boolean;
  }): Promise<ListSnsCanistersResponse> =>
    this.caller({ certified }).list_sns_canisters({});
}
