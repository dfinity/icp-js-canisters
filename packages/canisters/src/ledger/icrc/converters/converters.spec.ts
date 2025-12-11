import { toNullable } from "@dfinity/utils";
import { mockPrincipal } from "../mocks/ledger.mock";
import { fromCandidAccount, toCandidAccount } from "./converters";

describe("converters", () => {
  const owner = mockPrincipal;
  const subaccount = new Uint8Array([1, 2, 3]);

  describe("fromCandidAccount", () => {
    it("should transform a Candid Account to IcrcAccount correctly", () => {
      expect(
        fromCandidAccount({
          owner,
          subaccount: toNullable(subaccount),
        }),
      ).toStrictEqual({
        owner,
        subaccount,
      });
    });

    it("should handle nullish subaccount", () => {
      expect(
        fromCandidAccount({
          owner,
          subaccount: toNullable(),
        }),
      ).toStrictEqual({
        owner,
      });
    });
  });

  describe("toCandidAccount", () => {
    it("should transform an IcrcAccount to a Candid Account correctly", () => {
      expect(
        toCandidAccount({
          owner,
          subaccount,
        }),
      ).toStrictEqual({
        owner,
        subaccount: toNullable(subaccount),
      });
    });

    it("should handle nullish subaccount", () => {
      expect(
        toCandidAccount({
          owner,
        }),
      ).toStrictEqual({
        owner,
        subaccount: toNullable(),
      });
    });
  });
});
