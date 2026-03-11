import * as z from "zod";

/** @see {@link Result} */
export const inferResultSchema = <T extends z.ZodType>(schema: T) =>
  z.union([
    z.strictObject({
      status: z.literal("success"),
      result: schema,
    }),
    z.strictObject({
      status: z.literal("error"),
      err: z.unknown().optional(),
    }),
  ]);

/**
 * Represents a result type with a success or error state.
 *
 * @template T - The type of the success `result` value.
 *
 * @example
 * type StringResult = Result<string>;
 * // { status: "success"; result: string } | { status: "error"; err?: unknown }
 */
export type Result<T> = z.infer<
  ReturnType<typeof inferResultSchema<z.ZodType<T>>>
>;
