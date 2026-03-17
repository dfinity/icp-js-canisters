import * as z from "zod";
import { inferResultSchema } from "./result";

describe("result", () => {
  describe("inferResultSchema", () => {
    const schema = inferResultSchema(z.string());

    describe("success", () => {
      it("should parse a valid success result", () => {
        expect(schema.parse({ status: "success", result: "myValue" })).toEqual({
          status: "success",
          result: "myValue",
        });
      });

      it("should reject a success result with wrong result type", () => {
        expect(() =>
          schema.parse({ status: "success", result: 123 }),
        ).toThrowError();
      });

      it("should reject a success result with extra fields", () => {
        expect(() =>
          schema.parse({ status: "success", result: "hello", extra: true }),
        ).toThrowError();
      });
    });

    describe("error", () => {
      it("should parse a valid error result with err", () => {
        const err = new Error("something went wrong");

        expect(schema.parse({ status: "error", err })).toEqual({
          status: "error",
          err,
        });
      });

      it("should parse a valid error result without err", () => {
        expect(schema.parse({ status: "error" })).toEqual({ status: "error" });
      });

      it("should reject an error result with extra fields", () => {
        expect(() =>
          schema.parse({ status: "error", extra: true }),
        ).toThrowError();
      });
    });

    it("should reject an unknown status", () => {
      expect(() => schema.parse({ status: "unknown" })).toThrowError();
    });
  });
});
