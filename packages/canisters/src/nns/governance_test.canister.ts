import {
  assertNonNullish,
  createServices,
  type CanisterOptions,
} from "@dfinity/utils";
import type { ActorSubclass } from "@icp-sdk/core/agent";
import type { Principal } from "@icp-sdk/core/principal";
import { idlFactory } from "../declarations/nns/governance.idl";
import type { _SERVICE as GovernanceService } from "../declarations/nns/governance_test";
import { idlFactory as certifiedIdlFactory } from "../declarations/nns/governance_test.certified.idl";
import { fromListNeurons } from "./canisters/governance/request.converters";
import { toRawNeuron } from "./canisters/governance/response.converters";
import { MAINNET_GOVERNANCE_CANISTER_ID } from "./constants/canister_ids";
import type { Neuron } from "./types/governance_converters";
import { principalToAccountIdentifier } from "./utils/account_identifier.utils";

export class GovernanceTestCanister {
  private constructor(
    private readonly canisterId: Principal,
    private readonly certifiedService: ActorSubclass<GovernanceService>,
  ) {
    this.canisterId = canisterId;
    this.certifiedService = certifiedService;
  }

  public static create(options: CanisterOptions<GovernanceService> = {}) {
    const canisterId: Principal =
      options.canisterId ?? MAINNET_GOVERNANCE_CANISTER_ID;

    const { certifiedService } = createServices<GovernanceService>({
      options: {
        ...options,
        canisterId,
      },
      idlFactory,
      certifiedIdlFactory,
    });

    return new GovernanceTestCanister(canisterId, certifiedService);
  }

  /**
   * Test method to update fields of a neuron.
   *
   * Only available in the governance test canister.
   */
  async updateNeuron(neuron: Neuron) {
    assertNonNullish(neuron.id);
    const rawListNeuronsRequest = fromListNeurons({ neuronIds: [neuron.id] });
    const rawListNeuronsResponse = await this.certifiedService.list_neurons(
      rawListNeuronsRequest,
    );
    const [currentNeuron] = rawListNeuronsResponse.full_neurons;
    const currentAccountIdentifier = principalToAccountIdentifier(
      this.canisterId,
      Uint8Array.from(currentNeuron.account),
    );
    if (currentAccountIdentifier !== neuron.accountIdentifier) {
      throw new Error("Neuron account identifier can't be changed");
    }
    const rawNeuron = toRawNeuron({
      neuron,
      account: Uint8Array.from(currentNeuron.account),
    });
    return this.certifiedService.update_neuron(rawNeuron);
  }
}
