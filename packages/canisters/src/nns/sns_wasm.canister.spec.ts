import type { ActorSubclass } from "@icp-sdk/core/agent";
import { mock } from "vitest-mock-extended";
import type { _SERVICE as SnsWasmService } from "../declarations/nns/sns_wasm";
import { deployedSnsMock } from "./mocks/sns_wasm.mock";
import { SnsWasmCanister } from "./sns_wasm.canister";

describe("Sns-wasm", () => {
  it("should return the list of sns", async () => {
    const service = mock<ActorSubclass<SnsWasmService>>();
    service.list_deployed_snses.mockResolvedValue({
      instances: deployedSnsMock,
    });

    const canister = SnsWasmCanister.create({
      certifiedServiceOverride: service,
    });
    const res = await canister.listSnses({});

    expect(res).toEqual(deployedSnsMock);
  });
});
