import { Principal } from "@icp-sdk/core/principal";
import { PrincipalSchema, PrincipalTextSchema } from "./principal";
import { ZodSchemaId } from "./schema-id";

describe("Principal", () => {
  const mockPrincipalText =
    "xlmdg-vkosz-ceopx-7wtgu-g3xmd-koiyc-awqaq-7modz-zf6r6-364rh-oqe";

  describe("PrincipalText", () => {
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

    it("should have the correct schema id", () => {
      expect(PrincipalTextSchema.meta()).toEqual({
        id: ZodSchemaId.PrincipalText,
      });
    });
  });

  describe("PrincipalSchema", () => {
    const mockPrincipal = Principal.fromText(mockPrincipalText);

    it("should pass validation with a valid Principal instance", () => {
      const result = PrincipalSchema.safeParse(mockPrincipal);

      expect(result.success).toBeTruthy();
    });

    it("should return a Principal instance after transformation", () => {
      const result = PrincipalSchema.safeParse(mockPrincipal);

      expect(result.success).toBeTruthy();

      if (result.success) {
        // eslint-disable-next-line vitest/no-conditional-expect
        expect(Principal.isPrincipal(result.data)).toBeTruthy();

        return;
      }

      expect(true).toBeFalsy();
    });

    it("should pass validation with an anonymous Principal", () => {
      const result = PrincipalSchema.safeParse(Principal.anonymous());

      expect(result.success).toBeTruthy();
    });

    it("should fail validation with an invalid value", () => {
      const result = PrincipalSchema.safeParse({ invalid: true });

      expect(result.success).toBeFalsy();

      if (!result.success) {
        // eslint-disable-next-line vitest/no-conditional-expect
        expect(result.error.issues).toEqual([
          {
            code: "custom",
            message: "Invalid Principal.",
            path: [],
          },
        ]);

        return;
      }

      expect(true).toBeFalsy();
    });

    it("should fail validation with a plain string", () => {
      const result = PrincipalSchema.safeParse(
        "xlmdg-vkosz-ceopx-7wtgu-g3xmd-koiyc-awqaq-7modz-zf6r6-364rh-oqe",
      );

      expect(result.success).toBeFalsy();
    });

    it("should fail validation with null", () => {
      const result = PrincipalSchema.safeParse(null);

      expect(result.success).toBeFalsy();
    });

    it("should pass validation with a Principal-shaped object", () => {
      const principalObject = {
        _isPrincipal: true,
        _arr: mockPrincipal.toUint8Array(),
      };

      const result = PrincipalSchema.safeParse(principalObject);

      expect(result.success).toBeTruthy();

      if (result.success) {
        // eslint-disable-next-line vitest/no-conditional-expect
        expect(result.data).toBeInstanceOf(Principal);

        return;
      }

      expect(true).toBeFalsy();
    });

    it("should fail validation with a partial Principal-shaped object", () => {
      const result = PrincipalSchema.safeParse({
        _isPrincipal: true,
        _arr: "not-a-uint8array",
      });

      expect(result.success).toBeFalsy();
    });
  });
});
