import * as z from "zod";
import { ZodSchemaId } from "./schema-id";

/**
 * Zod schema to validate a value is a `Uint8Array` instance.
 *
 * @example
 * ```typescript
 * const result = Uint8ArraySchema.safeParse(new Uint8Array([1, 2, 3]));
 * console.log(result.success); // true or false
 * ```
 */
export const Uint8ArraySchema = z
  .instanceof(Uint8Array)
  .meta({ id: ZodSchemaId.Uint8Array });
