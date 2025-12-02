import { Principal } from "@icp-sdk/core/principal";
import { PrincipalTextSchema } from "./principal";

describe("PrincipalText", () => {
  const mockPrincipalText =
    "xlmdg-vkosz-ceopx-7wtgu-g3xmd-koiyc-awqaq-7modz-zf6r6-364rh-oqe";

  it("should pass validation with a valid Principal string", () => {
    const result = PrincipalTextSchema.safeParse(mockPrincipalText);

    expect(result.success).toBeTruthy();
  });

  it("should fail validation with an invalid Principal string", () => {
    const invalidPrincipal = "invalid-principal";
    const result = PrincipalTextSchema.safeParse(invalidPrincipal);

    expect(result.success).toBeFalsy();

    if (!result.success) {
      // eslint-disable-next-line vitest/no-conditional-expect
      expect(result.error.issues).toEqual([
        {
          code: "custom",
          message: "Invalid textual representation of a Principal.",
          path: [],
        },
      ]);

      return;
    }

    expect(true).toBeFalsy();
  });

  it("should pass validation with an anonymous Principal", () => {
    const validPrincipal = Principal.anonymous().toText();
    const result = PrincipalTextSchema.safeParse(validPrincipal);

    expect(result.success).toBeTruthy();
  });

  it("should fail validation with a non-string input", () => {
    const invalidPrincipal = 12345;
    const result = PrincipalTextSchema.safeParse(invalidPrincipal);

    expect(result.success).toBeFalsy();

    if (!result.success) {
      // eslint-disable-next-line vitest/no-conditional-expect
      expect(result.error.issues).toEqual([
        {
          code: "invalid_type",
          expected: "string",
          message: "Invalid input: expected string, received number",
          path: [],
        },
      ]);

      return;
    }

    expect(true).toBeFalsy();
  });
});
