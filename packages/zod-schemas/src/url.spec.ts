import { createUrlSchema, UrlSchema } from "./url";

describe("UrlSchema", () => {
  describe("UrlSchema", () => {
    it("should accept valid https URLs", () => {
      const validUrl = "https://example.com";

      expect(() => UrlSchema.parse(validUrl)).not.toThrowError();
    });

    it("should accept valid https URLs with port", () => {
      const validUrl = "https://example.com:666";

      expect(() => UrlSchema.parse(validUrl)).not.toThrowError();
    });

    it("should accept valid https URLs with sub domain", () => {
      const validUrl = "https://staging.oisy.com";

      expect(() => UrlSchema.parse(validUrl)).not.toThrowError();
    });

    it("should accept valid https URLs with route", () => {
      const validUrl = "https://staging.oisy.com/sign";

      expect(() => UrlSchema.parse(validUrl)).not.toThrowError();
    });

    it("should accept localhost with http", () => {
      const validUrl = "http://localhost:3000";

      expect(() => UrlSchema.parse(validUrl)).not.toThrowError();
    });

    it("should accept 127.0.0.1 with http", () => {
      const validUrl = "http://127.0.0.1:3000";

      expect(() => UrlSchema.parse(validUrl)).not.toThrowError();
    });

    it("should reject localhost with an invalid protocol", () => {
      const invalidUrl = "ftp://localhost:3000";

      expect(() => UrlSchema.parse(invalidUrl)).toThrowError("Invalid URL.");
    });

    it("should reject non-localhost with an invalid protocol", () => {
      const invalidUrl = "ftp://example.com:3000";

      expect(() => UrlSchema.parse(invalidUrl)).toThrowError("Invalid URL.");
    });

    it("should reject non-localhost URLs without https", () => {
      const invalidUrl = "http://example.com";

      expect(() => UrlSchema.parse(invalidUrl)).toThrowError("Invalid URL.");
    });

    it("should reject an invalid URL", () => {
      const invalidUrl = "invalid-url";

      expect(() => UrlSchema.parse(invalidUrl)).toThrowError("Invalid URL.");
    });

    it("should reject an empty string", () => {
      const invalidUrl = "";

      expect(() => UrlSchema.parse(invalidUrl)).toThrowError("Invalid URL.");
    });
  });

  describe("createUrlSchema", () => {
    it("should accept https URLs by default", () => {
      const schema = createUrlSchema({});

      expect(() => schema.parse("https://example.com")).not.toThrowError();
    });

    it("should reject http URLs by default (non-localhost)", () => {
      const schema = createUrlSchema({});

      expect(() => schema.parse("http://example.com")).toThrowError(
        "Invalid URL.",
      );
    });

    it("should allow http URLs for localhost when allowHttpLocally is true", () => {
      const schema = createUrlSchema({ allowHttpLocally: true });

      expect(() => schema.parse("http://localhost:3000")).not.toThrowError();
      expect(() => schema.parse("http://127.0.0.1:8080")).not.toThrowError();
    });

    it("should reject http URLs for localhost when allowHttpLocally is false", () => {
      const schema = createUrlSchema({ allowHttpLocally: false });

      expect(() => schema.parse("http://localhost:3000")).toThrowError(
        "Invalid URL.",
      );
      expect(() => schema.parse("http://127.0.0.1:8080")).toThrowError(
        "Invalid URL.",
      );
    });

    it("should allow additional protocols when specified", () => {
      const schema = createUrlSchema({ additionalProtocols: ["wss:", "ftp:"] });

      expect(() => schema.parse("wss://example.com")).not.toThrowError();
      expect(() => schema.parse("ftp://example.com")).not.toThrowError();
    });

    it("should reject URLs with unsupported protocols even with additional protocols", () => {
      const schema = createUrlSchema({ additionalProtocols: ["wss:"] });

      expect(() => schema.parse("http://example.com")).toThrowError(
        "Invalid URL.",
      );
      expect(() => schema.parse("ftp://example.com")).toThrowError(
        "Invalid URL.",
      );
    });

    it("should accept localhost URLs with https even when allowHttpLocally is false", () => {
      const schema = createUrlSchema({ allowHttpLocally: false });

      expect(() => schema.parse("https://localhost:3000")).not.toThrowError();
      expect(() => schema.parse("https://127.0.0.1")).not.toThrowError();
    });

    it("should reject an invalid URL format", () => {
      const schema = createUrlSchema({});

      expect(() => schema.parse("not-a-url")).toThrowError("Invalid URL.");
    });

    it("should reject an empty string", () => {
      const schema = createUrlSchema({});

      expect(() => schema.parse("")).toThrowError("Invalid URL.");
    });

    it("should work with additional protocols and allowHttpLocally enabled", () => {
      const schema = createUrlSchema({
        additionalProtocols: ["wss:"],
        allowHttpLocally: true,
      });

      expect(() => schema.parse("wss://example.com")).not.toThrowError();
      expect(() => schema.parse("http://localhost")).not.toThrowError();
    });

    it("should reject URLs without the proper protocol suffix", () => {
      const schema = createUrlSchema({});

      expect(() => schema.parse("example.com")).toThrowError("Invalid URL.");
    });
  });
});
