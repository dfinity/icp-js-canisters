import { createServices, type CanisterOptions } from "@dfinity/utils";
import type { ActorSubclass } from "@icp-sdk/core/agent";
import type { _SERVICE as GenesisTokenService } from "../declarations/nns/genesis_token";
import { idlFactory as certifiedIdlFactory } from "../declarations/nns/genesis_token.certified.idl";
import { idlFactory } from "../declarations/nns/genesis_token.idl";
import { MAINNET_GENESIS_TOKEN_CANISTER_ID } from "./constants/canister_ids";
import type { NeuronId } from "./types/common";

export class GenesisTokenCanister {
  private constructor(
    private readonly service: ActorSubclass<GenesisTokenService>,
  ) {}

  public static create(options: CanisterOptions<GenesisTokenService> = {}) {
    const { service } = createServices<GenesisTokenService>({
      options: {
        ...options,
        canisterId: options.canisterId ?? MAINNET_GENESIS_TOKEN_CANISTER_ID,
      },
      idlFactory,
      certifiedIdlFactory,
    });

    return new GenesisTokenCanister(service);
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
