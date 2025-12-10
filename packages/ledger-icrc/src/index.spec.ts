import {
  IcrcIndexNgCanister,
  IcrcLedgerCanister,
  IcrcNftLedgerCanister,
} from "./index";

describe("@dfinity/ledger-icrc", () => {
  it("should re-export IcrcIndexNgCanister", () => {
    expect(IcrcIndexNgCanister).not.toBeUndefined();
  });

  it("should re-export IcrcLedgerCanister", () => {
    expect(IcrcLedgerCanister).not.toBeUndefined();
  });

  it("should re-export IcrcNftLedgerCanister", () => {
    expect(IcrcNftLedgerCanister).not.toBeUndefined();
  });
});
