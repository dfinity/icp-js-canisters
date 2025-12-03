import type { CallConfig } from "@icp-sdk/core/agent";
import { Principal } from "@icp-sdk/core/principal";
import { mockCanisterId } from "../ic-management.mock";
import { transform } from "./transform.utils";

describe("transform", () => {
  describe("canister_id", () => {
    it("should map the effectiveCanisterId when a valid canister_id is provided as principal in the request", () => {
      const methodName = "someMethod";
      const args = [{ canister_id: mockCanisterId }];
      const callConfig: CallConfig = {};

      const result = transform(methodName, args, callConfig);

      expect(result).toEqual({
        effectiveCanisterId: mockCanisterId,
      });
    });

    it("should map the effectiveCanisterId when a valid canister_id is provided as string in the request", () => {
      const methodName = "someMethod";
      const args = [{ canister_id: mockCanisterId.toText() }];
      const callConfig: CallConfig = {};

      const result = transform(methodName, args, callConfig);

      expect(result).toEqual({
        effectiveCanisterId: mockCanisterId,
      });
    });

    it("should throw an error if canister_id is provided in the request but is not a valid principal or representation", () => {
      const methodName = "someMethod";
      const args = [{ canister_id: 12345 }];
      const callConfig: CallConfig = {};

      expect(() => transform(methodName, args, callConfig)).toThrowError();
    });
  });

  describe("target_canister", () => {
    describe("with method install_chunked_code", () => {
      it("should map the effectiveCanisterId when a valid target_canister is provided as principal with method install_chunked_code in the request", () => {
        const methodName = "install_chunked_code";
        const args = [{ target_canister: mockCanisterId }];
        const callConfig: CallConfig = {};

        const result = transform(methodName, args, callConfig);

        expect(result).toEqual({
          effectiveCanisterId: mockCanisterId,
        });
      });

      it("should map the effectiveCanisterId when a valid target_canister is provided as string with method install_chunked_code in the request", () => {
        const methodName = "install_chunked_code";
        const args = [{ target_canister: mockCanisterId.toText() }];
        const callConfig: CallConfig = {};

        const result = transform(methodName, args, callConfig);

        expect(result).toEqual({
          effectiveCanisterId: mockCanisterId,
        });
      });

      it("should throw an error if target_canister is provided in the request with method install_chunked_code but is not a valid principal or representation", () => {
        const methodName = "install_chunked_code";
        const args = [{ target_canister: 12345 }];
        const callConfig: CallConfig = {};

        expect(() => transform(methodName, args, callConfig)).toThrowError();
      });

      it("should map the effectiveCanisterId to target_canister if a valid target_canister and canister_id are provided with the method install_chunked_code in the request", () => {
        const methodName = "install_chunked_code";
        const canisterId = Principal.fromText("7hfb6-caaaa-aaaar-qadga-cai");
        const args = [
          { target_canister: mockCanisterId, canister_id: canisterId },
        ];
        const callConfig: CallConfig = {};

        const result = transform(methodName, args, callConfig);

        expect(result).toEqual({
          effectiveCanisterId: mockCanisterId,
        });
      });
    });

    describe("without method install_chunked_code", () => {
      it("should not map the effectiveCanisterId when a valid target_canister is provided but not the method install_chunked_code in the request", () => {
        const methodName = "someMethod";
        const args = [{ target_canister: mockCanisterId }];
        const callConfig: CallConfig = {};

        const result = transform(methodName, args, callConfig);

        expect(result).toEqual({
          effectiveCanisterId: Principal.fromHex(""),
        });
      });

      it("should map the effectiveCanisterId to canister_id if a valid target_canister and canister_id are provided but not the method install_chunked_code in the request", () => {
        const methodName = "someMethod";
        const canisterId = Principal.fromText("7hfb6-caaaa-aaaar-qadga-cai");
        const args = [
          { target_canister: mockCanisterId, canister_id: canisterId },
        ];
        const callConfig: CallConfig = {};

        const result = transform(methodName, args, callConfig);

        expect(result).toEqual({
          effectiveCanisterId: canisterId,
        });
      });
    });
  });

  describe("specified_id", () => {
    describe("with method provisional_create_canister_with_cycles", () => {
      it("should map the effectiveCanisterId when specified_id is provided as Principal", () => {
        const methodName = "provisional_create_canister_with_cycles";
        const args = [{ specified_id: [mockCanisterId] }];
        const callConfig: CallConfig = {};

        const result = transform(methodName, args, callConfig);

        expect(result).toEqual({
          effectiveCanisterId: mockCanisterId,
        });
      });

      it("should map the effectiveCanisterId when specified_id is provided as text", () => {
        const methodName = "provisional_create_canister_with_cycles";
        const args = [{ specified_id: [mockCanisterId.toText()] }];
        const callConfig: CallConfig = {};

        const result = transform(methodName, args, callConfig);

        expect(result).toEqual({
          effectiveCanisterId: mockCanisterId,
        });
      });

      it("should throw an error when specified_id is invalid", () => {
        const methodName = "provisional_create_canister_with_cycles";
        const args = [{ specified_id: [12345] }];
        const callConfig: CallConfig = {};

        expect(() => transform(methodName, args, callConfig)).toThrowError();
      });

      it("should not map the effectiveCanisterId when specified_id is none", () => {
        const methodName = "provisional_create_canister_with_cycles";
        const args = [{ specified_id: [] }];
        const callConfig: CallConfig = {};

        const result = transform(methodName, args, callConfig);

        expect(result).toEqual({
          effectiveCanisterId: Principal.fromHex(""),
        });
      });

      it("should not map the effectiveCanisterId when specified_id is undefined", () => {
        const methodName = "provisional_create_canister_with_cycles";
        const args = [{}];
        const callConfig: CallConfig = {};

        const result = transform(methodName, args, callConfig);

        expect(result).toEqual({
          effectiveCanisterId: Principal.fromHex(""),
        });
      });
    });

    describe("without method provisional_create_canister_with_cycles", () => {
      it("should fallback to empty principal when specified_id is present but method is different", () => {
        const methodName = "someMethod";
        const args = [{ specified_id: [mockCanisterId] }];
        const callConfig: CallConfig = {};

        const result = transform(methodName, args, callConfig);

        expect(result).toEqual({
          effectiveCanisterId: Principal.fromHex(""),
        });
      });
    });
  });

  describe("no ids", () => {
    it("should return effectiveCanisterId aaaaa-aa when args is empty", () => {
      const methodName = "someMethod";
      const args: unknown[] = [];
      const callConfig: CallConfig = {};

      const result = transform(methodName, args, callConfig);

      expect(result).toEqual({
        effectiveCanisterId: Principal.fromHex(""),
      });
    });

    it("should return effectiveCanisterId aaaaa-aa when canister_id is missing in the first argument", () => {
      const methodName = "someMethod";
      const args = [{}];
      const callConfig: CallConfig = {};

      const result = transform(methodName, args, callConfig);

      expect(result).toEqual({
        effectiveCanisterId: Principal.fromHex(""),
      });
    });

    it("should return effectiveCanisterId aaaaa-aa when the first argument is not an object", () => {
      const methodName = "someMethod";
      const args = [42];
      const callConfig: CallConfig = {};

      const result = transform(methodName, args, callConfig);

      expect(result).toEqual({
        effectiveCanisterId: Principal.fromHex(""),
      });
    });
  });
});
