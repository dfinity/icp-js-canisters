import { CMCCanister } from "./index";

describe("@dfinity/cmc", () => {
  it("should re-export CMCCanister", () => {
    expect(CMCCanister).not.toBeUndefined();
  });
});
