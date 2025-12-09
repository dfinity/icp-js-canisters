import type { ActorSubclass } from "@icp-sdk/core/agent";
import { mock } from "vitest-mock-extended";
import type { _SERVICE as SnsRootService } from "../declarations/sns/root";
import { rootCanisterIdMock, snsMock } from "./mocks/sns.mock";
import { SnsRootCanister } from "./root.canister";

describe("Root canister", () => {
  it("should return the list of canister of the sns", async () => {
    const service = mock<ActorSubclass<SnsRootService>>();
    service.list_sns_canisters.mockResolvedValue(snsMock);

    const canister = SnsRootCanister.create({
      canisterId: rootCanisterIdMock,
      certifiedServiceOverride: service,
    });
    const res = await canister.listSnsCanisters({});

    expect(res).toEqual(snsMock);
  });
});
