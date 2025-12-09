import { isMethodNotSupportedError } from "./error.utils";

describe("error utils", () => {
  describe("isMethodNotSupportedError", () => {
    it("returns true for method is not supported for update", () => {
      const errorMessage = `"Call was rejected:
       Request ID: 3a6ef904b35fd19721c95c3df2b0b00b8abefba7f0ad188f5c472809b772c914
       Reject code: 3
       Reject text: Canister 75ffu-oaaaa-aaaaa-aabbq-cai has no update method 'get_auto_finalization_status'"`;
      const err = new Error(errorMessage);

      expect(isMethodNotSupportedError(err)).toBeTruthy();
    });

    it("returns true for method is not supported for query", () => {
      const errorMessage = `Call failed:
      Canister: s55qq-oqaaa-aaaaa-aaakq-cai
      Method: get_auto_finalization_status (query)
      "Status": "rejected"
      "Code": "DestinationInvalid"
      "Message": "IC0302: Canister s55qq-oqaaa-aaaaa-aaakq-cai has no query method 'get_auto_finalization_status'"`;
      const err = new Error(errorMessage);

      expect(isMethodNotSupportedError(err)).toBeTruthy();
    });

    it("returns false for other errors and non errors", () => {
      expect(isMethodNotSupportedError(new Error("another error"))).toBeFalsy();
      expect(isMethodNotSupportedError(undefined)).toBeFalsy();
      expect(isMethodNotSupportedError({})).toBeFalsy();
    });
  });
});
