import { CkETHMinterCanister, CkETHOrchestratorCanister } from "./index";

describe("@dfinity/cketh", () => {
  it("should re-export CkETHMinterCanister", () => {
    expect(CkETHMinterCanister).not.toBeUndefined();
  });

  it("should re-export CkETHOrchestratorCanister", () => {
    expect(CkETHOrchestratorCanister).not.toBeUndefined();
  });
});
