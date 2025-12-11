import type { ActorSubclass } from "@icp-sdk/core/agent";
import { mock } from "vitest-mock-extended";
import type { SnsRootService } from "../declarations";
import {
  governanceCanisterIdMock,
  indexCanisterIdMock,
  ledgerCanisterIdMock,
  rootCanisterIdMock,
  snsMock,
  swapCanisterIdMock,
} from "./mocks/sns.mock";
import { initSnsWrapper } from "./sns";

describe("Sns", () => {
  it("should init a wrapper", async () => {
    const service = mock<ActorSubclass<SnsRootService>>();
    service.list_sns_canisters.mockResolvedValue(snsMock);

    const { canisterIds } = await initSnsWrapper({
      rootOptions: {
        canisterId: rootCanisterIdMock,
        certifiedServiceOverride: service,
      },
    });

    expect(canisterIds).not.toBeNull();

    expect(canisterIds).toEqual({
      rootCanisterId: rootCanisterIdMock,
      ledgerCanisterId: ledgerCanisterIdMock,
      governanceCanisterId: governanceCanisterIdMock,
      swapCanisterId: swapCanisterIdMock,
      indexCanisterId: indexCanisterIdMock,
    });
  });
});
