import { Uint8ArraySchema } from "./arrays";
import { ZodSchemaId } from "./schema-id";

describe("Uint8ArraySchema", () => {
  it("should pass validation with a valid Uint8Array", () => {
    const result = Uint8ArraySchema.safeParse(new Uint8Array([1, 2, 3]));

    expect(result.success).toBeTruthy();
  });

  it("should pass validation with an empty Uint8Array", () => {
    const result = Uint8ArraySchema.safeParse(new Uint8Array());

    expect(result.success).toBeTruthy();
  });

  it("should fail validation with a plain array", () => {
    const result = Uint8ArraySchema.safeParse([1, 2, 3]);

    expect(result.success).toBeFalsy();
  });

  it("should fail validation with a string", () => {
    const result = Uint8ArraySchema.safeParse("not-a-uint8array");

    expect(result.success).toBeFalsy();
  });

  it("should fail validation with null", () => {
    const result = Uint8ArraySchema.safeParse(null);

    expect(result.success).toBeFalsy();
  });

  it("should have the correct schema id", () => {
    expect(Uint8ArraySchema.meta()).toEqual({
      id: ZodSchemaId.Uint8Array,
    });
  });
});
