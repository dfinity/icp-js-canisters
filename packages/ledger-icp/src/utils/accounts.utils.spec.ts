import { InvalidAccountIDError } from "../errors/ledger.errors";
import { checkAccountId, isIcpAccountIdentifier } from "./accounts.utils";

describe("accounts-utils", () => {
  describe("checkAccountId", () => {
    const validAccountId =
      "cd70bfa0f092c38a0ff8643d4617219761eb61d199b15418c0b1114d59e30f8e";

    it("should not throw if valid account id", () => {
      expect(() => checkAccountId(validAccountId)).not.toThrowError();
    });

    it("should throw if invalid checksum", () => {
      const incorrectChecksum = `a${validAccountId.slice(1)}`;
      const usage = () => checkAccountId(incorrectChecksum);

      expect(usage).toThrowError(InvalidAccountIDError);
      expect(usage).toThrowError(
        `Account identifier ${incorrectChecksum} has an invalid checksum. Are you sure the account identifier is correct?`,
      );
    });

    it("should throw if not valid account id", () => {
      const usage = () => checkAccountId("not-valid");

      expect(usage).toThrowError(InvalidAccountIDError);
      expect(usage).toThrowError(
        "Invalid account identifier not-valid. The account identifier must be 64 chars in length.",
      );
    });
  });

  describe("isIcpAccountIdentifier", () => {
    it("should return false if input is undefined", () => {
      expect(isIcpAccountIdentifier(undefined)).toBeFalsy();
    });

    it("should return true if valid account id", () => {
      expect(
        isIcpAccountIdentifier(
          "cd70bfa0f092c38a0ff8643d4617219761eb61d199b15418c0b1114d59e30f8e",
        ),
      ).toBeTruthy();
    });

    it("should return false if not valid account id", () => {
      expect(isIcpAccountIdentifier("not-valid")).toBeFalsy();
    });
  });
});
