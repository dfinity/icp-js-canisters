import { Principal } from "@icp-sdk/core/principal";
import * as z from "zod";

/**
 * Zod schema to validate a string as a valid textual representation of a Principal.
 *
 * This schema checks if the provided string can be converted into a `Principal` instance.
 * If the conversion fails, validation will return an error message.
 *
 * @example
 * ```typescript
 * const result = PrincipalTextSchema.safeParse('aaaaa-aa');
 * console.log(result.success); // true or false
 * ```
 */
export const PrincipalTextSchema = z.string().refine(
  (principal) => {
    try {
      Principal.fromText(principal);
      return true;
    } catch (_err: unknown) {
      return false;
    }
  },
  {
    error: "Invalid textual representation of a Principal.",
  },
);

export type PrincipalText = z.infer<typeof PrincipalTextSchema>;

/**
 * Zod schema to validate and transform a value into a `Principal` instance.
 *
 * This schema checks if the provided value is an instance or an object representing
 * a `Principal` and transforms it into a valid `Principal` instance.
 *
 * @example
 * ```typescript
 * const result = PrincipalSchema.safeParse(Principal.fromText('aaaaa-aa'));
 * console.log(result.success); // true or false
 * ```
 */
export const PrincipalSchema = z
  .custom<Principal>()
  .refine((principal) => Principal.isPrincipal(principal), {
    error: "Invalid Principal.",
    abort: true,
  })
  .transform((value) => Principal.from(value));
