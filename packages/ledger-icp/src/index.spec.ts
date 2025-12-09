import { IndexCanister, LedgerCanister } from "./index";

describe("@dfinity/ledger-icp", () => {
  it("should re-export LedgerCanister", () => {
    expect(LedgerCanister).not.toBeUndefined();
  });

  it("should re-export IndexCanister", () => {
    expect(IndexCanister).not.toBeUndefined();
  });
});
