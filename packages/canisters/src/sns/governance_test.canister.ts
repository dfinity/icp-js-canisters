import {
  Canister,
  createServices,
  fromNullable,
  isNullish,
  toNullable,
} from "@dfinity/utils";
import type {
  NeuronId,
  _SERVICE as SnsGovernanceTestService,
} from "../declarations/sns/governance_test";
import { idlFactory as certifiedIdlFactory } from "../declarations/sns/governance_test.certified.idl";
import { idlFactory } from "../declarations/sns/governance_test.idl";
import { SnsGovernanceError } from "./errors/governance.errors";
import type { SnsCanisterOptions } from "./types/canister.options";
import type { SnsAddMaturityParams } from "./types/governance_test.params";

export class SnsGovernanceTestCanister extends Canister<SnsGovernanceTestService> {
  /**
   * Instantiate a canister to interact with the governance of a Sns project.
   *
   * @param {SnsCanisterOptions} options Miscellaneous options to initialize the canister. Its ID being the only mandatory parammeter.
   */
  static create(options: SnsCanisterOptions<SnsGovernanceTestService>) {
    const { service, certifiedService, canisterId } =
      createServices<SnsGovernanceTestService>({
        options,
        idlFactory,
        certifiedIdlFactory,
      });

    return new SnsGovernanceTestCanister(canisterId, service, certifiedService);
  }

  /**
   * Add maturity to a neuron (only for testing purposes. Testnet only.)
   */
  addMaturity = async (params: SnsAddMaturityParams): Promise<void> => {
    const { id, amountE8s } = params;

    const { new_maturity_e8s } = await this.caller(params).add_maturity({
      id: toNullable<NeuronId>(id),
      amount_e8s: toNullable(amountE8s),
    });
    const newMaturity = fromNullable(new_maturity_e8s);

    if (isNullish(newMaturity) || newMaturity < amountE8s) {
      throw new SnsGovernanceError("No maturity added");
    }
  };
}
