import {
  arrayBufferToUint8Array,
  arrayOfNumberToUint8Array,
  asciiStringToByteArray,
  bigIntToUint8Array,
  candidNumberArrayToBigInt,
  hexStringToUint8Array,
  numberToUint8Array,
  uint8ArraysEqual,
  uint8ArrayToArrayOfNumber,
  uint8ArrayToBigInt,
  uint8ArrayToHexString,
} from "./arrays.utils";

describe("arrays-utils", () => {
  const arrayNumber = [215, 227, 8, 132, 55, 128, 181, 202];
  const uint8Array = new Uint8Array(arrayNumber);

  const arrayNumber2 = [0, 0, 0, 0, 0, 0, 6, 18];
  const uint8Array2 = new Uint8Array(arrayNumber2);

  it("should convert Uint8Array to BigInt", () =>
    expect(uint8ArrayToBigInt(uint8Array)).toEqual(15556286901827712458n));

  it("should convert bigint to Uint8Array", () =>
    expect(bigIntToUint8Array(15556286901827712458n)).toEqual(uint8Array));

  it("should convert bigint to Uint8Array and back to bigint", () =>
    expect(uint8ArrayToBigInt(bigIntToUint8Array(1555628690182n))).toEqual(
      1555628690182n,
    ));

  it("should convert number to Uint8Array", () => {
    expect(numberToUint8Array(1554)).toEqual(uint8Array2);
  });

  it("should convert number to Uint8Array and back to bigint", () =>
    expect(uint8ArrayToBigInt(numberToUint8Array(14))).toEqual(14n));

  it("should convert array buffer to Uint8Array", () =>
    expect(arrayBufferToUint8Array(uint8Array.buffer)).toEqual(uint8Array));

  it("should convert Uint8Array to array number", () =>
    expect(uint8ArrayToArrayOfNumber(uint8Array)).toEqual(arrayNumber));

  it("should convert array number to Uint8Array", () =>
    expect(arrayOfNumberToUint8Array(arrayNumber)).toEqual(uint8Array));

  it("should convert ascii string to byte array", () => {
    const expectedResult = [
      55, 49, 49, 48, 49, 49, 48, 49, 49, 48, 55, 49, 49, 53,
    ];

    expect(asciiStringToByteArray("71101101107115")).toEqual(expectedResult);
  });

  const hex =
    "0102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f20";
  const hexArray = Uint8Array.from([...Array(32)].map((_, i) => i + 1));

  it("should convert hex string to uint8array", () => {
    expect(hexStringToUint8Array(hex)).toEqual(hexArray);
  });

  it("should throw error if empty hex string is provided to convert to uint8array", () => {
    expect(() => hexStringToUint8Array("")).toThrowError();
  });

  it("should convert random string to uint8array of zeros", () => {
    expect(hexStringToUint8Array("test")).toEqual(Uint8Array.from([0, 0]));
  });

  it("should convert hex uint8array to string", () => {
    expect(uint8ArrayToHexString(hexArray)).toEqual(hex);
  });

  it("should convert array of numbers to string", () => {
    expect(uint8ArrayToHexString(Array.from(hexArray))).toEqual(hex);
  });

  it("should convert Candid Nat to BigInt", () => {
    // DOGMI fee
    expect(candidNumberArrayToBigInt([705032704, 1])).toBe(5_000_000_000n);

    // Interpretation of the fees without high bits
    expect(candidNumberArrayToBigInt([705032704, 0])).toBe(70_5032_704n);
    expect(candidNumberArrayToBigInt([705032704])).toBe(70_5032_704n);

    // Common SNS fees
    expect(candidNumberArrayToBigInt([10000])).toBe(10_000n);
    expect(candidNumberArrayToBigInt([20000])).toBe(20_000n);
    expect(candidNumberArrayToBigInt([100000])).toBe(100_000n);
    expect(candidNumberArrayToBigInt([1000000])).toBe(1_000_000n);

    // More than 2 parts:
    expect(candidNumberArrayToBigInt([0, 0, 1])).toBe(1n << 64n);
    expect(
      candidNumberArrayToBigInt([
        3735344374, 914506646, 1139096947, 3625449072, 77510495, 1540130702,
        55083,
      ]),
    ).toBe(345763845793847239482739482739482739482739482374928374234928374n);
  });

  describe("uint8ArraysEqual", () => {
    it("should return true for identical arrays", () => {
      const a = new Uint8Array([1, 2, 3]);
      const b = new Uint8Array([1, 2, 3]);

      expect(uint8ArraysEqual({ a, b })).toBeTruthy();
    });

    it("should return false for arrays with different lengths", () => {
      const a = new Uint8Array([1, 2, 3]);
      const b = new Uint8Array([1, 2, 3, 4]);

      expect(uint8ArraysEqual({ a, b })).toBeFalsy();
      expect(uint8ArraysEqual({ a: b, b: a })).toBeFalsy();
    });

    it("should return false for arrays with same length but different content", () => {
      const a = new Uint8Array([1, 2, 3]);
      const b = new Uint8Array([1, 2, 4]);

      expect(uint8ArraysEqual({ a, b })).toBeFalsy();
      expect(uint8ArraysEqual({ a: b, b: a })).toBeFalsy();
    });

    it("should return true for two empty arrays", () => {
      const a = new Uint8Array([]);
      const b = new Uint8Array([]);

      expect(uint8ArraysEqual({ a, b })).toBeTruthy();
    });
  });
});
