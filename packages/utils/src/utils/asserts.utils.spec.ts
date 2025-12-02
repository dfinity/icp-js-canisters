import {
  asNonNullish,
  assertNever,
  assertNonNullish,
  assertPercentageNumber,
  InvalidPercentageError,
  NullishError,
} from "./asserts.utils";

describe("asserts-utils", () => {
  describe("assertNonNullish", () => {
    it("should throw an exception if undefined", () => {
      const call = () => assertNonNullish(undefined);

      expect(call).toThrowError();
    });

    it("should throw an exception if null", () => {
      const call = () => assertNonNullish(null);

      expect(call).toThrowError();
    });

    it("should throw an exception with particular message", () => {
      const call = () => assertNonNullish(undefined, "Test error");

      expect(call).toThrowError(new NullishError("Test error"));
    });

    it("should not throw an exception if valid primitive type", () => {
      const call = () => assertNonNullish(1);

      expect(call).not.toThrowError();
    });

    it("should not throw an exception if valid object", () => {
      const call = () => assertNonNullish({});

      expect(call).not.toThrowError();
    });

    it("should make value of non-nullable type", () => {
      const getStringOrNull = (): string | null => "test";
      const value: string | null = getStringOrNull();
      const call = () => assertNonNullish(value);

      expect(call).not.toThrowError();
    });
  });

  describe("asNonNullish", () => {
    it("should throw an exception if undefined", () => {
      const call = () => asNonNullish(undefined);

      expect(call).toThrowError();
    });

    it("should throw an exception if null", () => {
      const call = () => asNonNullish(null);

      expect(call).toThrowError();
    });

    it("should throw an exception with particular message", () => {
      const call = () => asNonNullish(undefined, "Test error");

      expect(call).toThrowError(new NullishError("Test error"));
    });

    it("should not throw an exception if valid primitive type", () => {
      const call = () => asNonNullish(1);

      expect(call).not.toThrowError();
    });

    it("should not throw an exception if valid object", () => {
      const call = () => asNonNullish({});

      expect(call).not.toThrowError();
    });

    it("should return the value if valid", () => {
      const value: string | undefined = "test";
      const result: string = asNonNullish(value);

      expect(result).toBe(value);
    });
  });

  describe("assertPercentageNumber", () => {
    it("should not throw if valid percentage", () => {
      expect(() => assertPercentageNumber(30)).not.toThrowError();
    });

    it("should throw if not valid account id", () => {
      const call1 = () => assertPercentageNumber(300);

      expect(call1).toThrowError(InvalidPercentageError);
    });
  });

  describe("assertNever", () => {
    it("throws an Error with the provided message", () => {
      const msg = "Unsupported source";

      expect(() => assertNever(undefined as never, msg)).toThrowError(msg);
    });

    it("throws an Error when message is omitted", () => {
      expect(() => assertNever(undefined as never)).toThrowError(Error);
    });

    it("has a `never` parameter type", () => {
      expectTypeOf<Parameters<typeof assertNever>[0]>().toBeNever();

      expect(true).toBeTruthy();
    });
  });
});
