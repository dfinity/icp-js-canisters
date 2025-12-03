import { CMCCanister } from "./index";

describe("@icp-sdk/cmc", () => {
  it("should re-export CMCCanister", () => {
    expect(CMCCanister).not.toBeUndefined();
  });
});
