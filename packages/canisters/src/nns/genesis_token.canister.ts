import { createServices, type CanisterOptions } from "@dfinity/utils";
import type { ActorSubclass } from "@icp-sdk/core/agent";
import {
  idlFactoryCertifiedNnsGenesisToken,
  idlFactoryNnsGenesisToken,
  type NnsGenesisTokenService,
} from "../declarations";
import { MAINNET_GENESIS_TOKEN_CANISTER_ID } from "./constants/canister_ids";
import type { NeuronId } from "./types/common";

export class NnsGenesisTokenCanister {
  private constructor(
    private readonly service: ActorSubclass<NnsGenesisTokenService>,
  ) {}

  public static create(options: CanisterOptions<NnsGenesisTokenService> = {}) {
    const { service } = createServices<NnsGenesisTokenService>({
      options: {
        ...options,
        canisterId: options.canisterId ?? MAINNET_GENESIS_TOKEN_CANISTER_ID,
      },
      idlFactory: idlFactoryNnsGenesisToken,
      certifiedIdlFactory: idlFactoryCertifiedNnsGenesisToken,
    });

    return new NnsGenesisTokenCanister(service);
  }

  public claimNeurons = async ({
    hexPubKey,
  }: {
    hexPubKey: string;
  }): Promise<NeuronId[]> => {
    const response = await this.service.claim_neurons(hexPubKey);
    if ("Ok" in response) {
      return response.Ok.map((neuronId) => neuronId.id);
    }

    throw new Error(response.Err);
  };
}
