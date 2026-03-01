import * as z from "zod";
import { ZodSchemaId } from "./schema-id";

/**
 * A URL protocol as template literal type.
 * Example: "https:" or "ftp:"
 */
export type UrlProtocol = `${string}:`;

/**
 * Creates a Zod schema for validating URLs. By default, it validates that the URL protocol is HTTPS and allow usage of HTTP only locally.
 *
 * @param {Object} options - Configuration options for the schema.
 * @param {UrlProtocol[]} [options.additionalProtocols=[]] - Additional protocols to allow (e.g., "wss:" or "ftp:"). ⚠️ Usage of insecure protocols is discouraged.
 * @param {boolean} [options.allowHttpLocally=true] - Whether to allow HTTP for localhost and 127.0.0.1. Default: true.
 * @returns {z.ZodEffects<z.ZodString, string, string>} - The Zod schema with URL validation.
 *
 * @example
 * const schema = createUrlSchema({
 *   additionalProtocols: ["wss:"],
 *   allowHttpLocally: false
 * });
 *
 * schema.parse("https://example.com"); // Valid
 * schema.parse("wss://example.com");    // Valid
 * schema.parse("http://localhost");     // Invalid if allowHttpLocally is false
 */
export const createUrlSchema = ({
  additionalProtocols = [],
  allowHttpLocally = true,
}: {
  additionalProtocols?: UrlProtocol[];
  allowHttpLocally?: boolean;
}): z.ZodURL =>
  z.url().refine(
    (url: string | URL): boolean => {
      try {
        const protocols = [...new Set(["https:", ...additionalProtocols])];

        const { protocol, hostname } = new URL(url);

        // We allow http for development locally
        if (allowHttpLocally && ["localhost", "127.0.0.1"].includes(hostname)) {
          return ["http:", ...protocols].includes(protocol);
        }

        return protocols.includes(protocol);
      } catch (_err: unknown) {
        return false;
      }
    },
    {
      error: "Invalid URL.",
    },
  );

/**
 * Default URL schema that enforces HTTPS and allows HTTP locally.
 *
 * @constant {z.ZodEffects<z.ZodString, string, string>}
 * @example
 * UrlSchema.parse("https://example.com"); // Valid
 * UrlSchema.parse("http://127.0.0.1");   // Valid (localhost exception)
 */
export const UrlSchema = createUrlSchema({}).meta({ id: ZodSchemaId.Url });
