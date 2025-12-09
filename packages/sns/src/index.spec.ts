import {
  initSnsWrapper,
  SnsGovernanceCanister,
  SnsGovernanceTestCanister,
  SnsRootCanister,
  SnsSwapCanister,
  SnsWrapper,
} from "./index";

describe("@dfinity/sns", () => {
  it("should re-export SnsRootCanister", () => {
    expect(SnsRootCanister).not.toBeUndefined();
  });

  it("should re-export SnsGovernanceCanister", () => {
    expect(SnsGovernanceCanister).not.toBeUndefined();
  });

  it("should re-export SnsSwapCanister", () => {
    expect(SnsSwapCanister).not.toBeUndefined();
  });

  it("should re-export SnsGovernanceTestCanister", () => {
    expect(SnsGovernanceTestCanister).not.toBeUndefined();
  });

  it("should re-export initSnsWrapper", () => {
    expect(initSnsWrapper).not.toBeUndefined();
  });

  it("should re-export SnsWrapper", () => {
    expect(SnsWrapper).not.toBeUndefined();
  });
});
