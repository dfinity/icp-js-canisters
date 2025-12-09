import { arrayOfNumberToUint8Array, toNullable } from "@dfinity/utils";
import { Principal } from "@icp-sdk/core/principal";
import { mockPrincipalText } from "../mocks/ledger.mock";
import type {
  ApproveParams,
  Icrc21ConsentMessageParams,
  TransferFromParams,
  TransferParams,
} from "../types/ledger.params";
import {
  toApproveArgs,
  toIcrc21ConsentMessageArgs,
  toTransferArg,
  toTransferFromArgs,
} from "./ledger.converters";

describe("ledger.converters", () => {
  const owner = Principal.fromText(mockPrincipalText);

  describe("toTransferArg", () => {
    it("should transform TransferParams to TransferArg correctly", () => {
      const params: TransferParams = {
        to: { owner, subaccount: [arrayOfNumberToUint8Array([7, 8, 9])] },
        amount: BigInt(1000),
        fee: BigInt(10),
        memo: new Uint8Array([1, 2, 3]),
        from_subaccount: new Uint8Array([4, 5, 6]),
        created_at_time: BigInt(100000),
      };

      const result = toTransferArg(params);

      expect(result).toEqual({
        to: params.to,
        amount: params.amount,
        fee: toNullable(params.fee),
        memo: toNullable(params.memo),
        from_subaccount: toNullable(params.from_subaccount),
        created_at_time: toNullable(params.created_at_time),
      });
    });
  });

  describe("toTransferFromArgs", () => {
    it("should transform TransferFromParams to TransferFromArgs correctly", () => {
      const params: TransferFromParams = {
        from: { owner, subaccount: [arrayOfNumberToUint8Array([4, 5, 6])] },
        to: { owner, subaccount: [arrayOfNumberToUint8Array([1, 2, 3])] },
        amount: BigInt(500),
        fee: BigInt(5),
        memo: new Uint8Array([7, 8, 9]),
        spender_subaccount: new Uint8Array([10, 11, 12]),
        created_at_time: BigInt(12345),
      };

      const result = toTransferFromArgs(params);

      expect(result).toEqual({
        from: params.from,
        to: params.to,
        amount: params.amount,
        fee: toNullable(params.fee),
        memo: toNullable(params.memo),
        spender_subaccount: toNullable(params.spender_subaccount),
        created_at_time: toNullable(params.created_at_time),
      });
    });
  });

  describe("toApproveArgs", () => {
    it("should transform ApproveParams to ApproveArgs correctly", () => {
      const params: ApproveParams = {
        spender: { owner, subaccount: [arrayOfNumberToUint8Array([7, 8, 9])] },
        amount: BigInt(200),
        fee: BigInt(2),
        memo: new Uint8Array([13, 14, 15]),
        from_subaccount: new Uint8Array([16, 17, 18]),
        created_at_time: BigInt(56789),
        expected_allowance: BigInt(100),
        expires_at: BigInt(98765),
      };

      const result = toApproveArgs(params);

      expect(result).toEqual({
        spender: params.spender,
        amount: params.amount,
        fee: toNullable(params.fee),
        memo: toNullable(params.memo),
        from_subaccount: toNullable(params.from_subaccount),
        created_at_time: toNullable(params.created_at_time),
        expected_allowance: toNullable(params.expected_allowance),
        expires_at: toNullable(params.expires_at),
      });
    });
  });

  describe("toIcrc21ConsentMessageArgs", () => {
    it("should transform Icrc21ConsentMessageParams to ConsentMessageArgs correctly", () => {
      const params: Icrc21ConsentMessageParams = {
        method: "someMethod",
        arg: new Uint8Array([21, 22, 23]),
        userPreferences: {
          metadata: {
            language: "en",
            utcOffsetMinutes: 120,
          },
          deriveSpec: {
            FieldsDisplay: null,
          },
        },
      };

      const result = toIcrc21ConsentMessageArgs(params);

      expect(result).toEqual({
        method: params.method,
        arg: params.arg,
        user_preferences: {
          metadata: {
            language: params.userPreferences.metadata.language,
            utc_offset_minutes: toNullable(
              params.userPreferences.metadata.utcOffsetMinutes,
            ),
          },
          device_spec: toNullable({
            FieldsDisplay: null,
          }),
        },
      });
    });

    it("should handle undefined deriveSpec in userPreferences", () => {
      const params: Icrc21ConsentMessageParams = {
        method: "someMethod",
        arg: new Uint8Array([21, 22, 23]),
        userPreferences: {
          metadata: {
            language: "en",
            utcOffsetMinutes: 120,
          },
        },
      };

      const result = toIcrc21ConsentMessageArgs(params);

      expect(result).toEqual({
        method: params.method,
        arg: params.arg,
        user_preferences: {
          metadata: {
            language: params.userPreferences.metadata.language,
            utc_offset_minutes: toNullable(
              params.userPreferences.metadata.utcOffsetMinutes,
            ),
          },
          device_spec: toNullable(),
        },
      });
    });
  });
});
