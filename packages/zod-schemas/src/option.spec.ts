import * as z from "zod";
import {
  inferNullableSchema,
  inferNullishSchema,
  inferOptionSchema,
} from "./option";

describe("options", () => {
  describe("inferOptionSchema", () => {
    const schema = inferOptionSchema(z.string());

    it("should parse a valid value", () => {
      expect(schema.parse("myValue")).toBe("myValue");
    });

    it("should parse undefined", () => {
      expect(schema.parse(undefined)).toBeUndefined();
    });

    it("should reject null", () => {
      expect(() => schema.parse(null)).toThrowError();
    });

    it("should reject wrong type", () => {
      expect(() => schema.parse(123)).toThrowError();
    });
  });

  describe("inferNullableSchema", () => {
    const schema = inferNullableSchema(z.string());

    it("should parse a valid value", () => {
      expect(schema.parse("myValue")).toBe("myValue");
    });

    it("should parse null", () => {
      expect(schema.parse(null)).toBeNull();
    });

    it("should reject undefined", () => {
      expect(() => schema.parse(undefined)).toThrowError();
    });

    it("should reject wrong type", () => {
      expect(() => schema.parse(123)).toThrowError();
    });
  });

  describe("inferNullishSchema", () => {
    const schema = inferNullishSchema(z.string());

    it("should parse a valid value", () => {
      expect(schema.parse("myValue")).toBe("myValue");
    });

    it("should parse null", () => {
      expect(schema.parse(null)).toBeNull();
    });

    it("should parse undefined", () => {
      expect(schema.parse(undefined)).toBeUndefined();
    });

    it("should reject wrong type", () => {
      expect(() => schema.parse(123)).toThrowError();
    });
  });
});
