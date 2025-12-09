import {
  assertNonNullish,
  createServices,
  type CanisterOptions,
} from "@dfinity/utils";
import type { ActorSubclass } from "@icp-sdk/core/agent";
import type { Principal } from "@icp-sdk/core/principal";
import {
  idlFactoryCertifiedNnsGovernanceTest,
  idlFactoryNnsGovernanceTest,
  type NnsGovernanceTestService,
} from "../declarations";
import { fromListNeurons } from "./canisters/governance/request.converters";
import { toRawNeuron } from "./canisters/governance/response.converters";
import { MAINNET_GOVERNANCE_CANISTER_ID } from "./constants/canister_ids";
import type { Neuron } from "./types/governance_converters";
import { principalToAccountIdentifier } from "./utils/account_identifier.utils";

export class GovernanceTestCanister {
  private constructor(
    private readonly canisterId: Principal,
    private readonly certifiedService: ActorSubclass<NnsGovernanceTestService>,
  ) {
    this.canisterId = canisterId;
    this.certifiedService = certifiedService;
  }

  public static create(
    options: CanisterOptions<NnsGovernanceTestService> = {},
  ) {
    const canisterId: Principal =
      options.canisterId ?? MAINNET_GOVERNANCE_CANISTER_ID;

    const { certifiedService } = createServices<NnsGovernanceTestService>({
      options: {
        ...options,
        canisterId,
      },
      idlFactory: idlFactoryNnsGovernanceTest,
      certifiedIdlFactory: idlFactoryCertifiedNnsGovernanceTest,
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
