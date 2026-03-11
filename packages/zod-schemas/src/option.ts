import type { z } from "zod";

/** @see {@link Option} */
export const inferOptionSchema = <T extends z.ZodType>(schema: T) =>
  schema.optional();

/** @see {@link Nullable} */
export const inferNullishSchema = <T extends z.ZodType>(schema: T) =>
  schema.nullish();

/** @see {@link Nullish} */
export const inferNullableSchema = <T extends z.ZodType>(schema: T) =>
  schema.nullable();

/**
 * Represents a value that may be `undefined`.
 *
 * @template T - The type of the wrapped value.
 *
 * @example
 * type MaybeString = Option<string>; // string | undefined
 */
export type Option<T> = z.infer<
  ReturnType<typeof inferOptionSchema<z.ZodType<T>>>
>;

/**
 * Represents a value that may be `null`.
 *
 * @template T - The type of the wrapped value.
 *
 * @example
 * type MaybeString = Nullable<string>; // string | null
 */
export type Nullable<T> = z.infer<
  ReturnType<typeof inferNullableSchema<z.ZodType<T>>>
>;

/**
 * Represents a value that may be `null` or `undefined`.
 *
 * @template T - The type of the wrapped value.
 *
 * @example
 * type MaybeString = Nullish<string>; // string | null | undefined
 */
export type Nullish<T> = z.infer<
  ReturnType<typeof inferNullishSchema<z.ZodType<T>>>
>;
