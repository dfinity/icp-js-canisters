import type { ActorSubclass } from "@icp-sdk/core/agent";
import { mock } from "vitest-mock-extended";
import type { NnsGenesisTokenService } from "../declarations";
import { NnsGenesisTokenCanister } from "./genesis_token.canister";

describe("GenesisTokenCanister", () => {
  it("claimNeurons returns a list of neuron ids", async () => {
    const response = {
      Ok: [
        {
          id: BigInt(1),
        },
        {
          id: BigInt(2),
        },
      ],
    };
    const service = mock<ActorSubclass<NnsGenesisTokenService>>();
    service.claim_neurons.mockResolvedValue(response);

    const gtc = NnsGenesisTokenCanister.create({ serviceOverride: service });
    const res = await gtc.claimNeurons({
      hexPubKey: "",
    });

    expect(res).toEqual([BigInt(1), BigInt(2)]);
  });

  it("claimNeurons throws errors", async () => {
    const response = {
      Err: "An error occurred.",
    };
    const service = mock<ActorSubclass<NnsGenesisTokenService>>();
    service.claim_neurons.mockResolvedValue(response);

    const gtc = NnsGenesisTokenCanister.create({ serviceOverride: service });
    const call = async () => {
      await gtc.claimNeurons({ hexPubKey: "" });
    };

    await expect(call).rejects.toThrowError("An error occurred.");
  });
});
