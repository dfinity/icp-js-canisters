import { base64ToUint8Array, uint8ArrayToBase64 } from "./base64.utils";

describe("Base64 Encoding and Decoding", () => {
  describe("Success", () => {
    it("should correctly encode Uint8Array to base64 string", () => {
      const uint8Array = new Uint8Array([104, 101, 108, 108, 111]);
      const base64String = uint8ArrayToBase64(uint8Array);

      expect(base64String).toBe(btoa("hello"));
    });

    it("should correctly decode base64 string to Uint8Array", () => {
      const base64String = btoa("hello");
      const uint8Array = base64ToUint8Array(base64String);

      expect(uint8Array).toEqual(new Uint8Array([104, 101, 108, 108, 111]));
    });

    it("should handle empty Uint8Array encoding", () => {
      const uint8Array = new Uint8Array([]);
      const base64String = uint8ArrayToBase64(uint8Array);

      expect(base64String).toBe("");
    });

    it("should handle empty base64 string decoding", () => {
      const base64String = "";
      const uint8Array = base64ToUint8Array(base64String);

      expect(uint8Array).toEqual(new Uint8Array([]));
    });

    it("should encode and decode non-ASCII binary data correctly", () => {
      const uint8Array = new Uint8Array([255, 254, 253, 252, 251]);
      const base64String = uint8ArrayToBase64(uint8Array);
      const decodedArray = base64ToUint8Array(base64String);

      expect(decodedArray).toEqual(uint8Array);
    });
  });

  describe("Errors", () => {
    it("should throw an error when decoding an invalid base64 string", () => {
      const invalidBase64String = "invalid!base64";

      expect(() => {
        base64ToUint8Array(invalidBase64String);
      }).toThrowError();
    });

    it("should not encode non-Uint8Array values properly", () => {
      const invalidInput = "hello";
      // @ts-expect-error: we are testing this on purpose
      const result = uint8ArrayToBase64(invalidInput);

      expect(result).not.toBe(uint8ArrayToBase64(new Uint8Array([1, 2, 3, 4])));
    });

    it("should decode correctly even if base64 string is missing padding", () => {
      const base64StringWithoutPadding = "YWJjZA"; // missing '==' padding
      const result = base64ToUint8Array(base64StringWithoutPadding);

      expect(result).toEqual(new Uint8Array([97, 98, 99, 100])); // 'abcd'
    });
  });
});
