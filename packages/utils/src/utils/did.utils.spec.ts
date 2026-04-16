import { NullishError } from "./asserts.utils";
import {
  fromDefinedNullable,
  fromNullable,
  fromNullishNullable,
  toNullable,
} from "./did.utils";

describe("did-utils", () => {
  const test = { test: "1" };

  describe("fromNullable", () => {
    it("should convert from empty array to undefined", () => {
      expect(fromNullable([])).toBeUndefined();
    });

    it("should convert from array to object", () => {
      expect(fromNullable([{ test: "1" }])).toEqual(test);
    });
  });

  describe("toNullable", () => {
    it("should convert from undefined to empty array", () => {
      expect(toNullable(undefined)).toEqual([]);
    });

    it("should convert from null to empty array", () => {
      expect(toNullable(null)).toEqual([]);
    });

    it("should convert object to array", () => {
      const test = { test: "1" };

      expect(toNullable(test)).toEqual([test]);
    });

    it("should convert boolean to array", () => {
      const test = false;

      expect(toNullable(test)).toEqual([test]);
    });

    it("should convert null to empty array", () => {
      const test = null;

      expect(toNullable(test)).toEqual([]);
    });

    it("should convert 0 to array", () => {
      const test = 0;

      expect(toNullable(test)).toEqual([test]);
    });
  });

  describe("fromDefinedNullable", () => {
    it("should convert from array to object", () => {
      expect(fromDefinedNullable([{ test: "1" }])).toEqual(test);
    });

    it("should throw on undefined", () => {
      expect(() => fromDefinedNullable([])).toThrow(NullishError);
    });
  });

  describe("fromNullishNullable", () => {
    it("should return undefined for an empty array", () => {
      expect(fromNullishNullable([])).toBeUndefined();
    });

    it("should return undefined for undefined input", () => {
      expect(fromNullishNullable(undefined)).toBeUndefined();
    });

    it("should return the value for a non-empty array", () => {
      expect(fromNullishNullable([{ test: "1" }])).toEqual(test);
    });

    it("should return undefined when the array contains undefined", () => {
      expect(fromNullishNullable([undefined])).toBeUndefined();
    });
  });
});
